/**
 * `dsh-industry-research` — industry and company research domain pack for
 * DeepSeek Harness. Mounts four workspace-bound research tools
 * (`industry_map` / `industry_track` / `company_scan` / `industry_report`),
 * publishes two methodology skills (`industry-research-method`,
 * `company-research-method`) from the packaged `skills/` directory, and emits
 * typed Cordis events after each committed artifact. The web capability
 * (`ctx.web`) and the report engine (`ctx.researchReport`) are optional and
 * looked up structurally at execution time — never injected. Research only;
 * not investment advice.
 *
 * Function plugin — no default export (the Loader unwraps
 * `exports.default ?? exports`, and a stray default would discard
 * `name`/`inject`/`Config`/`apply`).
 * @module dsh-industry-research
 */

import { existsSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import { FileSystemSkillProvider } from '@deepseek-ai/dsh-skill-filesystem'
// Type-only: registers the `ctx.skills` Context merge for the inject.
import type {} from '@deepseek-ai/dsh-skill'
import { Config, resolveConfig } from './config.ts'
import { buildIndustryMapTool } from './tools/map.ts'
import { buildIndustryTrackTool } from './tools/track.ts'
import { buildCompanyScanTool } from './tools/company.ts'
import { buildIndustryReportTool } from './tools/report.ts'
import { VERSION } from './version.ts'

export const name = 'industry-research'
/** The four tools and the skill provider; web/engine stay optional lookups. */
export const inject = ['skills', 'tools']

export { Config, resolveConfig } from './config.ts'
export type { Config as IndustryResearchConfig, ResolvedConfig } from './config.ts'
export { VERSION } from './version.ts'
export { CHAIN_TIERS, COMPANY_STATUSES, chainGaps, isIsoDate, validateChainMap, validateStatus } from './chain.ts'
export type { ChainEdge, ChainMap, ChainMetric, ChainNode, ChainTier, CompanyStatus } from './chain.ts'
export { analyzeBottlenecks, renderChainSvg, xmlEscape } from './chain-svg.ts'
export type { ChainBottleneck } from './chain-svg.ts'
export { DEPTH_LEVELS, DEPTH_PROFILES, resolveDepth } from './depth.ts'
export type { DepthProfile, ResearchDepth } from './depth.ts'
export { INDUSTRY_TAXONOMY, taxonomyEntry } from './taxonomy.ts'
export type { TaxonomyEntry } from './taxonomy.ts'
export { ARTIFACT_CHANGES, latestHashes, readVersions, recordVersion, rootRelative, verifyVersion } from './versions.ts'
export type { ArtifactChange, VersionRecord } from './versions.ts'
export { lookupJobs } from './jobs.ts'
export type { JobHooksLike, JobOutcomeLike, JobStartLike, JobsLike } from './jobs.ts'
export { readResearchState, summarizeDelta, updateResearchState, writeResearchState } from './research-state.ts'
export type { ResearchState, ResearchStateDelta } from './research-state.ts'
export { adversarialCheck, renderRedReviewNote } from './adversarial.ts'
export { loadSources, registerSource, saveSources, sha256Of } from './sources.ts'
export type { SourceEntry, SourceRegistry } from './sources.ts'
export { EVIDENCE_CATEGORIES, mergeTimeline, normalizeUrl, readTimeline, sourceAllowed, validateEvidenceCategory } from './timeline.ts'
export type { EvidenceCategory, TimelineEntry, TimelineMerge } from './timeline.ts'
export { boundFigures, readCard, renderCardMarkdown, scanFile, validateCompanyCard, validateTicker, writeCard, DISCLAIMER, READABLE_EXTENSIONS, TICKER_FORMATS } from './company.ts'
export type { CardSource, CardWebSource, CompanyCard, CompanyValuePoint, FigureCandidate, FileOutline, ScannedFile } from './company.ts'
export { autoDraft, AUTO_SECTIONS, buildEvidence, renderFallbackMarkdown, reportDirName, validateDeliveryContract, validateDraft, writeFallbackReport } from './report.ts'
export type { AutoSection, FallbackManifest, LoadedArtifacts, ReportClaim, ReportDraft } from './report.ts'
export { lookupEngine } from './engine-bridge.ts'
export type {
  AssembleReportRequest,
  AssembleReportResult,
  EvidenceInput,
  ReportSectionInput,
  ResearchReportLike,
} from './engine-bridge.ts'
export { lookupWeb, requestSignal, requireWeb, webErrorMessage } from './web.ts'
export type { WebFetchOutcome, WebLike, WebSearchOutcome, WebSource } from './web.ts'
export { resolveContained, resolveIndustryRoot, resolveWorkspaceFile, safeSegment } from './paths.ts'
export { chainPathOf, chainSvgPathOf, companyDirOf, industryDirOf, notesDirOf, reportsDirOf, researchStatePathOf, sourcesPathOf, timelinePathOf, versionsPathOf, workspaceOf } from './toolkit.ts'
export type { MapEventPayload, ReportEventPayload, TrackEventPayload } from './events.ts'
export { buildIndustryMapTool } from './tools/map.ts'
export type { IndustryMapValue } from './tools/map.ts'
export { buildIndustryTrackTool } from './tools/track.ts'
export type { IndustryTrackValue } from './tools/track.ts'
export { buildCompanyScanTool } from './tools/company.ts'
export type { CompanyScanBatchValue, CompanyScanValue } from './tools/company.ts'
export { buildIndustryReportTool, loadArtifacts } from './tools/report.ts'
export type { IndustryReportValue, ReviewOutcome } from './tools/report.ts'

/** Directory of this module: `src/` under tsx/vitest or `lib/` when built. */
const MODULE_DIR = dirname(fileURLToPath(import.meta.url))

/** Whether a directory contains at least one `<skill>/SKILL.md` bundle. */
function hasSkillBundles(dir: string): boolean {
  if (!existsSync(dir)) return false
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return false
  }
  return entries.some(entry => entry.isDirectory() && existsSync(join(dir, entry.name, 'SKILL.md')))
}

/**
 * Resolve the skills root to publish and fail loud on misconfiguration: an
 * explicit `skillsDir` must exist and hold bundles, and the packaged default
 * (`skills/` beside `src/` or `lib/`) must exist — never mount silently with
 * zero skills.
 * @param skillsDir - explicit config override, if any.
 * @returns the validated skills root.
 */
function resolveSkillsRoot(skillsDir: string | undefined): string {
  if (skillsDir !== undefined) {
    const root = resolve(skillsDir)
    if (!hasSkillBundles(root)) {
      throw new Error(`industry-research: config.skillsDir "${skillsDir}" does not exist or contains no <skill>/SKILL.md bundles`)
    }
    return root
  }
  const root = join(MODULE_DIR, '..', 'skills')
  if (!hasSkillBundles(root)) {
    throw new Error(`industry-research: packaged skills root ${root} is missing; expected skills/<name>/SKILL.md bundles beside the built lib/. Set config.skillsDir to an explicit root.`)
  }
  return root
}

/**
 * Mount the research pack: validate config (fail loud), publish the packaged
 * skills, and register the four tools. With `enabled: false` nothing is
 * registered and the plugin stays inert.
 * @param ctx - the plugin context (host).
 * @param config - raw plugin config.
 */
export function apply(ctx: Context, config: Config = {}): void {
  const resolved = resolveConfig(config)
  const logger = ctx.logger('industry-research')
  if (!resolved.enabled) {
    logger.info('disabled: enabled is false — no research capabilities are mounted')
    return
  }

  const skillsRoot = resolveSkillsRoot(resolved.skillsDir)
  ctx.effect(function* () {
    yield ctx.skills.registerProvider(control => new FileSystemSkillProvider(ctx, control, {
      providerName: 'industry-research',
      includeDefaultRoots: false,
      customSkillDirs: [skillsRoot],
      watch: false,
    }))
  })

  ctx.tools.register(buildIndustryMapTool(ctx, resolved))
  ctx.tools.register(buildIndustryTrackTool(ctx, resolved))
  ctx.tools.register(buildCompanyScanTool(ctx, resolved))
  ctx.tools.register(buildIndustryReportTool(ctx, resolved))
  logger.info(`industry-research ${VERSION} mounted: 4 tools, skills from ${skillsRoot}`)
}
