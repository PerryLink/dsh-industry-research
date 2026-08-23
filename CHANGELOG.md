# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
