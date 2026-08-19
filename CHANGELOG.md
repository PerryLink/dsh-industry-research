# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
