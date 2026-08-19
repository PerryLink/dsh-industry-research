/**
 * Optional access to the `ctx.web` capability. The service is never injected
 * (a deployment without web providers must still mount this plugin); it is
 * looked up structurally at execution time, and `industry_track` fails loud
 * with mount guidance when the capability or the deployment's `offline` mode
 * says the web is out of reach.
 * @module dsh-industry-research/web
 */

import type { Context } from '@deepseek-ai/cordis'
import type { ResolvedConfig } from './config.ts'

/** One citeable search source (structural mirror of `WebSearchSource`). */
export type WebSource = {
  readonly url: string
  readonly title?: string
  readonly snippet?: string
  readonly publishedAt?: string
}

/** Structural mirror of `WebSearchResult`. */
export interface WebSearchOutcome {
  readonly content?: string
  readonly sources: readonly WebSource[]
  readonly truncated: boolean
}

/** Structural mirror of `WebFetchResult`. */
export interface WebFetchOutcome {
  readonly url: string
  readonly statusCode: number
  readonly body: { readonly kind: string; readonly content: string }
  readonly truncated: boolean
}

/** The structural surface of the optional `ctx.web` service this plugin uses. */
export interface WebLike {
  search(request: { query: string; maxResults?: number }, signal?: AbortSignal): Promise<WebSearchOutcome>
  fetch(request: { url: string }, signal?: AbortSignal): Promise<WebFetchOutcome>
}

/**
 * Look up the optional web capability.
 * @param ctx - the plugin context.
 * @returns the web service surface, or undefined when no web seam is mounted.
 */
export function lookupWeb(ctx: Context): WebLike | undefined {
  return ctx.get('web') as unknown as WebLike | undefined
}

/**
 * Resolve the web capability or throw the actionable reason it cannot run:
 * `offline: true` (deployment choice) or no mounted web seam (mount guidance
 * naming the missing pieces). Used by tools whose work is impossible offline.
 * @param ctx - the plugin context.
 * @param config - the resolved plugin config.
 * @param tool - the calling tool name (for the error message).
 * @returns the web service surface.
 */
export function requireWeb(ctx: Context, config: ResolvedConfig, tool: string): WebLike {
  if (config.offline) {
    throw new Error(`${tool} cannot run while config.offline is true — public-source tracking requires the web; set offline: false or work from local artifacts only`)
  }
  const web = lookupWeb(ctx)
  if (web === undefined) {
    throw new Error(`${tool} requires the ctx.web capability, which is not mounted in this profile — mount @deepseek-ai/dsh-web plus a search provider (e.g. @deepseek-ai/dsh-web-search-deepseek) and a fetch provider (e.g. @deepseek-ai/dsh-web-fetch-http); the official dsh-base bundle already composes them`)
  }
  return web
}

/**
 * Combine the tool's caller signal with the configured per-request timeout.
 * @param signal - the tool execution signal (`exec.signal`).
 * @param timeoutMs - per-request timeout in milliseconds.
 * @returns a signal that fires on either cancellation or timeout.
 */
export function requestSignal(signal: AbortSignal, timeoutMs: number): AbortSignal {
  return AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
}

/**
 * Render a thrown web failure with its machine-routable code when one exists
 * (`WebError` carries a stable `code`; plain errors degrade to the message).
 * @param error - the thrown value.
 * @returns a single-line diagnostic.
 */
export function webErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code
    if (typeof code === 'string' && code.length > 0) return `${code}: ${error.message}`
    return error.message
  }
  return String(error)
}
