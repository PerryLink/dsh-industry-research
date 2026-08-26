/**
 * The `industry_report` tool: the builtin-fallback renderer (versioned
 * Markdown + manifest with the source-traceability table), the frozen-contract
 * engine bridge (assemble called with contract-shaped evidence/sections/
 * claims; sealHash + verdicts surfaced), draft validation, and the report
 * event.
 * @module dsh-industry-research/test/report.spec
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { mountBase, mountEngine, mountJobs, mountPlugin, callTool, unmountBase, type BaseHarness } from './harness.ts'
import { autoDraft, validateDeliveryContract } from '../src/report.ts'
import type { LoadedArtifacts, ReportDraft } from '../src/report.ts'
import type { AssembleReportRequest } from '../src/engine-bridge.ts'
import type { IndustryReportValue } from '../src/tools/report.ts'
import type { ReportEventPayload } from '../src/events.ts'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(cleanup => cleanup()))
})

/** Mount a base + plugin and register their teardown. */
async function setup(config: Record<string, unknown> = {}): Promise<BaseHarness> {
  const base = await mountBase(`report-${cleanups.length}`)
  const fiber = await mountPlugin(base, config)
  cleanups.push(async () => { await fiber.dispose(); await unmountBase(base) })
  return base
}

/** Seed one industry with a chain map, a timeline, and one company card. */
async function seedIndustry(base: BaseHarness): Promise<void> {
  const industryDir = join(base.workspace, 'industry-research', '示例')
  await mkdir(industryDir, { recursive: true })
  await writeFile(join(industryDir, 'chain.json'), `${JSON.stringify({
    industry: '示例',
    nodes: [
      { id: 'up', name: '上游原料', tier: 'upstream', metrics: [{ key: '价格', value: 10, unit: '元', asOf: '2026-01-01', sourceRef: 'S1' }] },
      { id: 'down', name: '下游渠道', tier: 'downstream', metrics: [{ key: '占比' }] },
    ],
    edges: [{ from: 'up', to: 'down' }],
  }, null, 2)}\n`, 'utf8')
  await writeFile(join(industryDir, 'timeline.jsonl'), `${JSON.stringify({
    date: '2026-08-01', title: '产业政策一', url: 'https://gov.test/policy-1',
    summary: '摘要', snapshotHash: 'ab'.repeat(32), capturedAt: '2026-08-19T00:00:00.000Z', topics: ['示例 行业 政策'],
  })}\n`, 'utf8')
  const companyDir = join(base.workspace, 'industry-research', 'companies', '样例酒业')
  await mkdir(companyDir, { recursive: true })
  await writeFile(join(companyDir, 'card.json'), `${JSON.stringify({
    name: '样例酒业', slug: '样例酒业', asOf: '2026-08-19T00:00:00.000Z',
    sources: [{ path: '/workspace/data/excerpt.md', sha256: 'cd'.repeat(32), bytes: 100, lines: 10 }],
    outline: [], figureCandidates: [{ path: '/workspace/data/excerpt.md', line: 5, text: '2025 年营业收入 120.50 亿元' }],
    webSources: null, gaps: ['风险点待补'], disclaimer: '仅供研究，不构成投资建议',
  }, null, 2)}\n`, 'utf8')
}

describe('industry_report builtin-fallback path', () => {
  it('assembles a versioned Markdown report with the source table and honest engine label', async () => {
    const base = await setup()
    await seedIndustry(base)
    const events: ReportEventPayload[] = []
    base.ctx.on('industry-research/report', payload => { events.push(payload) })
    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.engine).toBe('builtin-fallback')
    expect(value.reportPath).not.toBeNull()
    expect(value.manifestPath).not.toBeNull()
    expect(value.claims).toBeGreaterThan(0)
    expect(value.evidence).toBe(3)
    const markdown = await readFile(value.reportPath!, 'utf8')
    expect(markdown).toContain('仅供研究，不构成投资建议')
    expect(markdown).toContain('builtin-fallback')
    expect(markdown).toContain('来源回溯表')
    expect(markdown).toContain('unverified')
    expect(markdown).toContain('上游原料 的 价格 为 10元')
    const manifest = JSON.parse(await readFile(value.manifestPath!, 'utf8')) as {
      engine: string
      evidence: Array<{ id: string; sha256: string }>
      claims: Array<{ status: string }>
      gaps: string[]
    }
    expect(manifest.engine).toBe('builtin-fallback')
    expect(manifest.evidence.map(item => item.id).sort()).toEqual(['E-chain', 'E-company-样例酒业', 'E-timeline'])
    expect(manifest.evidence.every(item => /^[0-9a-f]{64}$/u.test(item.sha256))).toBe(true)
    expect(manifest.claims.every(claim => claim.status === 'unverified')).toBe(true)
    expect(manifest.gaps.some(gap => gap.includes('占比'))).toBe(true)
    expect(events).toHaveLength(1)
    expect(events[0]?.engine).toBe('builtin-fallback')
  })

  it('honors the sections filter and reports missing artifacts as gaps', async () => {
    const base = await setup()
    const result = await callTool(base, 'industry_report', { industry: '空白', sections: ['overview', 'gaps'] })
    const value = result.value as unknown as IndustryReportValue
    expect(value.gaps.some(gap => gap.includes('chain.json'))).toBe(true)
    const markdown = await readFile(value.reportPath!, 'utf8')
    expect(markdown).toContain('概览')
    expect(markdown).toContain('缺口与待补')
    expect(markdown).not.toContain('## 产业链结构')
    expect(value.claims).toBe(0)
  })
})

describe('industry_report engine path (frozen contract)', () => {
  it('submits contract-shaped evidence/sections/claims and surfaces seal + verdicts', async () => {
    const base = await setup()
    await seedIndustry(base)
    const seen: AssembleReportRequest[] = []
    await mountEngine(base, request => {
      seen.push(request)
      return Promise.resolve({
        reportDir: join(base.workspace, 'sealed-report'),
        sealHash: 'ef'.repeat(32),
        verdicts: request.claims.map(claim => ({ claimId: claim.id, status: 'verified' as const })),
      })
    })
    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.engine).toBe('research-report')
    expect(value.sealHash).toBe('ef'.repeat(32))
    expect(value.reportDir).toBe(join(base.workspace, 'sealed-report'))
    expect(value.verdicts?.every(verdict => verdict.status === 'verified')).toBe(true)
    expect(value.reportPath).toBeNull()

    expect(seen).toHaveLength(1)
    const request = seen[0]!
    expect(request.topic).toBe('示例')
    expect(typeof request.title).toBe('string')
    expect(request.evidence.map(item => item.id).sort()).toEqual(['E-chain', 'E-company-样例酒业', 'E-timeline'])
    for (const item of request.evidence) {
      expect(typeof item.content).toBe('string')
      expect(item.content.length).toBeGreaterThan(0)
      expect(typeof item.origin).toBe('string')
      expect(typeof item.capturedAt).toBe('string')
    }
    expect(request.sections.length).toBeGreaterThan(0)
    const referenced = new Set(request.claims.map(claim => claim.id))
    for (const section of request.sections) {
      for (const paragraph of section.paragraphs) {
        for (const claimId of paragraph.claimIds ?? []) expect(referenced.has(claimId)).toBe(true)
      }
    }
    for (const claim of request.claims) {
      for (const evidenceId of claim.evidenceIds) {
        expect(request.evidence.some(item => item.id === evidenceId)).toBe(true)
      }
    }
  })
})

describe('industry_report draft handling', () => {
  it('accepts a model-authored draft that references registered evidence', async () => {
    const base = await setup()
    await seedIndustry(base)
    const result = await callTool(base, 'industry_report', {
      industry: '示例',
      draft: {
        title: '定制报告',
        sections: [{ heading: '要点', paragraphs: [{ text: '上游价格见 claim。', claimIds: ['C1'] }] }],
        claims: [{ id: 'C1', text: '上游原料价格为 10 元', evidenceIds: ['E-chain'] }],
      },
    })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.claims).toBe(1)
    const markdown = await readFile(value.reportPath!, 'utf8')
    expect(markdown).toContain('定制报告')
    expect(markdown).toContain('[C1]')
  })

  it('rejects a draft referencing unknown evidence or unregistered claims', async () => {
    const base = await setup()
    await seedIndustry(base)
    const badEvidence = await callTool(base, 'industry_report', {
      industry: '示例',
      draft: {
        sections: [{ heading: 'x', paragraphs: [{ text: 'y', claimIds: ['C1'] }] }],
        claims: [{ id: 'C1', text: 'z', evidenceIds: ['E-ghost'] }],
      },
    })
    expect(badEvidence.isError).toBe(true)
    expect(badEvidence.error?.message).toContain('E-ghost')
    const badClaim = await callTool(base, 'industry_report', {
      industry: '示例',
      draft: {
        sections: [{ heading: 'x', paragraphs: [{ text: 'y', claimIds: ['C9'] }] }],
        claims: [{ id: 'C1', text: 'z', evidenceIds: ['E-chain'] }],
      },
    })
    expect(badClaim.isError).toBe(true)
    expect(badClaim.error?.message).toContain('C9')
  })
})

describe('validateDeliveryContract', () => {
  const evidenceIds = new Set(['E-chain'])

  it('accepts a complete draft over clean artifacts', () => {
    const draft: ReportDraft = { title: 't', sections: [{ heading: 'h', paragraphs: [{ text: 'x' }] }], claims: [{ id: 'C1', text: 'y', evidenceIds: ['E-chain'] }] }
    const artifacts: LoadedArtifacts = { cards: [], gaps: [] }
    expect(validateDeliveryContract(draft, artifacts, evidenceIds)).toEqual([])
  })

  it('flags placeholder residue and empty blocks', () => {
    const draft: ReportDraft = { title: 't', sections: [{ heading: 'h', paragraphs: [{ text: '{{todo}}' }] }], claims: [] }
    const artifacts: LoadedArtifacts = { cards: [], gaps: [] }
    const problems = validateDeliveryContract(draft, artifacts, evidenceIds)
    expect(problems.some(problem => problem.includes('placeholder'))).toBe(true)
    expect(validateDeliveryContract({ title: '', sections: [{ heading: 'h', paragraphs: [{ text: 'x' }] }], claims: [] }, artifacts, evidenceIds).some(problem => problem.includes('title'))).toBe(true)
  })

  it('flags a card metric value without an asOf', () => {
    const artifacts: LoadedArtifacts = {
      cards: [{ path: '/c', content: '', card: { name: 'A', slug: 'A', asOf: '2026-08-19T00:00:00.000Z', sources: [], outline: [], figureCandidates: [], webSources: null, gaps: [], disclaimer: 'x', metrics: [{ key: '股价', value: 1, asOf: '', source: 'S1' }] } }],
      gaps: [],
    }
    const draft: ReportDraft = { title: 't', sections: [{ heading: 'h', paragraphs: [{ text: 'x' }] }], claims: [] }
    expect(validateDeliveryContract(draft, artifacts, evidenceIds).some(problem => problem.includes('without an asOf'))).toBe(true)
  })
})

describe('industry_report delivery contract', () => {
  it('fails loud on placeholder residue before producing a report', async () => {
    const base = await setup()
    await seedIndustry(base)
    const result = await callTool(base, 'industry_report', {
      industry: '示例',
      draft: {
        sections: [{ heading: '要点', paragraphs: [{ text: '待填 {{industry}} 内容。', claimIds: ['C1'] }] }],
        claims: [{ id: 'C1', text: '占位 {{x}}', evidenceIds: ['E-chain'] }],
      },
    })
    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('交付契约校验失败')
  })
})

describe('autoDraft timeline evidence-category grouping', () => {
  it('groups timeline entries by evidence category', () => {
    const artifacts: LoadedArtifacts = {
      cards: [],
      gaps: [],
      timeline: {
        path: '/t',
        content: '',
        entries: [
          { date: '2026-08-01', title: '催化事件', url: 'https://a.test/1', summary: null, snapshotHash: null, capturedAt: '2026-08-01T00:00:00.000Z', topics: ['x'], evidenceCategory: 'confirmed-catalyst' },
          { date: '2026-08-02', title: '论坛噪音', url: 'https://a.test/2', summary: null, snapshotHash: null, capturedAt: '2026-08-02T00:00:00.000Z', topics: ['x'], evidenceCategory: 'forum-buzz' },
          { date: '2026-08-03', title: '未分类', url: 'https://a.test/3', summary: null, snapshotHash: null, capturedAt: '2026-08-03T00:00:00.000Z', topics: ['x'] },
        ],
      },
    }
    const draft = autoDraft('示例', artifacts, ['timeline'])
    const texts = draft.sections[0]!.paragraphs.map(paragraph => paragraph.text)
    expect(texts.some(text => text.includes('confirmed-catalyst'))).toBe(true)
    expect(texts.some(text => text.includes('forum-buzz'))).toBe(true)
    expect(texts.some(text => text.includes('未分类'))).toBe(true)
  })
})

describe('industry_report red-team review', () => {
  it('skips the red review job when no jobs service is mounted', async () => {
    const base = await setup()
    await seedIndustry(base)
    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.review).toEqual({ mode: 'skipped', note: 'jobs unavailable' })
    expect(value.perspectives).toEqual({ mode: 'skipped', note: 'jobs unavailable' })
    expect(value.machineCheck).toEqual([])
    const markdown = await readFile(value.reportPath!, 'utf8')
    expect(markdown).toContain('机器对抗检查')
    expect(markdown).toContain('多视角（正反方）')
  })

  it('spawns a red review job and writes red-review-note.md when jobs is mounted', async () => {
    const base = await setup()
    await seedIndustry(base)
    const jobs = await mountJobs(base)
    const result = await callTool(base, 'industry_report', { industry: '示例' })
    expect(result.isError).toBe(false)
    const value = result.value as unknown as IndustryReportValue
    expect(value.review.mode).toBe('job')
    expect(value.perspectives.mode).toBe('job')
    expect(jobs.started).toHaveLength(2)
    expect(jobs.started[0]?.label).toContain('对抗审阅')
    expect(jobs.started[1]?.label).toContain('正反方辩论')
    await jobs.started[0]!.hooks.done
    const note = await readFile(join(base.workspace, 'industry-research', '示例', 'red-review-note.md'), 'utf8')
    expect(note).toContain('红方对抗审阅笔记')
    expect(note).toContain('未发现可攻击点')
    await jobs.started[1]!.hooks.done
    const perspectives = await readFile(join(base.workspace, 'industry-research', '示例', 'perspectives-note.md'), 'utf8')
    expect(perspectives).toContain('多视角正反方笔记')
  })
})
