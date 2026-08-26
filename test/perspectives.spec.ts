/**
 * The deterministic bull/bear synthesis and its note renderer: sourced values
 * land on the bull side with evidence ids, declared gaps and data-quality
 * findings land on the bear side, and the note renders both sections plus the
 * synthesis line.
 * @module dsh-industry-research/test/perspectives.spec
 */

import { describe, expect, it } from 'vitest'
import { renderPerspectivesNote, synthesizePerspectives } from '../src/perspectives.ts'
import type { LoadedArtifacts, ReportDraft } from '../src/report.ts'

const evidenceIds = new Set(['E-chain', 'E-timeline', 'E-company-a'])

function draft(): ReportDraft {
  return { title: 't', sections: [{ heading: 'h', paragraphs: [{ text: 'x' }] }], claims: [] }
}

describe('synthesizePerspectives', () => {
  it('puts sourced, dated values on the bull side and gaps on the bear side', () => {
    const artifacts: LoadedArtifacts = {
      cards: [
        {
          path: '/card',
          content: '',
          card: {
            name: 'A',
            slug: 'a',
            asOf: '2026-08-19T00:00:00.000Z',
            sources: [],
            outline: [],
            figureCandidates: [],
            webSources: null,
            gaps: [],
            disclaimer: 'x',
            metrics: [{ key: '营业收入', value: 100, unit: '亿元', asOf: '2026-08-01', source: 'S1' }],
          },
        },
      ],
      gaps: ['缺少政策与动态 timeline.jsonl'],
      chain: {
        path: '/c',
        content: '',
        map: {
          industry: 'x',
          nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [{ key: '价格', value: 10, asOf: '2026-08-01', sourceRef: 'S1' }] }],
          edges: [],
        },
      },
      timeline: { path: '/t', content: '', entries: [{ url: 'https://e/x', title: '政策', date: '2026-08-01', summary: null, snapshotHash: null, capturedAt: '2026-08-19T00:00:00.000Z', topics: ['白酒'] }] },
    }
    const synthesis = synthesizePerspectives(draft(), artifacts, evidenceIds)
    expect(synthesis.bull.some(point => point.text.includes('产业链指标'))).toBe(true)
    expect(synthesis.bull.some(point => point.text.includes('公司数据'))).toBe(true)
    expect(synthesis.bull.some(point => point.evidenceIds.includes('E-timeline'))).toBe(true)
    expect(synthesis.bear.some(point => point.text.includes('缺少政策与动态'))).toBe(true)
  })

  it('surfaces data-quality findings on the bear side', () => {
    const artifacts: LoadedArtifacts = {
      cards: [],
      gaps: [],
      chain: {
        path: '/c',
        content: '',
        map: {
          industry: 'x',
          nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [{ key: '价格', value: 10, sourceRef: 'S1' }] }],
          edges: [],
        },
      },
    }
    const synthesis = synthesizePerspectives(draft(), artifacts, evidenceIds)
    expect(synthesis.bear.some(point => point.text.includes('数据质量风险') && point.text.includes('without an asOf'))).toBe(true)
  })

  it('reports empty sides honestly when there is nothing to cite', () => {
    const artifacts: LoadedArtifacts = { cards: [], gaps: [] }
    const synthesis = synthesizePerspectives(draft(), artifacts, evidenceIds)
    expect(synthesis.bull).toEqual([])
    expect(synthesis.bear).toEqual([])
  })
})

describe('renderPerspectivesNote', () => {
  it('renders bull, bear, and synthesis sections', () => {
    const artifacts: LoadedArtifacts = {
      cards: [],
      gaps: ['缺少产业链结构图 chain.json'],
    }
    const note = renderPerspectivesNote('示例', draft(), artifacts, evidenceIds, '2026-08-19T00:00:00.000Z')
    expect(note).toContain('# 多视角正反方笔记（bull/bear）')
    expect(note).toContain('## 多方视角（bull · 利好/支撑）')
    expect(note).toContain('## 空方视角（bear · 利空/风险）')
    expect(note).toContain('## 综合（再合成）')
    expect(note).toContain('缺少产业链结构图')
  })
})
