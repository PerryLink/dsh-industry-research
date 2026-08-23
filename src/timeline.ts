/**
 * The per-industry timeline store (`timeline.jsonl`): one JSON entry per line,
 * appended by `industry_track`, deduplicated by normalized URL, and capped by
 * `timelineMaxEntries` (oldest entries dropped first). Pure file store — the
 * web retrieval policy lives in `tools/track.ts`.
 * @module dsh-industry-research/timeline
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/** Evidence category labels for timeline entries. */
export const EVIDENCE_CATEGORIES = [
  'confirmed-catalyst',
  'market-narrative',
  'forum-buzz',
  'technical-confirmation',
  'macro-amplifier',
  'background-noise',
] as const

/** One legal evidence category. */
export type EvidenceCategory = (typeof EVIDENCE_CATEGORIES)[number]

/** One timeline entry: a dated, sourced industry event. */
export type TimelineEntry = {
  /** Event date (ISO-8601) from the source's publication time; null when the provider gave none. */
  date: string | null
  /** Headline. */
  title: string
  /** Source URL (citation). */
  url: string
  /** Short summary (search snippet); null when unavailable. */
  summary: string | null
  /** SHA-256 of the fetched page snapshot; null when the snapshot fetch failed or was outside the fetch budget. */
  snapshotHash: string | null
  /** ISO-8601 time this entry was captured by `industry_track`. */
  capturedAt: string
  /** Search topics that surfaced this entry. */
  topics: string[]
  /** Optional caveat (e.g. why the snapshot hash is missing). */
  note?: string
  /** Optional evidence category; validated against {@link EVIDENCE_CATEGORIES} on write. */
  evidenceCategory?: EvidenceCategory
}

/** The outcome of merging a batch into the store. */
export interface TimelineMerge {
  /** Entries actually appended (new URLs). */
  added: TimelineEntry[]
  /** Batch entries dropped because their URL was already tracked. */
  duplicates: number
  /** Total entries in the store after the merge. */
  total: number
  /** Whether the cap dropped older entries during this merge. */
  truncated: boolean
}

/**
 * Normalize a URL for dedupe: lowercase scheme and host, strip default ports,
 * strip a lone trailing slash on the path. Unparseable URLs are returned
 * verbatim (dedupe then falls back to exact string equality).
 * @param url - the raw URL.
 * @returns the normalized dedupe key.
 */
export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.protocol = parsed.protocol.toLowerCase()
    parsed.hostname = parsed.hostname.toLowerCase()
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) {
      parsed.port = ''
    }
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1)
    }
    return parsed.toString()
  } catch {
    return url
  }
}

/**
 * Decide whether a source URL passes the host allow/block lists. Entries are
 * host suffixes (`gov.cn` matches `www.gov.cn`) or URL prefixes
 * (`https://www.gov.cn/zhengce/`). The blocklist wins. An empty allowlist
 * allows every host.
 * @param url - the candidate URL.
 * @param allowlist - configured allow entries.
 * @param blocklist - configured block entries.
 * @returns whether the URL may be tracked.
 */
export function sourceAllowed(url: string, allowlist: readonly string[], blocklist: readonly string[]): boolean {
  let host = ''
  try {
    host = new URL(url).hostname.toLowerCase()
  } catch {
    host = ''
  }
  const matches = (entry: string): boolean => {
    const normalized = entry.toLowerCase()
    if (normalized.includes('://')) return url.toLowerCase().startsWith(normalized)
    return host === normalized || host.endsWith(`.${normalized}`)
  }
  if (blocklist.some(matches)) return false
  if (allowlist.length === 0) return true
  return allowlist.some(matches)
}

/**
 * Read a timeline store, tolerating a missing file. Corrupt lines are skipped
 * and counted (never silently: the caller surfaces the count), because a
 * single torn line must not drop the rest of a durable log.
 * @param path - absolute path of the JSONL file.
 * @returns the parsed entries plus the number of skipped corrupt lines.
 */
export async function readTimeline(path: string): Promise<{ entries: TimelineEntry[]; corrupt: number }> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { entries: [], corrupt: 0 }
    throw error
  }
  const entries: TimelineEntry[] = []
  let corrupt = 0
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.length === 0) continue
    try {
      const parsed = JSON.parse(trimmed) as TimelineEntry
      if (typeof parsed.url !== 'string' || typeof parsed.title !== 'string') throw new Error('missing fields')
      entries.push(parsed)
    } catch {
      corrupt += 1
    }
  }
  return { entries, corrupt }
}

/**
 * Validate an evidence category against the legal enum. Absent categories are
 * legal; an illegal value fails loud so a mistyped label never lands in the
 * durable store.
 * @param value - the candidate category.
 * @returns validation problems (empty when valid).
 */
export function validateEvidenceCategory(value: unknown): string[] {
  if (value === undefined) return []
  if (typeof value !== 'string' || !(EVIDENCE_CATEGORIES as readonly string[]).includes(value)) {
    return [`evidenceCategory must be one of ${EVIDENCE_CATEGORIES.join('|')}, got ${JSON.stringify(value)}`]
  }
  return []
}

/**
 * Merge a batch into the store and persist: dedupe by normalized URL (both
 * against the store and within the batch), append the survivors, and rewrite
 * the file keeping only the newest `maxEntries` when the cap is exceeded.
 * A batch entry carrying an illegal `evidenceCategory` fails loud before any
 * write.
 * @param path - absolute path of the JSONL file.
 * @param batch - candidate entries, in arrival order.
 * @param maxEntries - retention cap (oldest dropped first).
 * @returns the merge outcome.
 */
export async function mergeTimeline(path: string, batch: readonly TimelineEntry[], maxEntries: number): Promise<TimelineMerge> {
  for (const entry of batch) {
    const problems = validateEvidenceCategory(entry.evidenceCategory)
    if (problems.length > 0) throw new Error(problems.join('；'))
  }
  const { entries } = await readTimeline(path)
  const seen = new Set(entries.map(entry => normalizeUrl(entry.url)))
  const added: TimelineEntry[] = []
  let duplicates = 0
  for (const entry of batch) {
    const key = normalizeUrl(entry.url)
    if (seen.has(key)) {
      duplicates += 1
      continue
    }
    seen.add(key)
    added.push(entry)
  }
  const merged = [...entries, ...added]
  const kept = merged.length > maxEntries ? merged.slice(merged.length - maxEntries) : merged
  const truncated = kept.length !== merged.length
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, kept.map(entry => JSON.stringify(entry)).join('\n') + (kept.length > 0 ? '\n' : ''), 'utf8')
  return { added, duplicates, total: kept.length, truncated }
}
