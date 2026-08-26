/**
 * Multi-perspective (bull/bear) debate synthesis for `industry_report`. Like
 * the red-team review, the synthesis is deterministic code over the already
 * loaded artifacts: the bull (利好/支撑) side lists sourced, dated values and
 * coverage, and the bear (利空/风险) side lists declared gaps and data-quality
 * findings — every point cites its evidence id or is an honest gap, never an
 * invented number. A forked subagent job writes the rendered note into the
 * workspace and appends it to the versions.jsonl SHA-256 ledger.
 * @module dsh-industry-research/perspectives
 */

import { adversarialCheck } from './adversarial.ts'
import type { LoadedArtifacts, ReportDraft } from './report.ts'

/** One side of the debate. */
export const PERSPECTIVE_SIDES = ['bull', 'bear'] as const

/** One debate side. */
export type PerspectiveSide = (typeof PERSPECTIVE_SIDES)[number]

/** One synthesized point: a claim and the evidence ids backing it. */
export interface PerspectivePoint {
  /** The point text (a sourced observation or an honest gap). */
  text: string
  /** Evidence ids backing the point (empty when the point is a declared gap). */
  evidenceIds: string[]
}

/** The bull/bear synthesis for one report assembly. */
export interface PerspectivesSynthesis {
  /** Positive/supporting observations (sourced, dated values and coverage). */
  bull: PerspectivePoint[]
  /** Negative/risk observations (gaps and data-quality findings). */
  bear: PerspectivePoint[]
}

/** Maximum sourced chain metrics surfaced on the bull side. */
const BULL_CHAIN_CAP = 8

/** Maximum sourced card metrics surfaced on the bull side. */
const BULL_CARD_CAP = 6

/** Maximum gap/finding lines surfaced on the bear side. */
const BEAR_CAP = 12

/**
 * Synthesize the bull/bear perspectives from the loaded artifacts. The bull
 * side lists sourced, dated values (chain metrics, card metrics, and timeline
 * coverage); the bear side lists declared gaps and deterministic data-quality
 * findings. Pure and byte-stable for the same inputs — never model-authored.
 * @param draft - the report draft under synthesis.
 * @param artifacts - the source artifacts the report assembles from.
 * @param evidenceIds - registered evidence ids (for dead-link checks).
 * @returns the bull/bear synthesis.
 */
export function synthesizePerspectives(draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>): PerspectivesSynthesis {
  const bull: PerspectivePoint[] = []
  const bear: PerspectivePoint[] = []

  if (artifacts.chain !== undefined) {
    for (const node of artifacts.chain.map.nodes) {
      for (const metric of node.metrics) {
        if (metric.value === undefined || metric.sourceRef === undefined) continue
        if (bull.length >= BULL_CHAIN_CAP) break
        bull.push({
          text: `产业链指标：${node.name} 的「${metric.key}」为 ${metric.value}${metric.unit ?? ''}${metric.asOf !== undefined ? `（截至 ${metric.asOf}` : ''}${metric.asOf !== undefined ? `，来源 ${metric.sourceRef}）` : ''}`,
          evidenceIds: ['E-chain'],
        })
      }
      if (bull.length >= BULL_CHAIN_CAP) break
    }
  }

  if (artifacts.timeline !== undefined && artifacts.timeline.entries.length > 0) {
    bull.push({ text: `政策与动态已收录 ${artifacts.timeline.entries.length} 条，时间线可追溯。`, evidenceIds: ['E-timeline'] })
  }

  let cardPoints = 0
  for (const { card } of artifacts.cards) {
    for (const metric of (card.metrics ?? [])) {
      if (cardPoints >= BULL_CARD_CAP) break
      cardPoints += 1
      bull.push({
        text: `公司数据：${card.name} 的「${metric.key}」为 ${metric.value}${metric.unit ?? ''}（截至 ${metric.asOf}，来源 ${metric.source}）。`,
        evidenceIds: [`E-company-${card.slug}`],
      })
    }
    if (cardPoints >= BULL_CARD_CAP) break
  }

  for (const gap of artifacts.gaps) {
    if (bear.length >= BEAR_CAP) break
    bear.push({ text: `缺口：${gap}`, evidenceIds: [] })
  }
  for (const finding of adversarialCheck(draft, artifacts, evidenceIds)) {
    if (bear.length >= BEAR_CAP) break
    bear.push({ text: `数据质量风险：${finding}`, evidenceIds: [] })
  }

  return { bull, bear }
}

/**
 * Render the multi-perspective note (`perspectives-note.md`): bull and bear
 * sections over the same source-traceability table, then a synthesis line. The
 * note is written into the industry workspace by the forked debate job and
 * appended to the versions.jsonl SHA-256 ledger.
 * @param industry - the industry display name.
 * @param draft - the report draft.
 * @param artifacts - the source artifacts.
 * @param evidenceIds - registered evidence ids.
 * @param generatedAt - ISO-8601 generation time.
 * @returns the note Markdown text.
 */
export function renderPerspectivesNote(industry: string, draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>, generatedAt: string): string {
  const synthesis = synthesizePerspectives(draft, artifacts, evidenceIds)
  const lines = [
    '# 多视角正反方笔记（bull/bear）',
    '',
    `> 行业：${industry}；生成时间：${generatedAt}。本笔记由多视角正反方辩论 job 产出，正反方观点均来自同一份来源回溯表，仅供研究，不构成投资建议。`,
    '',
    '## 多方视角（bull · 利好/支撑）',
  ]
  if (synthesis.bull.length > 0) {
    for (const point of synthesis.bull) {
      lines.push(`- ${point.text}${point.evidenceIds.length > 0 ? `（证据 ${point.evidenceIds.join(', ')}）` : ''}`)
    }
  } else {
    lines.push('- （无）')
  }
  lines.push('', '## 空方视角（bear · 利空/风险）')
  if (synthesis.bear.length > 0) {
    for (const point of synthesis.bear) lines.push(`- ${point.text}`)
  } else {
    lines.push('- （无）')
  }
  lines.push('', '## 综合（再合成）', '', `多方 ${synthesis.bull.length} 项、空方 ${synthesis.bear.length} 项；数值以来源证据为准，缺口如实声明。`)
  lines.push('')
  return lines.join('\n')
}
