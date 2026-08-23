/**
 * Per-industry research-state memory (`research-state.json`). It records the
 * last run's depth, the latest artifact hashes from the versions ledger,
 * tracked source URLs, evidence-category counts, the gap list, and an injected
 * capture timestamp. Reads tolerate a missing file but fail loud on a corrupt
 * one; the delta summary compares two states so tools can report "vs last run"
 * (new/removed sources, unchanged evidence).
 * @module dsh-industry-research/research-state
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { ResearchDepth } from './depth.ts'
import { latestHashes, readVersions, recordVersion } from './versions.ts'

/** The persisted research-state shape. */
export interface ResearchState {
  /** The depth of the last run; absent before the first run. */
  depth?: ResearchDepth
  /** Latest artifact hashes from the versions ledger (artifact → sha256). */
  artifactHashes: Record<string, string>
  /** Tracked/registered source origins or URLs, in encounter order. */
  sourceUrls: string[]
  /** Evidence-category → entry count. */
  evidenceCategoryCounts: Record<string, number>
  /** Gap declarations of the last run. */
  gaps: string[]
  /** ISO-8601 capture time injected by the writer. */
  capturedAt: string
}

/** The incremental "vs last run" summary. */
export type ResearchStateDelta = {
  /** Sources present now but absent last run. */
  newSources: string[]
  /** Sources present last run but absent now. */
  removedSources: string[]
  /** Count of evidence items whose source was unchanged between runs. */
  unchangedEvidence: number
}

/**
 * Read a research-state file, tolerating a missing file. A corrupt or
 * malformed file fails loud — the memory must not be silently discarded.
 * @param path - absolute path of `research-state.json`.
 * @returns the state, or null when no state exists yet.
 */
export async function readResearchState(path: string): Promise<ResearchState | null> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`research-state at ${path} is not valid JSON`)
  }
  if (typeof parsed !== 'object' || parsed === null) throw new Error(`research-state at ${path} is malformed`)
  const state = parsed as ResearchState
  if (typeof state.artifactHashes !== 'object' || state.artifactHashes === null) throw new Error(`research-state at ${path} is malformed (artifactHashes)`)
  if (!Array.isArray(state.sourceUrls)) throw new Error(`research-state at ${path} is malformed (sourceUrls)`)
  if (typeof state.evidenceCategoryCounts !== 'object' || state.evidenceCategoryCounts === null) throw new Error(`research-state at ${path} is malformed (evidenceCategoryCounts)`)
  if (!Array.isArray(state.gaps)) throw new Error(`research-state at ${path} is malformed (gaps)`)
  return state
}

/**
 * Persist a research-state file, creating the parent directory.
 * @param path - absolute path of `research-state.json`.
 * @param state - the state to write.
 */
export async function writeResearchState(path: string, state: ResearchState): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
}

/**
 * Compute the incremental delta between the previous state (or null on the
 * first run) and the next state.
 * @param prev - the previous state, or null.
 * @param next - the freshly built state.
 * @returns the new/removed source lists and the unchanged-evidence count.
 */
export function summarizeDelta(prev: ResearchState | null, next: ResearchState): ResearchStateDelta {
  const prevUrls = new Set(prev?.sourceUrls ?? [])
  const nextUrls = new Set(next.sourceUrls)
  const newSources = next.sourceUrls.filter(url => !prevUrls.has(url))
  const removedSources = (prev?.sourceUrls ?? []).filter(url => !nextUrls.has(url))
  const unchangedEvidence = next.sourceUrls.filter(url => prevUrls.has(url)).length
  return { newSources, removedSources, unchangedEvidence }
}

/**
 * Read the previous state, build and persist the next state (registering it in
 * the versions ledger), and return the "vs last run" delta.
 * @param statePath - absolute path of `research-state.json`.
 * @param versionsPath - absolute path of `versions.jsonl`.
 * @param artifact - root-relative path of `research-state.json`.
 * @param depth - the depth of this run.
 * @param sourceUrls - tracked/registered source origins, in encounter order.
 * @param evidenceCategoryCounts - evidence-category → count.
 * @param gaps - gap declarations of this run.
 * @param capturedAt - ISO-8601 capture time.
 * @returns the incremental delta.
 */
export async function updateResearchState(
  statePath: string,
  versionsPath: string,
  artifact: string,
  depth: ResearchDepth,
  sourceUrls: string[],
  evidenceCategoryCounts: Record<string, number>,
  gaps: string[],
  capturedAt: string,
): Promise<ResearchStateDelta> {
  const prev = await readResearchState(statePath)
  const versions = await readVersions(versionsPath)
  const next: ResearchState = { depth, artifactHashes: latestHashes(versions), sourceUrls, evidenceCategoryCounts, gaps, capturedAt }
  await writeResearchState(statePath, next)
  await recordVersion(versionsPath, artifact, `${JSON.stringify(next, null, 2)}\n`, capturedAt)
  return summarizeDelta(prev, next)
}
