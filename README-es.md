<div align="center">

# 🏭 dsh-industry-research
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-industry-research` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Paquete de dominio para investigación de industrias y empresas en DeepSeek Harness.**

*Mapas de cadena industrial, seguimiento de fuentes públicas, tarjetas de empresa e informes auditables: cada cifra remonta a una fuente y cada laguna se declara.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-industry-research.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-industry-research/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-industry-research?label=version)](https://github.com/PerryLink/dsh-industry-research/releases)
[![npm version](https://img.shields.io/npm/v/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads&lang=es)](https://dshfind.com/es/plugins/PerryLink/dsh-industry-research?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-industry-research
```


</div>

---

**Solo con fines de investigación; no constituye asesoramiento de inversión.** Este paquete solo apoya la investigación: sin trading, sin predicción de precios, sin fuentes de pago o con inicio de sesión.


**📖 Base de conocimiento del ecosistema** — datos medidos, no marketing: [guía de desarrollo · datos de selección · criterios de mantenimiento](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # instalar
dsh plugin --profile demo remove dsh-industry-research    # desinstalar
```

Verifica que la fila se monta: `dsh --profile demo --dump-config | grep dsh-industry-research`.

## ⭐ 如果它帮到了你

Este plugin forma parte de la [familia de plugins DSH](https://github.com/PerryLink) (más de 40, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre antes.

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-industry-research?

Paquete de dominio para investigación de industrias y empresas en DeepSeek Harness.

Mapas de cadena industrial, seguimiento de fuentes públicas, tarjetas de empresa e informes auditables: cada cifra remonta a una fuente y cada laguna se declara.

![Demostración de terminal de dsh-industry-research: dsh-industry-research — install, then the three artifacts](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-hero.png)

![Animated terminal demo of dsh-industry-research](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-demo.gif)

*La misma ejecución, animada.*

## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1` (línea publicada en npm, verificado el 2026-09-25; peers en `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`).
0.1.2-rc.1 (adaptado el 2026-09-02): el sobre de sesión conserva su campo ignorable solo para compatibilidad de lectura de logs almacenados - Session.append aún no puede estamparlo, por lo que el comportamiento de la puerta no cambia.
Verificado el 2026-09-24 contra los peers publicados `0.1.7-rc.2` (cadena de puertas completa; el smoke de instalación de perfil real lo ejecuta el job semanal y por PR `compat.yml`).
- Node `^22.19.0 || >=24.0.0`, solo ESM (`"type": "module"`).
- Dependencias peer: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, y `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` en `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` (todas compuestas por el bundle oficial `dsh-base`).
- Capacidades opcionales, resueltas en tiempo de ejecución (nunca inyectadas): `ctx.web` (recuperación de fuentes públicas, compuesta por `dsh-base`) y `ctx.researchReport` (el motor de sellado del plugin hermano `dsh-research-report`).

## What you get

- **`industry_map`** — crea o actualiza un mapa de cadena industrial (`chain.json`): nodos upstream/midstream/downstream, aristas y ranuras de métricas. Una métrica con `value` exige `sourceRef`; una ranura sin valor es una laguna explícita. Las notas/archivos semilla y un resumen opcional de `ctx.web` se registran como fuentes citables (`S1`, `S2`, …).
- **`industry_track`** — seguimiento de políticas y noticias de fuentes públicas a través de la costura oficial `ctx.web`: búsqueda por tema, listas de permitidos/bloqueados por host, filtro `since`, capturas de instantáneas limitadas con hashes SHA-256 de procedencia, y fusión con deduplicación en `timeline.jsonl` con tope de retención. Falla en voz alta cuando la capacidad web no está disponible.
- **`company_scan`** — tarjetas de empresa (`card.json` + `card.md`) a partir de tus archivos de datos del workspace (hash SHA-256, esquemas Markdown y líneas candidatas de cifras para que cada número cite archivo y línea), con complemento opcional de citas `ctx.web`. Solo formatos de texto en v1 (sin PDF).
- **`industry_report`** — un informe auditable a partir del mapa + la línea temporal + las tarjetas. Con el motor `ctx.researchReport` montado, evidencia/secciones/claims se sellan mediante su `assemble` y regresan los veredictos por claim; sin él, la ruta integrada escribe `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` versionados con una tabla de trazabilidad SHA-256 y etiqueta honestamente `engine: 'builtin-fallback'`.
- **Dos skills de metodología** — `industry-research-method` (descomposición de la cadena, marco oferta/demanda, disciplina de fuentes, disciplina de declaración de lagunas) y `company-research-method` (marco de empresa, lista de fuentes públicas, redacción de cumplimiento).
- **Eventos Cordis tipados** — `industry-research/map`, `industry-research/track`, `industry-research/report` emitidos tras cada artefacto confirmado.

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-industry-research
```

### Canal git

```sh
# Desde un profile temporal (fija el commit; ejecuta el build `prepare` autocontenido)
dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
# El pnpm-workspace.yaml del profile gana una entrada allowBuilds para dsh-industry-research en el primer add.
```

### Canal npm

```sh
dsh plugin --profile demo add dsh-industry-research
```

Ambos canales instalan la fila del bundle (ver `cordis.patch.yml`) en la pila `dsh.profile.bundles` del profile y surten efecto al reiniciar.

Luego, en una sesión:

```
加载 industry-research-method 技能，然后研究白酒行业：
先 industry_map 建产业链图，再 industry_track 跟踪政策，最后 industry_report 出报告。
```

## Configuration

Todos los ajustes son campos `Config` de Schemastery; los valores inválidos fallan ruidosamente al cargar el profile.

| Key | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Interruptor maestro; `false` no monta nada. |
| `industryRoot` | `industry-research` | Raíz de artefactos, relativa al workspace de sesión (o absoluta). |
| `fetchTimeoutMs` | `20000` | Tiempo de espera por solicitud (ms) para llamadas `ctx.web`. |
| `timelineMaxEntries` | `500` | Entradas retenidas por `timeline.jsonl` (se descartan las más antiguas). |
| `sourceAllowlist` | `[]` | Lista de hosts permitidos (vacía = todos). |
| `sourceBlocklist` | `[]` | Lista de hosts bloqueados (prevalece sobre la permitida). |
| `offline` | `false` | Modo offline: nunca toca `ctx.web`; solo datos locales. |
| `skillsDir` | _(sin definir)_ | Raíz de skills explícita; por defecto el `skills/` empaquetado. |
| `track.maxResultsPerTopic` | `10` | maxResults de `web_search` por tema. |
| `track.maxFetchesPerCall` | `10` | Presupuesto de capturas por llamada `industry_track`. |
| `scan.maxFileBytes` | `1048576` | Tope de lectura por archivo de datos de empresa. |
| `scan.maxFigureCandidates` | `100` | Presupuesto de líneas candidatas por escaneo. |
| `scan.strictTicker` | `true` | Los tickers de tarjetas deben coincidir con un formato integrado (A-share 6 dígitos, EE. UU. 1–5 letras, HK 1–5 dígitos); `false` exime la verificación. |

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

Con `chain`: valida (aristas colgadas, valores sin fuente, tiers ilegales, ids duplicados, status/statusAsOf, `taxonomyCode` desconocido — fallo ruidoso con la lista completa) y persiste `chain.json`, luego lista las lagunas explícitas y los nodos cuello de botella. Sin `chain`: devuelve el mapa actual, las fuentes registradas y un resumen opcional de estructura vía `ctx.web` para iterar. Con `renderSvg: true` también escribe un `chain.svg` determinista. `depth` escala la asistencia web. Emite `industry-research/map`.

### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

Busca cada tema a través de `ctx.web`, filtra por las listas y `since`, captura instantáneas (SHA-256) dentro del presupuesto y fusiona en `timeline.jsonl` (deduplicación por URL normalizada, con tope). `depth` escala el presupuesto; `evidenceCategory` etiqueta cada entrada y se valida contra la enumeración de seis categorías. Las fuentes cuya instantánea falló se conservan como entradas solo-cita con la razón en `note`. Falla en voz alta nombrando la capacidad faltante cuando `ctx.web` no está montada o `offline: true`. Emite `industry-research/track`.

### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

Lee los archivos de datos del workspace (`.md/.txt/.csv/.tsv/.json`; v1 no analiza PDF), los hashea, extrae esquemas Markdown y líneas candidatas de cifras, adjunta citas `ctx.web` opcionales y persiste la tarjeta. Un `status` requiere un `statusAsOf` no futuro; un `ticker` debe coincidir con un formato integrado salvo `scan.strictTicker: false`; cada valor de `metrics` debe llevar `source` + `asOf`. `companies` (lote) aísla una empresa fallida sin abortar el lote; `parallel: true` distribuye cada empresa en un job independiente cuando `ctx.jobs` está montado (si no, vuelve a secuencial, reflejado en `mode`). Los archivos rechazados regresan con razones; todo lo que la tarjeta no puede establecer es una laguna explícita.

### `industry_report({ industry, sections?, companies?, draft? })`

Reúne la evidencia (`E-chain`, `E-timeline`, `E-company-<slug>`), verifica los artefactos leídos contra `versions.jsonl` (el hash que no coincide falla en voz alta) y valida tu `draft` (secciones + claims; cada `evidenceIds` debe referenciar evidencia registrada) o construye el borrador mecánico (métricas con fuente y entradas recientes se convierten en claims, agrupadas por `evidenceCategory`). Un contrato de entrega determinista corre antes de producir y falla en voz alta ante bloques faltantes, marcadores de posición o aserciones sin fuente/fecha. Una comprobación adversaria determinista siempre corre, y un job de revisión rojo (`red-review-note.md`) se lanza cuando `ctx.jobs` está montado (si no, `review: skipped(jobs unavailable)`). Ruta del motor: directorio sellado + `sealHash` + veredictos por claim. Ruta integrada: Markdown versionado + manifiesto, claims honestamente marcados `unverified`. Emite `industry-research/report`.

## Skills

- **`industry-research-method`** — metodología de investigación industrial: descomposición upstream/midstream/downstream, marco oferta/demanda, disciplina de fuentes (cada número: valor + unidad + fuente + asOf) y disciplina de lagunas (declarar, nunca fabricar).
- **`company-research-method`** — metodología de investigación de empresas: marco de estructura de negocio / finanzas / riesgos, lista de prioridad de fuentes públicas (divulgaciones de la empresa → reguladores → medios autorizados) y redacción de cumplimiento.

Ambas se cargan bajo demanda con la herramienta estándar `skill` (`加载 industry-research-method 技能`).

## Data layout

```
<workspace>/<industryRoot>/versions.jsonl             registro de versiones (SHA-256 + timestamp + cambio)
<workspace>/<industryRoot>/<industria>/research-state.json  memoria de estado de investigación
<workspace>/<industryRoot>/<industria>/red-review-note.md    industry_report (revisión roja, jobs)
<workspace>/<industryRoot>/<industria>/chain.json      industry_map
<workspace>/<industryRoot>/<industria>/chain.svg       industry_map (renderSvg: true)
<workspace>/<industryRoot>/<industria>/timeline.jsonl  industry_track
<workspace>/<industryRoot>/<industria>/sources.json    registro de fuentes citables (S1, S2, …)
<workspace>/<industryRoot>/<industria>/notes/          notas semilla
<workspace>/<industryRoot>/<industria>/reports/<ts>/   industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<empresa>/card.*  company_scan
```

## Permissions & data

`dsh-industry-research` consume solo costuras públicas: `ctx.tools`, `ctx.skills` y — resueltas opcionalmente — `ctx.web` y `ctx.researchReport`. No realiza acceso de red propio (toda recuperación pasa por `ctx.web` con la selección de proveedor del despliegue y tus tiempos de espera configurados), no almacena credenciales y solo escribe dentro del workspace de sesión bajo `industryRoot`. Solo se usan fuentes públicas; las fuentes de pago o con inicio de sesión están fuera de alcance — pasa tus propias exportaciones como `dataFiles`.

## Security boundaries

- **Contención en el workspace** — nombres de industria/empresa validados como segmentos de ruta; archivos de datos verificados contra el cwd de sesión (ambos lados resueltos).
- **Procedencia por construcción** — las fuentes llevan hashes SHA-256; los números sin fuente son errores de validación; las líneas corruptas de la línea temporal se omiten con un conteo visible, nunca en silencio.
- **Degradación honesta** — la ausencia de `ctx.web` / `ctx.researchReport` produce fallos ruidosos o artefactos fallback honestamente etiquetados, nunca fabricación silenciosa.
- **Registros reversibles** — todo pasa por `ctx.effect()` / `ctx.on()` / `register()`.
- **Cumplimiento solo-investigación** — descripciones de herramientas, tarjetas e informes llevan 「仅供研究，不构成投资建议」; los datos llevan asOf y fuentes.

## Known limitations

- **Eventos Cordis, no eventos de log de sesión** — los eventos `industry-research/*` son observabilidad Cordis tipada y nunca se anexan al log de sesión; el registro duradero son los artefactos del workspace; la observabilidad viaja por los eventos Cordis tipados; los resultados de herramientas visibles al modelo viajan por el evento duradero `tool/result`.
- **Sin escrituras en `ctx.attachment`** — la costura de adjuntos de rc2 solo acepta imágenes (PNG/JPEG/WebP/GIF); los informes Markdown permanecen como archivos versionados del workspace, referenciados por ruta absoluta en el resultado de la herramienta.
- **v1 solo lee formatos de texto** — sin análisis de PDF; pide a los usuarios convertir los PDF a texto/Markdown primero.
- **Skills en edición china** — las skills de metodología empaquetadas se publican en chino; una edición en inglés es trabajo futuro.
- **Herramientas en primer plano** — `industry_track` está acotada por `track.maxFetchesPerCall` y `fetchTimeoutMs` y corre en primer plano; un modo con trabajos en segundo plano es trabajo futuro.
- **El borrador automático es mecánico** — resume artefactos y convierte datos con fuente en claims; la calidad narrativa viene de los `draft` escritos por el modelo.

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

- Diseño e implementación iniciales por la sesión de desarrollo de `dsh-industry-research` (DeepSeek Harness).

Las contribuciones externas son bienvenidas — abre un issue o una pull request.

**Versión de DSH aplicable:** verificada con `dsh-v0.2.1-alpha.1` (la versión del host a la que apunta esta compilación); requiere `>=0.1.7-alpha.1 <0.2.0`.

## Familia de plugins DSH de PerryLink

Este proyecto es uno de los **87 plugins activamente mantenidos** de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro familiar tiene **95** plugins — **5 congelados**, **3 retirados** — y permanece plegado abajo para que cada README conserve una primera pantalla corta. Expándelo para ver cada fila, con el motivo en la columna Estado.

<details>
<summary>Expandir los 95 plugins</summary>

| Plugin | Una línea | Estado |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 CONGELADO — ver el README del repositorio |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>## License

Apache-2.0 — consulta [LICENSE](LICENSE).

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
