// Verify the built artifacts after `pnpm run build`: syntax-check the host
// bundle, import it under plain Node, and assert the shipped files the
// export path needs. Guards against TypeScript-only syntax leaking into
// shipped output and against a tarball missing the bundle patch or the
// packaged skills.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

const required = [
  'lib/index.js',
  'lib/types/index.d.ts',
  'cordis.patch.yml',
  'skills/industry-research-method/SKILL.md',
  'skills/company-research-method/SKILL.md',
]
for (const rel of required) {
  if (!existsSync(path.join(root, rel))) throw new Error(`missing artifact: ${rel}`)
}

// 1. Syntax-check the host bundle (plain Node parse; no execution).
execFileSync(process.execPath, ['--check', path.join(root, 'lib/index.js')], { stdio: 'inherit' })

// 2. The ESM host face must import under plain Node (no tsx, no checkout paths).
const index = await import(pathToFileURL(path.join(root, 'lib/index.js')).href)
if (typeof index.apply !== 'function' || index.name !== 'industry-research') {
  throw new Error('lib/index.js exports an unexpected plugin face')
}
if (!Array.isArray(index.inject) || !index.inject.includes('skills') || !index.inject.includes('tools')) {
  throw new Error('lib/index.js does not declare the skills + tools injects')
}

// 3. The bundled config must expose the schema const and the resolve step.
if (typeof index.Config !== 'function' || typeof index.resolveConfig !== 'function') {
  throw new Error('lib/index.js does not re-export Config and resolveConfig')
}

console.log('artifacts OK: syntax + ESM import + plugin face + bundle patch + skills present')
