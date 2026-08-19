/**
 * The `company_scan` tool: workspace data-file scanning with hashes, outlines
 * and figure candidates, honest rejection of unreadable/unsupported files,
 * path-escape refusal, offline web gaps, and the persisted card.
 * @module dsh-industry-research/test/company.spec
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountPlugin, mountWeb, callTool, stubSearch, unmountBase, type BaseHarness } from './harness.ts'
import type { CompanyCard } from '../src/company.ts'
import type { CompanyScanValue } from '../src/tools/company.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`company-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/** Write a data file into the harness workspace. */
async function seedFile(base: BaseHarness, rel: string, content: string): Promise<void> {
  const absolute = join(base.workspace, rel)
  await mkdir(join(absolute, '..'), { recursive: true })
  await writeFile(absolute, content, 'utf8')
}

const EXCERPT = [
  '# 样例公司材料',
  '',
  '## 业务',
  '主营白酒生产与销售。',
  '## 财务',
  '2025 年营业收入 120.50 亿元，同比增长 8.30%（截至 2025-12-31）。',
  '2025 年末经销商 2,300 家。',
  '',
].join('\n')

describe('company_scan', () => {
  it('scans data files into a card with hashes, outline, and figure candidates', async () => {
    const base = await setup()
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['data/excerpt.md'], web: false })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanValue
    const card = value.card
    expect(card.sources).toHaveLength(1)
    expect(card.sources[0]?.sha256).toMatch(/^[0-9a-f]{64}$/u)
    expect(card.outline[0]?.headings).toContain('财务')
    expect(card.figureCandidates.some(figure => figure.text.includes('120.50') && figure.line > 0)).toBe(true)
    expect(card.disclaimer).toContain('仅供研究，不构成投资建议')
    const persisted = JSON.parse(await readFile(join(base.workspace, 'industry-research', 'companies', '样例酒业', 'card.json'), 'utf8')) as CompanyCard
    expect(persisted.name).toBe('样例酒业')
    const markdown = await readFile(join(base.workspace, 'industry-research', 'companies', '样例酒业', 'card.md'), 'utf8')
    expect(markdown).toContain('来源清单')
    expect(markdown).toContain('SHA-256')
  })

  it('rejects unsupported extensions and missing files with reasons, without dropping good files', async () => {
    const base = await setup()
    await seedFile(base, 'data/good.md', EXCERPT)
    await seedFile(base, 'data/report.pdf', '%PDF-1.4 fake')
    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['data/good.md', 'data/report.pdf', 'data/missing.md'], web: false })
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.sources).toHaveLength(1)
    expect(value.rejected).toHaveLength(2)
    expect(value.rejected.find(entry => entry.path === 'data/report.pdf')?.reason).toContain('unsupported')
    expect(value.rejected.find(entry => entry.path === 'data/missing.md')).toBeDefined()
  })

  it('fails loud on a path escaping the workspace', async () => {
    const base = await setup()
    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['../outside.md'], web: false })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('escapes')
  })

  it('declares gaps honestly: no files, offline web, web unavailable', async () => {
    const base = await setup({ offline: true })
    const result = await callTool(base, 'company_scan', { name: '样例酒业' })
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.gaps.some(gap => gap.includes('未提供数据文件'))).toBe(true)
    expect(value.card.gaps.some(gap => gap.includes('offline'))).toBe(true)
    expect(value.card.webSources).toBeNull()
  })

  it('attaches web citations when the seam is mounted', async () => {
    const base = await setup()
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    await mountWeb(base, stubSearch([{ url: 'https://a.test/co', title: '公司官网' }]))
    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['data/excerpt.md'] })
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.webSources).toHaveLength(1)
    expect(value.card.webSources?.[0]?.url).toBe('https://a.test/co')
  })

  it('bounds figure candidates by scan.maxFigureCandidates and notes the cut', async () => {
    const base = await setup({ scan: { maxFigureCandidates: 1 } })
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['data/excerpt.md'], web: false })
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.figureCandidates).toHaveLength(1)
    expect(value.card.gaps.some(gap => gap.includes('maxFigureCandidates'))).toBe(true)
  })
})
