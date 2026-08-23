/**
 * The built-in industry taxonomy anchor table: well-formed codes, lookups, and
 * chain-node `taxonomyCode` validation (unknown codes fail loud).
 * @module dsh-industry-research/test/taxonomy.spec
 */

import { describe, expect, it } from 'vitest'
import { INDUSTRY_TAXONOMY, taxonomyEntry } from '../src/taxonomy.ts'
import { validateChainMap } from '../src/chain.ts'
import type { ChainMap } from '../src/chain.ts'

describe('INDUSTRY_TAXONOMY', () => {
  it('holds only two-digit codes and resolves known lookups', () => {
    expect(INDUSTRY_TAXONOMY.length).toBeGreaterThan(0)
    expect(INDUSTRY_TAXONOMY.every(entry => /^\d{2}$/u.test(entry.code))).toBe(true)
    expect(taxonomyEntry('15')?.name).toContain('酒')
    expect(taxonomyEntry('999')).toBeUndefined()
  })
})

describe('validateChainMap taxonomyCode', () => {
  it('accepts a known taxonomyCode', () => {
    const map: ChainMap = {
      industry: 'x',
      nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [], taxonomyCode: '15' }],
      edges: [],
    }
    expect(validateChainMap(map)).toEqual([])
  })

  it('rejects an unknown taxonomyCode', () => {
    const map: ChainMap = {
      industry: 'x',
      nodes: [{ id: 'a', name: 'A', tier: 'upstream', metrics: [], taxonomyCode: '999' }],
      edges: [],
    }
    expect(validateChainMap(map).some(problem => problem.includes('taxonomyCode'))).toBe(true)
  })
})
