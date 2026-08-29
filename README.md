<div align="center">

# 🏭 dsh-industry-research
- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-industry-research` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)

**Industry and company research domain pack for DeepSeek Harness.**

*Chain maps, public-source tracking, company cards, and auditable reports — every number traces to a source, every gap is declared.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-industry-research/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-industry-research?label=version)](https://github.com/PerryLink/dsh-industry-research/releases)
[![npm version](https://img.shields.io/npm/v/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

**仅供研究，不构成投资建议 — Research only, not investment advice.** This pack does research support only: no trading, no price prediction, no paid/login-walled sources.

## Compatibility

- DeepSeek Harness `0.1.1-rc.2` (peers pinned to `0.1.1-rc.2`).
- Node `^22.19.0 || >=24.0.0`, ESM only (`"type": "module"`).
- Peer dependencies: `@deepseek-ai/cordis ^4.0.1`, `@deepseek-ai/schemastery ^3.18.0`, and `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` at `>=0.1.0-rc.8 <0.2.0` (all composed by the official `dsh-base` bundle).
- Optional, looked up at execution time (never injected): `ctx.web` (public-source retrieval — composed by `dsh-base`) and `ctx.researchReport` (the sibling `dsh-research-report` sealing engine).

## What you get

- **`industry_map`** — build or update an industry chain map (`chain.json`): upstream/midstream/downstream nodes, edges, and metric slots. A metric with a `value` must carry a `sourceRef`; a value-less slot is an explicit gap. Node `status` assertions carry a `statusAsOf`, and an optional `taxonomyCode` must hit the built-in 国民经济行业分类 大类 table. With `renderSvg: true` it also writes a deterministic, tier-layered `chain.svg` network diagram with funnel/hub bottleneck highlighting. A `depth` argument scales the web assist (quick/standard/comprehensive). Seed notes/files and an optional `ctx.web` digest are registered as citable sources (`S1`, `S2`, …).
- **`industry_track`** — public-source policy/news tracking over the official `ctx.web` seam: per-topic search, host allow/block lists, `since` filtering, bounded snapshot fetches with SHA-256 provenance hashes, and append + dedupe into `timeline.jsonl` with a retention cap. Entries may carry a validated `evidenceCategory`; a `depth` argument scales source counts. Fails loud when the web capability is unreachable.
- **`company_scan`** — company cards (`card.json` + `card.md`) from your workspace data files (SHA-256-hashed, with Markdown outlines and figure-candidate lines so every number cites a file and a line), plus an optional `ctx.web` citation complement. Cards carry a listing `status` (with `statusAsOf`), a format-checked `ticker`, and sourced price/value `metrics` (each with `source` + `asOf`). Batch mode (`companies`) isolates one bad company without aborting the batch; `depth` scales the web complement. Text formats only in v1 (no PDF).
- **`industry_report`** — one auditable report from the map + timeline + cards. Before producing, a deterministic delivery contract checks blocks, status/price assertions, and placeholder residue (fail loud, no half-assembled report). Timeline entries are grouped by `evidenceCategory`. A deterministic bull/bear (正反方) synthesis lists sourced, dated values against declared gaps and data-quality findings, is embedded as the report's multi-perspective section, and is forked as a subagent job writing `perspectives-note.md` into the version ledger. With a mounted `ctx.researchReport` engine the evidence/sections/claims are sealed by its `assemble` and per-claim verdicts come back; without one, the builtin fallback writes versioned `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` with a SHA-256 source-traceability table and honestly labels `engine: 'builtin-fallback'`.
- **Artifact version ledger** — `industry_map` / `company_scan` / `industry_report` append to `versions.jsonl` (root-relative path + SHA-256 + timestamp + change type) on every artifact write; reads verify the hash and fail loud on mismatch.
- **Two methodology skills** — `industry-research-method` (chain decomposition, supply/demand framework, sourcing discipline, gap-declaration discipline) and `company-research-method` (company framework, public-source list, compliance wording).
- **Typed Cordis events** — `industry-research/map`, `industry-research/track`, `industry-research/report` emitted after each committed artifact.

## Quick start

### git channel

```sh
# From a scratch profile (pins the commit; runs the self-contained `prepare` build)
dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
# The profile's pnpm-workspace.yaml gains an allowBuilds entry for dsh-industry-research on first add.
```

### npm channel

```sh
dsh plugin --profile demo add dsh-industry-research
```

Both channels install the bundle row (see `cordis.patch.yml`) into the profile's `dsh.profile.bundles` stack and take effect on restart.

Then, in a session:

```
加载 industry-research-method 技能，然后研究白酒行业：
先 industry_map 建产业链图，再 industry_track 跟踪政策，最后 industry_report 出报告。
```

## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # install
dsh plugin --profile demo remove dsh-industry-research    # uninstall
```

Verify the row mounts: `dsh --profile demo --dump-config | grep dsh-industry-research`.

## Configuration

All tunables are Schemastery `Config` fields; invalid values fail the profile load loudly.

| Key | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Master switch; `false` mounts nothing. |
| `industryRoot` | `industry-research` | Artifact root, relative to the session workspace (or absolute). |
| `fetchTimeoutMs` | `20000` | Per-request timeout (ms) for `ctx.web` search/fetch calls. |
| `timelineMaxEntries` | `500` | Entries retained per industry `timeline.jsonl` (oldest dropped). |
| `sourceAllowlist` | `[]` | Host allowlist for tracked sources (empty = all hosts). |
| `sourceBlocklist` | `[]` | Host blocklist for tracked sources (wins over the allowlist). |
| `offline` | `false` | Offline mode: never touch `ctx.web`; local workspace data only. |
| `skillsDir` | _(unset)_ | Explicit skills root override; defaults to the packaged `skills/`. |
| `track.maxResultsPerTopic` | `10` | `web_search` maxResults per topic. |
| `track.maxFetchesPerCall` | `10` | Snapshot-fetch budget per `industry_track` call. |
| `scan.maxFileBytes` | `1048576` | Per-file read cap for company data files. |
| `scan.maxFigureCandidates` | `100` | Figure-candidate budget per company scan. |
| `scan.strictTicker` | `true` | Company-card tickers must match a built-in format (A-share 6 digits, US 1–5 letters, HK 1–5 digits); `false` exempts the format check. |

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

Called with `chain`: validates (dangling edges, unsourced values, illegal tiers, duplicate ids, status/statusAsOf, unknown `taxonomyCode` — loud failure with the full issue list) and persists `chain.json`, then lists the explicit gap slots and bottleneck nodes. Called without `chain`: returns the current map, the registered sources, and an optional `ctx.web` chain-structure digest so the model can iterate. With `renderSvg: true` it also writes a deterministic `chain.svg`. `depth` (quick/standard/comprehensive) scales the web assist. Returns a `delta` summary vs the previous `research-state.json`. Emits `industry-research/map`.

### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

Searches each topic through `ctx.web`, filters by the allow/block lists and `since`, fetches page snapshots (SHA-256) within the call budget, and merges into `timeline.jsonl` (dedupe by normalized URL, capped). `depth` scales the source/fetch budget; `evidenceCategory` labels every appended entry and is validated against the six-category enum. Sources whose snapshot failed are kept as citation-only entries with the reason in `note`. Returns a `delta` summary vs the previous `research-state.json`. Fails loud naming the missing capability when `ctx.web` is unmounted or `offline: true`. Emits `industry-research/track`.

### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

Reads the workspace data files (`.md/.txt/.csv/.tsv/.json`; v1 does not parse PDF), hashes them, extracts Markdown outlines and figure-candidate lines, optionally attaches `ctx.web` citations, and persists the card. A `status` requires a non-future `statusAsOf`; a `ticker` must match a built-in format unless `scan.strictTicker: false`; every `metrics` value must carry `source` + `asOf`. `companies` (batch) isolates one bad company without aborting the batch; `parallel: true` fans each company into an independent job when `ctx.jobs` is mounted (otherwise it falls back to sequential, reported in the result `mode`). Rejected files come back with reasons; everything the card cannot establish is an explicit gap.

### `industry_report({ industry, sections?, companies?, draft? })`

Assembles evidence (`E-chain`, `E-timeline`, `E-company-<slug>`), verifies the read artifacts against `versions.jsonl` (hash mismatch fails loud), and either validates your `draft` (sections + claims; every claim's `evidenceIds` must reference registered evidence) or builds the mechanical auto-draft (sourced metrics and recent timeline entries become claims, grouped by `evidenceCategory`). A deterministic delivery contract runs before production and fails loud on any missing block, placeholder, or unsourced/undated assertion. A deterministic adversarial machine-check always runs, and a red-team review job (`red-review-note.md`) is spawned when `ctx.jobs` is mounted (else `review: skipped(jobs unavailable)`). A deterministic bull/bear (正反方) synthesis embeds a multi-perspective section in the report and forks a debate job (`perspectives-note.md`) when `ctx.jobs` is mounted. Engine path: sealed directory + `sealHash` + per-claim verdicts. Fallback path: versioned Markdown + manifest, claims honestly marked `unverified`. Emits `industry-research/report`.

## Skills

- **`industry-research-method`** — industry research methodology: upstream/midstream/downstream decomposition, supply/demand framework, sourcing discipline (every number: value + unit + source + asOf), and gap-declaration discipline (declare, never fabricate).
- **`company-research-method`** — company research methodology: the business-structure / financials / risks card framework, the public-source priority list (company disclosures → regulators → authoritative media), and compliance wording.

Both load on demand through the standard `skill` tool (`加载 industry-research-method 技能`).

## Data layout

```
<workspace>/<industryRoot>/versions.jsonl              artifact version ledger (SHA-256 + timestamp + change)
<workspace>/<industryRoot>/<industry>/research-state.json  research-state memory
<workspace>/<industryRoot>/<industry>/chain.json      industry_map
<workspace>/<industryRoot>/<industry>/chain.svg       industry_map (renderSvg: true)
<workspace>/<industryRoot>/<industry>/timeline.jsonl  industry_track
<workspace>/<industryRoot>/<industry>/sources.json    citable source registry (S1, S2, …)
<workspace>/<industryRoot>/<industry>/notes/          seed notes
<workspace>/<industryRoot>/<industry>/red-review-note.md  industry_report (red-team review, jobs)
<workspace>/<industryRoot>/<industry>/perspectives-note.md  industry_report (bull/bear debate, jobs)
<workspace>/<industryRoot>/<industry>/reports/<ts>/   industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<name>/card.*    company_scan
```

## Permissions & data

`dsh-industry-research` consumes only public seams: `ctx.tools`, `ctx.skills`, and — looked up optionally — `ctx.web` and `ctx.researchReport`. It performs no network access of its own (all retrieval goes through `ctx.web` with the deployment's provider selection and your configured timeouts), stores no credentials, and writes only inside the session workspace under `industryRoot`. Only public sources are used; paid or login-walled sources are out of scope — pass your own exports in as `dataFiles`.

## Security boundaries

- **Workspace containment** — industry/company names are validated path segments; data files are containment-checked against the session cwd (both sides resolved).
- **Provenance by construction** — sources carry SHA-256 hashes; unsourced numbers are validation errors; corrupt timeline lines are skipped with a surfaced count, never silently.
- **Honest degradation** — missing `ctx.web` / `ctx.researchReport` produce loud failures or honestly labeled fallback artifacts, never silent fabrication.
- **Reversible registrations** — everything goes through `ctx.effect()` / `ctx.on()` / `register()`.
- **Research-only compliance** — tool descriptions, cards, and reports carry 「仅供研究，不构成投资建议」; data points carry asOf and sources.

## Known limitations

- **Cordis events, not session-log events** — `industry-research/*` events are typed Cordis observability events and are never appended to the session log; the durable record is the workspace artifacts themselves, and model-visible tool results ride the durable `tool/result` session event.
- **No `ctx.attachment` writes** — the rc2 attachment seam accepts images only (PNG/JPEG/WebP/GIF); Markdown reports therefore stay versioned workspace files, referenced by absolute path in the tool result.
- **v1 reads text formats only** — no PDF parsing; ask users to convert PDFs to text/Markdown first.
- **Chinese-edition skills** — the packaged methodology skills ship in Chinese; an English edition is future work.
- **Foreground tools** — `industry_track` is bounded by `track.maxFetchesPerCall` and `fetchTimeoutMs` and runs in the foreground; a background-jobs mode is future work.
- **The auto-draft is mechanical** — it summarizes artifacts and turns sourced data points into claims; narrative quality comes from model-authored `draft`s.

## Development

```sh
pnpm install
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:self-contained && pnpm run verify:artifacts
pnpm run verify:readme-sync
pnpm run verify:skills
pnpm run pack:check
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report`

## Contributors

- Initial design and implementation by the `dsh-industry-research` development session (DeepSeek Harness).

External contributions are welcome — open an issue or a pull request.

## License

Apache-2.0 — see [LICENSE](LICENSE).
