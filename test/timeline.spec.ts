/**
 * Timeline store: URL normalization for dedupe, host allow/block lists,
 * corrupt-line tolerance, append + dedupe merges, and the retention cap.
 * @module dsh-industry-research/test/timeline.spec
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mergeTimeline, normalizeUrl, readTimeline, sourceAllowed, validateEvidenceCategory } from '../src/timeline.ts'
import type { TimelineEntry } from '../src/timeline.ts'

const tempDirs: string[] = []
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })))
})

/** Create one temp dir owned by this suite. */
async function tempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), 'dsh-ir-timeline-'))
  tempDirs.push(dir)
  return dir
}

/** One entry factory with sane defaults. */
function entry(url: string, overrides: Partial<TimelineEntry> = {}): TimelineEntry {
  return {
    date: '2026-08-01',
    title: `title of ${url}`,
    url,
    summary: null,
    snapshotHash: null,
    capturedAt: '2026-08-19T00:00:00.000Z',
    topics: ['t'],
    ...overrides,
  }
}

describe('normalizeUrl', () => {
  it('normalizes case, default ports, and trailing slashes', () => {
    expect(normalizeUrl('HTTPS://Example.COM:443/path/')).toBe('https://example.com/path')
    expect(normalizeUrl('http://example.com:80/a')).toBe('http://example.com/a')
    expect(normalizeUrl('not a url')).toBe('not a url')
  })
})

describe('sourceAllowed', () => {
  it('allows everything with an empty allowlist, minus the blocklist', () => {
    expect(sourceAllowed('https://www.gov.cn/x', [], [])).toBe(true)
    expect(sourceAllowed('https://www.gov.cn/x', [], ['gov.cn'])).toBe(false)
    expect(sourceAllowed('https://sub.gov.cn/x', [], ['gov.cn'])).toBe(false)
    expect(sourceAllowed('https://notgov.cn/x', [], ['gov.cn'])).toBe(true)
  })

  it('restricts to the allowlist when present; blocklist wins', () => {
    expect(sourceAllowed('https://www.gov.cn/x', ['gov.cn'], [])).toBe(true)
    expect(sourceAllowed('https://example.com/x', ['gov.cn'], [])).toBe(false)
    expect(sourceAllowed('https://bad.gov.cn/x', ['gov.cn'], ['bad.gov.cn'])).toBe(false)
    expect(sourceAllowed('https://www.gov.cn/zhengce/1', ['https://www.gov.cn/zhengce/'], [])).toBe(true)
  })
})

describe('evidenceCategory', () => {
  it('accepts legal categories and absent ones', () => {
    expect(validateEvidenceCategory(undefined)).toEqual([])
    expect(validateEvidenceCategory('forum-buzz')).toEqual([])
    expect(validateEvidenceCategory('background-noise')).toEqual([])
  })

  it('rejects an illegal category', () => {
    expect(validateEvidenceCategory('made-up').some(problem => problem.includes('evidenceCategory'))).toBe(true)
  })

  it('mergeTimeline fails loud on an illegal category before any write', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'timeline.jsonl')
    const bad = entry('https://a.test/1')
    ;(bad as { evidenceCategory?: string }).evidenceCategory = 'made-up'
    await expect(mergeTimeline(file, [bad], 500)).rejects.toThrow(/evidenceCategory/u)
  })
})

describe('readTimeline + mergeTimeline', () => {
  it('tolerates a missing file and counts corrupt lines without dropping good ones', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'timeline.jsonl')
    expect(await readTimeline(file)).toEqual({ entries: [], corrupt: 0 })
    await writeFile(file, `${JSON.stringify(entry('https://a.test/1'))}\n{corrupt\n`, 'utf8')
    const read = await readTimeline(file)
    expect(read.entries).toHaveLength(1)
    expect(read.corrupt).toBe(1)
  })

  it('appends new URLs and dedupes against the store and within the batch', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'timeline.jsonl')
    const first = await mergeTimeline(file, [entry('https://a.test/1'), entry('https://a.test/2')], 500)
    expect(first.added).toHaveLength(2)
    expect(first.total).toBe(2)
    const second = await mergeTimeline(file, [
      entry('https://a.test/1'),
      entry('HTTPS://A.TEST:443/1'),
      entry('https://a.test/3'),
    ], 500)
    expect(second.added).toHaveLength(1)
    expect(second.duplicates).toBe(2)
    expect(second.total).toBe(3)
    const read = await readTimeline(file)
    expect(read.entries.map(item => item.url)).toEqual(['https://a.test/1', 'https://a.test/2', 'https://a.test/3'])
  })

  it('drops the oldest entries when the retention cap is exceeded', async () => {
    const dir = await tempDir()
    const file = path.join(dir, 'timeline.jsonl')
    await mergeTimeline(file, [entry('https://a.test/1'), entry('https://a.test/2')], 500)
    const merge = await mergeTimeline(file, [entry('https://a.test/3'), entry('https://a.test/4')], 3)
    expect(merge.truncated).toBe(true)
    expect(merge.total).toBe(3)
    const read = await readTimeline(file)
    expect(read.entries.map(item => item.url)).toEqual(['https://a.test/2', 'https://a.test/3', 'https://a.test/4'])
  })
})
