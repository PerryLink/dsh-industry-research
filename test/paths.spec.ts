/**
 * Path safety: segment validation (traversal, separators, control characters,
 * Windows device names), workspace containment, and root resolution.
 * @module dsh-industry-research/test/paths.spec
 */

import { describe, expect, it } from 'vitest'
import { resolve } from 'node:path'
import { resolveContained, resolveIndustryRoot, resolveWorkspaceFile, safeSegment } from '../src/paths.ts'

describe('safeSegment', () => {
  it('accepts CJK and ordinary names', () => {
    expect(safeSegment('industry', '白酒')).toBe('白酒')
    expect(safeSegment('industry', ' 半导体设备-2 ')).toBe('半导体设备-2')
  })

  it('rejects separators, traversal, control characters, and device names', () => {
    expect(() => safeSegment('industry', 'a/b')).toThrow(/single path segment/u)
    expect(() => safeSegment('industry', '..')).toThrow(/traversal/u)
    expect(() => safeSegment('industry', 'a..b')).toThrow(/traversal/u)
    expect(() => safeSegment('industry', 'a\u0001b')).toThrow(/control/u)
    expect(() => safeSegment('industry', 'CON')).toThrow(/device name/u)
    expect(() => safeSegment('industry', '')).toThrow(/non-empty/u)
    expect(() => safeSegment('industry', '.hidden')).toThrow(/start with/u)
  })
})

describe('resolveWorkspaceFile', () => {
  it('resolves relative paths inside the workspace and rejects escapes', () => {
    const cwd = resolve('/tmp/ir-workspace')
    expect(resolveWorkspaceFile(cwd, 'notes/a.md')).toBe(resolve(cwd, 'notes/a.md'))
    expect(() => resolveWorkspaceFile(cwd, '../outside.md')).toThrow(/escapes/u)
    expect(() => resolveWorkspaceFile(cwd, resolve('/tmp/elsewhere/x.md'))).toThrow(/escapes/u)
    expect(resolveWorkspaceFile(cwd, resolve(cwd, 'inner.md'))).toBe(resolve(cwd, 'inner.md'))
  })
})

describe('resolveIndustryRoot + resolveContained', () => {
  it('resolves relative roots against the cwd and keeps segments contained', () => {
    const cwd = resolve('/tmp/ir-workspace')
    const root = resolveIndustryRoot(cwd, 'industry-research')
    expect(root).toBe(resolve(cwd, 'industry-research'))
    expect(resolveContained(root, '白酒')).toBe(resolve(root, '白酒'))
    const absolute = resolveIndustryRoot(cwd, resolve('/tmp/ir-absolute'))
    expect(absolute).toBe(resolve('/tmp/ir-absolute'))
  })
})
