/**
 * Keyless end-to-end suite (acceptance §9.3): `offline: true` plus the
 * committed 白酒 fixtures. Copies the fixtures into a temp workspace, runs
 * industry_map → company_scan → industry_track (must fail loud offline) →
 * industry_report (builtin-fallback), and asserts the report carries the
 * disclaimer, the gap declarations, and the source-traceability table, with
 * every figure in the report traceable to the fixture files.
 * @module dsh-industry-research/test/e2e-baijiu.spec
 */

import { cp, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountPlugin, callTool, unmountBase, type BaseHarness } from './harness.ts'
import type { ChainMap } from '../src/chain.ts'
import type { IndustryMapValue } from '../src/tools/map.ts'
import type { CompanyScanValue } from '../src/tools/company.ts'
import type { IndustryReportValue } from '../src/tools/report.ts'

const fixturesRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'baijiu')

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount an offline base + plugin with the fixtures copied into its workspace. */
async function setup(): Promise<BaseHarness> {
  const base = await mountBase(`e2e-baijiu-${cleanups.length}`)
  await cp(fixturesRoot, join(base.workspace, 'fixtures'), { recursive: true })
  const fiber = await mountPlugin(base, { offline: true })
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

describe('白酒 end-to-end (offline, fixtures)', () => {
  it('runs map → scan → report with gap declarations and traceable figures', async () => {
    const base = await setup()

    // 1. industry_map: seed file registered, authored chain validated + persisted.
    const chain: ChainMap = {
      industry: '白酒',
      nodes: [
        { id: 'up-grain', name: '高粱/小麦种植', tier: 'upstream', metrics: [{ key: '高粱亩产' }] },
        { id: 'up-pack', name: '包装物料', tier: 'upstream', metrics: [] },
        { id: 'mid-brew', name: '白酒酿造（酱香/浓香/清香）', tier: 'midstream', metrics: [
          { key: '样例酒业 2025 年营业收入', value: 120.5, unit: '亿元', asOf: '2025-12-31', sourceRef: 'S2' },
        ] },
        { id: 'down-dist', name: '经销商/商超/电商/餐饮', tier: 'downstream', metrics: [{ key: '经销渠道占比' }] },
      ],
      edges: [
        { from: 'up-grain', to: 'mid-brew', note: '原料供应' },
        { from: 'up-pack', to: 'mid-brew', note: '包装供应' },
        { from: 'mid-brew', to: 'down-dist', note: '成品分销' },
      ],
    }
    const mapped = await callTool(base, 'industry_map', {
      industry: '白酒',
      seedFiles: ['fixtures/notes/industry-notes.md', 'fixtures/data/sample-distiller-excerpt.md'],
      chain,
    })
    expect(mapped.isError).toBe(false)
    const mapValue = mapped.value as unknown as IndustryMapValue
    expect(mapValue.updated).toBe(true)
    expect(mapValue.sources).toHaveLength(2)
    expect(mapValue.gaps.some(gap => gap.includes('高粱亩产'))).toBe(true)
    expect(mapValue.gaps.some(gap => gap.includes('经销渠道占比'))).toBe(true)

    // 2. company_scan: the excerpt becomes a card with figure candidates.
    const scanned = await callTool(base, 'company_scan', {
      name: '样例酒业',
      dataFiles: ['fixtures/data/sample-distiller-excerpt.md'],
    })
    expect(scanned.isError).toBe(false)
    const scanValue = scanned.value as unknown as CompanyScanValue
    expect(scanValue.card.figureCandidates.some(figure => figure.text.includes('120.50'))).toBe(true)
    expect(scanValue.card.gaps.some(gap => gap.includes('offline'))).toBe(true)

    // 3. industry_track must fail loud in offline mode.
    const tracked = await callTool(base, 'industry_track', { industry: '白酒' })
    expect(tracked.isError).toBe(true)
    expect(tracked.error?.message).toContain('offline')

    // 4. industry_report: builtin-fallback assembly with the source table.
    const reported = await callTool(base, 'industry_report', { industry: '白酒' })
    expect(reported.isError).toBe(false)
    const reportValue = reported.value as unknown as IndustryReportValue
    expect(reportValue.engine).toBe('builtin-fallback')
    const markdown = await readFile(reportValue.reportPath!, 'utf8')
    expect(markdown).toContain('仅供研究，不构成投资建议')
    expect(markdown).toContain('来源回溯表')
    expect(markdown).toContain('缺口与待补')
    expect(markdown).toContain('高粱亩产')
    expect(markdown).toContain('经销渠道占比')

    // Every figure in the report must trace to a fixture: the only sourced
    // value in the chain is 120.5 亿元, which appears verbatim in the excerpt.
    const excerpt = await readFile(join(base.workspace, 'fixtures', 'data', 'sample-distiller-excerpt.md'), 'utf8')
    expect(markdown).toContain('120.5')
    expect(excerpt).toContain('120.50')
    const manifest = JSON.parse(await readFile(reportValue.manifestPath!, 'utf8')) as {
      engine: string
      evidence: Array<{ id: string; origin: string; sha256: string }>
      claims: Array<{ text: string; status: string }>
    }
    expect(manifest.engine).toBe('builtin-fallback')
    expect(manifest.evidence.some(item => item.id === 'E-chain')).toBe(true)
    expect(manifest.evidence.some(item => item.id === 'E-company-样例酒业')).toBe(true)
    const sourcedClaims = manifest.claims.filter(claim => /\d/u.test(claim.text))
    for (const claim of sourcedClaims) {
      expect(claim.text).toContain('120.5')
      expect(claim.status).toBe('unverified')
    }
  })
})
