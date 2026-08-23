/**
 * The plugin assembly over the real host seams: the four tools and the two
 * packaged skills are registered, and `enabled: false` mounts nothing.
 * @module dsh-industry-research/test/index.spec
 */

import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountPlugin, unmountBase, type BaseHarness } from './harness.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`index-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

describe('apply', () => {
  it('registers the four research tools', async () => {
    const base = await setup()
    for (const tool of ['industry_map', 'industry_track', 'company_scan', 'industry_report']) {
      expect(base.ctx.tools.get(tool), `${tool} should be registered`).toBeDefined()
    }
  })

  it('publishes the two packaged methodology skills', async () => {
    const base = await setup()
    const skills = await base.ctx.skills.list()
    const names = skills.map(skill => skill.name)
    expect(names).toContain('industry-research-method')
    expect(names).toContain('company-research-method')
    const loaded = await base.ctx.skills.get('industry-research-method')
    expect(loaded?.content).toContain('产业链')
    expect(loaded?.content).toContain('不构成投资建议')
  })

  it('stays inert when disabled', async () => {
    const base = await setup({ enabled: false })
    expect(base.ctx.tools.get('industry_map')).toBeUndefined()
    const skills = await base.ctx.skills.list()
    expect(skills.map(skill => skill.name)).not.toContain('industry-research-method')
  })

  it('fails loud when an explicit skillsDir holds no bundles', async () => {
    const base = await mountBase('index-badskills')
    cleanups.push(async () => { await unmountBase(base) })
    await expect(mountPlugin(base, { skillsDir: base.workspace })).rejects.toThrow(/skillsDir/u)
  })

  it('removes every contribution when the fiber is disposed (HMR-safe)', async () => {
    const base = await mountBase('index-dispose')
    const fiber = await mountPlugin(base)
    for (const tool of ['industry_map', 'industry_track', 'company_scan', 'industry_report']) {
      expect(base.ctx.tools.get(tool), `${tool} should be registered before dispose`).toBeDefined()
    }
    expect((await base.ctx.skills.list()).map(skill => skill.name)).toContain('industry-research-method')

    await fiber.dispose()

    for (const tool of ['industry_map', 'industry_track', 'company_scan', 'industry_report']) {
      expect(base.ctx.tools.get(tool), `${tool} should be gone after dispose`).toBeUndefined()
    }
    expect((await base.ctx.skills.list()).map(skill => skill.name)).not.toContain('industry-research-method')
    await unmountBase(base)
  })
})
