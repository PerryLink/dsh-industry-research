/**
 * Optional bridge to the `ctx.researchReport` report engine, provided by the
 * sibling `dsh-research-report` plugin. The engine is never injected and never
 * imported: it is looked up structurally with `ctx.get('researchReport')`, and
 * `industry_report` falls back to the builtin Markdown renderer when the
 * engine is absent. The request/result types below are the frozen
 * cross-plugin contract and must stay byte-identical with it.
 * @module dsh-industry-research/engine-bridge
 */

import type { Context } from '@deepseek-ai/cordis'

export interface ReportSectionInput {
  heading: string
  /** Paragraphs; each claim string may carry citations. */
  paragraphs: Array<{ text: string; claimIds?: string[] }>
}
export interface EvidenceInput {
  id: string
  title: string
  /** Where the evidence came from (URL or workspace path). */
  origin: string
  /** Verbatim content snapshot used for byte-level checks. */
  content: string
  /** ISO-8601 time the snapshot was captured. */
  capturedAt: string
}
export interface AssembleReportRequest {
  title: string
  topic: string
  evidence: EvidenceInput[]
  sections: ReportSectionInput[]
  /** Every claim id referenced in sections must be registered here. */
  claims: Array<{ id: string; text: string; evidenceIds: string[] }>
}
export interface AssembleReportResult {
  /** Workspace path of the sealed report directory (report.md + manifest.json). */
  reportDir: string
  /** SHA-256 content hash of manifest.json. */
  sealHash: string
  /** Per-claim verification verdicts. */
  verdicts: Array<{ claimId: string; status: 'verified' | 'unverified' | 'contradicted'; note?: string }>
}

/** The structural surface of the optional `ctx.researchReport` engine. */
export interface ResearchReportLike {
  /**
   * Assemble and seal a report from evidence, sections, and claims.
   * @param request - the frozen assemble request.
   * @returns the sealed report directory, manifest hash, and per-claim verdicts.
   */
  assemble(request: AssembleReportRequest): Promise<AssembleReportResult>
}

/**
 * Look up the optional report engine.
 * @param ctx - the plugin context.
 * @returns the engine surface, or undefined when no engine is mounted.
 */
export function lookupEngine(ctx: Context): ResearchReportLike | undefined {
  return ctx.get('researchReport') as unknown as ResearchReportLike | undefined
}
