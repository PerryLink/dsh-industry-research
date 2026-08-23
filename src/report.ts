/**
 * Report assembly for `industry_report`: load nothing itself — it turns the
 * already-loaded artifacts (chain map, timeline, company cards) into the
 * frozen evidence/sections/claims contract, validates model-authored drafts,
 * auto-drafts when the model supplied none, and renders the builtin-fallback
 * Markdown + manifest when no `ctx.researchReport` engine is mounted.
 * @module dsh-industry-research/report
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { isIsoDate, validateStatus } from './chain.ts'
import type { ChainMap } from './chain.ts'
import { EVIDENCE_CATEGORIES, type EvidenceCategory } from './timeline.ts'
import type { TimelineEntry } from './timeline.ts'
import type { CompanyCard } from './company.ts'
import { DISCLAIMER } from './company.ts'
import { sha256Of } from './sources.ts'
import type { EvidenceInput, ReportSectionInput } from './engine-bridge.ts'

/** One claim of the report draft (frozen-contract shape). */
export type ReportClaim = { id: string; text: string; evidenceIds: string[] }

/** A complete report draft: model-authored or auto-built. */
export interface ReportDraft {
  title: string
  sections: ReportSectionInput[]
  claims: ReportClaim[]
}

/** The artifacts an industry report assembles from. */
export interface LoadedArtifacts {
  /** The chain map with its raw file content; absent when no map exists. */
  chain?: { path: string; content: string; map: ChainMap }
  /** The timeline with its raw file content; absent when no entries exist. */
  timeline?: { path: string; content: string; entries: TimelineEntry[] }
  /** Company cards with their raw `card.json` content. */
  cards: Array<{ path: string; content: string; card: CompanyCard }>
  /** Artifact-level gaps (missing map, empty timeline, unreadable cards, …). */
  gaps: string[]
}

/** The standard auto-draft section keys selectable via the `sections` argument. */
export const AUTO_SECTIONS = ['overview', 'chain', 'timeline', 'companies', 'gaps'] as const

/** One standard auto-draft section key. */
export type AutoSection = (typeof AUTO_SECTIONS)[number]

/** How many timeline entries the auto-draft cites with claims. */
const AUTO_TIMELINE_CLAIMS = 10

/**
 * Build the frozen-contract evidence list from the loaded artifacts: one
 * entry per artifact file, carrying the verbatim content for byte-level
 * checks.
 * @param artifacts - the loaded artifacts.
 * @param capturedAt - ISO-8601 assembly time recorded on every entry.
 * @returns the evidence list.
 */
export function buildEvidence(artifacts: LoadedArtifacts, capturedAt: string): EvidenceInput[] {
  const evidence: EvidenceInput[] = []
  if (artifacts.chain !== undefined) {
    evidence.push({ id: 'E-chain', title: '产业链结构图 chain.json', origin: artifacts.chain.path, content: artifacts.chain.content, capturedAt })
  }
  if (artifacts.timeline !== undefined) {
    evidence.push({ id: 'E-timeline', title: '政策与动态时间线 timeline.jsonl', origin: artifacts.timeline.path, content: artifacts.timeline.content, capturedAt })
  }
  for (const { path, content, card } of artifacts.cards) {
    evidence.push({ id: `E-company-${card.slug}`, title: `公司速览卡 ${card.name}`, origin: path, content, capturedAt })
  }
  return evidence
}

/**
 * Validate a draft against the registered evidence: every claim's
 * `evidenceIds` must reference registered evidence, and every `claimIds`
 * reference in the sections must resolve to a registered claim.
 * @param draft - the candidate draft.
 * @param evidenceIds - registered evidence ids.
 * @returns human-readable problems (empty when valid).
 */
export function validateDraft(draft: ReportDraft, evidenceIds: ReadonlySet<string>): string[] {
  const problems: string[] = []
  if (typeof draft.title !== 'string' || draft.title.trim().length === 0) problems.push('draft.title must be a non-empty string')
  if (draft.sections.length === 0) problems.push('draft.sections must not be empty')
  const claimIds = new Set<string>()
  for (const claim of draft.claims) {
    if (typeof claim.id !== 'string' || claim.id.trim().length === 0) {
      problems.push('a claim has an empty id')
      continue
    }
    if (claimIds.has(claim.id)) problems.push(`duplicate claim id "${claim.id}"`)
    claimIds.add(claim.id)
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) problems.push(`claim "${claim.id}" references unknown evidence "${evidenceId}"`)
    }
  }
  for (const section of draft.sections) {
    for (const paragraph of section.paragraphs) {
      for (const claimId of paragraph.claimIds ?? []) {
        if (!claimIds.has(claimId)) problems.push(`section "${section.heading}" references unregistered claim "${claimId}"`)
      }
    }
  }
  return problems
}

/** Placeholder tokens a finished report must never ship. */
const PLACEHOLDER_RE = /\{\{|\}\}|TODO|FIXME|TBD/u

/**
 * Validate the deterministic delivery contract a report must satisfy before it
 * is produced: every block is complete (title, section headings + paragraphs,
 * claims with evidence), no placeholder residue remains in any text, every
 * status assertion in the source artifacts carries a valid non-future
 * `statusAsOf`, and every value assertion (card metric / chain metric) carries
 * its source and, for cards, a valid non-future `asOf`. Any problem fails loud
 * so a half-assembled report is never emitted.
 * @param draft - the validated draft.
 * @param artifacts - the loaded artifacts the report assembles from.
 * @param evidenceIds - registered evidence ids.
 * @returns delivery-contract problems (empty when the contract holds).
 */
export function validateDeliveryContract(draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>): string[] {
  const problems: string[] = []
  if (typeof draft.title !== 'string' || draft.title.trim().length === 0) problems.push('delivery contract: draft.title is empty')
  if (draft.sections.length === 0) problems.push('delivery contract: draft has no sections')
  for (const [sectionIndex, section] of draft.sections.entries()) {
    if (typeof section.heading !== 'string' || section.heading.trim().length === 0) {
      problems.push(`delivery contract: section[${sectionIndex}] has an empty heading`)
    }
    if (section.paragraphs.length === 0) problems.push(`delivery contract: section "${section.heading}" has no paragraphs`)
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      if (typeof paragraph.text !== 'string' || paragraph.text.trim().length === 0) {
        problems.push(`delivery contract: section "${section.heading}" paragraph[${paragraphIndex}] is empty`)
      }
    }
  }
  for (const claim of draft.claims) {
    if (typeof claim.text !== 'string' || claim.text.trim().length === 0) problems.push(`delivery contract: claim "${claim.id}" has empty text`)
    if (claim.evidenceIds.length === 0) problems.push(`delivery contract: claim "${claim.id}" has no evidence`)
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) problems.push(`delivery contract: claim "${claim.id}" references unknown evidence "${evidenceId}"`)
    }
  }
  for (const text of [draft.title, ...draft.sections.flatMap(section => section.paragraphs.map(paragraph => paragraph.text)), ...draft.claims.map(claim => claim.text)]) {
    if (PLACEHOLDER_RE.test(text)) problems.push(`delivery contract: placeholder residue in ${JSON.stringify(text.slice(0, 60))}`)
  }
  const now = new Date()
  if (artifacts.chain !== undefined) {
    for (const node of artifacts.chain.map.nodes) {
      problems.push(...validateStatus(node.status, node.statusAsOf, `chain node "${node.id}"`, now))
      for (const [metricIndex, metric] of node.metrics.entries()) {
        if (metric.value !== undefined && (typeof metric.sourceRef !== 'string' || metric.sourceRef.trim().length === 0)) {
          problems.push(`delivery contract: chain node "${node.id}" metric[${metricIndex}] carries a value without a sourceRef`)
        }
      }
    }
  }
  for (const { card } of artifacts.cards) {
    problems.push(...validateStatus(card.status, card.statusAsOf, `company card "${card.name}"`, now))
    for (const [metricIndex, metric] of (card.metrics ?? []).entries()) {
      if (typeof metric.source !== 'string' || metric.source.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without a source`)
      }
      if (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without an asOf`)
      } else if (!isIsoDate(metric.asOf)) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is not a valid ISO-8601 date`)
      } else if (Date.parse(metric.asOf) > now.getTime()) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is in the future`)
      }
    }
  }
  return problems
}

/**
 * Build the mechanical draft when the model supplied none: sourced chain
 * metrics and recent timeline entries become claims bound to their artifact
 * evidence; everything unsourced stays a declared gap, never prose.
 * @param industry - the industry display name.
 * @param artifacts - the loaded artifacts.
 * @param sections - which standard sections to include (default all).
 * @returns the auto-built draft.
 */
export function autoDraft(industry: string, artifacts: LoadedArtifacts, sections: readonly AutoSection[] = [...AUTO_SECTIONS]): ReportDraft {
  const wanted = new Set<string>(sections)
  const claims: ReportClaim[] = []
  const draftSections: ReportSectionInput[] = []

  if (wanted.has('overview')) {
    const presence = [
      artifacts.chain !== undefined ? `产业链结构图：${artifacts.chain.map.nodes.length} 节点 / ${artifacts.chain.map.edges.length} 边` : '产业链结构图：缺失',
      artifacts.timeline !== undefined ? `政策与动态：${artifacts.timeline.entries.length} 条` : '政策与动态：无',
      `公司速览卡：${artifacts.cards.length} 张`,
    ]
    draftSections.push({
      heading: '概览',
      paragraphs: [{ text: `本报告汇总「${industry}」行业研究工作区内的已有材料：${presence.join('；')}。所有数值均以来源回溯表中的证据为准，缺口见文末清单。` }],
    })
  }

  if (wanted.has('chain')) {
    const paragraphs: ReportSectionInput['paragraphs'] = []
    if (artifacts.chain !== undefined) {
      const map = artifacts.chain.map
      for (const tier of ['upstream', 'midstream', 'downstream'] as const) {
        const names = map.nodes.filter(node => node.tier === tier).map(node => node.name)
        paragraphs.push({ text: `${tier}：${names.length > 0 ? names.join('、') : '（无节点）'}` })
      }
      const edgeText = map.edges.map(edge => {
        const from = map.nodes.find(node => node.id === edge.from)?.name ?? edge.from
        const to = map.nodes.find(node => node.id === edge.to)?.name ?? edge.to
        return `${from} → ${to}${edge.note !== undefined ? `（${edge.note}）` : ''}`
      })
      if (edgeText.length > 0) paragraphs.push({ text: `链上关系：${edgeText.join('；')}` })
      const metricClaims: string[] = []
      for (const node of map.nodes) {
        node.metrics.forEach((metric, index) => {
          // A reportable numeric claim needs a fully sourced value: source + asOf.
          if (metric.value === undefined || metric.sourceRef === undefined || metric.asOf === undefined) return
          const id = `C-chain-${node.id}-${index}`
          claims.push({
            id,
            text: `${node.name} 的 ${metric.key} 为 ${metric.value}${metric.unit ?? ''}（截至 ${metric.asOf}，来源 ${metric.sourceRef}）`,
            evidenceIds: ['E-chain'],
          })
          metricClaims.push(id)
        })
      }
      if (metricClaims.length > 0) {
        paragraphs.push({ text: '链上关键指标见 claims 清单（逐条绑定来源证据）。', claimIds: metricClaims })
      } else {
        paragraphs.push({ text: '链上暂无有来源的指标数值（均为待补槽位）。' })
      }
    } else {
      paragraphs.push({ text: '待补：尚无产业链结构图（先运行 industry_map）。' })
    }
    draftSections.push({ heading: '产业链结构', paragraphs })
  }

  if (wanted.has('timeline')) {
    const paragraphs: ReportSectionInput['paragraphs'] = []
    if (artifacts.timeline !== undefined && artifacts.timeline.entries.length > 0) {
      const recent = artifacts.timeline.entries.slice(-AUTO_TIMELINE_CLAIMS)
      let claimIndex = 0
      for (const category of [...EVIDENCE_CATEGORIES, null] as readonly (EvidenceCategory | null)[]) {
        const group = recent.filter(entry => (entry.evidenceCategory ?? null) === category)
        if (group.length === 0) continue
        paragraphs.push({ text: `类别「${category === null ? '未分类' : category}」：` })
        for (const entry of group) {
          const id = `C-timeline-${claimIndex}`
          claimIndex += 1
          claims.push({ id, text: `${entry.date ?? '日期未知'}：${entry.title}（来源 ${entry.url}）`, evidenceIds: ['E-timeline'] })
          paragraphs.push({ text: `${entry.date ?? '日期未知'} — ${entry.title}`, claimIds: [id] })
        }
      }
      if (artifacts.timeline.entries.length > recent.length) {
        paragraphs.push({ text: `（时间线共 ${artifacts.timeline.entries.length} 条，此处仅列最近 ${recent.length} 条。）` })
      }
    } else {
      paragraphs.push({ text: '待补：尚无政策与动态条目（先运行 industry_track）。' })
    }
    draftSections.push({ heading: '政策与动态', paragraphs })
  }

  if (wanted.has('companies')) {
    const paragraphs: ReportSectionInput['paragraphs'] = []
    if (artifacts.cards.length > 0) {
      for (const { card } of artifacts.cards) {
        paragraphs.push({ text: `「${card.name}」（asOf ${card.asOf}）：数据文件 ${card.sources.length} 份，数字候选行 ${card.figureCandidates.length} 行，缺口 ${card.gaps.length} 项；详见该卡 card.md。` })
      }
    } else {
      paragraphs.push({ text: '待补：尚无公司速览卡（先运行 company_scan）。' })
    }
    draftSections.push({ heading: '公司速览', paragraphs })
  }

  if (wanted.has('gaps')) {
    draftSections.push({
      heading: '缺口与待补',
      paragraphs: artifacts.gaps.length > 0
        ? artifacts.gaps.map(gap => ({ text: gap }))
        : [{ text: '本次组装未发现材料级缺口（指标级待补见产业链结构一节）。' }],
    })
  }

  const title = `${industry} 行业研究报告`
  return { title, sections: draftSections, claims }
}

/**
 * Render the builtin-fallback Markdown report: sections with claim footnote
 * markers, a source-traceability appendix with SHA-256 per evidence, and the
 * unverified claims appendix. The fallback never claims independent
 * verification.
 * @param industry - the industry display name.
 * @param draft - the validated draft.
 * @param evidence - the registered evidence.
 * @param generatedAt - ISO-8601 generation time.
 * @param machineCheck - deterministic adversarial-check findings (empty = clean).
 * @returns the Markdown text.
 */
export function renderFallbackMarkdown(industry: string, draft: ReportDraft, evidence: readonly EvidenceInput[], generatedAt: string, machineCheck: readonly string[] = []): string {
  const lines: string[] = [
    `# ${draft.title}`,
    '',
    `> ${DISCLAIMER}。`,
    `> 行业：${industry}；生成时间：${generatedAt}；引擎：builtin-fallback（未经过独立核查引擎，claims 未做逐条核查）。`,
    '',
  ]
  for (const section of draft.sections) {
    lines.push(`## ${section.heading}`, '')
    for (const paragraph of section.paragraphs) {
      const markers = (paragraph.claimIds ?? []).map(id => `[${id}]`).join('')
      lines.push(`${paragraph.text}${markers}`, '')
    }
  }
  lines.push('## 附录：来源回溯表', '', '| 证据 | 来源 | SHA-256 | 抓取时间 |', '|---|---|---|---|')
  for (const item of evidence) {
    lines.push(`| ${item.id} | ${item.title}（\`${item.origin}\`） | \`${sha256Of(item.content)}\` | ${item.capturedAt} |`)
  }
  lines.push('', '## 附录：claims 清单（builtin-fallback，未核查）', '')
  if (draft.claims.length > 0) {
    lines.push('| claim | 内容 | 证据 | 状态 |', '|---|---|---|---|')
    for (const claim of draft.claims) {
      lines.push(`| ${claim.id} | ${claim.text} | ${claim.evidenceIds.join(', ')} | unverified |`)
    }
  } else {
    lines.push('无 claims。')
  }
  lines.push('', '## 机器对抗检查', '')
  if (machineCheck.length > 0) {
    for (const finding of machineCheck) lines.push(`- ${finding}`)
  } else {
    lines.push('未发现可攻击点。')
  }
  lines.push('')
  return lines.join('\n')
}

/** The fallback manifest shape (`manifest.json`). */
export interface FallbackManifest {
  engine: 'builtin-fallback'
  industry: string
  title: string
  generatedAt: string
  disclaimer: string
  evidence: Array<{ id: string; title: string; origin: string; sha256: string; capturedAt: string; bytes: number }>
  claims: Array<ReportClaim & { status: 'unverified' }>
  gaps: string[]
  machineCheck: string[]
}

/**
 * Write the fallback report directory: `report.md` + `manifest.json`.
 * @param reportDir - absolute target directory (created).
 * @param industry - the industry display name.
 * @param draft - the validated draft.
 * @param evidence - the registered evidence.
 * @param gaps - artifact-level gaps to record in the manifest.
 * @param generatedAt - ISO-8601 generation time.
 * @param machineCheck - deterministic adversarial-check findings.
 * @returns the written file paths.
 */
export async function writeFallbackReport(
  reportDir: string,
  industry: string,
  draft: ReportDraft,
  evidence: readonly EvidenceInput[],
  gaps: readonly string[],
  generatedAt: string,
  machineCheck: readonly string[] = [],
): Promise<{ reportPath: string; manifestPath: string }> {
  await mkdir(reportDir, { recursive: true })
  const reportPath = join(reportDir, 'report.md')
  const manifestPath = join(reportDir, 'manifest.json')
  const manifest: FallbackManifest = {
    engine: 'builtin-fallback',
    industry,
    title: draft.title,
    generatedAt,
    disclaimer: DISCLAIMER,
    evidence: evidence.map(item => ({
      id: item.id,
      title: item.title,
      origin: item.origin,
      sha256: sha256Of(item.content),
      capturedAt: item.capturedAt,
      bytes: Buffer.byteLength(item.content, 'utf8'),
    })),
    claims: draft.claims.map(claim => ({ ...claim, status: 'unverified' as const })),
    gaps: [...gaps],
    machineCheck: [...machineCheck],
  }
  await writeFile(reportPath, renderFallbackMarkdown(industry, draft, evidence, generatedAt, machineCheck), 'utf8')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  return { reportPath, manifestPath }
}

/**
 * The report directory name for one generation: `<YYYYMMDD-HHmmss>` with a
 * numeric suffix when the same second collides.
 * @param at - the generation time.
 * @param exists - whether a candidate directory already exists.
 * @returns the directory name (not a path).
 */
export function reportDirName(at: Date, exists: (name: string) => boolean): string {
  const pad = (value: number): string => String(value).padStart(2, '0')
  const base = `${at.getFullYear()}${pad(at.getMonth() + 1)}${pad(at.getDate())}-${pad(at.getHours())}${pad(at.getMinutes())}${pad(at.getSeconds())}`
  if (!exists(base)) return base
  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}-${suffix}`
    if (!exists(candidate)) return candidate
  }
}
