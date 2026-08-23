/**
 * The industry-chain structure model (`ChainMap`) and its validation. This is
 * a pure data module: no I/O; the non-future `statusAsOf` check takes an
 * injected `now` (defaulting to the call time). A metric is either a sourced
 * value (`value` + `sourceRef`, optionally `unit`/`asOf`) or an explicit gap
 * slot (no `value`), so an unsourced number is a validation error by
 * construction and a missing number is an honest, listable gap.
 * @module dsh-industry-research/chain
 */

import { taxonomyEntry } from './taxonomy.ts'

/** Chain tiers, upstream → downstream. */
export const CHAIN_TIERS = ['upstream', 'midstream', 'downstream'] as const

/** One chain tier. */
export type ChainTier = (typeof CHAIN_TIERS)[number]

/** Company listing status, shared by company cards and chain-node company references. */
export const COMPANY_STATUSES = ['public', 'private', 'acquired', 'IPO'] as const

/** One legal listing status. */
export type CompanyStatus = (typeof COMPANY_STATUSES)[number]

/** ISO-8601 date prefix (`YYYY-MM-DD` or with a time part). */
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/u

/** Whether a value parses as a real ISO-8601 date. */
export function isIsoDate(value: string): boolean {
  return ISO_DATE_RE.test(value) && !Number.isNaN(Date.parse(value))
}

/** One metric slot on a chain node. */
export type ChainMetric = {
  /** Metric name (e.g. `市场规模`, `毛利率`). */
  key: string
  /** The numeric value; absent means the slot is an explicit gap (待补). */
  value?: number
  /** Unit of the value (e.g. `亿元`, `%`). */
  unit?: string
  /** ISO-8601 date the value is current as of. */
  asOf?: string
  /** Source reference: a sources.json ref (`S1`), a URL, or a workspace path. Required whenever `value` is present. */
  sourceRef?: string
}

/** One node in the industry chain. */
export type ChainNode = {
  /** Stable node id referenced by edges (unique within the map). */
  id: string
  /** Display name (e.g. `高粱种植`, `白酒酿造`). */
  name: string
  tier: ChainTier
  /** Metric slots; each is a sourced value or an explicit gap. */
  metrics: ChainMetric[]
  /** Listing status when this node references a listed company. */
  status?: CompanyStatus
  /** ISO-8601 date the status is current as of; required whenever `status` is present. */
  statusAsOf?: string
  /** 国民经济行业分类 大类 code (e.g. `15`); must hit the built-in taxonomy table. */
  taxonomyCode?: string
}

/** One directed relation between two nodes. */
export type ChainEdge = {
  /** Source node id. */
  from: string
  /** Target node id. */
  to: string
  /** Optional relation note (e.g. `原料供应`). */
  note?: string
}

/** The industry-chain map persisted as `<industryRoot>/<industry>/chain.json`. */
export type ChainMap = {
  /** Industry display name. */
  industry: string
  nodes: ChainNode[]
  edges: ChainEdge[]
}

/**
 * Validate a `status`/`statusAsOf` pair (shared by chain nodes and company
 * cards). A present status must be one of {@link COMPANY_STATUSES} and carry a
 * `statusAsOf` that is a valid, non-future ISO-8601 date; a `statusAsOf`
 * without a status is also rejected. `now` is injected so this stays a pure
 * function of its inputs.
 * @param status - the asserted listing status (optional).
 * @param statusAsOf - the as-of date (optional).
 * @param subject - human label of the carrier (for error messages).
 * @param now - the validation instant.
 * @returns human-readable validation problems, in encounter order.
 */
export function validateStatus(status: unknown, statusAsOf: unknown, subject: string, now: Date): string[] {
  const problems: string[] = []
  if (status === undefined) {
    if (statusAsOf !== undefined) problems.push(`${subject} carries a statusAsOf without a status`)
    return problems
  }
  if (typeof status !== 'string' || !(COMPANY_STATUSES as readonly string[]).includes(status)) {
    problems.push(`${subject} has an illegal status ${JSON.stringify(status)} (expected ${COMPANY_STATUSES.join('|')})`)
  }
  if (typeof statusAsOf !== 'string' || statusAsOf.trim().length === 0) {
    problems.push(`${subject} declares a status but no statusAsOf — a status requires its as-of date`)
  } else if (!isIsoDate(statusAsOf)) {
    problems.push(`${subject} statusAsOf ${JSON.stringify(statusAsOf)} is not a valid ISO-8601 date`)
  } else if (Date.parse(statusAsOf) > now.getTime()) {
    problems.push(`${subject} statusAsOf ${JSON.stringify(statusAsOf)} is in the future (now ${now.toISOString()})`)
  }
  return problems
}

/**
 * Validate a chain map. Pure: returns the list of problems (empty when the
 * map is well-formed). Rules: unique node ids, legal tiers, edges reference
 * existing nodes, every metric carrying a `value` also carries a `sourceRef`
 * (gap slots without a value are always legal), a node `status` carries a
 * valid, non-future `statusAsOf`, and a node `taxonomyCode` hits the built-in
 * taxonomy table.
 * @param map - the candidate chain map.
 * @param now - the validation instant for the non-future status check (defaults to the call time).
 * @returns human-readable validation problems, in encounter order.
 */
export function validateChainMap(map: ChainMap, now: Date = new Date()): string[] {
  const problems: string[] = []
  if (typeof map.industry !== 'string' || map.industry.trim().length === 0) {
    problems.push('chain.industry must be a non-empty name')
  }
  const ids = new Set<string>()
  for (const node of map.nodes) {
    if (typeof node.id !== 'string' || node.id.trim().length === 0) {
      problems.push(`node ${JSON.stringify(node.id)} has an empty id`)
      continue
    }
    if (ids.has(node.id)) problems.push(`duplicate node id "${node.id}"`)
    ids.add(node.id)
    if (typeof node.name !== 'string' || node.name.trim().length === 0) {
      problems.push(`node "${node.id}" has an empty name`)
    }
    if (!(CHAIN_TIERS as readonly string[]).includes(node.tier)) {
      problems.push(`node "${node.id}" has an illegal tier ${JSON.stringify(node.tier)} (expected upstream|midstream|downstream)`)
    }
    problems.push(...validateStatus(node.status, node.statusAsOf, `node "${node.id}"`, now))
    if (node.taxonomyCode !== undefined) {
      if (typeof node.taxonomyCode !== 'string' || taxonomyEntry(node.taxonomyCode) === undefined) {
        problems.push(`node "${node.id}" has an unknown taxonomyCode ${JSON.stringify(node.taxonomyCode)} — use a code from the built-in 国民经济行业分类 大类 table`)
      }
    }
    for (const metric of node.metrics) {
      if (typeof metric.key !== 'string' || metric.key.trim().length === 0) {
        problems.push(`node "${node.id}" has a metric with an empty key`)
        continue
      }
      if (metric.value !== undefined) {
        if (typeof metric.value !== 'number' || !Number.isFinite(metric.value)) {
          problems.push(`node "${node.id}" metric "${metric.key}" carries a non-finite value`)
        }
        if (typeof metric.sourceRef !== 'string' || metric.sourceRef.trim().length === 0) {
          problems.push(`node "${node.id}" metric "${metric.key}" carries a value without a sourceRef — register the source or mark the slot 待补 (omit value)`)
        }
      }
    }
  }
  for (const edge of map.edges) {
    if (!ids.has(edge.from)) problems.push(`edge references unknown node "${edge.from}" (from)`)
    if (!ids.has(edge.to)) problems.push(`edge references unknown node "${edge.to}" (to)`)
  }
  return problems
}

/**
 * List the explicit gaps of a well-formed chain map: metric slots without a
 * value, nodes without any metric slot, and tiers with no node at all.
 * @param map - the chain map (already validated).
 * @returns human-readable gap lines, in encounter order.
 */
export function chainGaps(map: ChainMap): string[] {
  const gaps: string[] = []
  const tiers = new Set<string>()
  for (const node of map.nodes) {
    tiers.add(node.tier)
    if (node.metrics.length === 0) {
      gaps.push(`节点「${node.name}」(${node.id}) 没有任何指标槽位`)
    }
    for (const metric of node.metrics) {
      if (metric.value === undefined) {
        gaps.push(`节点「${node.name}」(${node.id}) 的指标「${metric.key}」待补（无来源数值）`)
      }
    }
  }
  for (const tier of CHAIN_TIERS) {
    if (!tiers.has(tier)) gaps.push(`产业链缺少 ${tier} 层节点`)
  }
  return gaps
}
