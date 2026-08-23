/**
 * The deterministic chain-map SVG renderer: strict XML escaping of user text,
 * tier-column layout, directed arrow edges, and the dual-rule bottleneck
 * detection (funnel vs hub) with highlight colors and byte-stable output.
 * @module dsh-industry-research/test/chain-svg.spec
 */

import { describe, expect, it } from 'vitest'
import { analyzeBottlenecks, renderChainSvg, xmlEscape } from '../src/chain-svg.ts'
import type { ChainMap } from '../src/chain.ts'

/** A map with one funnel (in 2, out 1) and one hub (in 2, out 2). */
function bottleneckMap(): ChainMap {
  return {
    industry: '示例',
    nodes: [
      { id: 'a', name: '上游A', tier: 'upstream', metrics: [] },
      { id: 'b', name: '上游B', tier: 'upstream', metrics: [] },
      { id: 'c', name: '上游C', tier: 'upstream', metrics: [] },
      { id: 'funnel', name: '中游漏斗', tier: 'midstream', metrics: [] },
      { id: 'hub', name: '中游枢纽', tier: 'midstream', metrics: [] },
      { id: 'd', name: '下游D', tier: 'downstream', metrics: [] },
      { id: 'e', name: '下游E', tier: 'downstream', metrics: [] },
      { id: 'f', name: '下游F', tier: 'downstream', metrics: [] },
    ],
    edges: [
      { from: 'a', to: 'funnel' },
      { from: 'b', to: 'funnel' },
      { from: 'funnel', to: 'd' },
      { from: 'a', to: 'hub' },
      { from: 'c', to: 'hub' },
      { from: 'hub', to: 'e' },
      { from: 'hub', to: 'f' },
    ],
  }
}

describe('xmlEscape', () => {
  it('escapes every XML-significant character', () => {
    expect(xmlEscape('<&>"\'')).toBe('&lt;&amp;&gt;&quot;&apos;')
    expect(xmlEscape('plain')).toBe('plain')
  })
})

describe('analyzeBottlenecks', () => {
  it('flags funnels (in ≥ 2, out ≤ 1) and hubs (in ≥ 2, out ≥ 2) with degrees', () => {
    const bottlenecks = analyzeBottlenecks(bottleneckMap())
    expect(bottlenecks.map(bottleneck => bottleneck.id)).toEqual(['funnel', 'hub'])
    expect(bottlenecks[0]).toEqual({ id: 'funnel', name: '中游漏斗', kind: 'funnel', inDegree: 2, outDegree: 1 })
    expect(bottlenecks[1]).toEqual({ id: 'hub', name: '中游枢纽', kind: 'hub', inDegree: 2, outDegree: 2 })
  })

  it('returns no bottlenecks when no node has in-degree ≥ 2', () => {
    const map: ChainMap = {
      industry: 'x',
      nodes: [
        { id: 'a', name: 'A', tier: 'upstream', metrics: [] },
        { id: 'b', name: 'B', tier: 'downstream', metrics: [] },
      ],
      edges: [{ from: 'a', to: 'b' }],
    }
    expect(analyzeBottlenecks(map)).toEqual([])
  })
})

describe('renderChainSvg', () => {
  it('lays nodes out in three tier columns and draws directed edges', () => {
    const svg = renderChainSvg(bottleneckMap())
    // Three distinct x columns: upstream 48, midstream 488, downstream 928.
    expect(svg).toContain('<rect x="48"')
    expect(svg).toContain('<rect x="488"')
    expect(svg).toContain('<rect x="928"')
    expect(svg).toContain('marker-end="url(#arrow)"')
  })

  it('highlights funnels and hubs with distinct fills', () => {
    const svg = renderChainSvg(bottleneckMap())
    expect(svg).toContain('fill="#fff4cc"')
    expect(svg).toContain('fill="#fde3e3"')
  })

  it('escapes user text so it cannot break the markup', () => {
    const map: ChainMap = {
      industry: 'A&B<C>',
      nodes: [{ id: 'x"y', name: 'a<b&c', tier: 'upstream', metrics: [] }],
      edges: [],
    }
    const svg = renderChainSvg(map)
    expect(svg).toContain('A&amp;B&lt;C&gt;')
    expect(svg).toContain('a&lt;b&amp;c')
    expect(svg).toContain('x&quot;y')
    expect(svg).not.toContain('a<b&c')
  })

  it('is byte-stable for the same input', () => {
    const map = bottleneckMap()
    expect(renderChainSvg(map)).toBe(renderChainSvg(map))
  })

  it('matches the recorded snapshot', () => {
    expect(renderChainSvg(bottleneckMap())).toMatchSnapshot()
  })
})
