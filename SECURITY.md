# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Report privately through GitHub's private vulnerability reporting:

**https://github.com/PerryLink/dsh-industry-research/security/advisories/new**

That flow keeps the report confidential while we triage, and it is the channel we watch first.

## Before you report

- **Redact sensitive data** from any logs, session excerpts, or report artifacts you attach: tokens, API keys, secrets, Authorization/request headers, personal paths, and account identifiers.
- Include, when possible: the plugin version, the harness (`dsh`) version, Node and OS versions, and the minimal steps to reproduce.

## What to expect

- **Acknowledgment**: within 5 business days.
- **Triage**: within 10 business days we confirm the issue and assess severity, or ask for more details.
- **Fix**: security fixes are prepared in a private fork, released as a patch version, and announced in the release notes.

## Disclosure and credit

- We follow coordinated disclosure: a public advisory (and CVE request where appropriate) is published once a fix ships.
- Reporters are credited in the advisory unless they ask to remain anonymous. There is no bug bounty program at this time.

## Scope

This plugin is a research domain pack. Its guarantees are:

- **Public sources only, through the official seam** — all network access goes through `ctx.web` (the harness's provider-selected web capability). The plugin never opens its own sockets, never touches login-walled or paid sources, and `offline: true` disables all web access.
- **Workspace containment** — every artifact is written under the configured `industryRoot` inside the session workspace; industry/company names and data-file paths are validated against traversal and escape before any file operation.
- **Provenance by construction** — sources carry SHA-256 content hashes; reports keep a source-traceability appendix; unsourced numbers are validation errors, never prose.
- **No credential handling** — the plugin stores no secrets and reads no credential stores.
- **Fail-loud configuration** — every tunable is validated at mount; invalid bounds throw.
- **Reversible registrations** — every contribution goes through `ctx.effect()` / `ctx.on()` / `register()`, so uninstall and hot reload are clean.

Vulnerabilities in the harness itself should be reported to the official harness maintainers instead.
