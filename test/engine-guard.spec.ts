/**
 * The `ctx.researchReport` lookup guard.
 *
 * `ctx.get('researchReport')` is untyped, so whatever is mounted under that
 * name is an unverified claim. This used to be bridged with
 * `as unknown as ResearchReportLike` — an assertion, not a check: a service
 * mounted without `assemble` was accepted at lookup time and only blew up
 * inside the call path, where the failure is far harder to attribute.
 *
 * These tests pin the two halves of that contract:
 *   - the guard rejects a mounted-but-wrong service, so `industry_report`
 *     takes its honest builtin-fallback path instead of calling into nothing;
 *   - the guard accepts a well-formed engine (the positive control, so the
 *     rejection above cannot pass vacuously).
 * @module dsh-industry-research/test/engine-guard
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { lookupEngine } from '../src/engine-bridge.ts'
import type { IndustryReportValue } from '../src/tools/report.ts'
import { callTool, mountBase, mountEngine, mountPlugin, unmountBase, type BaseHarness } from './harness.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`engine-guard-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/**
 * Provide a value under `researchReport` that is deliberately the WRONG shape:
 * it is mounted (so `ctx.get` returns it) but exposes no `assemble` method.
 * @param base - the mounted base.
 * @param value - the malformed service value to mount.
 */
function provideMalformedEngine(base: BaseHarness, value: unknown): void {
  base.ctx.reflect.provide('researchReport', value)
}

/** Seed the minimum artifacts `industry_report` needs to build a draft. */
async function seedIndustry(base: BaseHarness): Promise<void> {
  const industryDir = join(base.workspace, 'industry-research', '示例')
  await mkdir(industryDir, { recursive: true })
  await writeFile(join(industryDir, 'chain.json'), `${JSON.stringify({
    industry: '示例',
    nodes: [
      { id: 'up', name: '上游原料', tier: 'upstream', metrics: [{ key: '价格', value: 10, unit: '元', asOf: '2026-01-01', sourceRef: 'S1' }] },
      { id: 'down', name: '下游渠道', tier: 'downstream', metrics: [{ key: '占比' }] },
    ],
    edges: [{ from: 'up', to: 'down' }],
  }, null, 2)}\n`, 'utf8')
}

describe('lookupEngine guard', () => {
  it('rejects non-object candidates', async () => {
    // Cordis forbids registering the same service name twice, so each
    // candidate gets its own mounted base.
    for (const candidate of [undefined, null, 'researchReport', 42, true, []]) {
      const base = await setup()
      provideMalformedEngine(base, candidate)
      expect(lookupEngine(base.ctx), `candidate: ${String(candidate)}`).toBeUndefined()
    }
  })

  it('rejects an object that has no callable assemble', async () => {
    const base = await setup()
    provideMalformedEngine(base, { assemble: 'not-a-function' })
    expect(lookupEngine(base.ctx)).toBeUndefined()
  })

  it('accepts a well-formed engine (positive control)', async () => {
    const base = await setup()
    await mountEngine(base, () => Promise.resolve({
      reportDir: join(base.workspace, 'sealed'),
      sealHash: 'ab'.repeat(32),
      verdicts: [],
    }))
    const engine = lookupEngine(base.ctx)
    expect(engine).toBeDefined()
    expect(typeof engine?.assemble).toBe('function')
  })
})

describe('industry_report falls back when the mounted engine is the wrong shape', () => {
  it('does not call into a malformed service and reports the builtin engine', async () => {
    const base = await setup()
    await seedIndustry(base)
    // Mounted but unusable: without the guard this would be cast and called.
    provideMalformedEngine(base, { notAnEngine: true })
    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.engine).toBe('builtin-fallback')
    expect(value.reportPath).not.toBeNull()
    expect(value.sealHash).toBeNull()
    expect(value.verdicts).toBeNull()
  })
})
