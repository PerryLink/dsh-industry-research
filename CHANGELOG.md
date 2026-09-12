# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Rename the four translated READMEs to `README-<lang>.md`. npm selects the package-page readme as the first markdown file matching its `{README,README.*}` glob (`@npmcli/package-json`, publish path), and that glob order puts `README.<lang>.md` ahead of `README.md` — so npm was serving the Simplified-Chinese file for this package too (measured on 15/15 sampled packages of the family). The new names sit outside the glob, so the English source is served again. No content changed apart from the language-switcher link each translation holds to its siblings, and the repo readme gate still passes. Takes effect with the next release; an already-published version cannot gain a corrected readme retroactively.
- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.2` line and record `0.1.5-rc.2` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.2`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Fixed

- The release workflow claimed provenance but never passed the flag: it runs `npm publish --access public`, and npm only attests a token-based publish when `--provenance` is given explicitly. The publish step is now `npm publish --access public --provenance`, matching the rest of the family. Takes effect from the next release; an already-published version cannot gain attestations retroactively.
## [0.3.8] - 2026-09-10

### Changed

- Pin the `@deepseek-ai/dsh-*` dev/test dependencies to the published `0.1.5-rc.1` line and record `0.1.5-rc.1` in `dshWorkshop.compatibility.dshVersions`; the monthly Compat workflow now runs against `0.1.5-rc.1`. The peer range `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0` is unchanged, so no supported host line is dropped.

### Docs

- Refresh the five-language README compatibility baseline to `dsh-v0.1.5-rc.1` (verified 2026-09-10).

## [0.3.7] - 2026-09-09

### Fixed

- Retarget the test harness `SystemPrompt` config from the removed `persona` field to `personaPrefix` (host commit `40792330c0` split it into `personaPrefix`/`personaSuffix`), which unblocked `typecheck` and `typecheck:ci` on the 0.1.5-alpha.1 peers; no behavior change.

### Changed

- Move the published-dependency baseline to dsh `0.1.5-alpha.1`: devDependency pins, `dshWorkshop.compatibility.dshVersions`, and the `compat.yml` CLI/bundle pins now target that line, while the `@deepseek-ai/dsh-*` peer ranges keep both the 0.1.2-rc.1 and 0.1.5-alpha.1 lines; no behavior change.

### Docs

- Refresh the five-language README Compatibility sections, AGENTS.md, and THIRD_PARTY_NOTICES.md to the verified `dsh-v0.1.5-alpha.1` baseline and the composite peer range; no behavior change.


## [0.3.6] - 2026-09-08

### Docs

- Repair GBK mojibake in historical CHANGELOG entries (em/en dashes, arrows, comparison signs, and two mangled Chinese taxonomy terms) and drop the hard-coded Chinese disclaimer prefix from the EN/ES/PT/HI README headlines; all restorations match the clean pre-corruption text; no behavior change.


## [0.3.5] - 2026-09-07

### Docs

- Fix the DSH plugin badge URL: shields.io rejects the four-segment static badge form with "404 badge not found"; the label now uses the documented double-dash form (`dsh--plugin`), rendering identically; no behavior change.


## [0.3.4] - 2026-09-07

### Fixed

- Align the `@deepseek-ai/dsh-*` peer ranges to `>=0.1.2-rc.1 <0.2.0`: the older `>=0.1.0-rc.8 <0.2.0` band resolved to only the `0.1.0-rc.8` prerelease under registry-driven resolution and broke fresh tarball installs; no behavior change.

### Docs

- Refresh the five-language README support-version wording: the verified GitHub tag `dsh-v0.1.3-alpha.1` now leads the compatibility claim, while npm `0.1.2-rc.1` stays the published dependency-pin line (peers `>=0.1.2-rc.1 <0.2.0`); no behavior change.


## [0.3.3] - 2026-09-04

### Changed

- Align the devDependency pins to the published dsh `0.1.2-rc.1` line, move the compat CI harness probes from `0.1.1-rc.2` to `0.1.2-rc.1`, refresh the stale alpha.3 references in AGENTS.md/THIRD_PARTY_NOTICES/test comments, drop the unused `@deepseek-ai/dsh-attachment` devDependency, and repair the corrupted em-dash in the package description; no behavior change.

## [0.3.2] - 2026-09-02

### Changed

- Align the devDependency pins to the published dsh 0.1.2-alpha.5 line and re-verify the adaptation claims; no behavior change.

## [0.3.1] - 2026-09-01

### Changed

- Upgrade the `@deepseek-ai/dsh-*` devDependency family from `0.1.1-rc.2` to `0.1.2-alpha.3` (DeepSeek Harness alpha.3); the `@deepseek-ai/cordis` and `@deepseek-ai/schemastery` devDependencies align to `^4.0.2` / `^3.18.2`. The `dsh-tools` / `dsh-skill` / `dsh-skill-filesystem` peer dependencies remain `>=0.1.0-rc.8 <0.2.0`.
- Derive the test call id from the `ToolExecution['callId']` contract (`test/call-id.ts`) and a local opaque identity in `scripts/loader-runner.mjs` instead of importing the dsh-llm `CallId` brand, which the alpha.2 host renamed to `ToolCallId`; the dual-ruler brand keeps both the typed harness and the plain-Node Loader runner green on both published lines.

## [0.3.0] - 2026-08-26

### Added

- Multi-perspective bull/bear debate synthesis in `industry_report`: `synthesizePerspectives` deterministically derives bull and bear perspective points from the loaded artifacts and evidence, `renderPerspectivesNote` writes a `perspectives-note.md` artifact (appended to the SHA-256 ledger), and the report result gains a `perspectives` outcome — a forked subagent job when `ctx.jobs` is mounted, otherwise `skipped(jobs unavailable)`.

### Fixed

- Serialize `recordVersion` writes in the artifact version ledger (`src/versions.ts`): each path's ledger appends are chained through a per-path promise tail so a read never observes a torn write and no record is lost to a stale read when the report flow and its background jobs (red review, bull/bear debate) append `versions.jsonl` concurrently.

## [0.2.0] - 2026-08-23

### Added

- Deterministic `chain.json` → SVG network renderer (`src/chain-svg.ts`): tier-column layout, directed arrow edges, and dual-rule bottleneck detection (funnel: in-degree ≥ 2 and out-degree ≤ 1; hub: in-degree ≥ 2 and out-degree ≥ 2) with highlight colors. `industry_map` gains a `renderSvg` flag that writes `chain.svg` beside `chain.json` and returns the bottleneck summary; all user text is XML-escaped and the output is byte-stable for the same input.
- Status assertions with dates: chain nodes and company cards may carry a `status` (`public`/`private`/`acquired`/`IPO`) that must carry a non-future `statusAsOf`; missing or future dates fail validation loud.
- Price discipline and ticker validation: company cards accept sourced `metrics` (every value requires `source` + `asOf`) and a `ticker` checked against built-in formats (A-share 6 digits, US 1–5 letters, HK 1–5 digits), with the `scan.strictTicker` config exemption.
- Research depth routing (`src/depth.ts`): `industry_map` / `industry_track` / `company_scan` accept a `depth` argument (quick/standard/comprehensive, default standard) that deterministically scales web collection — quick uses minimal source counts, comprehensive uses maximum — with loud failure out of range.
- Per-company scan failure isolation: `company_scan` accepts a `companies` batch argument; one company's failure (bad file, path escape, validation) no longer aborts the batch and is reported in a `failures` list with its reason while the rest produce normally.
- Artifact version ledger (`src/versions.ts` + `versions.jsonl` at the industry root): `industry_map` / `company_scan` / `industry_report` append a root-relative path + SHA-256 + injected timestamp + change type on every artifact write; artifact reads verify against the ledger and fail loud on a hash mismatch (unrecorded artifacts are skipped).
- Built-in industry taxonomy anchor table (`src/taxonomy.ts`, 国民经济行业分类 大类 code-name-keywords); chain nodes may declare a `taxonomyCode` that must hit the table, with loud failure for unknown codes.
- Evidence category labels: timeline entries may carry an `evidenceCategory` (`confirmed-catalyst` / `market-narrative` / `forum-buzz` / `technical-confirmation` / `macro-amplifier` / `background-noise`) validated on write; the auto-draft groups timeline entries by category.
- Delivery contract validation (`validateDeliveryContract`): `industry_report` runs a deterministic pre-production check (complete blocks, status assertions with dates, value assertions with source + asOf, no placeholder residue) and fails loud instead of emitting a half-assembled report.
- Research-state memory (`src/research-state.ts` + `research-state.json` per industry): `industry_map` / `industry_track` persist the last run's depth, latest artifact hashes, source URLs, evidence-category counts, gaps, and an injected timestamp, and return a deterministic "vs last run" delta (new/removed sources, unchanged evidence); a corrupt state fails loud and the write is registered in `versions.jsonl`.
- Red-team adversarial review (`src/adversarial.ts`): `industry_report` runs the deterministic `adversarialCheck` machine-check baseline (dead evidence links, unsourced/undated numbers, statuses without dates) and, when `ctx.get('jobs')` is mounted, spawns a devil's-advocate review job that writes `red-review-note.md`; without `jobs` it records `review: skipped(jobs unavailable)`.
- Per-company parallel scan: `company_scan` batch mode accepts `parallel` (default false); with `parallel: true` and a mounted `ctx.jobs` it fans each company out into an independent job with failure isolation and reports the execution `mode`, otherwise it falls back to the sequential path.

### Deviations

- **chain.json Slot client visualization UI** — needs a new client face plus packaging changes; the deterministic `chain.svg` artifact already covers the core value.
- **Industry-expert subagent team (model orchestration)** — covered by failure isolation, depth routing, and adversarial review; a full model team exceeds this repo's determinism-first principle.
- **Exa external retrieval service** — third-party API dependency, out of scope.
- **Skill self-evolution (Hermes shadow agent)** — exceeds the DSH skill-provider mechanism.

## [0.1.3] - 2026-08-23

### Added

- `verify:skills` gate (`scripts/check-skills.mjs` + `test/skills.spec.ts`): every packaged skill must carry `name`/`description` frontmatter and resolve its cited `references/*.md`; wired into the CI gates.
- Tool triple-interface assertions (`test/tools.spec.ts`): schema + canonical value + content blocks asserted together for all four tools through the real registry.
- Web degradation tests (`test/web.spec.ts` + `test/track.spec.ts`): per-request timeout signal firing, caller-cancel signal propagation, machine-routable web error codes, `requireWeb` fail-closed, and search-provider throw fail-closed.

### Changed

- Harden the illegal-config negatives: `track.maxResultsPerTopic` and `scan.maxFileBytes` / `scan.maxFigureCandidates` out-of-range now have unit and Loader-level regression cases.
- Add a fiber-dispose assertion proving the four tools and both skills disappear from the authoritative registries after `dispose()` (HMR-safety), plus a direct `'default' in builtEntry === false` assertion on the shipped bundle.

## [0.1.2] - 2026-08-22

### Changed

- Upgrade the `@deepseek-ai/dsh-*` dependency family from `0.1.0-rc.8` to `0.1.1-rc.2` (DeepSeek Harness rc2): the eight dev peers (`dsh-agent`, `dsh-llm`, `dsh-session`, `dsh-skill`, `dsh-skill-filesystem`, `dsh-system-prompt`, `dsh-tools`, `dsh-web`) stay exact-pinned at `0.1.1-rc.2`; the `dsh-tools` / `dsh-skill` / `dsh-skill-filesystem` peer dependencies remain `>=0.1.0-rc.8 <0.2.0` (no rc2-only API is required). `@deepseek-ai/cordis` and non-dsh dependencies are unchanged.
- `dshWorkshop.compatibility.dshVersions` now declares `0.1.1-rc.2`; the workspace `minimumReleaseAgeExclude` broadens to the whole `@deepseek-ai/*` scope so the freshly published rc2 family resolves.
- Five-language READMEs, `AGENTS.md`, and `THIRD_PARTY_NOTICES.md` state the rc2 peer family; `compat.yml` installs the CLI and `dsh-base` / `dsh-headless` at `0.1.1-rc.2`.

## [0.1.1] - 2026-08-21

### Changed

- Upgrade the `@deepseek-ai/dsh-*` dependency family from `0.1.0-rc.6` to `0.1.0-rc.8` (DeepSeek Harness rc8): the `dsh-tools` / `dsh-skill` / `dsh-skill-filesystem` peer dependencies now declare `>=0.1.0-rc.8 <0.2.0`, and the rc.8 dev peers (`dsh-agent`, `dsh-llm`, `dsh-session`, `dsh-skill`, `dsh-skill-filesystem`, `dsh-system-prompt`, `dsh-tools`, `dsh-web`) stay exact-pinned. `@deepseek-ai/cordis` and non-dsh dependencies are unchanged.
- Five-language READMEs, `AGENTS.md`, and `THIRD_PARTY_NOTICES.md` state the rc.8 peer family; the session-event design note is restated for the rc.8 session envelope (the durable record is the workspace artifacts; model-visible tool results ride the durable `tool/result` session event; observability rides the typed Cordis events).
- `compat.yml` profile smoke installs the CLI and `dsh-base` / `dsh-headless` at `0.1.0-rc.8`, and the workspace `minimumReleaseAgeExclude` pins the rc.8 peer family.

## [0.1.0] - 2026-08-19

### Added

- Industry/company research domain pack: four workspace-bound tools and two methodology skills.
- `industry_map` — validate and persist an industry chain map (`chain.json`): upstream/midstream/downstream nodes, edges, and metric slots where every value requires a `sourceRef` (unsourced values are rejected; value-less slots are explicit gaps). Seed notes/files and an optional `ctx.web` digest are registered as citable sources (`sources.json`).
- `industry_track` — public-source policy/news tracking over the official `ctx.web` seam (never a hand-rolled fetch): per-topic search, host allow/block lists, `since` filtering, bounded snapshot fetches with SHA-256 provenance hashes, and append + dedupe into `timeline.jsonl` with a retention cap. Fails loud when `ctx.web` is unmounted or `offline: true`.
- `company_scan` — company cards (`card.json` + `card.md`) from user-supplied workspace data files (hashed, with Markdown outlines and figure-candidate lines so every number cites a file and a line) plus an optional `ctx.web` citation complement. Text formats only in v1 (no PDF).
- `industry_report` — report assembly with two paths: the frozen-contract `ctx.researchReport` engine (`assemble` → sealed directory + per-claim verdicts) when mounted, or an honest builtin fallback (`reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` with a SHA-256 source-traceability table, claims marked `unverified`, `engine: 'builtin-fallback'`).
- Methodology skills `industry-research-method` and `company-research-method` (chain decomposition, supply/demand discipline, sourcing and gap-declaration discipline, compliance wording) published from the packaged `skills/` directory.
- Typed Cordis events `industry-research/map`, `industry-research/track`, and `industry-research/report` emitted after each committed artifact.
- Fail-loud Schemastery config (`industryRoot`, `fetchTimeoutMs`, `timelineMaxEntries`, `sourceAllowlist`/`sourceBlocklist`, `offline`, `skillsDir`, `track.*`, `scan.*`); vitest suites over the real 0.1.0-rc.6 `Context`/`Session`/`ToolRuntime`/`SkillRegistry`/`WebRuntime`; a keyless offline end-to-end suite over the 白酒 fixtures.
