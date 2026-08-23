/**
 * The tool triple interface (U2): every registered tool's schema (declared
 * `output.schema`), canonical value (`execute` → `result.value`), and content
 * blocks (`render` → `result.content`) are asserted together through the real
 * registry, so a tool whose schema, canonical value, or render projection
 * drifts cannot pass silently.
 * @module dsh-industry-research/test/tools.spec
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { callTool, mountBase, mountPlugin, mountWeb, stubFetch, stubSearch, unmountBase, type BaseHarness } from './harness.ts'
import type { ChainMap } from '../src/chain.ts'
import type { IndustryMapValue } from '../src/tools/map.ts'
import type { CompanyScanValue } from '../src/tools/company.ts'
import type { IndustryReportValue } from '../src/tools/report.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`tools-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/** Assert the shared object-schema skeleton plus the required top-level fields. */
function expectObjectSchema(schema: unknown, requiredFields: readonly string[]): void {
  const object = schema as {
    type?: string
    additionalProperties?: unknown
    required?: readonly string[]
    properties?: Record<string, unknown>
  }
  expect(object.type).toBe('object')
  expect(object.additionalProperties).toBe(false)
  expect(object.properties).toBeTypeOf('object')
  expect(object.required, 'output.schema must declare a required array').toBeInstanceOf(Array)
  for (const field of requiredFields) {
    expect(object.required, `output.schema required must include ${field}`).toContain(field)
    expect(object.properties?.[field], `output.schema must declare ${field}`).toBeDefined()
  }
}

/** Assert the model-facing content is a non-empty text projection. */
function expectTextBlocks(content: readonly unknown[], marker: RegExp): void {
  expect(content.length).toBeGreaterThan(0)
  expect(content.every(block => (block as { type: string }).type === 'text')).toBe(true)
  const text = content.map(block => (block as { text: string }).text).join('\n')
  expect(text).toMatch(marker)
}

describe('industry_map triple interface', () => {
  const REQUIRED = ['industry', 'dir', 'chainPath', 'updated', 'chain', 'gaps', 'sources', 'seedRefs', 'webDigest', 'webNote']

  it('asserts schema, canonical value, and content blocks together', async () => {
    const base = await setup()
    expectObjectSchema(base.ctx.tools.get('industry_map')?.output.schema, REQUIRED)

    const chain: ChainMap = {
      industry: '示例',
      nodes: [
        { id: 'up', name: '上游原料', tier: 'upstream', metrics: [{ key: '价格', value: 10, unit: '元', asOf: '2026-01-01', sourceRef: 'S1' }] },
        { id: 'down', name: '下游渠道', tier: 'downstream', metrics: [{ key: '占比' }] },
      ],
      edges: [{ from: 'up', to: 'down' }],
    }
    const result = await callTool(base, 'industry_map', { industry: '示例', chain, web: false })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryMapValue
    expect(value.updated).toBe(true)
    expect(value.chain?.nodes).toHaveLength(2)
    expect(value.gaps.some(gap => gap.includes('占比'))).toBe(true)
    expectTextBlocks(result.content, /产业链图/u)
  })
})

describe('industry_track triple interface', () => {
  const REQUIRED = ['industry', 'path', 'added', 'duplicates', 'blocked', 'tooOld', 'fetchFailed', 'total', 'truncated', 'corruptSkipped']

  it('asserts schema, canonical value, and content blocks together', async () => {
    const base = await setup()
    await mountWeb(base, stubSearch([{ url: 'https://gov.test/policy-1', title: '产业政策一', snippet: '摘要', publishedAt: '2026-08-01' }]), stubFetch({ 'https://gov.test/policy-1': '政策一全文' }))
    expectObjectSchema(base.ctx.tools.get('industry_track')?.output.schema, REQUIRED)

    const result = await callTool(base, 'industry_track', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as { added: Array<{ url: string }>; total: number }
    expect(value.added).toHaveLength(1)
    expect(value.total).toBe(1)
    expectTextBlocks(result.content, /政策与动态/u)
  })
})

describe('company_scan triple interface', () => {
  const REQUIRED = ['name', 'slug', 'dir', 'cardPath', 'cardJsonPath', 'card', 'rejected']
  const BATCH_REQUIRED = ['results', 'failures']

  it('asserts schema, canonical value, and content blocks together', async () => {
    const base = await setup()
    await mkdir(join(base.workspace, 'data'), { recursive: true })
    await writeFile(join(base.workspace, 'data', 'excerpt.md'), '2025 年营业收入 120.50 亿元。\n', 'utf8')
    const schema = base.ctx.tools.get('company_scan')?.output.schema as {
      oneOf?: Array<{ type?: string; additionalProperties?: unknown; required?: readonly string[]; properties?: Record<string, unknown> }>
    }
    expect(schema.oneOf).toBeInstanceOf(Array)
    expect(schema.oneOf).toHaveLength(2)
    const single = schema.oneOf?.[0]
    const batch = schema.oneOf?.[1]
    expect(single?.type).toBe('object')
    expect(single?.additionalProperties).toBe(false)
    expect(single?.properties).toBeTypeOf('object')
    expect(single?.required).toBeInstanceOf(Array)
    for (const field of REQUIRED) {
      expect(single?.required).toContain(field)
      expect(single?.properties?.[field]).toBeDefined()
    }
    expect(batch?.required).toBeInstanceOf(Array)
    for (const field of BATCH_REQUIRED) {
      expect(batch?.required).toContain(field)
      expect(batch?.properties?.[field]).toBeDefined()
    }

    const result = await callTool(base, 'company_scan', { name: '样例酒业', dataFiles: ['data/excerpt.md'], web: false })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as CompanyScanValue
    expect(value.card.sources).toHaveLength(1)
    expect(value.card.figureCandidates.some(figure => figure.text.includes('120.50'))).toBe(true)
    expectTextBlocks(result.content, /公司速览卡/u)
  })
})

describe('industry_report triple interface', () => {
  const REQUIRED = ['industry', 'engine', 'reportDir', 'reportPath', 'manifestPath', 'sealHash', 'verdicts', 'claims', 'evidence', 'gaps', 'generatedAt']

  it('asserts schema, canonical value, and content blocks together', async () => {
    const base = await setup()
    const industryDir = join(base.workspace, 'industry-research', '示例')
    await mkdir(industryDir, { recursive: true })
    await writeFile(join(industryDir, 'chain.json'), `${JSON.stringify({
      industry: '示例',
      nodes: [{ id: 'up', name: '上游', tier: 'upstream', metrics: [{ key: '价格', value: 10, unit: '元', asOf: '2026-01-01', sourceRef: 'S1' }] }],
      edges: [],
    }, null, 2)}\n`, 'utf8')
    expectObjectSchema(base.ctx.tools.get('industry_report')?.output.schema, REQUIRED)

    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.engine).toBe('builtin-fallback')
    expect(value.claims).toBeGreaterThan(0)
    expectTextBlocks(result.content, /builtin-fallback/u)
    expectTextBlocks(result.content, /仅供研究，不构成投资建议/u)
  })
})
