/**
 * Optional bridge to the `ctx.researchReport` report engine, provided by the
 * sibling `dsh-research-report` plugin. The engine is never injected and never
 * reached at runtime through an import: it is looked up structurally with
 * `ctx.get('researchReport')`, and `industry_report` falls back to the builtin
 * Markdown renderer when the engine is absent.
 *
 * The request/result types are **owned** by `dsh-research-report` and imported
 * from it as types only (erased at build time, so no runtime dependency is
 * created). They used to be mirrored as five local interfaces kept in sync by
 * hand — that mirror could drift silently, and nothing would fail until a real
 * call misbehaved. Re-exported here so existing import sites stay stable.
 * @module dsh-industry-research/engine-bridge
 */

import type { Context } from '@deepseek-ai/cordis'
import type {
  AssembleReportRequest,
  AssembleReportResult,
  EvidenceInput,
  ReportSectionInput,
} from 'dsh-research-report'

export type {
  AssembleReportRequest,
  AssembleReportResult,
  EvidenceInput,
  ReportSectionInput,
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
 * Structural guard for the optional report engine.
 *
 * `ctx.get()` is untyped, so the looked-up value must be proven to carry the
 * one method this plugin calls before it is used. This replaces the previous
 * `as unknown as` cast, which asserted a shape that was never checked: a
 * mounted service missing `assemble` would have been accepted here and failed
 * later inside the call path, where the cause is much harder to read.
 * @param value - the value returned by `ctx.get('researchReport')`.
 * @returns true when the value exposes a callable `assemble`.
 */
function isResearchReportLike(value: unknown): value is ResearchReportLike {
  if (typeof value !== 'object' || value === null) return false
  return typeof (value as { assemble?: unknown }).assemble === 'function'
}

/**
 * Look up the optional report engine.
 * @param ctx - the plugin context.
 * @returns the engine surface, or undefined when no engine is mounted.
 */
export function lookupEngine(ctx: Context): ResearchReportLike | undefined {
  const candidate: unknown = ctx.get('researchReport')
  return isResearchReportLike(candidate) ? candidate : undefined
}
