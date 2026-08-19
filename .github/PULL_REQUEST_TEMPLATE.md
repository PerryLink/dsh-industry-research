## Checklist

- [ ] All gates are green locally: `pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm pack`
- [ ] Tests added or updated for the changed behavior (real 0.1.0-rc.6 `Context`/`Session`/`ToolRuntime`, not hand-rolled mocks)
- [ ] `CHANGELOG.md` updated under `## [Unreleased]`
- [ ] All five READMEs synced (README.md is the source; zh/es/pt/hi updated in the same PR)
- [ ] Related issue linked (`Fixes #<n>` / `Refs #<n>`)
- [ ] I declare this PR contains no secrets, tokens, or credentials (examples use placeholders only)

## Summary

<!-- What changed and why. Keep it short. -->

## Test evidence

<!-- Commands run and their results; for report/artifact changes include a redacted snippet of the produced report or manifest. -->