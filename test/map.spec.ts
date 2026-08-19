/**
 * The `industry_map` tool over the real host seams: validated chain writes,
 * loud validation failures, seed/source registration, offline web behavior,
 * and the committed-map event.
 * @module dsh-industry-research/test/map.spec
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountPlugin, mountWeb, callTool, stubSearch, unmountBase, type BaseHarness } from './harness.ts'
import type { ChainMap } from '../src/chain.ts'
import type { IndustryMapValue } from '../src/tools/map.ts'
import type { MapEventPayload } from '../src/events.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`map-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/** A small valid chain for the 示例 industry. */
function demoChain(): ChainMap {
  return {
    industry: '示例',
    nodes: [
      { id: 'up', name: '上游原料', tier: 'upstream', metrics: [{ key: '价格', value: 10, unit: '元', asOf: '2026-01-01', sourceRef: 'S1' }] },
      { id: 'down', name: '下游渠道', tier: 'downstream', metrics: [{ key: '占比' }] },
    ],
    edges: [{ from: 'up', to: 'down' }],
  }
}

describe('industry_map', () => {
  it('validates and persists a chain, lists gaps, and emits the map event', async () => {
    const base = await setup()
    const events: MapEventPayload[] = []
    base.ctx.on('industry-research/map', payload => { events.push(payload) })
    const result = await callTool(base, 'industry_map', { industry: '示例', chain: demoChain(), web: false })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryMapValue
    expect(value.updated).toBe(true)
    expect(value.chain?.nodes).toHaveLength(2)
    expect(value.gaps.some(gap => gap.includes('占比'))).toBe(true)
    const persisted = JSON.parse(await readFile(join(base.workspace, 'industry-research', '示例', 'chain.json'), 'utf8')) as ChainMap
    expect(persisted.nodes[0]?.name).toBe('上游原料')
    expect(events).toHaveLength(1)
    expect(events[0]?.industry).toBe('示例')
    expect(events[0]?.nodes).toBe(2)
  })

  it('fails loud with the issue list when the chain is invalid', async () => {
    const base = await setup()
    const invalid = demoChain()
    invalid.edges.push({ from: 'up', to: 'ghost' })
    invalid.nodes[0]!.metrics.push({ key: '无来源数值', value: 1 })
    const result = await callTool(base, 'industry_map', { industry: '示例', chain: invalid, web: false })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('校验失败')
    expect(result.error?.message).toContain('ghost')
    expect(result.error?.message).toContain('sourceRef')
  })

  it('registers seed notes and seed files as citable sources', async () => {
    const base = await setup()
    const seedFile = join(base.workspace, 'notes.md')
    await import('node:fs/promises').then(fs => fs.writeFile(seedFile, 'seed file content\n', 'utf8'))
    const result = await callTool(base, 'industry_map', { industry: '示例', seed: '自由笔记', seedFiles: ['notes.md'], web: false })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryMapValue
    expect(value.seedRefs).toHaveLength(2)
    expect(value.sources).toHaveLength(2)
    expect(value.chain).toBeNull()
    expect(value.gaps.some(gap => gap.includes('尚无产业链结构图'))).toBe(true)
    const registry = JSON.parse(await readFile(join(base.workspace, 'industry-research', '示例', 'sources.json'), 'utf8')) as { items: Array<{ ref: string }> }
    expect(registry.items.map(item => item.ref)).toEqual(['S1', 'S2'])
  })

  it('skips the web assist offline and says so; uses the web digest when mounted', async () => {
    const offlineBase = await setup({ offline: true })
    const offline = await callTool(offlineBase, 'industry_map', { industry: '示例' })
    const offlineValue = offline.value as unknown as IndustryMapValue
    expect(offlineValue.webDigest).toBeNull()
    expect(offlineValue.webNote).toContain('offline')

    const onlineBase = await setup()
    await mountWeb(onlineBase, stubSearch([{ url: 'https://a.test/chain', title: '产业链分析' }]))
    const online = await callTool(onlineBase, 'industry_map', { industry: '示例' })
    const onlineValue = online.value as unknown as IndustryMapValue
    expect(onlineValue.webDigest).toHaveLength(1)
    expect(onlineValue.seedRefs).toContain('S1')
    expect(onlineValue.sources[0]?.origin).toBe('https://a.test/chain')
  })

  it('rejects a crafted industry name that would escape the workspace', async () => {
    const base = await setup()
    const result = await callTool(base, 'industry_map', { industry: '../escape', web: false })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toMatch(/single path segment|traversal/u)
  })
})
