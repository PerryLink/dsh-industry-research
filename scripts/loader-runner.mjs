// scripts/loader-runner.mjs — real Loader composition runner. An independent
// process boots a real Context, mounts the vendored Loader with the Include
// builtin, reads the given cordis.yml (service rows + the plugin row +
// config), then asserts the plugin's contributions through the authoritative
// registries and executes real behaviors: one industry_map write against a
// temp workspace and one industry_track loud failure without ctx.web.
//
// Usage: node scripts/loader-runner.mjs <cordis.yml>
// Exit 0 prints DSH_LOADER_RESULT <json>; any assertion or load failure exits
// non-zero with the reason on stderr (used by the invalid-config and
// default-export regression cases).

import { Context } from '@deepseek-ai/cordis'
import Include from '@deepseek-ai/cordis-plugin-include'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import { SessionId } from '@deepseek-ai/dsh-session'
import { createRequire } from 'node:module'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Dual-ruler call-id: host master renamed the dsh-llm `CallId` brand to
// `ToolCallId` (0.1.2-alpha.2), while the 0.1.1-rc.2 line still exports
// `CallId`. The brand is opaque at runtime, so a local identity keeps this
// plain-Node runner green on both published lines without naming either
// export (the typed test harness mirrors this via ToolExecution['callId']).
const CallId = id => id

const configArgument = process.argv[2]
if (configArgument === undefined) {
  console.error('usage: loader-runner.mjs <cordis.yml>')
  process.exit(2)
}

const configPath = resolve(configArgument)
// Resolve bare package rows from this repository's dependency tree so the
// composition works with config files written anywhere (e.g. a temp dir).
const configRequire = createRequire(resolve(import.meta.dirname, '../package.json'))

const workspace = mkdtempSync(join(tmpdir(), 'dsh-industry-research-loader-'))
const ctx = new Context()
try {
  ctx.baseUrl = `${pathToFileURL(dirname(configPath)).href}/`
  await ctx.plugin(Loader)
  ctx.loader.internal = /** @type {any} */ ({
    version: 'v2',
    async import(specifier) {
      if (specifier.startsWith('file:')) return import(specifier)
      if (specifier.startsWith('node:')) return import(specifier)
      const absolute = /^([a-zA-Z]:)?[\\/]/u.test(specifier)
      return import(pathToFileURL(absolute ? specifier : configRequire.resolve(specifier)).href)
    },
  })
  ctx.loader.builtins.include = Include
  await ctx.loader.create({
    name: 'cordis:include',
    config: { path: pathToFileURL(configPath).href },
  })
  await ctx.loader.await()

  // Authoritative registries carry the plugin's contributions.
  const schemas = ctx.tools.schemas()
  const names = schemas.map(schema => schema.name)
  for (const tool of ['industry_map', 'industry_track', 'company_scan', 'industry_report']) {
    if (!names.includes(tool)) {
      throw new Error(`Loader composition: ${tool} tool is missing from the tools registry`)
    }
  }
  const skills = await ctx.skills.list()
  const skillNames = skills.map(skill => skill.name)
  for (const skill of ['industry-research-method', 'company-research-method']) {
    if (!skillNames.includes(skill)) {
      throw new Error(`Loader composition: ${skill} skill is missing from the skills registry`)
    }
  }

  const session = ctx.sessions.create(SessionId('dsh-industry-research-loader-runner'), { meta: { cwd: workspace } })
  const agent = /** @type {any} */ ({
    id: session.id,
    options: { provider: 'deepseek', model: 'demo-model' },
    session,
    inbox: {},
    status: 'idle',
    ctx,
    cancel: () => undefined,
    whenIdle: async () => undefined,
    runMaintenance: async (task) => task(new AbortController().signal),
    send: () => undefined,
    followup: () => undefined,
    steer: () => undefined,
    inject: () => undefined,
  })

  // Real behavior 1: industry_map writes a validated chain into the workspace.
  const mapped = await ctx.tools.execute({
    callId: CallId('call-map'),
    name: 'industry_map',
    arguments: {
      industry: 'demo',
      chain: {
        industry: 'demo',
        nodes: [
          { id: 'up', name: '上游', tier: 'upstream', metrics: [] },
          { id: 'down', name: '下游', tier: 'downstream', metrics: [{ key: '缺口项' }] },
        ],
        edges: [{ from: 'up', to: 'down' }],
      },
    },
    agent,
    signal: new AbortController().signal,
  })
  if (mapped.isError) throw new Error(`industry_map failed: ${mapped.error?.message ?? 'unknown'}`)
  const mapValue = /** @type {any} */ (mapped.value)
  if (mapValue?.updated !== true || !Array.isArray(mapValue?.gaps)) {
    throw new Error(`industry_map returned an unexpected value: ${JSON.stringify(mapValue)}`)
  }

  // Real behavior 2: industry_track without ctx.web fails loud with guidance.
  const tracked = await ctx.tools.execute({
    callId: CallId('call-track'),
    name: 'industry_track',
    arguments: { industry: 'demo' },
    agent,
    signal: new AbortController().signal,
  })
  if (!tracked.isError || !String(tracked.error?.message ?? '').includes('ctx.web')) {
    throw new Error(`industry_track without ctx.web must fail loud naming ctx.web, got: ${JSON.stringify(tracked.error)}`)
  }

  const summary = {
    tools: names,
    skills: skillNames,
    mapGaps: mapValue.gaps.length,
  }
  process.stdout.write(`DSH_LOADER_RESULT ${JSON.stringify(summary)}\n`)
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
} finally {
  await ctx.fiber.dispose()
  // Only the runner-owned mkdtemp prefix is ever removed here.
  if (workspace.startsWith(join(tmpdir(), 'dsh-industry-research-loader-'))) {
    rmSync(workspace, { recursive: true, force: true })
  }
}
