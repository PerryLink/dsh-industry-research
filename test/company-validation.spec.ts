/**
 * Company-card validation: ticker/code format checks (with the strictTicker
 * exemption) and the price/value discipline (every metric value needs a
 * non-empty source + a valid, non-future asOf).
 * @module dsh-industry-research/test/company-validation.spec
 */

import { describe, expect, it } from 'vitest'
import { validateCompanyCard, validateTicker } from '../src/company.ts'
import type { CompanyCard } from '../src/company.ts'

const NOW = new Date('2026-08-24T00:00:00.000Z')

/** A minimal valid card (all optional assertion fields absent). */
function card(overrides: Partial<CompanyCard> = {}): CompanyCard {
  return {
    name: '样例酒业',
    slug: '样例酒业',
    asOf: '2026-08-19T00:00:00.000Z',
    sources: [],
    outline: [],
    figureCandidates: [],
    webSources: null,
    gaps: [],
    disclaimer: '仅供研究，不构成投资建议',
    ...overrides,
  }
}

describe('validateTicker', () => {
  it('accepts the built-in formats and absent tickers', () => {
    expect(validateTicker(undefined, true)).toEqual([])
    expect(validateTicker('', true)).toEqual([])
    expect(validateTicker('600519', true)).toEqual([]) // A股
    expect(validateTicker('AAPL', true)).toEqual([]) // 美股
    expect(validateTicker('700', true)).toEqual([]) // 港股
  })

  it('rejects a ticker matching no known format when strict', () => {
    const problems = validateTicker('60051A', true)
    expect(problems.some(problem => problem.includes('does not match a known format'))).toBe(true)
  })

  it('exempts the format check when strict is false', () => {
    expect(validateTicker('60051A', false)).toEqual([])
  })
})

describe('validateCompanyCard', () => {
  it('accepts a card with a legal status, ticker, and sourced metrics', () => {
    const valid = card({
      status: 'public',
      statusAsOf: '2026-08-23',
      ticker: '600519',
      metrics: [{ key: '股价', value: 120.5, unit: '元', asOf: '2026-08-23', source: 'S1' }],
    })
    expect(validateCompanyCard(valid, NOW, true)).toEqual([])
  })

  it('rejects a metric value without a source or without an asOf', () => {
    const noSource = card({ metrics: [{ key: '股价', value: 120.5, asOf: '2026-08-23', source: ' ' }] })
    expect(validateCompanyCard(noSource, NOW, true).some(problem => problem.includes('without a source'))).toBe(true)
    const noAsOf = card({ metrics: [{ key: '股价', value: 120.5, asOf: '', source: 'S1' }] })
    expect(validateCompanyCard(noAsOf, NOW, true).some(problem => problem.includes('without an asOf'))).toBe(true)
  })

  it('rejects a future metric asOf and a non-finite value', () => {
    const future = card({ metrics: [{ key: '股价', value: 120.5, asOf: '2099-01-01', source: 'S1' }] })
    expect(validateCompanyCard(future, NOW, true).some(problem => problem.includes('future'))).toBe(true)
    const nonFinite = card({ metrics: [{ key: '股价', value: Number.NaN, asOf: '2026-08-23', source: 'S1' }] })
    expect(validateCompanyCard(nonFinite, NOW, true).some(problem => problem.includes('non-finite'))).toBe(true)
  })

  it('rejects a status without a statusAsOf through the card validator', () => {
    const missing = card({ status: 'acquired' })
    expect(validateCompanyCard(missing, NOW, true).some(problem => problem.includes('statusAsOf'))).toBe(true)
  })

  it('applies the ticker format exemption via strictTicker', () => {
    const badTicker = card({ ticker: '60051A' })
    expect(validateCompanyCard(badTicker, NOW, true).some(problem => problem.includes('ticker'))).toBe(true)
    expect(validateCompanyCard(badTicker, NOW, false)).toEqual([])
  })
})
