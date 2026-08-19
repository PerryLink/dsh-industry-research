/**
 * Bundle manifest consistency: every row the cordis.patch.yml names is
 * declared in package.json, and the patch mounts exactly this plugin (base
 * services come from the profile's base bundle).
 * @module dsh-industry-research/test/manifest.spec
 */

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  name: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  dsh?: { bundle?: { patch?: string } }
}
const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8')

/**
 * Row `name:` keys sit at the six-space indent directly under each `- id:`
 * list item of the bundle patch (config keys under `config:` nest deeper).
 */
function rowNames(patchText: string): string[] {
  const names: string[] = []
  for (const line of patchText.split('\n')) {
    const match = /^ {6}name:\s*(?:'([^']+)'|"([^"]+)"|(\S+))\s*$/.exec(line)
    if (match) names.push(match[1] ?? match[2] ?? match[3] ?? '')
  }
  return names
}

describe('cordis.patch.yml manifest consistency', () => {
  it('declares the dsh.bundle patch in package.json', () => {
    expect(pkg.dsh?.bundle?.patch).toBe('./cordis.patch.yml')
  })

  it('every external row name is declared in dependencies or peerDependencies', () => {
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ])
    for (const name of rowNames(patch)) {
      const own = name === pkg.name || name.startsWith(`${pkg.name}/`)
      expect(own || declared.has(name), `patch row "${name}" must be declared`).toBe(true)
    }
  })

  it('mounts this plugin and does not duplicate base-bundle services', () => {
    const names = rowNames(patch)
    expect(names).toContain('dsh-industry-research')
    for (const base of ['@deepseek-ai/dsh-tools', '@deepseek-ai/dsh-skill', '@deepseek-ai/dsh-skill-filesystem']) {
      expect(names, `patch must not re-mount ${base} (provided by dsh-base)`).not.toContain(base)
    }
  })
})
