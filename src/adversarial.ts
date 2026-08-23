/**
 * Deterministic red-team adversarial review. `adversarialCheck` is pure code
 * that always runs before a report ships (the machine-check baseline); the
 * optional red-review job writes `red-review-note.md` from the same findings.
 * It scans the report's claims and source artifacts for unsourced/undated
 * numbers, statuses without dates, and dead evidence links — never invoking a
 * model, so the result is byte-stable for the same inputs.
 * @module dsh-industry-research/adversarial
 */

import type { LoadedArtifacts, ReportDraft } from './report.ts'

/**
 * Run the deterministic adversarial scan. Findings cover: claims referencing
 * unknown evidence (dead links), chain metrics with a value but no `sourceRef`
 * or no `asOf`, chain nodes with a `status` but no `statusAsOf`, and card
 * metrics missing `source`/`asOf` or asserting a `status` without a date.
 * @param draft - the report draft under review.
 * @param artifacts - the source artifacts the report assembles from.
 * @param evidenceIds - registered evidence ids.
 * @returns adversarial findings (empty when the report is clean).
 */
export function adversarialCheck(draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>): string[] {
  const findings: string[] = []
  for (const claim of draft.claims) {
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) findings.push(`claim "${claim.id}" references a dead evidence link "${evidenceId}"`)
    }
  }
  if (artifacts.chain !== undefined) {
    for (const node of artifacts.chain.map.nodes) {
      if (node.status !== undefined && node.statusAsOf === undefined) {
        findings.push(`chain node "${node.id}" asserts status ${node.status} without a statusAsOf date`)
      }
      for (const [index, metric] of node.metrics.entries()) {
        if (metric.value !== undefined && (typeof metric.sourceRef !== 'string' || metric.sourceRef.trim().length === 0)) {
          findings.push(`chain node "${node.id}" metric[${index}] carries a value without a sourceRef`)
        }
        if (metric.value !== undefined && (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0)) {
          findings.push(`chain node "${node.id}" metric[${index}] carries a value without an asOf`)
        }
      }
    }
  }
  for (const { card } of artifacts.cards) {
    if (card.status !== undefined && card.statusAsOf === undefined) {
      findings.push(`company card "${card.name}" asserts status ${card.status} without a statusAsOf date`)
    }
    for (const [index, metric] of (card.metrics ?? []).entries()) {
      if (typeof metric.source !== 'string' || metric.source.trim().length === 0) {
        findings.push(`company card "${card.name}" metric[${index}] carries a value without a source`)
      }
      if (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0) {
        findings.push(`company card "${card.name}" metric[${index}] carries a value without an asOf`)
      }
    }
  }
  return findings
}

/**
 * Render the red-team review note (devil's-advocate framing) from the
 * deterministic findings.
 * @param draft - the report draft under review.
 * @param artifacts - the source artifacts.
 * @param evidenceIds - registered evidence ids.
 * @param generatedAt - ISO-8601 generation time.
 * @returns the `red-review-note.md` Markdown text.
 */
export function renderRedReviewNote(draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>, generatedAt: string): string {
  const findings = adversarialCheck(draft, artifacts, evidenceIds)
  const lines = [
    '# 红方对抗审阅笔记（魔鬼代言人）',
    '',
    `> 生成时间：${generatedAt}。本笔记由对抗性审阅 job 产出，仅供研究，不构成投资建议。`,
    '',
    findings.length > 0 ? `攻击点 ${findings.length} 项：` : '未发现可攻击点。',
  ]
  for (const finding of findings) lines.push(`- ${finding}`)
  lines.push('')
  return lines.join('\n')
}
