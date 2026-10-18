<div align="center">

# 🏭 dsh-industry-research
- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-industry-research` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking).
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-industry-research?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-industry-research/badge)](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-industry-research)

**Industry and company research domain pack for DeepSeek Harness.**

*Chain maps, public-source tracking, company cards, and auditable reports — every number traces to a source, every gap is declared.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-industry-research.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-industry-research/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-industry-research?label=version)](https://github.com/PerryLink/dsh-industry-research/releases)
[![npm version](https://img.shields.io/npm/v/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-industry-research
```


</div>

---

**Research only, not investment advice.** This pack does research support only: no trading, no price prediction, no paid/login-walled sources.

**📖 Ecosystem knowledge base** — measured data, not marketing: [plugin development guide · plugin-selection data · maintenance criteria](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # install
dsh plugin --profile demo remove dsh-industry-research    # uninstall
```

Verify the row mounts: `dsh --profile demo --dump-config | grep dsh-industry-research`.

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（40+ 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.


## What is dsh-industry-research?

Industry and company research domain pack for DeepSeek Harness.

Chain maps, public-source tracking, company cards, and auditable reports — every number traces to a source, every gap is declared.

![Terminal demo of dsh-industry-research: dsh-industry-research — install, then the three artifacts](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-hero.png)

![Animated terminal demo of dsh-industry-research](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-demo.gif)

*The same run, animated.*

## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1` (published npm line, verified 2026-09-25; peers `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`).
0.1.2-rc.1 (adapted 2026-09-02): the session envelope keeps its ignorable field for stored-log read compatibility only - Session.append still cannot stamp it, so audit-gate behavior is unchanged.
Verified 2026-09-24 against the `0.1.7-rc.2` published peers (full gate chain; the real profile install smoke runs in the weekly and per-PR `compat.yml` job).
- Node `^22.19.0 || >=24.0.0`, ESM only (`"type": "module"`).
- Peer dependencies: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, and `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` at `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` (all composed by the official `dsh-base` bundle).
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

```sh
dsh plugin --profile web add github:PerryLink/dsh-industry-research
```

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

**Applicable DSH version:** verified against `dsh-v0.2.1-alpha.1` (the host release this build targets); requires `>=0.1.7-alpha.1 <0.2.0`.

## PerryLink DSH Plugin Family

This project is one of the **87 actively maintained** DeepSeek Harness plugins from [PerryLink](https://github.com/PerryLink). The family roster is **95** plugins in total — **5 frozen**, **3 retired** — and stays collapsed below so every README keeps a short first screen. Expand it to see every row, with the reason in the Status column.

<details>
<summary>Expand all 95 plugins</summary>

| Plugin | One-liner | Status |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRED — see the repo README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 FROZEN — see the repo README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 FROZEN — see the repo README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 FROZEN — see the repo README |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 FROZEN — see the repo README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRED — see the repo README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRED — see the repo README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>

### Install from the DSH Desktop Market

All PerryLink plugins are browsable in the built-in DSH Desktop Market: **Market → Sources → add source → paste** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ select it**. Installation still goes through the Market's npm-identity verification and your confirmation.

## License

Apache-2.0 — see [LICENSE](LICENSE).
