/**
 * Company scan support: read user-supplied data files from the workspace,
 * hash them, extract a lightweight outline (Markdown headings) and
 * figure-candidate lines (lines carrying digits, so every number the model
 * cites can point at a file and a line), and persist the scan card
 * (`card.json` + `card.md`). v1 reads text formats only — no PDF.
 * @module dsh-industry-research/company
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { sha256Of } from './sources.ts'
import type { ResolvedConfig } from './config.ts'

/** File extensions v1 can read as text. PDF and office formats are out of scope. */
export const READABLE_EXTENSIONS = new Set(['.md', '.txt', '.csv', '.tsv', '.json'])

/** One registered data-file source on a card. */
export type CardSource = {
  /** Absolute workspace path of the data file. */
  path: string
  /** SHA-256 of the file content at scan time. */
  sha256: string
  /** File size in bytes at scan time. */
  bytes: number
  /** Line count at scan time. */
  lines: number
}

/** One line carrying a digit — a citation anchor for every figure the model quotes. */
export type FigureCandidate = {
  /** Absolute workspace path of the data file. */
  path: string
  /** 1-based line number. */
  line: number
  /** The verbatim line text (trimmed, capped). */
  text: string
}

/** Markdown heading outline of one data file. */
export type FileOutline = {
  /** Absolute workspace path of the data file. */
  path: string
  /** Heading texts in document order (`#`/`##`/`###`). */
  headings: string[]
}

/** One web citation attached to the card (public-source complement). */
export type CardWebSource = {
  url: string
  title?: string
  snippet?: string
  publishedAt?: string
}

/** The structured company scan card persisted as `card.json`. */
export type CompanyCard = {
  /** Company display name. */
  name: string
  /** Directory slug (validated path segment). */
  slug: string
  /** ISO-8601 scan time. */
  asOf: string
  /** Data-file sources with hashes. */
  sources: CardSource[]
  /** Per-file Markdown outlines. */
  outline: FileOutline[]
  /** Lines carrying digits, for precise figure citation. */
  figureCandidates: FigureCandidate[]
  /** Public-source citations from ctx.web; null when the web complement did not run. */
  webSources: CardWebSource[] | null
  /** Honest gap declarations (what the card could not establish). */
  gaps: string[]
  /** Research-only disclaimer carried into every rendering. */
  disclaimer: string
}

/** The research-only disclaimer text shared by cards and reports. */
export const DISCLAIMER = '仅供研究，不构成投资建议'

/** Maximum length of one surfaced figure-candidate line. */
const FIGURE_LINE_CAP = 200
/** Maximum headings surfaced per file. */
const OUTLINE_CAP = 50

/** The outcome of reading and extracting one data file. */
export interface ScannedFile {
  source: CardSource
  outline: FileOutline | undefined
  figures: FigureCandidate[]
  /** Verbatim content (for downstream evidence registration). */
  content: string
}

/**
 * Read one containment-verified data file and extract its outline and figure
 * candidates. Unsupported extensions and unreadable entries throw — the tool
 * wraps them into the card's gap list where the contract allows skipping.
 * @param path - absolute, containment-verified file path.
 * @param maxBytes - per-file read cap.
 * @returns the scanned file.
 */
export async function scanFile(path: string, maxBytes: number): Promise<ScannedFile> {
  const ext = extname(path).toLowerCase()
  if (!READABLE_EXTENSIONS.has(ext)) {
    throw new Error(`unsupported data-file extension ${JSON.stringify(ext)} (v1 reads ${[...READABLE_EXTENSIONS].join(', ')}; PDF is out of scope)`)
  }
  const info = await stat(path)
  if (!info.isFile()) throw new Error(`not a regular file: ${path}`)
  if (info.size > maxBytes) {
    throw new Error(`file exceeds scan.maxFileBytes (${info.size} > ${maxBytes}): ${path}`)
  }
  const content = await readFile(path, 'utf8')
  const lines = content.split('\n')
  const headings: string[] = []
  const figures: FigureCandidate[] = []
  if (ext === '.md') {
    for (const line of lines) {
      const match = /^#{1,3}\s+(.+?)\s*$/u.exec(line)
      if (match?.[1] !== undefined && headings.length < OUTLINE_CAP) headings.push(match[1])
    }
  }
  lines.forEach((raw, index) => {
    const text = raw.trim()
    if (text.length === 0 || !/\d/u.test(text)) return
    figures.push({ path, line: index + 1, text: text.length > FIGURE_LINE_CAP ? `${text.slice(0, FIGURE_LINE_CAP)}…` : text })
  })
  return {
    source: { path, sha256: sha256Of(content), bytes: info.size, lines: lines.length },
    outline: headings.length > 0 ? { path, headings } : undefined,
    figures,
    content,
  }
}

/**
 * Persist a company card as `card.json` + `card.md` inside its directory.
 * The Markdown card is a template whose analytical sections stay explicitly
 * 待补 — the tool surfaces evidence (sources, outline, figure candidates); it
 * never invents business structure, financials, or risks.
 * @param dir - absolute company card directory.
 * @param card - the card to persist.
 * @returns the written file paths.
 */
export async function writeCard(dir: string, card: CompanyCard): Promise<{ cardJsonPath: string; cardPath: string }> {
  await mkdir(dir, { recursive: true })
  const cardJsonPath = join(dir, 'card.json')
  const cardPath = join(dir, 'card.md')
  await writeFile(cardJsonPath, `${JSON.stringify(card, null, 2)}\n`, 'utf8')
  await writeFile(cardPath, renderCardMarkdown(card), 'utf8')
  return { cardJsonPath, cardPath }
}

/**
 * Render the human-facing Markdown card. Every section that the scan could
 * not fill from evidence is an explicit 待补 line, never prose.
 * @param card - the card to render.
 * @returns the Markdown text.
 */
export function renderCardMarkdown(card: CompanyCard): string {
  const lines: string[] = [
    `# 公司速览卡：${card.name}`,
    '',
    `> ${card.disclaimer}。扫描时间（asOf）：${card.asOf}`,
    '',
    '## 业务结构',
    '',
  ]
  if (card.outline.length > 0) {
    lines.push('数据文件目录结构（供研究定位，非分析结论）：')
    for (const outline of card.outline) {
      lines.push(`- \`${outline.path}\``)
      for (const heading of outline.headings) lines.push(`  - ${heading}`)
    }
  } else {
    lines.push('待补：未从数据文件中提取到目录结构。')
  }
  lines.push('', '## 财务要点', '')
  if (card.figureCandidates.length > 0) {
    lines.push(`数字候选行（共 ${card.figureCandidates.length} 行，引用时必须标注文件与行号）：`)
    for (const figure of card.figureCandidates.slice(0, 20)) {
      lines.push(`- \`${figure.path}\`:${figure.line} — ${figure.text}`)
    }
    if (card.figureCandidates.length > 20) lines.push(`- ……其余 ${card.figureCandidates.length - 20} 行见 card.json`)
  } else {
    lines.push('待补：数据文件中未发现数字行。')
  }
  lines.push('', '## 风险点', '', '待补：由研究者基于来源材料归纳；不得凭空列举。', '', '## 来源清单', '')
  if (card.sources.length > 0) {
    for (const source of card.sources) {
      lines.push(`- \`${source.path}\` — SHA-256 \`${source.sha256}\`，${source.bytes} 字节，${source.lines} 行`)
    }
  } else {
    lines.push('无用户提供的数据文件。')
  }
  if (card.webSources !== null) {
    lines.push('', '公开源检索（ctx.web）：')
    for (const source of card.webSources) {
      const label = source.title ?? source.url
      const when = source.publishedAt !== undefined ? `（${source.publishedAt}）` : ''
      lines.push(`- [${label}](${source.url})${when}`)
    }
  }
  lines.push('', '## 缺口声明', '')
  if (card.gaps.length > 0) {
    for (const gap of card.gaps) lines.push(`- ${gap}`)
  } else {
    lines.push('无。')
  }
  lines.push('')
  return lines.join('\n')
}

/**
 * Load a persisted card (for report assembly). Missing/corrupt cards fail
 * loud to the caller, which decides per-card tolerance.
 * @param cardJsonPath - absolute path of `card.json`.
 * @returns the parsed card.
 */
export async function readCard(cardJsonPath: string): Promise<CompanyCard> {
  const text = await readFile(cardJsonPath, 'utf8')
  const parsed = JSON.parse(text) as CompanyCard
  if (typeof parsed.name !== 'string' || !Array.isArray(parsed.sources) || !Array.isArray(parsed.gaps)) {
    throw new Error(`company card at ${cardJsonPath} is malformed`)
  }
  return parsed
}

/**
 * Apply the figure-candidate budget to a scan result set, keeping files in
 * scan order and noting the cut in the card gaps when it applies.
 * @param figures - all candidates, in scan order.
 * @param config - resolved config (budget source).
 * @returns the bounded candidate list.
 */
export function boundFigures(figures: readonly FigureCandidate[], config: ResolvedConfig): FigureCandidate[] {
  return figures.slice(0, config.scan.maxFigureCandidates)
}
