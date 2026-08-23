/**
 * Shared test harness: REAL Cordis `Context`, REAL `SessionStore`/`Session`
 * with a per-suite temp workspace as the session cwd, the REAL
 * SystemPrompt/ToolRuntime/SkillRegistry from the 0.1.1-rc.2 peers, and the
 * REAL `WebRuntime` seam when a suite mounts web (providers at that pluggable
 * edge are scripted, exactly as the harness's own tool-web tests do). The
 * optional `ctx.researchReport` engine is mounted through the REAL Cordis
 * service mechanism. Nothing here hand-writes a harness service.
 * @module dsh-industry-research/test/harness
 */

import { Context, Service } from '@deepseek-ai/cordis'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import SessionStore, { SessionId, type Session } from '@deepseek-ai/dsh-session'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime, { type ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import WebRuntime from '@deepseek-ai/dsh-web'
import type { WebFetchProvider, WebSearchProvider } from '@deepseek-ai/dsh-web'
import { CallId } from '@deepseek-ai/dsh-llm'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { AssembleReportRequest, AssembleReportResult } from '../src/engine-bridge.ts'

/** Everything a mounted base hands back to a test. */
export interface BaseHarness {
  /** The mounting context (session store + system prompt + tools + skills). */
  readonly ctx: Context
  /** A real session whose header cwd is the temp workspace. */
  readonly session: Session
  /** A minimal real-shaped agent pointing at the session. */
  readonly agent: Agent
  /** The temp workspace root (owned by the caller; removed on teardown). */
  readonly workspace: string
}

const TEMP_PREFIX = 'dsh-industry-research-test-'

/**
 * Mount the real services the plugin injects, plus a real session rooted in a
 * fresh temp workspace and a minimal agent for tool execution.
 * @param sessionId - session id to create (defaults to `ir-harness`).
 * @returns the mounted base.
 */
export async function mountBase(sessionId = 'ir-harness'): Promise<BaseHarness> {
  const ctx = new Context()
  await ctx.plugin(SessionStore)
  const workspace = await mkdtemp(path.join(tmpdir(), TEMP_PREFIX))
  const session = ctx.sessions.create(SessionId(sessionId), { meta: { cwd: workspace } })
  await ctx.plugin(SystemPrompt, { persona: '' })
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(SkillRegistry)
  const agent = {
    session,
    status: 'idle',
    options: {},
    reserveTurnAdmission: () => () => undefined,
  } as unknown as Agent
  return { ctx, session, agent, workspace }
}

/** Remove the temp workspace a base was mounted on (only own mkdtemp dirs). */
export async function unmountBase(base: BaseHarness): Promise<void> {
  const expected = path.join(tmpdir(), TEMP_PREFIX)
  if (!base.workspace.startsWith(expected)) throw new Error(`refusing to remove non-harness dir: ${base.workspace}`)
  await rm(base.workspace, { recursive: true, force: true })
}

/** Mount the plugin under test on a harness context. */
export async function mountPlugin(base: BaseHarness, config: Record<string, unknown> = {}) {
  const plugin = await import('../src/index.ts')
  return base.ctx.plugin(plugin as never, config as never)
}

let callCounter = 0

/** Execute one tool through the real registry pipeline as the harness agent. */
export async function callTool(base: BaseHarness, name: string, args: unknown): Promise<ToolExecutionResult> {
  callCounter += 1
  return base.ctx.tools.execute({
    signal: new AbortController().signal,
    callId: CallId(`ir-call-${callCounter}`),
    name,
    arguments: args,
    agent: base.agent,
  })
}

/**
 * Mount the REAL web seam with scripted providers at its pluggable edge.
 * @param base - the mounted base.
 * @param search - scripted search provider, if any.
 * @param fetchProvider - scripted fetch provider, if any.
 */
export async function mountWeb(base: BaseHarness, search?: WebSearchProvider, fetchProvider?: WebFetchProvider): Promise<void> {
  await base.ctx.plugin(WebRuntime, {})
  if (search !== undefined) base.ctx.web.registerSearchProvider(search)
  if (fetchProvider !== undefined) base.ctx.web.registerFetchProvider(fetchProvider)
}

/**
 * Mount a scripted `ctx.researchReport` engine through the REAL Cordis
 * service mechanism (the optional third-party service boundary under test).
 * @param base - the mounted base.
 * @param assemble - the scripted assemble behavior.
 */
export async function mountEngine(base: BaseHarness, assemble: (request: AssembleReportRequest) => Promise<AssembleReportResult>): Promise<void> {
  class StubEngine extends Service {
    constructor(ctx: Context) {
      super(ctx, 'researchReport')
    }
    assemble(request: AssembleReportRequest): Promise<AssembleReportResult> {
      return assemble(request)
    }
  }
  await base.ctx.plugin(StubEngine)
}

/** A minimal job hooks surface the scripted jobs service hands back. */
export interface StubJobHooks {
  cancel(reason?: string): void
  done: Promise<{ status: string; output?: string }>
}

/** One job the scripted registry started, for assertions. */
export interface StubJobStart {
  kind: string
  label: string
  hooks: StubJobHooks
}

/**
 * Mount a scripted `ctx.jobs` registry through the REAL Cordis service
 * mechanism. `start` invokes the producer's `run()` synchronously (matching the
 * real registry's preflight) and records the started jobs.
 * @param base - the mounted base.
 * @returns the record of started jobs (for awaiting and asserting).
 */
export async function mountJobs(base: BaseHarness): Promise<{ started: StubJobStart[] }> {
  const started: StubJobStart[] = []
  class StubJobs extends Service {
    constructor(ctx: Context) {
      super(ctx, 'jobs')
    }
    start(spec: { kind: string; label: string; owner?: unknown; run(): StubJobHooks }): string {
      const hooks = spec.run()
      started.push({ kind: spec.kind, label: spec.label, hooks })
      return `subagent-${started.length}`
    }
  }
  await base.ctx.plugin(StubJobs)
  return { started }
}

/** A scripted search provider returning fixed sources. */
export function stubSearch(sources: Array<{ url: string; title?: string; snippet?: string; publishedAt?: string }>): WebSearchProvider {
  return {
    id: 'stub-search',
    available: () => true,
    search: () => Promise.resolve({ sources, truncated: false }),
  }
}

/** A scripted fetch provider returning a fixed text body per URL. */
export function stubFetch(bodies: Record<string, string>, failFor?: ReadonlySet<string>): WebFetchProvider {
  return {
    id: 'stub-fetch',
    available: () => true,
    fetch: (request: { url: string }) => {
      if (failFor?.has(request.url) === true) return Promise.reject(new Error('fetch failed by stub'))
      const content = bodies[request.url] ?? `body of ${request.url}`
      return Promise.resolve({ url: request.url, statusCode: 200, body: { kind: 'text' as const, content }, truncated: false })
    },
  }
}
