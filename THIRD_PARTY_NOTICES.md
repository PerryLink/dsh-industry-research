# Third-party notices

`dsh-industry-research` bundles no third-party source code. All TypeScript/JavaScript
sources in this repository are original works by the dsh-industry-research contributors,
licensed under Apache-2.0 (see `LICENSE`).

The package depends on the following software. None of it is bundled into the
published tarball except where noted; these are install-time dependencies:

| Package | Version range | License | Purpose |
|---|---|---|---|
| [tsdown](https://github.com/rolldown/tsdown) | `^0.22.14` | MIT | Build-time bundling of `lib/` (a regular dependency so the git-install channel's `prepare` script can build) |
| [typescript](https://github.com/microsoft/TypeScript) | `^5.9.0` | Apache-2.0 | Build-time declaration emission (`lib/types/`) |
| [@deepseek-ai/cordis](https://www.npmjs.com/package/@deepseek-ai/cordis) | `^4.0.2` (peer) | See package | The plugin runtime |
| [@deepseek-ai/schemastery](https://www.npmjs.com/package/@deepseek-ai/schemastery) | `^3.18.2` (peer) | See package | Configuration schema |
| `@deepseek-ai/dsh-*` peers | `0.1.2-rc.1` (peer) | See packages | Official harness seams (`dsh-tools`, `dsh-skill`, `dsh-skill-filesystem`) |

At runtime the plugin talks to the harness services listed as peerDependencies
plus the optional `ctx.web` and `ctx.researchReport` capabilities (looked up
structurally); it performs no network requests of its own and stores no
credentials.
