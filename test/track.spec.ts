/**
 * The `industry_track` tool: loud failure without the web capability (and in
 * offline mode), the full happy path over the REAL web seam with scripted
 * providers (dedupe across calls, allow/block lists, fetch-failure notes,
 * snapshot hashes), and the track event.
 * @module dsh-industry-research/test/track.spec
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountPlugin, mountWeb, callTool, stubFetch, stubSearch, unmountBase, type BaseHarness } from './harness.ts'
import type { IndustryTrackValue } from '../src/tools/track.ts'
import type { TrackEventPayload } from '../src/events.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`track-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

describe('industry_track capability gates', () => {
  it('fails loud naming ctx.web when no web seam is mounted', async () => {
    const base = await setup()
    const result = await callTool(base, 'industry_track', { industry: '示例' })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('ctx.web')
    expect(result.error?.message).toContain('dsh-web')
  })

  it('fails loud naming offline when offline: true', async () => {
    const base = await setup({ offline: true })
    const result = await callTool(base, 'industry_track', { industry: '示例' })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('offline')
  })

  it('fails closed when the search provider throws (no silent empty timeline)', async () => {
    const base = await setup()
    await mountWeb(base, {
      id: 'stub-search-fail',
      available: () => true,
      search: () => Promise.reject(Object.assign(new Error('search exploded'), { code: 'WEB_SEARCH_FAILED' })),
    })
    const result = await callTool(base, 'industry_track', { industry: '示例' })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('search exploded')
  })
})

describe('industry_track over the real web seam', () => {
  it('merges entries with snapshot hashes, dedupes across calls, and emits the event', async () => {
    const base = await setup()
    await mountWeb(base, stubSearch([
      { url: 'https://gov.test/policy-1', title: '产业政策一', snippet: '摘要一', publishedAt: '2026-08-01' },
      { url: 'https://news.test/item-2', title: '要闻二', publishedAt: '2026-08-05' },
    ]), stubFetch({ 'https://gov.test/policy-1': '政策一全文' }))
    const events: TrackEventPayload[] = []
    base.ctx.on('industry-research/track', payload => { events.push(payload) })

    const first = await callTool(base, 'industry_track', { industry: '示例' })
    expect(first.isError).toBe(false)
    const firstValue = first.value as unknown as IndustryTrackValue
    expect(firstValue.added).toHaveLength(2)
    expect(firstValue.total).toBe(2)
    const policy = firstValue.added.find(entry => entry.url === 'https://gov.test/policy-1')
    expect(policy?.snapshotHash).toMatch(/^[0-9a-f]{64}$/u)
    const news = firstValue.added.find(entry => entry.url === 'https://news.test/item-2')
    expect(news?.snapshotHash).toMatch(/^[0-9a-f]{64}$/u)
    expect(events).toHaveLength(1)
    expect(events[0]?.added).toBe(2)

    const second = await callTool(base, 'industry_track', { industry: '示例' })
    const secondValue = second.value as unknown as IndustryTrackValue
    expect(secondValue.added).toHaveLength(0)
    expect(secondValue.duplicates).toBe(2)
    expect(secondValue.total).toBe(2)

    const persisted = (await readFile(join(base.workspace, 'industry-research', '示例', 'timeline.jsonl'), 'utf8')).trim().split('\n')
    expect(persisted).toHaveLength(2)
  })

  it('applies the blocklist, the since filter, and records fetch failures honestly', async () => {
    const base = await setup({ sourceBlocklist: ['blocked.test'] })
    await mountWeb(base, stubSearch([
      { url: 'https://blocked.test/x', title: '被拦截', publishedAt: '2026-08-01' },
      { url: 'https://ok.test/old', title: '过早', publishedAt: '2020-01-01' },
      { url: 'https://ok.test/new', title: '新政策', publishedAt: '2026-08-10' },
      { url: 'https://fail.test/y', title: '抓取失败', publishedAt: '2026-08-11' },
    ]), stubFetch({}, new Set(['https://fail.test/y'])))
    const result = await callTool(base, 'industry_track', { industry: '示例', since: '2026-01-01' })
    const value = result.value as unknown as IndustryTrackValue
    expect(value.blocked).toBe(1)
    expect(value.tooOld).toBe(1)
    expect(value.added.map(entry => entry.url).sort()).toEqual(['https://fail.test/y', 'https://ok.test/new'])
    const failed = value.added.find(entry => entry.url === 'https://fail.test/y')
    expect(failed?.snapshotHash).toBeNull()
    expect(failed?.note).toContain('快照抓取失败')
    expect(value.fetchFailed).toHaveLength(1)
  })

  it('honors the fetch budget: sources beyond it stay citation-only', async () => {
    const base = await setup({ track: { maxFetchesPerCall: 1 } })
    await mountWeb(base, stubSearch([
      { url: 'https://a.test/1', title: '一', publishedAt: '2026-08-01' },
      { url: 'https://a.test/2', title: '二', publishedAt: '2026-08-02' },
    ]), stubFetch({}))
    const result = await callTool(base, 'industry_track', { industry: '示例' })
    const value = result.value as unknown as IndustryTrackValue
    expect(value.added).toHaveLength(2)
    const withHash = value.added.filter(entry => entry.snapshotHash !== null)
    expect(withHash).toHaveLength(1)
    const beyond = value.added.find(entry => entry.snapshotHash === null)
    expect(beyond?.note).toContain('超出本次抓取预算')
  })
})
