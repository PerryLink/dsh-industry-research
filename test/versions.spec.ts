/**
 * The artifact version ledger: root-relative paths, created/updated change
 * inference, hash verification that fails loud on mismatch, and loud failure
 * on a corrupt ledger line.
 * @module dsh-industry-research/test/versions.spec
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { readVersions, recordVersion, rootRelative, verifyVersion } from '../src/versions.ts'

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })))
})

/** Create one temp dir owned by this suite. */
async function tempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'dsh-ir-versions-'))
  tempDirs.push(dir)
  return dir
}

describe('rootRelative', () => {
  it('returns a forward-slash root-relative path', () => {
    const root = path.resolve('/tmp/root')
    expect(rootRelative(root, join(root, '白酒', 'chain.json'))).toBe('白酒/chain.json')
  })
})

describe('recordVersion + verifyVersion', () => {
  it('infers created then updated, and verifies matching content', async () => {
    const root = await tempDir()
    const ledger = join(root, 'versions.jsonl')
    expect(await recordVersion(ledger, '白酒/chain.json', 'v1\n', '2026-08-24T00:00:00.000Z')).toBe('created')
    expect(await recordVersion(ledger, '白酒/chain.json', 'v2\n', '2026-08-24T00:00:01.000Z')).toBe('updated')
    const records = await readVersions(ledger)
    expect(records).toHaveLength(2)
    expect(records[1]?.change).toBe('updated')
    expect(records.every(record => /^[0-9a-f]{64}$/u.test(record.sha256))).toBe(true)
    await expect(verifyVersion(ledger, '白酒/chain.json', 'v2\n')).resolves.toBeUndefined()
  })

  it('fails loud on a hash mismatch and skips unrecorded artifacts', async () => {
    const root = await tempDir()
    const ledger = join(root, 'versions.jsonl')
    await recordVersion(ledger, '白酒/chain.json', 'good\n', '2026-08-24T00:00:00.000Z')
    await expect(verifyVersion(ledger, '白酒/chain.json', 'tampered\n')).rejects.toThrow(/version verification/u)
    await expect(verifyVersion(ledger, '白酒/unknown.json', 'anything\n')).resolves.toBeUndefined()
  })

  it('fails loud on a corrupt ledger line', async () => {
    const root = await tempDir()
    const ledger = join(root, 'versions.jsonl')
    await writeFile(ledger, '{corrupt\n', 'utf8')
    await expect(readVersions(ledger)).rejects.toThrow(/corrupt line/u)
  })
})
