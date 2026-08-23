/**
 * Config resolution: defaults, explicit overrides, and fail-loud bounds.
 * @module dsh-industry-research/test/config.spec
 */

import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config.ts'

describe('resolveConfig', () => {
  it('fills the documented defaults', () => {
    const resolved = resolveConfig({})
    expect(resolved.enabled).toBe(true)
    expect(resolved.industryRoot).toBe('industry-research')
    expect(resolved.fetchTimeoutMs).toBe(20_000)
    expect(resolved.timelineMaxEntries).toBe(500)
    expect(resolved.sourceAllowlist).toEqual([])
    expect(resolved.sourceBlocklist).toEqual([])
    expect(resolved.offline).toBe(false)
    expect(resolved.skillsDir).toBeUndefined()
    expect(resolved.track).toEqual({ maxResultsPerTopic: 10, maxFetchesPerCall: 10 })
    expect(resolved.scan).toEqual({ maxFileBytes: 1_048_576, maxFigureCandidates: 100 })
  })

  it('honors explicit overrides', () => {
    const resolved = resolveConfig({
      industryRoot: 'research',
      offline: true,
      sourceBlocklist: ['example.com'],
      track: { maxResultsPerTopic: 3, maxFetchesPerCall: 2 },
      scan: { maxFileBytes: 1024, maxFigureCandidates: 5 },
    })
    expect(resolved.industryRoot).toBe('research')
    expect(resolved.offline).toBe(true)
    expect(resolved.sourceBlocklist).toEqual(['example.com'])
    expect(resolved.track.maxResultsPerTopic).toBe(3)
    expect(resolved.scan.maxFigureCandidates).toBe(5)
  })

  it('fails loud on invalid bounds and entries', () => {
    expect(() => resolveConfig({ industryRoot: '  ' })).toThrow(/industryRoot/u)
    expect(() => resolveConfig({ fetchTimeoutMs: 0 })).toThrow(/fetchTimeoutMs/u)
    expect(() => resolveConfig({ timelineMaxEntries: -1 })).toThrow(/timelineMaxEntries/u)
    expect(() => resolveConfig({ sourceAllowlist: [''] })).toThrow(/sourceAllowlist/u)
    expect(() => resolveConfig({ track: { maxResultsPerTopic: 0 } })).toThrow(/maxResultsPerTopic/u)
    expect(() => resolveConfig({ track: { maxFetchesPerCall: 0 } })).toThrow(/maxFetchesPerCall/u)
    expect(() => resolveConfig({ scan: { maxFileBytes: 1.5 } })).toThrow(/maxFileBytes/u)
    expect(() => resolveConfig({ scan: { maxFileBytes: Number.MAX_SAFE_INTEGER + 1 } })).toThrow(/maxFileBytes/u)
    expect(() => resolveConfig({ scan: { maxFigureCandidates: 0 } })).toThrow(/maxFigureCandidates/u)
    expect(() => resolveConfig({ scan: { maxFigureCandidates: -1 } })).toThrow(/maxFigureCandidates/u)
  })
})
