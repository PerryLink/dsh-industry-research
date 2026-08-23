/**
 * The industry-research artifact version ledger (`versions.jsonl` at the
 * industry root). Every artifact write by `industry_map` / `company_scan` /
 * `industry_report` appends one record — root-relative artifact path, SHA-256
 * of the written bytes, an injected capture timestamp, and a change type — and
 * artifact reads verify against the latest record, failing loud on a hash
 * mismatch. Artifacts with no ledger entry are skipped (nothing recorded →
 * nothing to verify).
 * @module dsh-industry-research/versions
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative } from 'node:path'
import { sha256Of } from './sources.ts'

/** The change kinds a version record can carry. */
export const ARTIFACT_CHANGES = ['created', 'updated'] as const

/** One change kind. */
export type ArtifactChange = (typeof ARTIFACT_CHANGES)[number]

/** One ledger record: a root-relative artifact path and its content hash. */
export interface VersionRecord {
  /** Root-relative artifact path (e.g. `白酒/chain.json`). */
  artifact: string
  /** SHA-256 of the written bytes. */
  sha256: string
  /** ISO-8601 capture time injected by the writer. */
  capturedAt: string
  /** Whether this write created or updated the artifact. */
  change: ArtifactChange
}

/** Express a full path relative to the industry root, with forward slashes. */
export function rootRelative(root: string, fullPath: string): string {
  return relative(root, fullPath).replaceAll('\\', '/')
}

/** Collapse a ledger into the latest hash per artifact path. */
export function latestHashes(records: readonly VersionRecord[]): Record<string, string> {
  const hashes: Record<string, string> = {}
  for (const record of records) hashes[record.artifact] = record.sha256
  return hashes
}

/**
 * Read the ledger, tolerating a missing file. Corrupt lines fail loud — a torn
 * integrity ledger cannot be trusted to verify anything.
 * @param path - absolute path of `versions.jsonl`.
 * @returns the records in append order.
 */
export async function readVersions(path: string): Promise<VersionRecord[]> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
  const records: VersionRecord[] = []
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.length === 0) continue
    try {
      const parsed = JSON.parse(trimmed) as VersionRecord
      if (typeof parsed.artifact !== 'string' || typeof parsed.sha256 !== 'string' || typeof parsed.capturedAt !== 'string' || typeof parsed.change !== 'string') {
        throw new Error('missing fields')
      }
      records.push(parsed)
    } catch {
      throw new Error(`versions ledger at ${path} has a corrupt line`)
    }
  }
  return records
}

/**
 * Append one version record for an artifact write. The change kind is inferred:
 * `created` when the artifact has no prior record, `updated` otherwise.
 * @param path - absolute path of `versions.jsonl`.
 * @param artifact - root-relative artifact path.
 * @param content - the verbatim written bytes (hashed).
 * @param capturedAt - ISO-8601 capture time.
 * @returns the inferred change kind.
 */
export async function recordVersion(path: string, artifact: string, content: string, capturedAt: string): Promise<ArtifactChange> {
  const records = await readVersions(path)
  const change: ArtifactChange = records.some(record => record.artifact === artifact) ? 'updated' : 'created'
  records.push({ artifact, sha256: sha256Of(content), capturedAt, change })
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${records.map(record => JSON.stringify(record)).join('\n')}\n`, 'utf8')
  return change
}

/**
 * Verify an artifact's content against its latest ledger record. A missing
 * record is a no-op (unrecorded artifacts are not checked); a hash mismatch
 * fails loud.
 * @param path - absolute path of `versions.jsonl`.
 * @param artifact - root-relative artifact path.
 * @param content - the read-back bytes to verify.
 */
export async function verifyVersion(path: string, artifact: string, content: string): Promise<void> {
  const records = await readVersions(path)
  let latest: VersionRecord | undefined
  for (const record of records) {
    if (record.artifact === artifact) latest = record
  }
  if (latest === undefined) return
  const hash = sha256Of(content)
  if (hash !== latest.sha256) {
    throw new Error(`artifact ${JSON.stringify(artifact)} failed version verification: content hash ${hash} does not match recorded ${latest.sha256}`)
  }
}
