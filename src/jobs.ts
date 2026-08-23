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
 * Look up the optional background-job registry.
 * @param ctx - the plugin context.
 * @returns the registry surface, or undefined when no job service is mounted.
 */
export function lookupJobs(ctx: Context): JobsLike | undefined {
  return ctx.get('jobs') as unknown as JobsLike | undefined
}
