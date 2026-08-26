/**
 * The `industry_report` tool: assemble one industry's report from the
 * workspace artifacts (chain map, timeline, company cards). With a mounted
 * `ctx.researchReport` engine the evidence/sections/claims go to its
 * `assemble` and the sealed directory plus per-claim verdicts come back;
 * without one the builtin fallback renders versioned Markdown
 * (`reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` with the
 * source-traceability table) and says so honestly (`engine:
 * 'builtin-fallback'`). The model may author the draft (sections + claims) or
 * leave it to the mechanical auto-draft.
 * @module dsh-industry-research/tools/report
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from '../config.ts'
import { readCard } from '../company.ts'
import { adversarialCheck, renderRedReviewNote } from '../adversarial.ts'
import { renderPerspectivesNote, synthesizePerspectives } from '../perspectives.ts'
import { autoDraft, buildEvidence, reportDirName, validateDeliveryContract, validateDraft, writeFallbackReport } from '../report.ts'
import type { LoadedArtifacts, ReportDraft } from '../report.ts'
import { AUTO_SECTIONS } from '../report.ts'
import type { AutoSection } from '../report.ts'
import { lookupJobs } from '../jobs.ts'
import { chainPathOf, companyDirOf, industryDirOf, reportsDirOf, timelinePathOf, versionsPathOf, workspaceOf } from '../toolkit.ts'
import { recordVersion, rootRelative, verifyVersion } from '../versions.ts'
import { lookupEngine } from '../engine-bridge.ts'
import type { AssembleReportResult } from '../engine-bridge.ts'
import type { ChainMap } from '../chain.ts'
import { chainGaps } from '../chain.ts'
import { readTimeline } from '../timeline.ts'
import type { ReportEventPayload } from '../events.ts'

/** The red-team review outcome attached to a report. */
export type ReviewOutcome = { mode: 'job'; jobId: string } | { mode: 'skipped'; note: string }

/** The canonical value returned by `industry_report`. */
export interface IndustryReportValue {
  industry: string
  /** Which engine produced the report. */
  engine: 'research-report' | 'builtin-fallback'
  /** Absolute report directory (sealed engine dir or fallback dir). */
  reportDir: string
  /** Absolute `report.md` path (fallback only; null on the engine path). */
  reportPath: string | null
  /** Absolute `manifest.json` path (fallback only; null on the engine path). */
  manifestPath: string | null
  /** SHA-256 of the engine's manifest (engine path only; null on fallback). */
  sealHash: string | null
  /** Per-claim verdicts (engine path only; null on fallback). */
  verdicts: Array<{ claimId: string; status: 'verified' | 'unverified' | 'contradicted'; note?: string }> | null
  /** Claim count of the report. */
  claims: number
  /** Evidence count of the report. */
  evidence: number
  /** Artifact-level gaps recorded at assembly. */
  gaps: string[]
  /** ISO-8601 generation time. */
  generatedAt: string
  /** Deterministic adversarial-check findings (machine-check baseline). */
  machineCheck: string[]
  /** Red-team review outcome (spawned job or skipped). */
  review: ReviewOutcome
  /** Multi-perspective (bull/bear) debate outcome (spawned job or skipped). */
  perspectives: ReviewOutcome
}

/** The draft parameter schema (semantic reference checks live in {@link validateDraft}). */
const DRAFT_PARAMETER = {
  type: 'object',
  properties: {
    title: { type: 'string', description: '报告标题；缺省「<行业> 行业研究报告」' },
    sections: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string', required: true },
          paragraphs: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              properties: {
                text: { type: 'string', required: true },
                claimIds: { type: 'array', items: { type: 'string' }, description: '本段引用的 claim id 列表' },
              },
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    },
    claims: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', required: true, description: 'claim id（如 C1）' },
          text: { type: 'string', required: true, description: '断言内容（数字须与证据一致）' },
          evidenceIds: { type: 'array', items: { type: 'string' }, required: true, description: '支撑证据 id（E-chain / E-timeline / E-company-<slug>）' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
  description: '模型撰写的报告草稿；缺省时由工具按已有材料机械组装',
} as const

/**
 * Load every artifact a report assembles from. Missing artifacts are gaps,
 * not failures; unreadable ones are gaps with the reason recorded.
 * @param config - resolved plugin config.
 * @param cwd - absolute workspace root.
 * @param industry - validated industry argument.
 * @param companies - optional company-name filter for card inclusion.
 * @returns the loaded artifacts.
 */
export async function loadArtifacts(config: ResolvedConfig, cwd: string, industry: string, companies?: readonly string[]): Promise<LoadedArtifacts> {
  const { root, dir } = industryDirOf(config, cwd, industry)
  const gaps: string[] = []
  const artifacts: LoadedArtifacts = { cards: [], gaps }

  const chainPath = chainPathOf(dir)
  let chainContent: string | undefined
  try {
    chainContent = await readFile(chainPath, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      gaps.push('缺少产业链结构图 chain.json（先运行 industry_map）')
    } else {
      gaps.push(`chain.json 读取失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (chainContent !== undefined) {
    // Version mismatch fails loud (integrity); parse failures stay honest gaps.
    await verifyVersion(versionsPathOf(root), rootRelative(root, chainPath), chainContent)
    try {
      const map = JSON.parse(chainContent) as ChainMap
      artifacts.chain = { path: chainPath, content: chainContent, map }
      gaps.push(...chainGaps(map))
    } catch (error) {
      gaps.push(`chain.json 解析失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const timelinePath = timelinePathOf(dir)
  try {
    const content = await readFile(timelinePath, 'utf8')
    const { entries, corrupt } = await readTimeline(timelinePath)
    if (entries.length > 0) {
      artifacts.timeline = { path: timelinePath, content, entries }
    } else {
      gaps.push('timeline.jsonl 为空：尚无政策与动态条目（先运行 industry_track）')
    }
    if (corrupt > 0) gaps.push(`timeline.jsonl 有 ${corrupt} 行损坏已跳过`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      gaps.push('缺少政策与动态 timeline.jsonl（先运行 industry_track）')
    } else {
      throw error
    }
  }

  const companiesDir = join(root, 'companies')
  let slugs: string[] = []
  if (companies !== undefined && companies.length > 0) {
    slugs = companies.map(company => companyDirOf(config, cwd, company).slug)
  } else {
    try {
      slugs = (await readdir(companiesDir, { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
  for (const slug of slugs) {
    const cardJsonPath = join(companiesDir, slug, 'card.json')
    let cardContent: string | undefined
    try {
      cardContent = await readFile(cardJsonPath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        gaps.push(`公司「${slug}」无速览卡（先运行 company_scan）`)
      } else {
        gaps.push(`公司「${slug}」的 card.json 读取失败：${error instanceof Error ? error.message : String(error)}`)
      }
      continue
    }
    // Version mismatch fails loud (integrity); parse failures stay honest gaps.
    await verifyVersion(versionsPathOf(root), rootRelative(root, cardJsonPath), cardContent)
    try {
      const card = await readCard(cardJsonPath)
      artifacts.cards.push({ path: cardJsonPath, content: cardContent, card })
    } catch (error) {
      gaps.push(`公司「${slug}」的 card.json 解析失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (artifacts.cards.length === 0 && slugs.length === 0) {
    gaps.push('尚无公司速览卡（可选：运行 company_scan 补充公司维度）')
  }
  return artifacts
}

/**
 * Build the `industry_report` tool definition.
 * @param ctx - the plugin context (event emission + optional engine lookup).
 * @param config - the resolved plugin config.
 * @returns the tool definition to register.
 */
export function buildIndustryReportTool(ctx: Context, config: ResolvedConfig) {
  return defineTool({
    name: 'industry_report',
    description: '行业研究员的报告组装工具：汇总产业链结构图、政策时间线与公司速览卡，产出可核查的行业研究报告。挂载 ctx.researchReport 引擎时提交其 assemble 封存并回传逐 claim 核查结论；否则走内置降级路径（版本化 Markdown + 来源回溯表，如实标注 engine: builtin-fallback）。数字均须对应来源证据；仅供研究，不构成投资建议。',
    parameters: {
      industry: { type: 'string', required: true, description: '行业名（作为目录段，如「白酒」）' },
      sections: { type: 'array', items: { type: 'string', enum: [...AUTO_SECTIONS] }, description: `自动草稿包含哪些标准小节（${AUTO_SECTIONS.join('/')}）；提供 draft 时忽略` },
      companies: { type: 'array', items: { type: 'string' }, description: '纳入报告的公司名列表；缺省纳入 companies/ 下全部速览卡' },
      draft: DRAFT_PARAMETER,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          industry: { type: 'string', required: true },
          engine: { type: 'string', enum: ['research-report', 'builtin-fallback'], required: true },
          reportDir: { type: 'string', required: true },
          reportPath: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
          manifestPath: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
          sealHash: { oneOf: [{ type: 'string' }, { type: 'null' }], required: true },
          verdicts: { oneOf: [{ type: 'array', items: { type: 'json' } }, { type: 'null' }], required: true },
          claims: { type: 'number', required: true },
          evidence: { type: 'number', required: true },
          gaps: { type: 'array', items: { type: 'string' }, required: true },
          generatedAt: { type: 'string', required: true },
          machineCheck: { type: 'array', items: { type: 'string' }, required: true },
          review: { type: 'json', required: true },
          perspectives: { type: 'json', required: true },
        },
        additionalProperties: false,
      },
      render: (_args, value) => {
        const current = value as IndustryReportValue
        const lines = current.engine === 'research-report'
          ? [
              `行业「${current.industry}」研究报告已经独立核查引擎封存 → ${current.reportDir}`,
              `sealHash：${current.sealHash ?? ''}；claims ${current.claims} 条（verified ${(current.verdicts ?? []).filter(verdict => verdict.status === 'verified').length} 条）。`,
            ]
          : [
              `行业「${current.industry}」研究报告（builtin-fallback，未经过独立核查引擎）→ ${current.reportPath}`,
              `claims ${current.claims} 条均标记 unverified；来源回溯表见 report.md 附录与 ${current.manifestPath ?? ''}。`,
            ]
        lines.push(`机器对抗检查：${current.machineCheck.length > 0 ? `${current.machineCheck.length} 项发现` : '未发现可攻击点'}。`)
        lines.push(`红方审阅：${current.review.mode === 'job' ? `job ${current.review.jobId} 已派生` : `skipped（${current.review.note}）`}。`)
        lines.push(`多视角正反方：${current.perspectives.mode === 'job' ? `job ${current.perspectives.jobId} 已派生` : `skipped（${current.perspectives.note}）`}。`)
        if (current.gaps.length > 0) lines.push(`缺口声明：${current.gaps.join('；')}`)
        lines.push('仅供研究，不构成投资建议。')
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    timeoutMs: 60_000,
    async execute(args, exec): Promise<IndustryReportValue> {
      const cwd = workspaceOf(exec)
      const { root, dir, name } = industryDirOf(config, cwd, args.industry)
      const generatedAt = new Date().toISOString()
      const artifacts = await loadArtifacts(config, cwd, name, args.companies)
      const evidence = buildEvidence(artifacts, generatedAt)
      const evidenceIds = new Set(evidence.map(item => item.id))

      let draft: ReportDraft
      if (args.draft !== undefined) {
        draft = {
          title: args.draft.title ?? `${name} 行业研究报告`,
          sections: args.draft.sections,
          claims: args.draft.claims,
        }
        const problems = validateDraft(draft, evidenceIds)
        if (problems.length > 0) {
          throw new Error(`draft 校验失败（${problems.length} 项）：${problems.join('；')}（已登记证据：${[...evidenceIds].join(', ') || '无'}）`)
        }
      } else {
        const sections = (args.sections ?? [...AUTO_SECTIONS]) as AutoSection[]
        draft = autoDraft(name, artifacts, sections)
      }

      // Delivery contract (blue baseline): no half-assembled report is ever emitted.
      const contractProblems = validateDeliveryContract(draft, artifacts, evidenceIds)
      if (contractProblems.length > 0) {
        throw new Error(`交付契约校验失败（${contractProblems.length} 项）：${contractProblems.join('；')}`)
      }

      // Deterministic adversarial check (always runs, machine-check baseline).
      const machineCheck = adversarialCheck(draft, artifacts, evidenceIds)

      // Optional red-team review job: spawn it when a background-job registry exists.
      let review: ReviewOutcome
      const jobs = lookupJobs(ctx)
      const versionsPath = versionsPathOf(root)
      const redNotePath = join(dir, 'red-review-note.md')
      if (jobs === undefined) {
        review = { mode: 'skipped', note: 'jobs unavailable' }
      } else {
        const noteContent = renderRedReviewNote(draft, artifacts, evidenceIds, generatedAt)
        const jobId = jobs.start({
          kind: 'subagent',
          label: '红方对抗审阅（魔鬼代言人）',
          owner: exec.agent,
          run: () => {
            let cancelled = false
            const done = (async () => {
              if (!cancelled) {
                await writeFile(redNotePath, noteContent, 'utf8')
                await recordVersion(versionsPath, rootRelative(root, redNotePath), noteContent, generatedAt)
              }
              return { status: cancelled ? 'killed' as const : 'completed' as const, output: machineCheck.length > 0 ? machineCheck.join('；') : 'no findings' }
            })()
            return { cancel: () => { cancelled = true }, done }
          },
        })
        review = { mode: 'job', jobId }
      }

      // Multi-perspective (bull/bear) debate: synthesize deterministically, then
      // fork a subagent job to write the note and append it to the SHA-256 ledger.
      const synthesis = synthesizePerspectives(draft, artifacts, evidenceIds)
      let perspectives: ReviewOutcome
      const perspectivesNotePath = join(dir, 'perspectives-note.md')
      if (jobs === undefined) {
        perspectives = { mode: 'skipped', note: 'jobs unavailable' }
      } else {
        const noteContent = renderPerspectivesNote(name, draft, artifacts, evidenceIds, generatedAt)
        const jobId = jobs.start({
          kind: 'subagent',
          label: '多视角正反方辩论（bull/bear）',
          owner: exec.agent,
          run: () => {
            let cancelled = false
            const done = (async () => {
              if (!cancelled) {
                await writeFile(perspectivesNotePath, noteContent, 'utf8')
                await recordVersion(versionsPath, rootRelative(root, perspectivesNotePath), noteContent, generatedAt)
              }
              return { status: cancelled ? 'killed' as const : 'completed' as const, output: `bull ${synthesis.bull.length} 项 / bear ${synthesis.bear.length} 项` }
            })()
            return { cancel: () => { cancelled = true }, done }
          },
        })
        perspectives = { mode: 'job', jobId }
      }

      const engine = lookupEngine(ctx)
      let value: IndustryReportValue
      if (engine !== undefined) {
        const result: AssembleReportResult = await engine.assemble({
          title: draft.title,
          topic: name,
          evidence,
          sections: draft.sections,
          claims: draft.claims,
        })
        value = {
          industry: name,
          engine: 'research-report',
          reportDir: result.reportDir,
          reportPath: null,
          manifestPath: null,
          sealHash: result.sealHash,
          verdicts: result.verdicts,
          claims: draft.claims.length,
          evidence: evidence.length,
          gaps: artifacts.gaps,
          generatedAt,
          machineCheck,
          review,
          perspectives,
        }
      } else {
        const reportsDir = reportsDirOf(dir)
        const dirName = reportDirName(new Date(), candidate => existsSync(join(reportsDir, candidate)))
        const reportDir = join(reportsDir, dirName)
        const { reportPath, manifestPath } = await writeFallbackReport(reportDir, name, draft, evidence, artifacts.gaps, generatedAt, machineCheck, synthesis)
        await recordVersion(versionsPath, rootRelative(root, reportPath), await readFile(reportPath, 'utf8'), generatedAt)
        await recordVersion(versionsPath, rootRelative(root, manifestPath), await readFile(manifestPath, 'utf8'), generatedAt)
        value = {
          industry: name,
          engine: 'builtin-fallback',
          reportDir,
          reportPath,
          manifestPath,
          sealHash: null,
          verdicts: null,
          claims: draft.claims.length,
          evidence: evidence.length,
          gaps: artifacts.gaps,
          generatedAt,
          machineCheck,
          review,
          perspectives,
        }
      }

      const payload: ReportEventPayload = { industry: name, engine: value.engine, reportDir: value.reportDir, claims: value.claims, evidence: value.evidence }
      ctx.emit('industry-research/report', payload)
      return value
    },
  })
}
