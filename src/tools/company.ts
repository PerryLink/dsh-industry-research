/**
 * The `company_scan` tool: scan one or many companies from user-supplied
 * workspace data files (primary) plus an optional `ctx.web` public-source
 * complement, and persist a company card (`card.json` + `card.md`) whose every
 * figure can be cited back to a file and a line. Single-company mode (`name`)
 * fails loud on a bad company; batch mode (`companies`) isolates each
 * company's failure so one bad company never aborts the batch. Paid/login-walled
 * sources are out of scope — the user passes their exports in via `dataFiles`.
 * v1 reads text formats only (no PDF).
 * @module dsh-industry-research/tools/company
 */

import { readFile } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from '../config.ts'
import type { CompanyStatus } from '../chain.ts'
import { DEPTH_PROFILES, resolveDepth } from '../depth.ts'
import type { ResearchDepth } from '../depth.ts'
import { boundFigures, scanFile, validateCompanyCard, writeCard } from '../company.ts'
import type { CardWebSource, CompanyCard } from '../company.ts'
import { lookupJobs } from '../jobs.ts'
import type { JobOutcomeLike } from '../jobs.ts'
import { lookupWeb, requestSignal, webErrorMessage } from '../web.ts'
import { resolveWorkspaceFile } from '../paths.ts'
import { companyDirOf, versionsPathOf, workspaceOf } from '../toolkit.ts'
import { recordVersion, rootRelative } from '../versions.ts'

/** The canonical value returned by a single-company `company_scan`. */
export type CompanyScanValue = {
  name: string
  slug: string
  /** Absolute company card directory. */
  dir: string
  cardPath: string
  cardJsonPath: string
  /** The persisted card. */
  card: CompanyCard
  /** Data files rejected this call, with the reason. */
  rejected: Array<{ path: string; reason: string }>
}

/** The canonical value returned by a batch `company_scan`. */
export type CompanyScanBatchValue = {
  /** Companies scanned successfully. */
  results: CompanyScanValue[]
  /** Companies that failed this call, with the reason. */
  failures: Array<{ name: string; reason: string }>
  /** How the batch was executed (parallel fan-out or sequential fallback). */
  mode: 'sequential' | 'parallel'
}

/** One company scan spec, shared by single and batch modes. */
interface CompanySpec {
  name: string
  dataFiles?: string[]
  web?: boolean
  status?: CompanyStatus
  statusAsOf?: string
  ticker?: string
  metrics?: Array<{ key: string; value: number; unit?: string; asOf: string; source: string }>
}

/** The shared per-company scan fields (schema + type source). */
const COMPANY_SCAN_FIELDS = {
  dataFiles: { type: 'array', items: { type: 'string' }, description: '工作区内数据文件的相对路径列表（.md/.txt/.csv/.tsv/.json；v1 不解析 PDF）' },
  web: { type: 'boolean', description: '是否做 web 公开源补充检索（默认 true；config.offline 时自动跳过）' },
  status: { type: 'string', enum: ['public', 'private', 'acquired', 'IPO'], description: '公司上市状态' },
  statusAsOf: { type: 'string', description: 'status 的截止日期（ISO-8601）；有 status 必填' },
  ticker: { type: 'string', description: '股票代码/ticker（如 A 股 600519）；按 config.scan.strictTicker 校验' },
  metrics: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        key: { type: 'string', required: true, description: '数据点名（如 股价、市值、营业收入）' },
        value: { type: 'number', required: true, description: '数值' },
        unit: { type: 'string', description: '单位（如 元、亿元、%）' },
        asOf: { type: 'string', required: true, description: '数值截止日期（ISO-8601，必填）' },
        source: { type: 'string', required: true, description: '来源引用：sources.json ref、URL 或工作区路径（必填）' },
      },
      additionalProperties: false,
    },
    description: '有来源的价格/数值数据点；每个 value 必须带 source + asOf',
  },
} as const

/** The single-company output schema (required fields only). */
const SINGLE_OUTPUT = {
  type: 'object',
  properties: {
    name: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    dir: { type: 'string', required: true },
    cardPath: { type: 'string', required: true },
    cardJsonPath: { type: 'string', required: true },
    card: { type: 'json', required: true },
    rejected: { type: 'array', items: { type: 'json' }, required: true },
  },
  additionalProperties: false,
} as const

/** The batch output schema. */
const BATCH_OUTPUT = {
  type: 'object',
  properties: {
    results: { type: 'array', items: { type: 'json' }, required: true },
    failures: { type: 'array', items: { type: 'json' }, required: true },
    mode: { type: 'string', enum: ['sequential', 'parallel'], required: true },
  },
  additionalProperties: false,
} as const

/**
 * Scan and persist one company card. Hard failures (path escape, validation)
 * throw — the batch loop isolates them; single mode lets them fail loud.
 * @param ctx - the plugin context (optional web lookup).
 * @param config - resolved plugin config.
 * @param cwd - absolute workspace root.
 * @param depth - resolved collection depth.
 * @param signal - the tool execution signal.
 * @param spec - the company scan spec.
 * @returns the persisted card value.
 */
async function scanOneCompany(ctx: Context, config: ResolvedConfig, cwd: string, depth: ResearchDepth, signal: AbortSignal, spec: CompanySpec): Promise<CompanyScanValue> {
  const { root, dir, slug } = companyDirOf(config, cwd, spec.name)
  const now = new Date().toISOString()
  const gaps: string[] = []
  const rejected: Array<{ path: string; reason: string }> = []

  const scanned: Awaited<ReturnType<typeof scanFile>>[] = []
  for (const file of spec.dataFiles ?? []) {
    const absolute = resolveWorkspaceFile(cwd, file)
    try {
      scanned.push(await scanFile(absolute, config.scan.maxFileBytes))
    } catch (error) {
      rejected.push({ path: file, reason: error instanceof Error ? error.message : String(error) })
    }
  }
  if ((spec.dataFiles ?? []).length === 0) {
    gaps.push('未提供数据文件（dataFiles）：业务结构 / 财务要点 / 风险点均待补')
  }

  let webSources: CardWebSource[] | null = null
  if (spec.web === false) {
    gaps.push('按调用方要求未做 web 公开源检索')
  } else if (config.offline) {
    gaps.push('config.offline 为 true，未做 web 公开源检索')
  } else {
    const web = lookupWeb(ctx)
    if (web === undefined) {
      gaps.push('ctx.web 未挂载，未做 web 公开源检索')
    } else {
      try {
        const outcome = await web.search(
          { query: `${spec.name} 公司 业务 简介`, maxResults: DEPTH_PROFILES[depth].scanSearchResults },
          requestSignal(signal, config.fetchTimeoutMs),
        )
        webSources = outcome.sources.map(source => ({
          url: source.url,
          ...(source.title !== undefined ? { title: source.title } : {}),
          ...(source.snippet !== undefined ? { snippet: source.snippet } : {}),
          ...(source.publishedAt !== undefined ? { publishedAt: source.publishedAt } : {}),
        }))
      } catch (error) {
        gaps.push(`web 公开源检索失败：${webErrorMessage(error)}`)
      }
    }
  }

  const figures = boundFigures(scanned.flatMap(file => file.figures), config)
  const totalFigures = scanned.reduce((sum, file) => sum + file.figures.length, 0)
  if (totalFigures > figures.length) {
    gaps.push(`数字候选行超出 scan.maxFigureCandidates（${totalFigures} > ${figures.length}），仅保留前 ${figures.length} 行`)
  }
  if (scanned.length > 0 && totalFigures === 0) {
    gaps.push('数据文件中未发现数字行：财务要点待补')
  }

  const card: CompanyCard = {
    name: spec.name.trim(),
    slug,
    asOf: now,
    sources: scanned.map(file => file.source),
    outline: scanned.flatMap(file => file.outline !== undefined ? [file.outline] : []),
    figureCandidates: figures,
    webSources,
    gaps,
    disclaimer: '仅供研究，不构成投资建议',
    ...(spec.status !== undefined ? { status: spec.status } : {}),
    ...(spec.statusAsOf !== undefined ? { statusAsOf: spec.statusAsOf } : {}),
    ...(spec.ticker !== undefined ? { ticker: spec.ticker } : {}),
    metrics: (spec.metrics ?? []).map(metric => ({
      key: metric.key,
      value: metric.value,
      ...(metric.unit !== undefined ? { unit: metric.unit } : {}),
      asOf: metric.asOf,
      source: metric.source,
    })),
  }
  const problems = validateCompanyCard(card, new Date(), config.scan.strictTicker)
  if (problems.length > 0) {
    throw new Error(`company card 校验失败（${problems.length} 项）：${problems.join('；')}`)
  }
  const { cardJsonPath, cardPath } = await writeCard(dir, card)
  const versionsPath = versionsPathOf(root)
  await recordVersion(versionsPath, rootRelative(root, cardJsonPath), await readFile(cardJsonPath, 'utf8'), now)
  await recordVersion(versionsPath, rootRelative(root, cardPath), await readFile(cardPath, 'utf8'), now)
  return { name: card.name, slug, dir, cardPath, cardJsonPath, card, rejected }
}

/**
 * Build the `company_scan` tool definition.
 * @param ctx - the plugin context (optional web lookup).
 * @param config - the resolved plugin config.
 * @returns the tool definition to register.
 */
export function buildCompanyScanTool(ctx: Context, config: ResolvedConfig) {
  return defineTool({
    name: 'company_scan',
    description: '公司研究员的速览卡工具：以用户提供的工作区数据文件（年报摘录、数据表）为主、ctx.web 公开检索为辅，产出公司速览卡（业务结构 / 财务要点 / 风险点框架），所有数字都能标注来源文件与行号。支持单公司（name）或批量（companies，单公司失败不中断整批）。不接付费/需登录数据源；缺口显式声明，禁止编造公司数字。仅供研究，不构成投资建议。',
    parameters: {
      name: { type: 'string', description: '公司名（单公司模式；与 companies 二选一）' },
      ...COMPANY_SCAN_FIELDS,
      depth: { type: 'string', enum: ['quick', 'standard', 'comprehensive'], description: '采集深度（quick=最小来源；standard=现行为；comprehensive=最大来源；默认 standard）' },
      companies: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', required: true, description: '公司名（作为目录段，如「样例酒业」）' },
            ...COMPANY_SCAN_FIELDS,
          },
          additionalProperties: false,
        },
        description: '批量公司扫描（每项同单公司字段；与 name 二选一）；单公司失败不中断整批',
      },
      parallel: { type: 'boolean', description: '批量模式是否按公司 fan-out 为独立 job（默认 false；需 ctx.jobs，否则回退顺序路径）' },
    },
    output: {
      schema: {
        oneOf: [SINGLE_OUTPUT, BATCH_OUTPUT],
      },
      render: (_args, value) => {
        const current = value as CompanyScanValue | CompanyScanBatchValue
        if ('results' in current) {
          const lines = [`批量公司扫描（${current.mode === 'parallel' ? 'parallel' : 'sequential'}）：成功 ${current.results.length} 家，失败 ${current.failures.length} 家。`]
          for (const result of current.results) lines.push(`- 成功：${result.name} → ${result.cardPath}`)
          for (const failure of current.failures) lines.push(`- 失败：${failure.name}（${failure.reason}）`)
          return [{ type: 'text', text: lines.join('\n') }]
        }
        const card = current.card
        const lines = [
          `公司速览卡「${card.name}」→ ${current.cardPath}`,
          `数据文件 ${card.sources.length} 份，数字候选行 ${card.figureCandidates.length} 行（引用数字必须标注文件与行号）。`,
        ]
        if (card.status !== undefined) lines.push(`上市状态：${card.status}（statusAsOf ${card.statusAsOf ?? ''}）`)
        if (card.ticker !== undefined) lines.push(`代码/ticker：${card.ticker}`)
        if ((card.metrics ?? []).length > 0) {
          lines.push(`价格/数值数据点 ${(card.metrics ?? []).length} 条：${(card.metrics ?? []).map(metric => `${metric.key}=${metric.value}${metric.unit ?? ''}（来源 ${metric.source}，截至 ${metric.asOf}）`).join('；')}`)
        }
        if (card.webSources !== null && card.webSources.length > 0) {
          lines.push(`公开源 ${card.webSources.length} 条：${card.webSources.map(source => source.title ?? source.url).join('；')}`)
        }
        if (current.rejected.length > 0) {
          lines.push(`未采纳文件 ${current.rejected.length} 份：${current.rejected.map(entry => `${entry.path}（${entry.reason}）`).join('；')}`)
        }
        if (card.gaps.length > 0) lines.push(`缺口声明：${card.gaps.join('；')}`)
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    timeoutMs: Math.max(30_000, config.fetchTimeoutMs * 3),
    async execute(args, exec): Promise<CompanyScanValue | CompanyScanBatchValue> {
      const cwd = workspaceOf(exec)
      const depth = resolveDepth(args.depth)
      const signal = exec.signal
      if (args.name !== undefined && args.companies !== undefined) {
        throw new Error('company_scan accepts either name (single company) or companies (batch), not both')
      }
      if (args.name !== undefined) {
        const spec: CompanySpec = {
          name: args.name,
          ...(args.dataFiles !== undefined ? { dataFiles: args.dataFiles } : {}),
          ...(args.web !== undefined ? { web: args.web } : {}),
          ...(args.status !== undefined ? { status: args.status } : {}),
          ...(args.statusAsOf !== undefined ? { statusAsOf: args.statusAsOf } : {}),
          ...(args.ticker !== undefined ? { ticker: args.ticker } : {}),
          ...(args.metrics !== undefined ? { metrics: args.metrics } : {}),
        }
        return await scanOneCompany(ctx, config, cwd, depth, signal, spec)
      }
      if (args.companies !== undefined) {
        const specs: CompanySpec[] = args.companies.map(company => ({
          name: company.name,
          ...(company.dataFiles !== undefined ? { dataFiles: company.dataFiles } : {}),
          ...(company.web !== undefined ? { web: company.web } : {}),
          ...(company.status !== undefined ? { status: company.status } : {}),
          ...(company.statusAsOf !== undefined ? { statusAsOf: company.statusAsOf } : {}),
          ...(company.ticker !== undefined ? { ticker: company.ticker } : {}),
          ...(company.metrics !== undefined ? { metrics: company.metrics } : {}),
        }))
        const jobs = args.parallel === true ? lookupJobs(ctx) : undefined
        if (jobs !== undefined) {
          const outcomes: Array<{ name: string; value?: CompanyScanValue; error?: string }> = specs.map(spec => ({ name: spec.name }))
          const dones: Array<Promise<JobOutcomeLike>> = []
          for (const [index, spec] of specs.entries()) {
            let cancelled = false
            let resolveDone!: (outcome: JobOutcomeLike) => void
            const done = new Promise<JobOutcomeLike>(resolve => { resolveDone = resolve })
            dones.push(done)
            jobs.start({
              kind: 'subagent',
              label: `company_scan: ${spec.name}`,
              owner: exec.agent,
              run: () => {
                void (async () => {
                  if (cancelled) { resolveDone({ status: 'killed' }); return }
                  try {
                    outcomes[index]!.value = await scanOneCompany(ctx, config, cwd, depth, signal, spec)
                    resolveDone({ status: 'completed', output: spec.name })
                  } catch (error) {
                    const reason = error instanceof Error ? error.message : String(error)
                    outcomes[index]!.error = reason
                    resolveDone({ status: 'failed', output: reason })
                  }
                })()
                return { cancel: () => { cancelled = true }, done }
              },
            })
          }
          await Promise.all(dones)
          return {
            results: outcomes.filter(outcome => outcome.value !== undefined).map(outcome => outcome.value!),
            failures: outcomes.filter(outcome => outcome.error !== undefined).map(outcome => ({ name: outcome.name, reason: outcome.error! })),
            mode: 'parallel' as const,
          }
        }
        const results: CompanyScanValue[] = []
        const failures: Array<{ name: string; reason: string }> = []
        for (const spec of specs) {
          try {
            results.push(await scanOneCompany(ctx, config, cwd, depth, signal, spec))
          } catch (error) {
            failures.push({ name: spec.name, reason: error instanceof Error ? error.message : String(error) })
          }
        }
        return { results, failures, mode: 'sequential' }
      }
      throw new Error('company_scan requires a name (single company) or companies (batch)')
    },
  })
}
