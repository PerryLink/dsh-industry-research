/**
 * The optional `ctx.web` degradation surface (U5/U6 + C6): the per-request
 * timeout signal fires on the configured deadline and on caller cancellation,
 * thrown web failures render as single-line machine-routable diagnostics, and
 * `requireWeb` fails closed for offline mode and an unmounted seam.
 * @module dsh-industry-research/test/web.spec
 */

import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, unmountBase, type BaseHarness } from './harness.ts'
import { requestSignal, requireWeb, webErrorMessage } from '../src/web.ts'
import { resolveConfig } from '../src/config.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

async function setup(id = 'web'): Promise<BaseHarness> {
  const base = await mountBase(id)
  cleanups.push(async () => { await unmountBase(base) })
  return base
}

/** Resolve once the signal aborts (or fail after the guard). */
function aborted(signal: AbortSignal, guardMs = 2000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { resolve(); return }
    const timer = setTimeout(() => reject(new Error('signal did not abort in time')), guardMs)
    signal.addEventListener('abort', () => { clearTimeout(timer); resolve() }, { once: true })
  })
}

describe('requestSignal', () => {
  it('aborts on the configured per-request timeout', async () => {
    const signal = requestSignal(new AbortController().signal, 15)
    await aborted(signal)
    expect(signal.aborted).toBe(true)
  })

  it('aborts immediately when the caller signal is already aborted', () => {
    const caller = new AbortController()
    caller.abort()
    expect(requestSignal(caller.signal, 60_000).aborted).toBe(true)
  })
})

describe('webErrorMessage', () => {
  it('surfaces the machine-routable code when present', () => {
    const error = Object.assign(new Error('boom'), { code: 'WEB_FETCH_FAILED' })
    expect(webErrorMessage(error)).toBe('WEB_FETCH_FAILED: boom')
  })

  it('degrades a plain error to its message and a non-error to its string form', () => {
    expect(webErrorMessage(new Error('plain'))).toBe('plain')
    expect(webErrorMessage('a string')).toBe('a string')
  })
})

describe('requireWeb', () => {
  it('fails closed naming offline mode first, then the unmounted seam', async () => {
    const base = await setup()
    expect(() => requireWeb(base.ctx, resolveConfig({ offline: true }), 'industry_track')).toThrow(/offline/u)
    expect(() => requireWeb(base.ctx, resolveConfig({}), 'industry_track')).toThrow(/ctx\.web/u)
    expect(() => requireWeb(base.ctx, resolveConfig({}), 'industry_track')).toThrow(/dsh-web/u)
  })
})
