/**
 * Workspace path resolution and containment for `dsh-industry-research`. All
 * artifacts live under `<cwd>/<industryRoot>/`; every name crossing a tool
 * argument boundary (industry, company, data file) is validated so a crafted
 * value cannot escape the workspace. Both sides of every containment check
 * are resolved before comparison (`path.resolve` returns backslashes on
 * Windows, and comparing against a forward-slash input would always fail).
 * @module dsh-industry-research/paths
 */

import { isAbsolute, resolve, sep } from 'node:path'

/** Windows device names that cannot serve as directory segments. */
const WINDOWS_RESERVED = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])$/iu
/** Windows-forbidden filename characters (control characters are checked by code point below). */
const FORBIDDEN_CHARS = /[<>:"|?*]/u

/**
 * Validate one path segment (an industry or company directory name). CJK and
 * other Unicode letters are fine; separators, traversal, control characters,
 * leading/trailing dots/spaces, and Windows device names are rejected.
 * @param label - what the segment names (for the error message).
 * @param value - the raw user/model-supplied name.
 * @returns the trimmed, validated segment.
 */
export function safeSegment(label: string, value: string): string {
  const segment = value.trim()
  if (segment.length === 0) throw new Error(`${label} must be a non-empty name`)
  if (segment.length > 80) throw new Error(`${label} must be at most 80 characters, got ${segment.length}`)
  if (segment.includes('/') || segment.includes('\\')) {
    throw new Error(`${label} must be a single path segment, got ${JSON.stringify(value)}`)
  }
  if (segment === '.' || segment === '..' || segment.includes('..')) {
    throw new Error(`${label} must not contain traversal, got ${JSON.stringify(value)}`)
  }
  if (FORBIDDEN_CHARS.test(segment)) {
    throw new Error(`${label} must not contain Windows-reserved characters, got ${JSON.stringify(value)}`)
  }
  for (const char of segment) {
    if ((char.codePointAt(0) ?? 0) < 0x20) {
      throw new Error(`${label} must not contain control characters, got ${JSON.stringify(value)}`)
    }
  }
  if (segment.startsWith('.') || segment.endsWith('.') || segment.endsWith(' ')) {
    throw new Error(`${label} must not start with '.' or end with '.'/' ', got ${JSON.stringify(value)}`)
  }
  if (WINDOWS_RESERVED.test(segment)) {
    throw new Error(`${label} must not be a Windows device name, got ${JSON.stringify(value)}`)
  }
  return segment
}

/**
 * Resolve `root` against the workspace cwd and return the absolute root.
 * A relative `industryRoot` is workspace-relative; an absolute one is used
 * as-is (deployment choice).
 * @param cwd - absolute session workspace root.
 * @param industryRoot - configured root (relative or absolute).
 * @returns the absolute industry root.
 */
export function resolveIndustryRoot(cwd: string, industryRoot: string): string {
  return isAbsolute(industryRoot) ? resolve(industryRoot) : resolve(cwd, industryRoot)
}

/**
 * Resolve a user-supplied workspace-relative file path and verify containment
 * inside the workspace. Absolute paths are accepted only when already inside
 * the workspace; everything escaping the cwd is rejected.
 * @param cwd - absolute session workspace root.
 * @param file - the raw path from a tool argument.
 * @returns the absolute, containment-verified path.
 */
export function resolveWorkspaceFile(cwd: string, file: string): string {
  const base = resolve(cwd)
  const target = isAbsolute(file) ? resolve(file) : resolve(base, file)
  if (target !== base && !target.startsWith(base + sep)) {
    throw new Error(`path escapes the session workspace: ${JSON.stringify(file)}`)
  }
  return target
}

/**
 * Resolve one named directory below a root and verify containment (defense in
 * depth after {@link safeSegment}).
 * @param root - absolute parent root.
 * @param segment - an already validated segment.
 * @returns the absolute, containment-verified directory path.
 */
export function resolveContained(root: string, segment: string): string {
  const base = resolve(root)
  const target = resolve(base, segment)
  if (!target.startsWith(base + sep)) {
    throw new Error(`segment escapes its root: ${JSON.stringify(segment)}`)
  }
  return target
}
