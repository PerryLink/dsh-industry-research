/**
 * The per-industry source registry (`sources.json`). Every artifact a metric
 * or claim may cite — a user note, a supplied data file, a fetched page — is
 * registered here with a stable ref (`S1`, `S2`, …), its origin (workspace
 * path or URL), and a SHA-256 content hash, so reports can render a
 * source-traceability appendix and byte-level checks can replay.
 * @module dsh-industry-research/sources
 */

import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

/** One registered source. */
export type SourceEntry = {
  /** Stable citation ref (e.g. `S1`). */
  ref: string
  /** Where the content came from: an absolute workspace path or a URL. */
  origin: string
  /** SHA-256 of the registered content snapshot. */
  sha256: string
  /** ISO-8601 time the snapshot was registered. */
  capturedAt: string
  /** Optional human note (e.g. the page title). */
  note?: string
}

/** The on-disk registry shape. */
export type SourceRegistry = {
  /** Next ref number (refs are never reused). */
  next: number
  items: SourceEntry[]
}

/** SHA-256 hex digest of a UTF-8 string. */
export function sha256Of(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

/**
 * Load a registry from disk, tolerating a missing file (empty registry).
 * A corrupt file fails loud — durable data must not be silently dropped.
 * @param path - absolute path of the registry JSON.
 * @returns the parsed registry, or a fresh one when the file does not exist.
 */
export async function loadSources(path: string): Promise<SourceRegistry> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { next: 1, items: [] }
    throw error
  }
  const parsed = JSON.parse(text) as SourceRegistry
  if (typeof parsed.next !== 'number' || !Array.isArray(parsed.items)) {
    throw new Error(`sources registry at ${path} is malformed (expected { next, items[] })`)
  }
  return parsed
}

/**
 * Persist a registry, creating the parent directory.
 * @param path - absolute path of the registry JSON.
 * @param registry - the registry to write.
 */
export async function saveSources(path: string, registry: SourceRegistry): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(registry, null, 2)}\n`, 'utf8')
}

/**
 * Register one source and return its ref. Re-registering the same origin
 * refreshes the hash/timestamp of the existing entry instead of duplicating
 * it, so refs stay stable across re-runs.
 * @param registry - the registry to mutate.
 * @param origin - workspace path or URL the content came from.
 * @param content - the verbatim content snapshot (hashed).
 * @param capturedAt - ISO-8601 registration time.
 * @param note - optional human note (e.g. page title).
 * @returns the stable ref of the entry.
 */
export function registerSource(registry: SourceRegistry, origin: string, content: string, capturedAt: string, note?: string): string {
  const sha256 = sha256Of(content)
  const existing = registry.items.find(item => item.origin === origin)
  if (existing !== undefined) {
    existing.sha256 = sha256
    existing.capturedAt = capturedAt
    if (note !== undefined) existing.note = note
    return existing.ref
  }
  const ref = `S${registry.next}`
  registry.next += 1
  registry.items.push({ ref, origin, sha256, capturedAt, ...(note !== undefined ? { note } : {}) })
  return ref
}
