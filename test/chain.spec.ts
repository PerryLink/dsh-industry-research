/**
 * ChainMap validation and gap listing: sourced-value discipline (a value
 * needs a sourceRef), dangling-edge detection, tier legality, duplicate ids,
 * and the explicit gap inventory.
 * @module dsh-industry-research/test/chain.spec
 */

import { describe, expect, it } from 'vitest'
import { chainGaps, validateChainMap } from '../src/chain.ts'
import type { ChainMap } from '../src/chain.ts'

/** A minimal valid map used as the mutation base. */
function validMap(): ChainMap {
  return {
    industry: '白酒',
    nodes: [
      { id: 'up', name: '高粱种植', tier: 'upstream', metrics: [{ key: '亩产', value: 350, unit: '公斤', asOf: '2025-12-31', sourceRef: 'S1' }] },
      { id: 'mid', name: '白酒酿造', tier: 'midstream', metrics: [{ key: '产量' }] },
      { id: 'down', name: '经销渠道', tier: 'downstream', metrics: [] },
    ],
    edges: [{ from: 'up', to: 'mid', note: '原料供应' }, { from: 'mid', to: 'down' }],
  }
}

describe('validateChainMap', () => {
  it('accepts a well-formed map', () => {
    expect(validateChainMap(validMap())).toEqual([])
  })

  it('rejects a dangling edge (unknown node reference)', () => {
    const map = validMap()
    map.edges.push({ from: 'mid', to: 'ghost' })
    const problems = validateChainMap(map)
    expect(problems.some(problem => problem.includes('ghost'))).toBe(true)
  })

  it('rejects a metric carrying a value without a sourceRef', () => {
    const map = validMap()
    map.nodes[0]!.metrics.push({ key: '采购价', value: 5.2 })
    const problems = validateChainMap(map)
    expect(problems.some(problem => problem.includes('采购价') && problem.includes('sourceRef'))).toBe(true)
  })

  it('accepts a gap slot (key without value) without a sourceRef', () => {
    const map = validMap()
    map.nodes[0]!.metrics.push({ key: '自给率' })
    expect(validateChainMap(map)).toEqual([])
  })

  it('rejects an illegal tier', () => {
    const map = validMap()
    ;(map.nodes[0] as { tier: string }).tier = 'middle'
    expect(validateChainMap(map).some(problem => problem.includes('tier'))).toBe(true)
  })

  it('rejects duplicate node ids', () => {
    const map = validMap()
    map.nodes.push({ id: 'up', name: '重复', tier: 'upstream', metrics: [] })
    expect(validateChainMap(map).some(problem => problem.includes('duplicate'))).toBe(true)
  })

  it('rejects a non-finite metric value', () => {
    const map = validMap()
    map.nodes[0]!.metrics.push({ key: '坏值', value: Number.NaN, sourceRef: 'S1' })
    expect(validateChainMap(map).some(problem => problem.includes('non-finite'))).toBe(true)
  })
})

describe('chainGaps', () => {
  it('lists value-less slots, metric-less nodes, and missing tiers', () => {
    const gaps = chainGaps(validMap())
    expect(gaps.some(gap => gap.includes('产量'))).toBe(true)
    expect(gaps.some(gap => gap.includes('经销渠道') && gap.includes('没有任何指标槽位'))).toBe(true)
    const sparse: ChainMap = { industry: 'x', nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [] }], edges: [] }
    const sparseGaps = chainGaps(sparse)
    expect(sparseGaps.some(gap => gap.includes('没有任何指标槽位'))).toBe(true)
    expect(sparseGaps.some(gap => gap.includes('midstream'))).toBe(true)
    expect(sparseGaps.some(gap => gap.includes('downstream'))).toBe(true)
  })
})
