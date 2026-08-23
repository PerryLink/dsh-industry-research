#!/usr/bin/env node
// Skills manifest gate: every packaged skill must expose a SKILL.md with
// YAML frontmatter carrying a `name` (matching its directory) and a
// non-empty `description`, and every `references/<file>.md` the body cites
// must exist on disk. Catches a skill that would mount with a blank name or
// a dangling reference before it ships.
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const skillsRoot = path.join(root, 'skills')

/** Minimal single-line YAML frontmatter reader (name/description only). */
function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/u)
  if (lines[0]?.trim() !== '---') return null
  const end = lines.indexOf('---', 1)
  if (end === -1) return null
  const entries = {}
  for (const line of lines.slice(1, end)) {
    const match = /^(\w+):\s*(.*)$/u.exec(line)
    if (match) entries[match[1]] = match[2].trim().replace(/^['"](.*)['"]$/u, '$1')
  }
  return entries
}

const failures = []
const skillDirs = readdirSync(skillsRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort()

if (skillDirs.length === 0) {
  console.error('skills manifest: no <skill>/ directories under skills/')
  process.exit(1)
}

for (const dirName of skillDirs) {
  const skillDir = path.join(skillsRoot, dirName)
  const skillPath = path.join(skillDir, 'SKILL.md')
  if (!existsSync(skillPath)) {
    failures.push(`${dirName}: missing SKILL.md`)
    continue
  }
  const text = readFileSync(skillPath, 'utf8')
  const frontmatter = parseFrontmatter(text)
  if (frontmatter === null) {
    failures.push(`${dirName}: SKILL.md has no YAML frontmatter`)
    continue
  }
  const name = (frontmatter.name ?? '').trim()
  const description = (frontmatter.description ?? '').trim()
  if (name === '') failures.push(`${dirName}: frontmatter.name is missing`)
  else if (name !== dirName) failures.push(`${dirName}: frontmatter.name is ${JSON.stringify(name)}, expected the directory name`)
  if (description === '') failures.push(`${dirName}: frontmatter.description is missing`)
  for (const match of text.matchAll(/references\/[A-Za-z0-9._-]+\.md/gu)) {
    const target = path.join(skillDir, match[0])
    if (!existsSync(target)) failures.push(`${dirName}: dangling reference ${JSON.stringify(match[0])}`)
  }
}

if (failures.length > 0) {
  console.error('skills manifest failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
console.log(`skills manifest: ${skillDirs.length} skills carry valid frontmatter and resolvable references`)
