/**
 * The `company_scan` tool: scan one company from user-supplied workspace data
 * files (primary) plus an optional `ctx.web` public-source complement, and
 * persist a company card (`card.json` + `card.md`) whose every figure can be
 * cited back to a file and a line. Paid/login-walled sources are out of scope
 * — the user passes their exports in via `dataFiles`. v1 reads text formats
 * only (no PDF).
 * @module dsh-industry-research/tools/company
 */

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from '../config.ts'
import { boundFigures, scanFile, writeCard } from '../company.ts'
import type { CardWebSource, CompanyCard } from '../company.ts'
import { lookupWeb, requestSignal, webErrorMessage } from '../web.ts'
import { resolveWorkspaceFile } from '../paths.ts'
import { companyDirOf, workspaceOf } from '../toolkit.ts'

/** The canonical value returned by `company_scan`. */
export interface CompanyScanValue {
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

/**
 * Build the `company_scan` tool definition.
 * @param ctx - the plugin context (optional web lookup).
 * @param config - the resolved plugin config.
 * @returns the tool definition to register.
 */
export function buildCompanyScanTool(ctx: Context, config: ResolvedConfig) {
  return defineTool({
    name: 'company_scan',
    description: '公司研究员的速览卡工具：以用户提供的工作区数据文件（年报摘录、数据表）为主、ctx.web 公开检索为辅，产出公司速览卡（业务结构 / 财务要点 / 风险点框架），所有数字都能标注来源文件与行号。不接付费/需登录数据源；缺口显式声明，禁止编造公司数字。仅供研究，不构成投资建议。',
    parameters: {
      name: { type: 'string', required: true, description: '公司名（作为目录段，如「样例酒业」）' },
      dataFiles: { type: 'array', items: { type: 'string' }, description: '工作区内数据文件的相对路径列表（.md/.txt/.csv/.tsv/.json；v1 不解析 PDF）' },
      web: { type: 'boolean', description: '是否做 web 公开源补充检索（默认 true；config.offline 时自动跳过）' },
    },
    output: {
      schema: {
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
      },
      render: (_args, value) => {
        const current = value as CompanyScanValue
        const card = current.card
        const lines = [
          `公司速览卡「${card.name}」→ ${current.cardPath}`,
          `数据文件 ${card.sources.length} 份，数字候选行 ${card.figureCandidates.length} 行（引用数字必须标注文件与行号）。`,
        ]
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
    async execute(args, exec): Promise<CompanyScanValue> {
      const cwd = workspaceOf(exec)
      const { dir, slug } = companyDirOf(config, cwd, args.name)
      const now = new Date().toISOString()
      const gaps: string[] = []
      const rejected: Array<{ path: string; reason: string }> = []

      const scanned: Awaited<ReturnType<typeof scanFile>>[] = []
      for (const file of args.dataFiles ?? []) {
        let absolute: string
        try {
          absolute = resolveWorkspaceFile(cwd, file)
        } catch (error) {
          throw error
        }
        try {
          scanned.push(await scanFile(absolute, config.scan.maxFileBytes))
        } catch (error) {
          rejected.push({ path: file, reason: error instanceof Error ? error.message : String(error) })
        }
      }
      if ((args.dataFiles ?? []).length === 0) {
        gaps.push('未提供数据文件（dataFiles）：业务结构 / 财务要点 / 风险点均待补')
      }

      let webSources: CardWebSource[] | null = null
      if (args.web === false) {
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
              { query: `${args.name} 公司 业务 简介`, maxResults: 5 },
              requestSignal(exec.signal, config.fetchTimeoutMs),
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
        name: args.name.trim(),
        slug,
        asOf: now,
        sources: scanned.map(file => file.source),
        outline: scanned.flatMap(file => file.outline !== undefined ? [file.outline] : []),
        figureCandidates: figures,
        webSources,
        gaps,
        disclaimer: '仅供研究，不构成投资建议',
      }
      const { cardJsonPath, cardPath } = await writeCard(dir, card)
      return { name: card.name, slug, dir, cardPath, cardJsonPath, card, rejected }
    },
  })
}
