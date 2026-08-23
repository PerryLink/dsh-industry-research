/**
 * Research depth routing. `depth` is a per-call tool argument (not a Config
 * field) that deterministically scales public-source collection:
 *
 * - `quick` — minimal source counts and one bounded round;
 * - `standard` — the shipped/configured bounds (current behavior);
 * - `comprehensive` — maximum source counts and full collection.
 *
 * The quick/comprehensive scales are fixed protocol constants, not deployment
 * tunables: a depth level means the same scale everywhere, so behavior never
 * depends on prompts. Out-of-range values fail loud.
 * @module dsh-industry-research/depth
 */

export const DEPTH_LEVELS = ['quick', 'standard', 'comprehensive'] as const

/** One legal research depth level. */
export type ResearchDepth = (typeof DEPTH_LEVELS)[number]

/** Fixed per-depth collection scales. */
export interface DepthProfile {
  /** `web_search` maxResults for the `industry_map` chain-structure assist. */
  readonly mapSearchResults: number
  /** `web_search` maxResults for the `company_scan` public-source complement. */
  readonly scanSearchResults: number
  /** `web_search` maxResults per topic for `industry_track`. */
  readonly trackMaxResultsPerTopic: number
  /** Snapshot-fetch budget for `industry_track`. */
  readonly trackMaxFetchesPerCall: number
}

/**
 * Fixed collection scales. `standard` mirrors the shipped defaults; the
 * `track.*` entries for `standard` are only documentation — `industry_track`
 * reads the configured `track.*` bounds at `standard` depth.
 */
export const DEPTH_PROFILES: Record<ResearchDepth, DepthProfile> = {
  quick: { mapSearchResults: 2, scanSearchResults: 2, trackMaxResultsPerTopic: 3, trackMaxFetchesPerCall: 3 },
  standard: { mapSearchResults: 5, scanSearchResults: 5, trackMaxResultsPerTopic: 10, trackMaxFetchesPerCall: 10 },
  comprehensive: { mapSearchResults: 10, scanSearchResults: 10, trackMaxResultsPerTopic: 20, trackMaxFetchesPerCall: 20 },
}

/**
 * Resolve a raw depth argument to a legal level, defaulting to `standard` and
 * failing loud on an out-of-range value.
 * @param depth - the raw depth argument.
 * @returns the validated depth level.
 */
export function resolveDepth(depth: unknown): ResearchDepth {
  if (depth === undefined) return 'standard'
  if (typeof depth !== 'string' || !(DEPTH_LEVELS as readonly string[]).includes(depth)) {
    throw new Error(`depth must be one of ${DEPTH_LEVELS.join('|')}, got ${JSON.stringify(depth)}`)
  }
  return depth as ResearchDepth
}
