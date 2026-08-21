/**
 * Typed Cordis events emitted after a tool commits its artifacts. These are
 * live observability events (other plugins may listen); they are NOT appended
 * to the session log. The durable record is the workspace artifacts
 * themselves, and model-visible tool results ride the durable `tool/result`
 * session event; out-of-repo `industry-research/*` session events would only
 * ever be skippable log noise, so none are appended.
 * @module dsh-industry-research/events
 */

/** Payload of `industry-research/map`. */
export interface MapEventPayload {
  /** Industry display name. */
  industry: string
  /** Absolute path of the written `chain.json`. */
  path: string
  /** Node count of the committed map. */
  nodes: number
  /** Edge count of the committed map. */
  edges: number
  /** Declared gap count of the committed map. */
  gaps: number
}

/** Payload of `industry-research/track`. */
export interface TrackEventPayload {
  /** Industry display name. */
  industry: string
  /** Absolute path of the `timeline.jsonl`. */
  path: string
  /** Entries appended by this call. */
  added: number
  /** Batch entries dropped as duplicates. */
  duplicates: number
  /** Total entries retained after the merge. */
  total: number
}

/** Payload of `industry-research/report`. */
export interface ReportEventPayload {
  /** Industry display name. */
  industry: string
  /** Which engine produced the report. */
  engine: 'research-report' | 'builtin-fallback'
  /** Absolute report directory. */
  reportDir: string
  /** Claim count of the report. */
  claims: number
  /** Evidence count of the report. */
  evidence: number
}

declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * An `industry_map` call committed a validated chain map to the
     * workspace. Fire-and-forget observability; listener failures are
     * contained by the dispatcher.
     * @mode emit
     * @param payload - the committed map summary (paths and counts).
     */
    'industry-research/map'(payload: MapEventPayload): void
    /**
     * An `industry_track` call merged new entries into an industry timeline.
     * Fire-and-forget observability; listener failures are contained by the
     * dispatcher.
     * @mode emit
     * @param payload - the merge summary (paths and counts).
     */
    'industry-research/track'(payload: TrackEventPayload): void
    /**
     * An `industry_report` call produced a report (engine-sealed or
     * builtin-fallback). Fire-and-forget observability; listener failures
     * are contained by the dispatcher.
     * @mode emit
     * @param payload - the report summary (engine, directory, counts).
     */
    'industry-research/report'(payload: ReportEventPayload): void
  }
}
