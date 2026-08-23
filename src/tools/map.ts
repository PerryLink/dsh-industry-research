/**
 * The `industry_map` tool: build or update one industry's chain map. The
 * model authors the ChainMap (guided by the industry-research-method skill);
 * the tool validates it (dangling edges, unsourced numbers, illegal tiers),
 * persists `chain.json`, registers seed/web material as citable sources, and
 * lists the explicit gap slots. Called without a `chain` argument it returns
 * the current map plus the registered sources, so the model can iterate.
 * @module dsh-industry-research/tools/map
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from '../config.ts'
import { chainGaps, validateChainMap } from '../chain.ts'
import type { ChainMap } from '../chain.ts'
import { analyzeBottlenecks, renderChainSvg } from '../chain-svg.ts'
import type { ChainBottleneck } from '../chain-svg.ts'
import { DEPTH_PROFILES, resolveDepth } from '../depth.ts'
import { loadSources, registerSource, saveSources } from '../sources.ts'
import type { SourceEntry } from '../sources.ts'
import { lookupWeb, requestSignal, webErrorMessage } from '../web.ts'
import type { WebSource } from '../web.ts'
import { resolveWorkspaceFile } from '../paths.ts'
import { updateResearchState } from '../research-state.ts'
import type { ResearchStateDelta } from '../research-state.ts'
import { chainPathOf, chainSvgPathOf, industryDirOf, notesDirOf, researchStatePathOf, sourcesPathOf, versionsPathOf, workspaceOf } from '../toolkit.ts'
import { recordVersion, rootRelative, verifyVersion } from '../versions.ts'
import type { MapEventPayload } from '../events.ts'

/** The canonical value returned by `industry_map`. */
export interface IndustryMapValue {
  industry: string
  /** Absolute industry directory. */
  dir: string
  /** Absolute path of `chain.json` (present once a map was committed). */
  chainPath: string
  /** Whether this call committed a new map. */
  updated: boolean
  /** The current map after this call; null when none exists yet. */
  chain: ChainMap | null
  /** Explicit gap slots of the current map. */
  gaps: string[]
  /** All registered citable sources of this industry. */
  sources: SourceEntry[]
  /** Refs registered by this call (seed note, seed files, web digest). */
  seedRefs: string[]
  /** Web-assist digest; null when the assist did not run. */
  webDigest: WebSource[] | null
  /** Why the web assist did not run; null when it ran or was not requested. */
  webNote: string | null
  /** Bottleneck nodes of the current map (funnel/hub rules); empty when none. */
  bottlenecks: ChainBottleneck[]
  /** Absolute path of the rendered `chain.svg`; null when `renderSvg` was not requested or no map exists. */
  svgPath: string | null
  /** Incremental "vs last run" summary. */
  delta: ResearchStateDelta
}

/** The ChainMap parameter schema (semantic checks live in {@link validateChainMap}). */
const CHAIN_PARAMETER = {
  type: 'object',
  properties: {
    industry: { type: 'string', required: true, description: '行业显示名' },
    nodes: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true, description: '节点 id（边引用用，如 upstream-1）' },
          name: { type: 'string', required: true, description: '节点显示名（如 高粱种植）' },
          tier: { type: 'string', enum: ['upstream', 'midstream', 'downstream'], required: true },
          status: { type: 'string', enum: ['public', 'private', 'acquired', 'IPO'], description: '公司上市状态（若该节点指向上市公司）' },
          statusAsOf: { type: 'string', description: 'status 的截止日期（ISO-8601）；有 status 必填' },
          taxonomyCode: { type: 'string', description: '国民经济行业分类大类代码（如 15）；必须命中内置映射表' },
          metrics: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', required: true, description: '指标名（如 市场规模）' },
                value: { type: 'number', description: '数值；缺省即待补槽位' },
                unit: { type: 'string', description: '单位（如 亿元、%）' },
                asOf: { type: 'string', description: '数值截止日期（ISO-8601）' },
                sourceRef: { type: 'string', description: '来源引用：sources.json 的 ref（如 S1）、URL 或工作区路径；有 value 时必填' },
              },
              additionalProperties: false,
            },
            description: '指标槽位：有 value 必须带 sourceRef；无 value 即显式待补',
          },
        },
        additionalProperties: false,
      },
    },
    edges: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          from: { type: 'string', required: true, description: '源节点 id' },
          to: { type: 'string', required: true, description: '目标节点 id' },
          note: { type: 'string', description: '关系说明（如 原料供应）' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
  description: '模型撰写的产业链结构图；语义校验（悬空边、无来源数值）由工具执行',
} as const

/**
 * Build the `industry_map` tool definition.
 * @param ctx - the plugin context (event emission + optional web lookup).
 * @param config - the resolved plugin config.
 * @returns the tool definition to register.
 */
export function buildIndustryMapTool(ctx: Context, config: ResolvedConfig) {
  return defineTool({
    name: 'industry_map',
    description: '行业研究员的产业链建图工具：校验并落盘一份产业链结构图（上/中/下游节点 + 边 + 指标槽位），或在不带 chain 时返回当前图与已登记来源。每个有数值的指标必须带来源引用（sourceRef），缺数值的槽位即显式待补；禁止编造数据。仅供研究，不构成投资建议。',
    parameters: {
      industry: { type: 'string', required: true, description: '行业名（作为目录段，如「白酒」）' },
      seed: { type: 'string', description: '自由文本笔记，写入该行业的 notes/ 并登记为来源' },
      seedFiles: { type: 'array', items: { type: 'string' }, description: '工作区内已有笔记/材料文件的相对路径列表，登记为来源' },
      web: { type: 'boolean', description: '是否做 web 辅助检索（默认 true；config.offline 时自动跳过）' },
      chain: CHAIN_PARAMETER,
      renderSvg: { type: 'boolean', description: '是否同时渲染确定性的 chain.svg 网状图（默认 false）' },
      depth: { type: 'string', enum: ['quick', 'standard', 'comprehensive'], description: '采集深度（quick=最小来源；standard=现行为；comprehensive=最大来源；默认 standard）' },
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          industry: { type: 'string', required: true },
          dir: { type: 'string', required: true },
          chainPath: { type: 'string', required: true },
          updated: { type: 'boolean', required: true },
          chain: { type: 'json', required: true },
          gaps: { type: 'array', items: { type: 'string' }, required: true },
          sources: { type: 'array', items: { type: 'json' }, required: true },
          seedRefs: { type: 'array', items: { type: 'string' }, required: true },
          webDigest: { oneOf: [{ type: 'array', items: { type: 'json' } }, { type: 'null' }], required: true },
          webNote: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
          bottlenecks: { type: 'array', items: { type: 'json' }, required: true },
          svgPath: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
          delta: { type: 'json', required: true },
        },
        additionalProperties: false,
      },
      render: (_args, value) => {
        const current = value as IndustryMapValue
        const lines = [
          `行业「${current.industry}」产业链图：${current.updated ? '已校验并写入' : '未更新（仅读取）'} ${current.chainPath}`,
          current.chain === null ? '当前无图：请撰写 chain 后再次调用。' : `节点 ${current.chain.nodes.length} / 边 ${current.chain.edges.length}；缺口 ${current.gaps.length} 项。`,
          `与上次相比：新增源 ${current.delta.newSources.length}，移除源 ${current.delta.removedSources.length}，未变化证据 ${current.delta.unchangedEvidence}。`,
        ]
        if (current.gaps.length > 0) lines.push(`缺口清单：${current.gaps.join('；')}`)
        if (current.bottlenecks.length > 0) {
          lines.push(`瓶颈节点 ${current.bottlenecks.length} 个：${current.bottlenecks.map(bottleneck => `${bottleneck.name}（${bottleneck.kind === 'funnel' ? '漏斗型' : '枢纽型'}）`).join('；')}`)
        }
        if (current.svgPath !== null) lines.push(`SVG 网状图已写入：${current.svgPath}`)
        if (current.seedRefs.length > 0) lines.push(`本次登记来源：${current.seedRefs.join(', ')}（共 ${current.sources.length} 条，可用于 sourceRef）`)
        if (current.webDigest !== null && current.webDigest.length > 0) {
          lines.push(`web 辅助检索 ${current.webDigest.length} 条：${current.webDigest.map(source => source.title ?? source.url).join('；')}`)
        }
        if (current.webNote !== null) lines.push(`web 辅助未执行：${current.webNote}`)
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    timeoutMs: Math.max(30_000, config.fetchTimeoutMs * 3),
    async execute(args, exec): Promise<IndustryMapValue> {
      const cwd = workspaceOf(exec)
      const { root, dir, name } = industryDirOf(config, cwd, args.industry)
      const depth = resolveDepth(args.depth)
      const sourcesPath = sourcesPathOf(dir)
      const registry = await loadSources(sourcesPath)
      const now = new Date().toISOString()
      const versionsPath = versionsPathOf(root)
      const seedRefs: string[] = []

      if (args.seed !== undefined && args.seed.trim().length > 0) {
        const notesDir = notesDirOf(dir)
        await mkdir(notesDir, { recursive: true })
        const notePath = join(notesDir, `seed-${now.replaceAll(':', '-')}.md`)
        const noteContent = `# 种子笔记（${now}）\n\n${args.seed.trim()}\n`
        await writeFile(notePath, noteContent, 'utf8')
        seedRefs.push(registerSource(registry, notePath, noteContent, now, 'seed note'))
      }
      for (const file of args.seedFiles ?? []) {
        const absolute = resolveWorkspaceFile(cwd, file)
        const content = await readFile(absolute, 'utf8')
        seedRefs.push(registerSource(registry, absolute, content, now, 'seed file'))
      }

      let webDigest: WebSource[] | null = null
      let webNote: string | null = null
      if (args.web === false) {
        webNote = '调用方指定 web: false'
      } else if (config.offline) {
        webNote = 'config.offline 为 true'
      } else {
        const web = lookupWeb(ctx)
        if (web === undefined) {
          webNote = 'ctx.web 未挂载（可选能力；不影响建图）'
        } else {
          try {
            const outcome = await web.search(
              { query: `${name} 产业链 上游 中游 下游 结构`, maxResults: DEPTH_PROFILES[depth].mapSearchResults },
              requestSignal(exec.signal, config.fetchTimeoutMs),
            )
            webDigest = [...outcome.sources]
            for (const source of outcome.sources) {
              const digest = `${source.title ?? ''}\n${source.snippet ?? ''}`
              seedRefs.push(registerSource(registry, source.url, digest, now, source.title))
            }
          } catch (error) {
            webNote = `web 检索失败：${webErrorMessage(error)}`
          }
        }
      }
      if (seedRefs.length > 0) await saveSources(sourcesPath, registry)

      const chainPath = chainPathOf(dir)
      let updated = false
      if (args.chain !== undefined) {
        const candidate = args.chain as ChainMap
        const problems = validateChainMap(candidate)
        if (problems.length > 0) {
          throw new Error(`chain 校验失败（${problems.length} 项）：${problems.join('；')}`)
        }
        await mkdir(dir, { recursive: true })
        const chainContent = `${JSON.stringify(candidate, null, 2)}\n`
        await writeFile(chainPath, chainContent, 'utf8')
        await recordVersion(versionsPath, rootRelative(root, chainPath), chainContent, now)
        updated = true
      }

      let current: ChainMap | null = null
      try {
        const chainText = await readFile(chainPath, 'utf8')
        await verifyVersion(versionsPath, rootRelative(root, chainPath), chainText)
        current = JSON.parse(chainText) as ChainMap
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      }
      const gaps = current === null ? ['尚无产业链结构图：请基于 seed 与来源撰写 chain 后再次调用'] : chainGaps(current)
      const bottlenecks = current === null ? [] : analyzeBottlenecks(current)

      let svgPath: string | null = null
      if (args.renderSvg === true && current !== null) {
        svgPath = chainSvgPathOf(dir)
        const svgContent = `${renderChainSvg(current)}\n`
        await writeFile(svgPath, svgContent, 'utf8')
        await recordVersion(versionsPath, rootRelative(root, svgPath), svgContent, now)
      }

      if (updated && current !== null) {
        const payload: MapEventPayload = { industry: name, path: chainPath, nodes: current.nodes.length, edges: current.edges.length, gaps: gaps.length }
        ctx.emit('industry-research/map', payload)
      }

      // Research-state memory: depth + latest hashes + registered sources + gaps, then diff vs last run.
      const statePath = researchStatePathOf(dir)
      const delta = await updateResearchState(statePath, versionsPath, rootRelative(root, statePath), depth, registry.items.map(item => item.origin), {}, gaps, now)

      return {
        industry: name,
        dir,
        chainPath,
        updated,
        chain: current,
        gaps,
        sources: registry.items,
        seedRefs,
        webDigest,
        webNote,
        bottlenecks,
        svgPath,
        delta,
      }
    },
  })
}
