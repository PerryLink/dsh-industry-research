/**
 * Research depth routing: the `depth` argument resolves deterministically to a
 * fixed collection profile and fails loud out of range.
 * @module dsh-industry-research/test/depth.spec
 */

import { describe, expect, it } from 'vitest'
import { DEPTH_LEVELS, DEPTH_PROFILES, resolveDepth } from '../src/depth.ts'

describe('resolveDepth', () => {
  it('defaults to standard and accepts every legal level', () => {
    expect(resolveDepth(undefined)).toBe('standard')
    for (const level of DEPTH_LEVELS) expect(resolveDepth(level)).toBe(level)
  })

  it('fails loud on an out-of-range value', () => {
    expect(() => resolveDepth('deep')).toThrow(/depth must be one of/u)
    expect(() => resolveDepth(42)).toThrow(/depth/u)
  })
})

describe('DEPTH_PROFILES', () => {
  it('is a fixed monotonic scale (quick < standard < comprehensive)', () => {
    expect(DEPTH_PROFILES.quick.mapSearchResults).toBeLessThan(DEPTH_PROFILES.standard.mapSearchResults)
    expect(DEPTH_PROFILES.standard.mapSearchResults).toBeLessThan(DEPTH_PROFILES.comprehensive.mapSearchResults)
    expect(DEPTH_PROFILES.quick.trackMaxFetchesPerCall).toBeLessThan(DEPTH_PROFILES.comprehensive.trackMaxFetchesPerCall)
  })
})
