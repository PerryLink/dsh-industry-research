/**
 * The `industry_track` tool: track public-source policy and news for one
 * industry through `ctx.web` (never a hand-rolled fetch). Searches per topic,
 * applies the host allow/block lists and the `since` filter, fetches page
 * snapshots for a SHA-256 provenance hash within the configured fetch budget,
 * and merges the surviving entries into `timeline.jsonl` (dedupe by
 * normalized URL, capped by `timelineMaxEntries`). Fails loud when the web
 * capability is unreachable; never fabricates an entry.
 * @module dsh-industry-research/tools/track
 */

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from '../config.ts'
import { DEPTH_PROFILES, resolveDepth } from '../depth.ts'
import { EVIDENCE_CATEGORIES, mergeTimeline, readTimeline, sourceAllowed } from '../timeline.ts'
import type { TimelineEntry } from '../timeline.ts'
import { sha256Of } from '../sources.ts'
import { requestSignal, requireWeb, webErrorMessage } from '../web.ts'
import { updateResearchState } from '../research-state.ts'
import type { ResearchStateDelta } from '../research-state.ts'
import { rootRelative } from '../versions.ts'
import { industryDirOf, researchStatePathOf, timelinePathOf, versionsPathOf, workspaceOf } from '../toolkit.ts'
import type { TrackEventPayload } from '../events.ts'

/** The canonical value returned by `industry_track`. */
export interface IndustryTrackValue {
  industry: string
  /** Absolute path of `timeline.jsonl`. */
  path: string
  /** Entries appended by this call. */
  added: TimelineEntry[]
  /** Batch candidates dropped as duplicates of already-tracked URLs. */
  duplicates: number
  /** Candidates dropped by the source allow/block lists. */
  blocked: number
  /** Candidates dropped by the `since` filter. */
  tooOld: number
  /** Sources whose snapshot fetch failed (kept as citation-only entries). */
  fetchFailed: Array<{ url: string; note: string }>
  /** Total entries retained after the merge. */
  total: number
  /** Whether the retention cap dropped older entries. */
  truncated: boolean
  /** Corrupt pre-existing lines skipped while reading the store. */
  corruptSkipped: number
  /** Incremental "vs last run" summary. */
  delta: ResearchStateDelta
}

/** How many snapshot fetches may run concurrently. */
const FETCH_CONCURRENCY = 4

/**
 * Run `limit`-bounded concurrent workers over `items`.
 * @param items - the work items.
 * @param limit - concurrency bound.
 * @param worker - the per-item async worker.
 */
async function pool<T>(items: readonly T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next]
      next += 1
      if (item !== undefined) await worker(item)
    }
  })
  await Promise.all(runners)
}

/**
 * Build the `industry_track` tool definition.
 * @param ctx - the plugin context (event emission + optional web lookup).
 * @param config - the resolved plugin config.
 * @returns the tool definition to register.
 */
export function buildIndustryTrackTool(ctx: Context, config: ResolvedConfig) {
  return defineTool({
    name: 'industry_track',
    description: '行业研究员的政策与动态跟踪工具：经官方 ctx.web 检索行业政策/要闻，产出带日期、标题、来源 URL、摘要与抓取快照哈希的结构化时间线条目，追加去重写入 timeline.jsonl。只使用公开源；来源不可达或数据缺口会显式列出，禁止编造。仅供研究，不构成投资建议。',
    parameters: {
      industry: { type: 'string', required: true, description: '行业名（作为目录段，如「白酒」）' },
      topics: { type: 'array', items: { type: 'string' }, description: '检索主题列表；缺省用「<行业> 行业 政策」与「<行业> 行业 动态 要闻」' },
      since: { type: 'string', description: '只保留该日期（ISO-8601）及之后的条目（按来源发布日期过滤；无日期的来源保留）' },
      depth: { type: 'string', enum: ['quick', 'standard', 'comprehensive'], description: '采集深度（quick=最小来源/单轮；standard=现行为；comprehensive=最大来源/全证据；默认 standard）' },
      evidenceCategory: { type: 'string', enum: [...EVIDENCE_CATEGORIES], description: `本批条目的证据分类标签（${EVIDENCE_CATEGORIES.join('/')}）；写入时校验枚举合法` },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          industry: { type: 'string', required: true },
          path: { type: 'string', required: true },
          added: { type: 'array', items: { type: 'json' }, required: true },
          duplicates: { type: 'number', required: true },
          blocked: { type: 'number', required: true },
          tooOld: { type: 'number', required: true },
          fetchFailed: { type: 'array', items: { type: 'json' }, required: true },
          total: { type: 'number', required: true },
          truncated: { type: 'boolean', required: true },
          corruptSkipped: { type: 'number', required: true },
          delta: { type: 'json', required: true },
        },
        additionalProperties: false,
      },
      render: (_args, value) => {
        const current = value as IndustryTrackValue
        const lines = [
          `行业「${current.industry}」政策与动态：新增 ${current.added.length} 条（去重 ${current.duplicates}，拦截 ${current.blocked}，过早 ${current.tooOld}），时间线共 ${current.total} 条 → ${current.path}`,
          `与上次相比：新增源 ${current.delta.newSources.length}，移除源 ${current.delta.removedSources.length}，未变化证据 ${current.delta.unchangedEvidence}。`,
        ]
        for (const entry of current.added.slice(0, 10)) {
          lines.push(`- ${entry.date ?? '日期未知'} — ${entry.title}（${entry.url}）`)
        }
        if (current.added.length > 10) lines.push(`- ……其余 ${current.added.length - 10} 条见 timeline.jsonl`)
        if (current.fetchFailed.length > 0) {
          lines.push(`快照抓取失败 ${current.fetchFailed.length} 条（仍以纯引用条目记录）：${current.fetchFailed.map(failure => failure.url).join('；')}`)
        }
        if (current.truncated) lines.push('已达 retention 上限，最旧条目已被裁剪。')
        if (current.corruptSkipped > 0) lines.push(`警告：跳过 ${current.corruptSkipped} 行损坏的既有时间线记录。`)
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    timeoutMs: Math.max(60_000, config.fetchTimeoutMs * Math.max(config.track.maxFetchesPerCall, DEPTH_PROFILES.comprehensive.trackMaxFetchesPerCall)),
    async execute(args, exec): Promise<IndustryTrackValue> {
      const web = requireWeb(ctx, config, 'industry_track')
      const cwd = workspaceOf(exec)
      const { root, dir, name } = industryDirOf(config, cwd, args.industry)
      const path = timelinePathOf(dir)
      const depth = resolveDepth(args.depth)
      const maxResultsPerTopic = depth === 'standard' ? config.track.maxResultsPerTopic : DEPTH_PROFILES[depth].trackMaxResultsPerTopic
      const maxFetchesPerCall = depth === 'standard' ? config.track.maxFetchesPerCall : DEPTH_PROFILES[depth].trackMaxFetchesPerCall
      const topics = (args.topics ?? [`${name} 行业 政策`, `${name} 行业 动态 要闻`]).map(topic => topic.trim()).filter(topic => topic.length > 0)
      if (topics.length === 0) throw new Error('topics must contain at least one non-empty topic')
      const since = args.since?.trim()
      if (since !== undefined && Number.isNaN(Date.parse(since))) {
        throw new Error(`since must be an ISO-8601 date, got ${JSON.stringify(args.since)}`)
      }

      // Search phase: one web.search per topic.
      interface Candidate { url: string; title: string | null; snippet: string | null; publishedAt: string | null; topics: string[] }
      const byUrl = new Map<string, Candidate>()
      for (const topic of topics) {
        const outcome = await web.search(
          { query: topic, maxResults: maxResultsPerTopic },
          requestSignal(exec.signal, config.fetchTimeoutMs),
        )
        for (const source of outcome.sources) {
          const existing = byUrl.get(source.url)
          if (existing !== undefined) {
            if (!existing.topics.includes(topic)) existing.topics.push(topic)
            continue
          }
          byUrl.set(source.url, {
            url: source.url,
            title: source.title ?? null,
            snippet: source.snippet ?? null,
            publishedAt: source.publishedAt ?? null,
            topics: [topic],
          })
        }
      }

      // Filter phase: allow/block lists, then the since filter.
      let blocked = 0
      let tooOld = 0
      const candidates: Candidate[] = []
      for (const candidate of byUrl.values()) {
        if (!sourceAllowed(candidate.url, config.sourceAllowlist, config.sourceBlocklist)) {
          blocked += 1
          continue
        }
        if (since !== undefined && candidate.publishedAt !== null) {
          const published = Date.parse(candidate.publishedAt)
          if (!Number.isNaN(published) && published < Date.parse(since)) {
            tooOld += 1
            continue
          }
        }
        candidates.push(candidate)
      }

      // Snapshot phase: bounded concurrent fetches within the call budget.
      const now = new Date().toISOString()
      const fetchFailed: Array<{ url: string; note: string }> = []
      const snapshots = new Map<string, string>()
      const fetchable = candidates.slice(0, maxFetchesPerCall)
      await pool(fetchable, FETCH_CONCURRENCY, async (candidate) => {
        try {
          const outcome = await web.fetch({ url: candidate.url }, requestSignal(exec.signal, config.fetchTimeoutMs))
          snapshots.set(candidate.url, sha256Of(outcome.body.content))
        } catch (error) {
          fetchFailed.push({ url: candidate.url, note: webErrorMessage(error) })
        }
      })

      const batch: TimelineEntry[] = candidates.map(candidate => {
        const snapshotHash = snapshots.get(candidate.url) ?? null
        const failure = fetchFailed.find(entry => entry.url === candidate.url)
        const beyondBudget = !fetchable.includes(candidate)
        return {
          date: candidate.publishedAt,
          title: candidate.title ?? candidate.url,
          url: candidate.url,
          summary: candidate.snippet,
          snapshotHash,
          capturedAt: now,
          topics: candidate.topics,
          ...(snapshotHash === null
            ? { note: failure !== undefined ? `快照抓取失败：${failure.note}` : beyondBudget ? '超出本次抓取预算，未抓取快照' : '无快照' }
            : {}),
          ...(args.evidenceCategory !== undefined ? { evidenceCategory: args.evidenceCategory } : {}),
        }
      })

      const { corrupt } = await readTimeline(path)
      const merge = await mergeTimeline(path, batch, config.timelineMaxEntries)

      // Research-state memory: record depth + latest hashes + source/category counts, then diff vs last run.
      const statePath = researchStatePathOf(dir)
      const { entries: allEntries } = await readTimeline(path)
      const sourceUrls = allEntries.map(entry => entry.url)
      const evidenceCategoryCounts: Record<string, number> = {}
      for (const entry of allEntries) {
        const category = entry.evidenceCategory ?? 'uncategorized'
        evidenceCategoryCounts[category] = (evidenceCategoryCounts[category] ?? 0) + 1
      }
      const delta = await updateResearchState(statePath, versionsPathOf(root), rootRelative(root, statePath), depth, sourceUrls, evidenceCategoryCounts, [], now)

      const payload: TrackEventPayload = { industry: name, path, added: merge.added.length, duplicates: merge.duplicates, total: merge.total }
      ctx.emit('industry-research/track', payload)

      return {
        industry: name,
        path,
        added: merge.added,
        duplicates: merge.duplicates,
        blocked,
        tooOld,
        fetchFailed,
        total: merge.total,
        truncated: merge.truncated,
        corruptSkipped: corrupt,
        delta,
      }
    },
  })
}
