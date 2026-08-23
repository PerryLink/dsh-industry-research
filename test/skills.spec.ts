/**
 * Skills manifest integrity (P2): the standalone `scripts/check-skills.mjs`
 * gate passes against the packaged skills — both methodology skills carry
 * `name`/`description` frontmatter and their cited `references/*.md` resolve.
 * @module dsh-industry-research/test/skills.spec
 */

import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const script = join(root, 'scripts', 'check-skills.mjs')

describe('skills manifest', () => {
  it('validates frontmatter and references for every packaged skill', () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: root,
      encoding: 'utf8',
      timeout: 30_000,
    })
    expect(result.status, `stdout:\n${result.stdout}\nstderr:\n${result.stderr}`).toBe(0)
    expect(result.stdout).toContain('2 skills carry valid frontmatter')
  })
})
