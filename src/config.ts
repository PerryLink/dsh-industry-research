/**
 * Config schema and resolution for `dsh-industry-research`. Every tunable is a
 * validated {@link Config} field changeable from cordis.yml; the resolution
 * step validates bounds so misconfiguration fails loud at mount. With
 * `enabled: false` the plugin registers nothing and stays inert.
 * @module dsh-industry-research/config
 */

import z from '@deepseek-ai/schemastery'

/** Public-source tracking bounds. */
export interface TrackConfig {
  /** `web_search` maxResults per topic. */
  maxResultsPerTopic?: number
  /** Maximum snapshot fetches per `industry_track` call; sources beyond the budget stay citation-only entries. */
  maxFetchesPerCall?: number
}

/** Company scan bounds. */
export interface ScanConfig {
  /** Maximum bytes read per user-supplied data file. */
  maxFileBytes?: number
  /** Maximum figure-candidate lines surfaced per company scan. */
  maxFigureCandidates?: number
  /** When true, a company-card ticker must match a built-in format; false exempts the format check. */
  strictTicker?: boolean
}

/** Raw plugin config — every field optional; {@link resolveConfig} supplies the defaults. */
export interface Config {
  /** Master switch; `false` mounts nothing. */
  enabled?: boolean
  /** Root directory (relative to the session workspace, or absolute) holding every industry artifact. */
  industryRoot?: string
  /** Per-request timeout (ms) applied to `ctx.web` search/fetch calls. */
  fetchTimeoutMs?: number
  /** Maximum entries retained per industry `timeline.jsonl` (oldest dropped). */
  timelineMaxEntries?: number
  /** Host allowlist for tracked sources (empty = all hosts allowed). Entries are host suffixes (`gov.cn`) or URL prefixes (`https://www.gov.cn/`). */
  sourceAllowlist?: string[]
  /** Host blocklist for tracked sources; wins over the allowlist. */
  sourceBlocklist?: string[]
  /** Offline mode: never touch `ctx.web`; only local workspace data is used. */
  offline?: boolean
  /** Explicit skills root override; defaults to the packaged `skills/` edition. */
  skillsDir?: string
  track?: TrackConfig
  scan?: ScanConfig
}

/** Fully resolved config handed to the runtime. */
export interface ResolvedConfig {
  readonly enabled: boolean
  readonly industryRoot: string
  readonly fetchTimeoutMs: number
  readonly timelineMaxEntries: number
  readonly sourceAllowlist: readonly string[]
  readonly sourceBlocklist: readonly string[]
  readonly offline: boolean
  readonly skillsDir: string | undefined
  readonly track: {
    readonly maxResultsPerTopic: number
    readonly maxFetchesPerCall: number
  }
  readonly scan: {
    readonly maxFileBytes: number
    readonly maxFigureCandidates: number
    readonly strictTicker: boolean
  }
}

/** Schemastery schema: the loader validates and fills defaults before `apply`. */
export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  industryRoot: z.string().default('industry-research'),
  fetchTimeoutMs: z.number().default(20_000),
  timelineMaxEntries: z.number().default(500),
  sourceAllowlist: z.array(z.string()).default([]),
  sourceBlocklist: z.array(z.string()).default([]),
  offline: z.boolean().default(false),
  skillsDir: z.string(),
  track: z.object({
    maxResultsPerTopic: z.number().default(10),
    maxFetchesPerCall: z.number().default(10),
  }).default({ maxResultsPerTopic: 10, maxFetchesPerCall: 10 }),
  scan: z.object({
    maxFileBytes: z.number().default(1_048_576),
    maxFigureCandidates: z.number().default(100),
    strictTicker: z.boolean().default(true),
  }).default({ maxFileBytes: 1_048_576, maxFigureCandidates: 100, strictTicker: true }),
})

/** Throw unless `value` is a positive safe integer. */
function assertPositiveInt(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${name} must be a positive safe integer, got ${String(value)}`)
  }
}

/** Throw unless every entry is a non-empty string. */
function assertStringList(name: string, value: readonly string[]): void {
  for (const entry of value) {
    if (typeof entry !== 'string' || entry.trim().length === 0) {
      throw new TypeError(`${name} entries must be non-empty strings, got ${JSON.stringify(entry)}`)
    }
  }
}

/**
 * Validate raw values and fill explicit defaults. Invalid bounds throw here —
 * misconfiguration fails loud at mount even without the Schemastery loader.
 * @param config - raw (possibly partial) plugin config.
 * @returns the fully resolved config.
 */
export function resolveConfig(config: Config = {}): ResolvedConfig {
  const industryRoot = config.industryRoot ?? 'industry-research'
  if (typeof industryRoot !== 'string' || industryRoot.trim().length === 0) {
    throw new TypeError('industryRoot must be a non-empty path')
  }

  const fetchTimeoutMs = config.fetchTimeoutMs ?? 20_000
  assertPositiveInt('fetchTimeoutMs', fetchTimeoutMs)
  const timelineMaxEntries = config.timelineMaxEntries ?? 500
  assertPositiveInt('timelineMaxEntries', timelineMaxEntries)

  const sourceAllowlist = config.sourceAllowlist ?? []
  assertStringList('sourceAllowlist', sourceAllowlist)
  const sourceBlocklist = config.sourceBlocklist ?? []
  assertStringList('sourceBlocklist', sourceBlocklist)

  const skillsDir = config.skillsDir
  if (skillsDir !== undefined && (typeof skillsDir !== 'string' || skillsDir.trim().length === 0)) {
    throw new TypeError('skillsDir must be a non-empty path when set')
  }

  const maxResultsPerTopic = config.track?.maxResultsPerTopic ?? 10
  assertPositiveInt('track.maxResultsPerTopic', maxResultsPerTopic)
  const maxFetchesPerCall = config.track?.maxFetchesPerCall ?? 10
  assertPositiveInt('track.maxFetchesPerCall', maxFetchesPerCall)

  const maxFileBytes = config.scan?.maxFileBytes ?? 1_048_576
  assertPositiveInt('scan.maxFileBytes', maxFileBytes)
  const maxFigureCandidates = config.scan?.maxFigureCandidates ?? 100
  assertPositiveInt('scan.maxFigureCandidates', maxFigureCandidates)
  const strictTicker = config.scan?.strictTicker ?? true

  return {
    enabled: config.enabled ?? true,
    industryRoot,
    fetchTimeoutMs,
    timelineMaxEntries,
    sourceAllowlist,
    sourceBlocklist,
    offline: config.offline ?? false,
    skillsDir,
    track: { maxResultsPerTopic, maxFetchesPerCall },
    scan: { maxFileBytes, maxFigureCandidates, strictTicker },
  }
}
