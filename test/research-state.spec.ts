/**
 * Research-state memory: tolerant reads of a missing state, loud failure on a
 * corrupt/malformed one, deterministic delta summarization, and the
 * update-and-register path.
 * @module dsh-industry-research/test/research-state.spec
 */

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { readResearchState, summarizeDelta, updateResearchState } from '../src/research-state.ts'
import { readVersions } from '../src/versions.ts'
import type { ResearchState } from '../src/research-state.ts'

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })))
})

async function tempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'dsh-ir-state-'))
  tempDirs.push(dir)
  return dir
}

describe('readResearchState', () => {
  it('returns null for a missing file and fails loud on a corrupt one', async () => {
    const dir = await tempDir()
    expect(await readResearchState(join(dir, 'research-state.json'))).toBeNull()
    await writeFile(join(dir, 'research-state.json'), '{not json', 'utf8')
    await expect(readResearchState(join(dir, 'research-state.json'))).rejects.toThrow(/not valid JSON/u)
  })

  it('fails loud on a malformed state', async () => {
    const dir = await tempDir()
    await writeFile(join(dir, 'research-state.json'), JSON.stringify({ sourceUrls: 'not-an-array' }), 'utf8')
    await expect(readResearchState(join(dir, 'research-state.json'))).rejects.toThrow(/malformed/u)
  })
})

describe('summarizeDelta', () => {
  it('computes new/removed sources and unchanged evidence deterministically', () => {
    const prev: ResearchState = { artifactHashes: {}, sourceUrls: ['a', 'b'], evidenceCategoryCounts: {}, gaps: [], capturedAt: 'x' }
    const next: ResearchState = { artifactHashes: {}, sourceUrls: ['b', 'c'], evidenceCategoryCounts: {}, gaps: [], capturedAt: 'y' }
    expect(summarizeDelta(prev, next)).toEqual({ newSources: ['c'], removedSources: ['a'], unchangedEvidence: 1 })
    expect(summarizeDelta(null, next)).toEqual({ newSources: ['b', 'c'], removedSources: [], unchangedEvidence: 0 })
  })
})

describe('updateResearchState', () => {
  it('persists the state, registers it in the ledger, and returns the delta', async () => {
    const dir = await tempDir()
    const statePath = join(dir, 'research-state.json')
    const versionsPath = join(dir, 'versions.jsonl')
    const first = await updateResearchState(statePath, versionsPath, '白酒/research-state.json', 'standard', ['a'], { 'confirmed-catalyst': 1 }, [], '2026-08-24T00:00:00.000Z')
    expect(first).toEqual({ newSources: ['a'], removedSources: [], unchangedEvidence: 0 })
    const second = await updateResearchState(statePath, versionsPath, '白酒/research-state.json', 'standard', ['a', 'b'], {}, [], '2026-08-24T00:00:01.000Z')
    expect(second).toEqual({ newSources: ['b'], removedSources: [], unchangedEvidence: 1 })
    const state = JSON.parse(await readFile(statePath, 'utf8')) as ResearchState
    expect(state.depth).toBe('standard')
    expect(state.sourceUrls).toEqual(['a', 'b'])
    const ledger = await readVersions(versionsPath)
    expect(ledger.some(record => record.artifact === '白酒/research-state.json')).toBe(true)
  })
})
