/**
 * The deterministic red-team adversarial check: it flags dead evidence links,
 * unsourced/undated chain metrics, statuses without dates, and card metrics
 * missing source/asOf, and reports clean when none of those hold.
 * @module dsh-industry-research/test/adversarial.spec
 */

import { describe, expect, it } from 'vitest'
import { adversarialCheck } from '../src/adversarial.ts'
import type { LoadedArtifacts, ReportDraft } from '../src/report.ts'

const evidenceIds = new Set(['E-chain', 'E-company-a'])

function draft(claims: ReportDraft['claims'] = []): ReportDraft {
  return { title: 't', sections: [{ heading: 'h', paragraphs: [{ text: 'x' }] }], claims }
}

describe('adversarialCheck', () => {
  it('is clean for a fully sourced report', () => {
    const artifacts: LoadedArtifacts = {
      cards: [],
      gaps: [],
      chain: {
        path: '/c',
        content: '',
        map: { industry: 'x', nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [{ key: '价格', value: 10, asOf: '2026-08-01', sourceRef: 'S1' }] }], edges: [] },
      },
    }
    expect(adversarialCheck(draft(), artifacts, evidenceIds)).toEqual([])
  })

  it('flags dead evidence links and undated/unsourced assertions', () => {
    const artifacts: LoadedArtifacts = {
      cards: [
        { path: '/card', content: '', card: { name: 'A', slug: 'a', asOf: '2026-08-19T00:00:00.000Z', sources: [], outline: [], figureCandidates: [], webSources: null, gaps: [], disclaimer: 'x', status: 'public', metrics: [{ key: '股价', value: 1, asOf: '', source: 'S1' }] } },
      ],
      gaps: [],
      chain: {
        path: '/c',
        content: '',
        map: {
          industry: 'x',
          nodes: [{ id: 'a', name: 'A', tier: 'upstream', status: 'public', metrics: [{ key: '价格', value: 10, sourceRef: 'S1' }, { key: '坏值', value: 20 }] }],
          edges: [],
        },
      },
    }
    const findings = adversarialCheck(draft([{ id: 'C1', text: 'x', evidenceIds: ['E-ghost'] }]), artifacts, evidenceIds)
    expect(findings.some(finding => finding.includes('dead evidence link'))).toBe(true)
    expect(findings.some(finding => finding.includes('without a statusAsOf'))).toBe(true)
    expect(findings.some(finding => finding.includes('without an asOf'))).toBe(true)
    expect(findings.some(finding => finding.includes('without a sourceRef'))).toBe(true)
  })
})
