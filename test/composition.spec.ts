/**
 * Real Loader composition suite: an independent process mounts the Loader
 * over a cordis.yml with the real harness service rows (session /
 * system-prompt / tools / skill) plus the plugin row pointing at the built
 * `lib/index.js`. Asserts the four tools and two skills through the
 * authoritative registries, one real industry_map write, the loud
 * industry_track failure without ctx.web, invalid-config rejection, and the
 * missing-inject default-export rejection.
 * @module dsh-industry-research/test/composition.spec
 */

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runner = join(repositoryRoot, 'scripts', 'loader-runner.mjs')
const builtEntry = join(repositoryRoot, 'lib', 'index.js')

const temporaryRoot = mkdtempSync(join(tmpdir(), 'dsh-ir-loader-'))

/** One cordis.yml: real harness service rows, then the plugin row. */
function configFor(pluginRow: string, configLines: string[] = []): string {
  return [
    "- name: '@deepseek-ai/dsh-session'",
    "- name: '@deepseek-ai/dsh-system-prompt'",
    "- name: '@deepseek-ai/dsh-tools'",
    "- name: '@deepseek-ai/dsh-skill'",
    `- name: ${JSON.stringify(pluginRow)}`,
    ...(configLines.length > 0 ? ['  config:', ...configLines.map(line => `    ${line}`)] : []),
    '',
  ].join('\n')
}

function runRunner(configPath: string): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [runner, configPath], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 120_000,
  })
  if (result.error !== undefined) throw result.error
  return { status: result.status, stdout: result.stdout, stderr: result.stderr }
}

beforeAll(() => {
  // The plugin row points at the built bundle; `shell` resolves `pnpm` (.cmd)
  // on Windows.
  const build = spawnSync('pnpm', ['run', 'build'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: { ...process.env },
    timeout: 120_000,
  })
  if (build.status !== 0) {
    throw new Error(`build failed (${String(build.status)}):\n${build.stdout}\n${build.stderr}`)
  }
}, 120_000)

describe('Loader composition (built entry)', () => {
  it('mounts the plugin: four tools, two skills, and real behaviors', () => {
    const configPath = join(temporaryRoot, 'valid.yml')
    writeFileSync(configPath, configFor(pathToFileURL(builtEntry).href))
    const evidence = runRunner(configPath)
    expect(evidence.status, `stdout:\n${evidence.stdout}\nstderr:\n${evidence.stderr}`).toBe(0)
    const marker = evidence.stdout.match(/DSH_LOADER_RESULT (.+)$/mu)
    expect(marker).not.toBeNull()
    const summary = JSON.parse(marker![1]!) as { tools: string[]; skills: string[]; mapGaps: number }
    for (const tool of ['industry_map', 'industry_track', 'company_scan', 'industry_report']) {
      expect(summary.tools).toContain(tool)
    }
    expect(summary.skills).toContain('industry-research-method')
    expect(summary.skills).toContain('company-research-method')
    expect(summary.mapGaps).toBeGreaterThan(0)
  })

  it('rejects invalid config through the Loader for the expected reason', () => {
    const entryUrl = pathToFileURL(builtEntry).href
    const cases = [
      { lines: ["enabled: 'yes'"], reason: /expected boolean|enabled/u },
      { lines: ['fetchTimeoutMs: 0'], reason: /fetchTimeoutMs|positive/u },
      { lines: ['timelineMaxEntries: -3'], reason: /timelineMaxEntries|positive/u },
      { lines: ['track:', '  maxResultsPerTopic: 0'], reason: /maxResultsPerTopic|positive/u },
      { lines: ['scan:', '  maxFileBytes: 0'], reason: /maxFileBytes|positive/u },
      { lines: ['scan:', '  maxFigureCandidates: -1'], reason: /maxFigureCandidates|positive/u },
      { lines: ['scan:', "  strictTicker: 'yes'"], reason: /strictTicker|boolean/u },
    ]
    for (const entry of cases) {
      const configPath = join(temporaryRoot, 'invalid.yml')
      writeFileSync(configPath, configFor(entryUrl, entry.lines))
      const evidence = runRunner(configPath)
      expect(evidence.status, `invalid config unexpectedly mounted:\n${entry.lines.join('\n')}`).not.toBe(0)
      expect(evidence.stderr, `failed for the wrong reason:\n${evidence.stderr}`).toMatch(entry.reason)
      // The two reports are mutually exclusive: the runner rethrows the failed
      // row's own error before it ever consults the tools registry, so stderr
      // carrying only the registry symptom would mean the reason was lost
      // again. This pins the causal chain instead of weakening it — see the
      // loader-await contract note at the end of this file.
      expect(evidence.stderr, `the registry symptom replaced the real reason:\n${evidence.stderr}`)
        .not.toMatch(/industry_map tool is missing from the tools registry/u)
    }
  })

  it('rejects a default export through the Loader with the missing-inject reason', () => {
    const wrapper = join(temporaryRoot, 'default-export.mjs')
    const builtUrl = pathToFileURL(builtEntry).href
    writeFileSync(wrapper, [
      `export { name, inject, Config, apply } from ${JSON.stringify(builtUrl)}`,
      `export { apply as default } from ${JSON.stringify(builtUrl)}`,
      '',
    ].join('\n'))
    const configPath = join(temporaryRoot, 'invalid-default.yml')
    writeFileSync(configPath, configFor(pathToFileURL(wrapper).href))
    const evidence = runRunner(configPath)
    expect(evidence.status).not.toBe(0)
    expect(evidence.stderr, `failed for the wrong reason:\n${evidence.stderr}`).toMatch(/without inject/u)
    // Same causal chain as the invalid-config case: the wrapper's `apply` was
    // never reached, so only the missing-inject reason may be reported.
    expect(evidence.stderr, `the registry symptom replaced the real reason:\n${evidence.stderr}`)
      .not.toMatch(/industry_map tool is missing from the tools registry/u)
  })

  it('exports no default on the real built entry (function-plugin contract)', async () => {
    const mod = await import(pathToFileURL(builtEntry).href)
    expect('default' in mod).toBe(false)
    expect(typeof mod.apply).toBe('function')
    expect(mod.name).toBe('industry-research')
  })
})

// Loader-await contract the negative cases above depend on.
//
// `cordis-plugin-loader` 1.0.6 dropped the failure surface `loader.await()`
// had in 1.0.4: 1.0.4 collected each `entry._await()` outcome and rejected with
// the single failure (or an AggregateError), while 1.0.6 only polls
// `entry._initTask || entry.fiber?.inertia`. `Entry._reload()` resolves
// `fiber.inertia` in the same turn it swallows the throw into `fiber._error`,
// so a row whose `apply` threw leaves nothing pending and `await()` resolves
// cleanly. The reason then survives in exactly two places: the row's
// error-level log record, and `Fiber.await()`, which rethrows the stored error.
// `scripts/loader-runner.mjs` therefore re-awaits every FAILED row, so these
// negatives fail on the real cause (the schema issue, or the missing inject)
// instead of only on the downstream symptom. The two reports are mutually
// exclusive: the rethrow happens before the registry check, so stderr can never
// carry both. With that rethrow disabled (`DSH_LOADER_RUNNER_NO_RETHROW=1`) the
// paired "tool is missing" negative assertions are what keep the suite from
// silently accepting a symptom-only report.

afterAll(() => {
  rmSync(temporaryRoot, { recursive: true, force: true })
})
