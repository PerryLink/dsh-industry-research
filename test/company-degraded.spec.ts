/**
 * `company_scan` capability-degradation contract.
 *
 * `parallel: true` is a *request*. The background-job registry is an optional
 * capability (`ctx.jobs` is looked up, never injected), so a deployment without
 * it still runs the batch — sequentially. Before this contract existed the
 * downgrade was invisible: the caller only saw `mode: 'sequential'` and could
 * not tell "I asked for parallel and got it downgraded" from "I never asked".
 *
 * These tests pin the states apart so the marker can never silently regress
 * into `mode`-only inference:
 *   1. not requested             ⇒ no `degraded`
 *   2. requested but unavailable ⇒ `degraded.capability === 'ctx.jobs'`
 *   3. requested and available   ⇒ no `degraded`, real fan-out
 * @module dsh-industry-research/test/company-degraded
 */

import { afterEach, describe, expect, it } from 'vitest'
import type { CompanyScanBatchValue } from '../src/tools/company.ts'
import { callTool, mountBase, mountJobs, mountPlugin, unmountBase, type BaseHarness } from './harness.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/**
 * Mount a base + plugin WITHOUT any jobs registry and register teardown.
 * @param config - plugin config overrides.
 * @returns the mounted base.
 */
async function setupWithoutJobs(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`company-degraded-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/** Both companies must exist in the base fixture set. */
const TWO = [{ name: '样例酒业', web: false }, { name: '样例食品', web: false }]

describe('company_scan degraded marker', () => {
  it('omits degraded when parallel was never requested', async () => {
    const base = await setupWithoutJobs()
    const result = await callTool(base, 'company_scan', { companies: TWO })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.mode).toBe('sequential')
    expect(value.degraded).toBeUndefined()
    expect('degraded' in value).toBe(false)
  })

  it('reports the ctx.jobs downgrade when parallel is requested without a jobs service', async () => {
    const base = await setupWithoutJobs()
    const result = await callTool(base, 'company_scan', { companies: TWO, parallel: true })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.mode).toBe('sequential')
    expect(value.degraded).toBeDefined()
    expect(value.degraded?.capability).toBe('ctx.jobs')
    expect(value.degraded?.reason).toContain('ctx.jobs')
    // The downgrade must not change what the batch actually did.
    expect(value.results).toHaveLength(2)
    expect(value.failures).toHaveLength(0)
  })

  it('surfaces the downgrade in the rendered content so the model sees it', async () => {
    const base = await setupWithoutJobs()
    const result = await callTool(base, 'company_scan', { companies: [TWO[0]!], parallel: true })
    const text = result.content.map(block => ('text' in block ? block.text : '')).join('\n')
    expect(text).toContain('能力降级')
    expect(text).toContain('ctx.jobs')
  })

  it('omits degraded when parallel is requested and the jobs service is mounted', async () => {
    const base = await setupWithoutJobs()
    const jobs = await mountJobs(base)
    const result = await callTool(base, 'company_scan', { companies: TWO, parallel: true })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.mode).toBe('parallel')
    expect(value.degraded).toBeUndefined()
    expect('degraded' in value).toBe(false)
    expect(jobs.started).toHaveLength(2)
  })
})
