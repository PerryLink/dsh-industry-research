# AGENTS.md

Standalone DeepSeek Harness plugin repository (`dsh-industry-research`). Development follows the dsh-plugin-guide skill and the official plugin contract; this file records repo-local decisions.

## Layout

- `src/index.ts` — function-plugin contract (`name`/`inject`/`Config`/`apply`; NO default export). Injects `skills` and `tools` only. Publishes the packaged `skills/` directory through the official `FileSystemSkillProvider` and registers the four tools.
- `src/config.ts` — Schemastery schema + explicit `resolveConfig` (no hidden `?? default` in run paths). Bounds fail loud at mount.
- `src/chain.ts` — the `ChainMap` data model + validation (pure): unique node ids, legal tiers, no dangling edges, and every `value` requires a `sourceRef` (a value-less slot is an explicit gap).
- `src/timeline.ts` — the `timeline.jsonl` store (pure fs): URL-normalized dedupe, host allow/block lists, corrupt-line tolerance with a surfaced count, and the retention cap.
- `src/sources.ts` — the per-industry `sources.json` registry: stable `S<n>` refs, origins, and SHA-256 content hashes.
- `src/company.ts` — company scan: text-format data files (no PDF), Markdown outlines, figure-candidate lines, `card.json` + `card.md`.
- `src/report.ts` — report assembly: evidence/sections/claims building, draft validation, the mechanical auto-draft, and the builtin-fallback Markdown + manifest renderer.
- `src/engine-bridge.ts` — the frozen `ctx.researchReport` contract (byte-identical with the sibling plugin) and the structural `ctx.get('researchReport')` lookup. Never injected, never imported.
- `src/web.ts` — the structural `ctx.web` lookup, the offline/unmounted loud failures, and per-request timeout signals.
- `src/paths.ts` / `src/toolkit.ts` — workspace containment and the `<cwd>/<industryRoot>/` layout.
- `src/events.ts` — typed Cordis events (`industry-research/map|track|report`, `@mode emit`).
- `src/tools/*.ts` — the four `defineTool` definitions.
- `skills/` — the two methodology SKILL.md bundles (Chinese edition).
- `fixtures/baijiu/` — committed teaching fixtures for the keyless e2e suite (clearly fictional).
- `scripts/` — `prepare.mjs` (build), `verify-self-contained.mjs`, `verify-artifacts.mjs`, `check-readme-sync.mjs` (five-language gate), `changelog-section.mjs`, `loader-runner.mjs` (real Loader composition runner).
- `test/` — vitest; REAL `Context`/`SessionStore`/`Session`/`ToolRuntime`/`SkillRegistry`/`WebRuntime` from the 0.1.0-rc.8 peers. Only the pluggable edges (web providers, the optional report engine) are scripted, through the real registration mechanisms.

## Hard rules applied here

- **Optional capabilities are looked up, never injected.** `ctx.web` and `ctx.researchReport` are resolved with `ctx.get(...)` at execution time; without them `industry_track` fails loud with mount guidance and `industry_report` takes the honest builtin-fallback path. Writing them into `inject` would park the plugin in PENDING forever on deployments without those siblings.
- **Cordis events, not session-log events.** `industry-research/*` events are typed Cordis observability events and are never appended to the session log: the durable record is the workspace artifacts, model-visible tool results ride the durable `tool/result` session event, and observability rides the typed Cordis events.
- **No network outside `ctx.web`.** All retrieval goes through the official seam (provider selection, timeouts, and error taxonomy have one owner); `offline: true` disables it entirely.
- **No invented data.** A metric value without a source is a validation error; a missing value is an explicit gap slot; reports list gaps instead of filling them. Fictitious fixture data is clearly marked as teaching material.
- **Workspace containment.** Industry/company names are validated segments; data files are containment-checked against the session cwd (both sides `resolve()`d — Windows backslash trap).
- **No tunables hardcoded.** Every knob is a validated `Config` field with a default in `src/config.ts`, an inline comment in `cordis.patch.yml`, and a row in the five-language README configuration table.
- **Research-only compliance.** Tool descriptions, cards, and reports carry 「仅供研究，不构成投资建议」; data points carry asOf and sources.
- **This plugin registers no waterfall listeners.** If one is ever added, allow/passthrough MUST call `next()`.

## Checks

`pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm run verify:readme-sync && pnpm run pack:check`

- `typecheck` resolves `@deepseek-ai/*` through the installed 0.1.0-rc.8 peers; `typecheck:ci` clears `skipLibCheck` and enables `verbatimModuleSyntax` against the published types. Both must stay green.

## Release

The release session bumps package.json + `src/version.ts`, stamps the CHANGELOG `[Unreleased]` section, re-runs the full gate, and commits + tags (never pushes from a dev session). `.github/workflows/release.yml` publishes to npm with provenance on version tags.

## Docs

- Five-language READMEs (`README.md`, `README.zh.md`, `README.es.md`, `README.pt.md`, `README.hi.md`) — keep all five in sync; the English file is the source of truth. `scripts/check-readme-sync.mjs` (CI) enforces section structure and configuration-table keys.
- GitHub topics `dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report` (mirror `package.json` keywords).
- License is Apache-2.0 (`LICENSE` + the package.json `license` field). `THIRD_PARTY_NOTICES.md` documents the build-time dependencies.
