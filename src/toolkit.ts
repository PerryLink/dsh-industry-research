/**
 * Shared helpers for the four research tools: workspace resolution from the
 * calling agent's session and per-industry directory layout. The layout is:
 *
 * ```
 * <cwd>/<industryRoot>/<industry>/chain.json      industry_map
 * <cwd>/<industryRoot>/<industry>/timeline.jsonl  industry_track
 * <cwd>/<industryRoot>/<industry>/sources.json    source registry
 * <cwd>/<industryRoot>/<industry>/notes/          seed notes
 * <cwd>/<industryRoot>/<industry>/reports/<ts>/   industry_report
 * <cwd>/<industryRoot>/companies/<slug>/card.*    company_scan
 * ```
 * @module dsh-industry-research/toolkit
 */

import { join } from 'node:path'
import type { ToolRunContext } from '@deepseek-ai/dsh-tools'
import type { ResolvedConfig } from './config.ts'
import { resolveContained, resolveIndustryRoot, safeSegment } from './paths.ts'

/**
 * Resolve the session workspace the calling agent operates in. The tools are
 * workspace-bound by design; without an agent-owned session cwd there is no
 * honest place to persist artifacts, so this fails loud.
 * @param exec - the tool execution context.
 * @returns the absolute workspace root.
 */
export function workspaceOf(exec: ToolRunContext): string {
  const cwd = exec.agent?.session.header.cwd
  if (cwd === undefined || cwd.trim().length === 0) {
    throw new Error('this tool requires an agent-owned session workspace (session.header.cwd is unset)')
  }
  return cwd
}

/**
 * Resolve and validate the directory of one industry under the configured
 * root. The industry name is validated as a single safe path segment.
 * @param config - resolved plugin config.
 * @param cwd - absolute workspace root.
 * @param industry - the raw industry argument.
 * @returns `{ root, dir, name }` — absolute industry root, absolute industry directory, and the validated segment.
 */
export function industryDirOf(config: ResolvedConfig, cwd: string, industry: string): { root: string; dir: string; name: string } {
  const name = safeSegment('industry', industry)
  const root = resolveIndustryRoot(cwd, config.industryRoot)
  return { root, dir: resolveContained(root, name), name }
}

/**
 * Resolve and validate the directory of one company card under the shared
 * companies root.
 * @param config - resolved plugin config.
 * @param cwd - absolute workspace root.
 * @param company - the raw company name argument.
 * @returns `{ root, dir, slug }` — absolute industry root, absolute company directory, and the validated slug.
 */
export function companyDirOf(config: ResolvedConfig, cwd: string, company: string): { root: string; dir: string; slug: string } {
  const slug = safeSegment('company', company)
  const root = resolveIndustryRoot(cwd, config.industryRoot)
  return { root, dir: join(root, 'companies', slug), slug }
}

/** The `chain.json` path of an industry directory. */
export function chainPathOf(dir: string): string {
  return join(dir, 'chain.json')
}

/** The `chain.svg` path of an industry directory. */
export function chainSvgPathOf(dir: string): string {
  return join(dir, 'chain.svg')
}

/** The `timeline.jsonl` path of an industry directory. */
export function timelinePathOf(dir: string): string {
  return join(dir, 'timeline.jsonl')
}

/** The `sources.json` path of an industry directory. */
export function sourcesPathOf(dir: string): string {
  return join(dir, 'sources.json')
}

/** The `research-state.json` path of an industry directory. */
export function researchStatePathOf(dir: string): string {
  return join(dir, 'research-state.json')
}

/** The `versions.jsonl` ledger path at the industry-research root. */
export function versionsPathOf(root: string): string {
  return join(root, 'versions.jsonl')
}

/** The `notes/` directory of an industry directory. */
export function notesDirOf(dir: string): string {
  return join(dir, 'notes')
}

/** The `reports/` directory of an industry directory. */
export function reportsDirOf(dir: string): string {
  return join(dir, 'reports')
}
