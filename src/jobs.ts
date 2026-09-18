/**
 * Optional access to the `ctx.jobs` background-job registry. The service is
 * never injected: it is looked up structurally at execution time, and tools
 * degrade to a deterministic sequential path when no job registry is mounted.
 * Only the minimal `start` surface this plugin uses is declared — everything
 * else stays opaque to the caller.
 * @module dsh-industry-research/jobs
 */

import type { Context } from '@deepseek-ai/cordis'

/** Terminal outcome a producer reports through its job hooks. */
export interface JobOutcomeLike {
  status: 'completed' | 'killed' | 'failed'
  output?: string
}

/** The hooks a job starter returns to the registry. */
export interface JobHooksLike {
  cancel(reason?: string): void
  done: Promise<JobOutcomeLike>
}

/** The minimal job-start spec this plugin passes to the registry. */
export interface JobStartLike {
  kind: string
  label: string
  owner?: unknown
  run(): JobHooksLike
}

/** The minimal background-job registry surface this plugin uses. */
export interface JobsLike {
  start(spec: JobStartLike): string
}

/**
 * Structural guard for the optional background-job registry.
 *
 * `ctx.get()` is untyped, so the looked-up value is proven to carry the one
 * method this plugin calls rather than asserted with a cast. A service mounted
 * under `jobs` without a callable `start` would otherwise be accepted here and
 * fail inside the batch path.
 * @param value - the value returned by `ctx.get('jobs')`.
 * @returns true when the value exposes a callable `start`.
 */
function isJobsLike(value: unknown): value is JobsLike {
  if (typeof value !== 'object' || value === null) return false
  return typeof (value as { start?: unknown }).start === 'function'
}

/**
 * Look up the optional background-job registry.
 * @param ctx - the plugin context.
 * @returns the registry surface, or undefined when no job service is mounted.
 */
export function lookupJobs(ctx: Context): JobsLike | undefined {
  const candidate: unknown = ctx.get('jobs')
  return isJobsLike(candidate) ? candidate : undefined
}
