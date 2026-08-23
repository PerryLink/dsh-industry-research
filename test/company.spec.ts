/**
 * The `company_scan` tool: workspace data-file scanning with hashes, outlines
 * and figure candidates, honest rejection of unreadable/unsupported files,
 * path-escape refusal, offline web gaps, and the persisted card.
 * @module dsh-industry-research/test/company.spec
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountJobs, mountPlugin, mountWeb, callTool, stubSearch, unmountBase, type BaseHarness } from './harness.ts'
import type { CompanyCard } from '../src/company.ts'
import type { CompanyScanBatchValue, CompanyScanValue } from '../src/tools/company.ts'

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

  it('persists status, ticker, and sourced metrics with the assertion lines', async () => {
    const base = await setup()
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    const result = await callTool(base, 'company_scan', {
      name: '样例酒业',
      dataFiles: ['data/excerpt.md'],
      web: false,
      status: 'public',
      statusAsOf: '2026-08-23',
      ticker: '600519',
      metrics: [{ key: '股价', value: 120.5, unit: '元', asOf: '2026-08-23', source: 'S1' }],
    })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.status).toBe('public')
    expect(value.card.statusAsOf).toBe('2026-08-23')
    expect(value.card.ticker).toBe('600519')
    expect(value.card.metrics).toHaveLength(1)
    const markdown = await readFile(value.cardPath, 'utf8')
    expect(markdown).toContain('上市状态：public')
    expect(markdown).toContain('代码/ticker：600519')
    expect(markdown).toContain('价格与数值数据点')
  })

  it('fails loud when a status is declared without a statusAsOf', async () => {
    const base = await setup()
    const result = await callTool(base, 'company_scan', { name: '样例酒业', web: false, status: 'IPO' })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('statusAsOf')
  })

  it('fails loud when a metric value lacks a source and when a ticker has a bad format', async () => {
    const base = await setup()
    const noSource = await callTool(base, 'company_scan', {
      name: '样例酒业', web: false,
      metrics: [{ key: '股价', value: 120.5, asOf: '2026-08-23', source: ' ' }],
    })
    expect(noSource.isError).toBe(true)
    expect(noSource.error?.message).toContain('without a source')
    const badTicker = await callTool(base, 'company_scan', { name: '样例酒业', web: false, ticker: '60051A' })
    expect(badTicker.isError).toBe(true)
    expect(badTicker.error?.message).toContain('ticker')
  })

  it('honors scan.strictTicker: false as a format exemption', async () => {
    const base = await setup({ scan: { strictTicker: false } })
    const result = await callTool(base, 'company_scan', { name: '样例酒业', web: false, ticker: '60051A' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.ticker).toBe('60051A')
  })

  it('isolates one failed company in a batch and produces the rest', async () => {
    const base = await setup()
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    const result = await callTool(base, 'company_scan', {
      companies: [
        { name: '样例酒业', dataFiles: ['data/excerpt.md'], web: false },
        { name: '坏公司', web: false, status: 'IPO' },
        { name: '样例食品', dataFiles: ['data/excerpt.md'], web: false },
      ],
    })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.results).toHaveLength(2)
    expect(value.results.map(item => item.name)).toEqual(['样例酒业', '样例食品'])
    expect(value.failures).toHaveLength(1)
    expect(value.failures[0]?.name).toBe('坏公司')
    expect(value.failures[0]?.reason).toContain('statusAsOf')
  })

  it('isolates a path escape in a batch without aborting good companies', async () => {
    const base = await setup()
    const result = await callTool(base, 'company_scan', {
      companies: [
        { name: '逃逸公司', dataFiles: ['../outside.md'], web: false },
        { name: '正常公司', web: false },
      ],
    })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.results).toHaveLength(1)
    expect(value.results[0]?.name).toBe('正常公司')
    expect(value.failures).toHaveLength(1)
    expect(value.failures[0]?.reason).toContain('escapes')
  })

  it('rejects providing both name and companies', async () => {
    const base = await setup()
    const result = await callTool(base, 'company_scan', { name: 'A', companies: [{ name: 'B' }], web: false })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('not both')
  })

  it('falls back to sequential when parallel is requested without a jobs service', async () => {
    const base = await setup()
    const result = await callTool(base, 'company_scan', { companies: [{ name: '样例酒业', web: false }, { name: '样例食品', web: false }], parallel: true })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.mode).toBe('sequential')
    expect(value.results).toHaveLength(2)
  })

  it('fans out per company into jobs when parallel and jobs are present', async () => {
    const base = await setup()
    const jobs = await mountJobs(base)
    await seedFile(base, 'data/excerpt.md', EXCERPT)
    const result = await callTool(base, 'company_scan', {
      companies: [
        { name: '样例酒业', dataFiles: ['data/excerpt.md'], web: false },
        { name: '坏公司', web: false, status: 'IPO' },
        { name: '样例食品', web: false },
      ],
      parallel: true,
    })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanBatchValue
    expect(value.mode).toBe('parallel')
    expect(jobs.started).toHaveLength(3)
    expect(value.results).toHaveLength(2)
    expect(value.failures).toHaveLength(1)
    expect(value.failures[0]?.name).toBe('坏公司')
  })
})
