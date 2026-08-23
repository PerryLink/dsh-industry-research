/**
 * Deterministic, zero-dependency SVG renderer for a validated {@link ChainMap}.
 * Nodes are laid out in three tier columns (upstream → midstream →
 * downstream); directed edges are drawn as arrows; bottleneck nodes are
 * detected by two rules — funnel (in-degree ≥ 2 and out-degree ≤ 1) and hub
 * (in-degree ≥ 2 and out-degree ≥ 2) — and highlighted with distinct fills.
 * Every user-supplied string is XML-escaped, and the emitted bytes are a pure
 * function of the input map (same input → same bytes).
 * @module dsh-industry-research/chain-svg
 */

import type { ChainMap, ChainNode } from './chain.ts'

/** A bottleneck node with its computed degrees and the rule that flagged it. */
export type ChainBottleneck = {
  /** Stable node id. */
  id: string
  /** Display name. */
  name: string
  /** `funnel` (in ≥ 2, out ≤ 1) or `hub` (in ≥ 2, out ≥ 2). */
  kind: 'funnel' | 'hub'
  /** Number of edges pointing into this node. */
  inDegree: number
  /** Number of edges leaving this node. */
  outDegree: number
}

/** Escape every XML-significant character so user text cannot break the markup. */
export function xmlEscape(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Tier column order, upstream → downstream. */
const TIER_ORDER = ['upstream', 'midstream', 'downstream'] as const

/** Fixed geometry; all coordinates stay integers, so the output is byte-stable. */
const NODE_WIDTH = 200
const NODE_HEIGHT = 72
const COLUMN_GAP = 240
const ROW_GAP = 100
const MARGIN = 48
const LEGEND_AREA = 28
/** Maximum characters per wrapped name line (CJK-safe). */
const NAME_MAX_CHARS = 15

/**
 * Compute the bottleneck nodes of a chain map by the two rules: a funnel has
 * in-degree ≥ 2 and out-degree ≤ 1; a hub has in-degree ≥ 2 and out-degree ≥ 2.
 * The two rules are mutually exclusive, so every bottleneck has exactly one kind.
 * @param map - the chain map (already validated, so edges reference real nodes).
 * @returns bottleneck nodes in node-encounter order.
 */
export function analyzeBottlenecks(map: ChainMap): ChainBottleneck[] {
  const inDegree = new Map<string, number>()
  const outDegree = new Map<string, number>()
  for (const node of map.nodes) {
    inDegree.set(node.id, 0)
    outDegree.set(node.id, 0)
  }
  for (const edge of map.edges) {
    outDegree.set(edge.from, (outDegree.get(edge.from) ?? 0) + 1)
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1)
  }
  const bottlenecks: ChainBottleneck[] = []
  for (const node of map.nodes) {
    const inD = inDegree.get(node.id) ?? 0
    const outD = outDegree.get(node.id) ?? 0
    if (inD < 2) continue
    bottlenecks.push({ id: node.id, name: node.name, kind: outD >= 2 ? 'hub' : 'funnel', inDegree: inD, outDegree: outD })
  }
  return bottlenecks
}

/** Wrap a node name into at most two lines, ellipsizing overflow. */
function wrapName(name: string): string[] {
  const chars = Array.from(name)
  if (chars.length <= NAME_MAX_CHARS) return [name]
  const first = chars.slice(0, NAME_MAX_CHARS).join('')
  const rest = chars.slice(NAME_MAX_CHARS)
  const second = rest.length > NAME_MAX_CHARS - 1 ? `${rest.slice(0, NAME_MAX_CHARS - 1).join('')}…` : rest.join('')
  return [first, second]
}

/** The node fill/stroke for one bottleneck kind (or a normal node). */
function nodeStyle(kind: 'funnel' | 'hub' | undefined): { fill: string; stroke: string } {
  if (kind === 'funnel') return { fill: '#fff4cc', stroke: '#b8860b' }
  if (kind === 'hub') return { fill: '#fde3e3', stroke: '#b22222' }
  return { fill: '#ffffff', stroke: '#5b6570' }
}

/** Exit/entry border points of a directed edge between two node boxes. */
function edgeEndpoints(a: { x: number; y: number }, b: { x: number; y: number }): { x1: number; y1: number; x2: number; y2: number } {
  const acx = a.x + NODE_WIDTH / 2
  const acy = a.y + NODE_HEIGHT / 2
  const bcx = b.x + NODE_WIDTH / 2
  const bcy = b.y + NODE_HEIGHT / 2
  let x1: number
  let y1: number
  let x2: number
  let y2: number
  if (bcx > acx) {
    x1 = a.x + NODE_WIDTH; y1 = acy
    x2 = b.x; y2 = bcy
  } else if (bcx < acx) {
    x1 = a.x; y1 = acy
    x2 = b.x + NODE_WIDTH; y2 = bcy
  } else if (bcy > acy) {
    x1 = acx; y1 = a.y + NODE_HEIGHT
    x2 = bcx; y2 = b.y
  } else {
    x1 = acx; y1 = a.y
    x2 = bcx; y2 = b.y + NODE_HEIGHT
  }
  return { x1, y1, x2, y2 }
}

/**
 * Render a chain map as a deterministic SVG document. Node layout is tier
 * columns (sorted by id within each tier) with directed arrow edges and
 * highlighted bottleneck nodes; a one-line legend explains the highlight
 * colors. All user text (industry, node names, node ids) is XML-escaped.
 * @param map - the chain map to render.
 * @returns the SVG source text (no trailing newline).
 */
export function renderChainSvg(map: ChainMap): string {
  const bottlenecks = analyzeBottlenecks(map)
  const bottleneckKind = new Map<string, 'funnel' | 'hub'>()
  for (const bottleneck of bottlenecks) bottleneckKind.set(bottleneck.id, bottleneck.kind)

  const columns = new Map<(typeof TIER_ORDER)[number], ChainNode[]>()
  for (const tier of TIER_ORDER) columns.set(tier, [])
  for (const node of map.nodes) columns.get(node.tier)?.push(node)
  for (const tier of TIER_ORDER) {
    columns.get(tier)!.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  }

  const positions = new Map<string, { x: number; y: number }>()
  let maxRows = 0
  for (let col = 0; col < TIER_ORDER.length; col += 1) {
    const nodes = columns.get(TIER_ORDER[col]!)!
    if (nodes.length > maxRows) maxRows = nodes.length
    nodes.forEach((node, row) => {
      positions.set(node.id, {
        x: MARGIN + col * (NODE_WIDTH + COLUMN_GAP),
        y: MARGIN + row * (NODE_HEIGHT + ROW_GAP),
      })
    })
  }

  const gridHeight = maxRows === 0 ? 0 : (maxRows - 1) * (NODE_HEIGHT + ROW_GAP) + NODE_HEIGHT
  const width = MARGIN * 2 + (TIER_ORDER.length - 1) * (NODE_WIDTH + COLUMN_GAP) + NODE_WIDTH
  const height = MARGIN * 2 + gridHeight + LEGEND_AREA
  const legendY = MARGIN + gridHeight + 18

  const parts: string[] = []
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="sans-serif">`)
  parts.push('  <defs>')
  parts.push('    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">')
  parts.push('      <path d="M0,0 L10,5 L0,10 z" fill="#5b6570"/>')
  parts.push('    </marker>')
  parts.push('  </defs>')
  parts.push(`  <text x="${MARGIN}" y="28" font-size="16" font-weight="bold" fill="#111827">${xmlEscape(map.industry)} 产业链结构图</text>`)
  for (const edge of map.edges) {
    const from = positions.get(edge.from)
    const to = positions.get(edge.to)
    if (from === undefined || to === undefined) continue
    const point = edgeEndpoints(from, to)
    if (point.x1 === point.x2 && point.y1 === point.y2) continue
    parts.push(`  <line x1="${point.x1}" y1="${point.y1}" x2="${point.x2}" y2="${point.y2}" stroke="#5b6570" stroke-width="1.5" marker-end="url(#arrow)"/>`)
  }
  for (const node of map.nodes) {
    const position = positions.get(node.id)
    if (position === undefined) continue
    const kind = bottleneckKind.get(node.id)
    const style = nodeStyle(kind)
    const cx = position.x + NODE_WIDTH / 2
    parts.push(`  <rect x="${position.x}" y="${position.y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" rx="8" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${kind === undefined ? '1.5' : '2.5'}"/>`)
    wrapName(node.name).forEach((line, index) => {
      parts.push(`  <text x="${cx}" y="${position.y + 22 + index * 17}" text-anchor="middle" font-size="13" fill="#1f2937">${xmlEscape(line)}</text>`)
    })
    parts.push(`  <text x="${cx}" y="${position.y + NODE_HEIGHT - 12}" text-anchor="middle" font-size="10" fill="#6b7280">${xmlEscape(node.id)}</text>`)
  }
  parts.push(`  <text x="${MARGIN}" y="${legendY}" font-size="11" fill="#374151">图例：黄色 = 漏斗型瓶颈（入度≥2 且出度≤1）；红色 = 枢纽型瓶颈（入度≥2 且出度≥2）</text>`)
  parts.push('</svg>')
  return parts.join('\n')
}
