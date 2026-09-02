<div align="center">

# 🏭 dsh-industry-research
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-industry-research` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**Paquete de dominio para investigación de industrias y empresas en DeepSeek Harness.**

*Mapas de cadena industrial, seguimiento de fuentes públicas, tarjetas de empresa e informes auditables: cada cifra remonta a una fuente y cada laguna se declara.*

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

**仅供研究，不构成投资建议 — Solo con fines de investigación; no constituye asesoramiento de inversión.** Este paquete solo apoya la investigación: sin trading, sin predicción de precios, sin fuentes de pago o con inicio de sesión.

## Compatibility

- DeepSeek Harness `0.1.2-alpha.5` (peers fijados en `0.1.2-alpha.5`).
0.1.2-alpha.5 (adaptado el 2026-09-02): el sobre de sesión conserva su campo ignorable solo para compatibilidad de lectura de logs almacenados - Session.append aún no puede estamparlo, por lo que el comportamiento de la puerta no cambia.
- Node `^22.19.0 || >=24.0.0`, solo ESM (`"type": "module"`).
- Dependencias peer: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, y `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` en `>=0.1.0-rc.8 <0.2.0` (todas compuestas por el bundle oficial `dsh-base`).
- Capacidades opcionales, resueltas en tiempo de ejecución (nunca inyectadas): `ctx.web` (recuperación de fuentes públicas, compuesta por `dsh-base`) y `ctx.researchReport` (el motor de sellado del plugin hermano `dsh-research-report`).

## What you get

- **`industry_map`** — crea o actualiza un mapa de cadena industrial (`chain.json`): nodos upstream/midstream/downstream, aristas y ranuras de métricas. Una métrica con `value` exige `sourceRef`; una ranura sin valor es una laguna explícita. Las notas/archivos semilla y un resumen opcional de `ctx.web` se registran como fuentes citables (`S1`, `S2`, …).
- **`industry_track`** — seguimiento de políticas y noticias de fuentes públicas a través de la costura oficial `ctx.web`: búsqueda por tema, listas de permitidos/bloqueados por host, filtro `since`, capturas de instantáneas limitadas con hashes SHA-256 de procedencia, y fusión con deduplicación en `timeline.jsonl` con tope de retención. Falla en voz alta cuando la capacidad web no está disponible.
- **`company_scan`** — tarjetas de empresa (`card.json` + `card.md`) a partir de tus archivos de datos del workspace (hash SHA-256, esquemas Markdown y líneas candidatas de cifras para que cada número cite archivo y línea), con complemento opcional de citas `ctx.web`. Solo formatos de texto en v1 (sin PDF).
- **`industry_report`** — un informe auditable a partir del mapa + la línea temporal + las tarjetas. Con el motor `ctx.researchReport` montado, evidencia/secciones/claims se sellan mediante su `assemble` y regresan los veredictos por claim; sin él, la ruta integrada escribe `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` versionados con una tabla de trazabilidad SHA-256 y etiqueta honestamente `engine: 'builtin-fallback'`.
- **Dos skills de metodología** — `industry-research-method` (descomposición de la cadena, marco oferta/demanda, disciplina de fuentes, disciplina de declaración de lagunas) y `company-research-method` (marco de empresa, lista de fuentes públicas, redacción de cumplimiento).
- **Eventos Cordis tipados** — `industry-research/map`, `industry-research/track`, `industry-research/report` emitidos tras cada artefacto confirmado.

## Quick start

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

## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # instalar
dsh plugin --profile demo remove dsh-industry-research    # desinstalar
```

Verifica que la fila se monta: `dsh --profile demo --dump-config | grep dsh-industry-research`.

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

## PerryLink DSH Plugin Family

Este proyecto es uno de los [33 complementos de DeepSeek Harness](https://github.com/PerryLink) mantenidos por [PerryLink](https://github.com/PerryLink). Si este te ayuda, probablemente los demás también:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | Auto-revisión de segundo modelo en la cadena de aprobación, con cierre en fallo por defecto | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | Agentes hijos en segundo plano durables con barra lateral de UI web, mensajería e interrupción | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | Gobernanza de costes para DeepSeek Harness: presupuestos, carbono y latencia en un panel. | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Equivalente a /rewind de Claude Code: instantáneas, bifurcaciones de sesión, restauración de un solo uso | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Migra sesiones, memoria, habilidades y CLAUDE.md de Claude Code a DSH | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | Control de escritorio nativo multiplataforma para DeepSeek Harness — Windows primero. | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | Historial de entrada estilo terminal para el compositor web: flechas, búsqueda Ctrl+R | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | Comprobaciones de calidad de datasets y verificación de citas (el puente numérico opcional consumido aquí) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | Defensa contra inyección de prompts, jailbreak y fuga de secretos para DeepSeek Harness. | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | Guardián de disciplina de ingeniería: interrogatorio de requisitos, puertas de pruebas, revisión adversaria | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | Enrutamiento unificado de generación de imágenes estáticas para DeepSeek Harness. | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | Diagnóstico de rendimiento de solo lectura para DeepSeek Harness. | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | Informes de investigación deterministas para fondos mutuos públicos chinos | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | Integración de PR/issues de GitHub para DSH, cada escritura controlada por aprobación | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | Base de conocimiento documental local para DeepSeek Harness. | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | Integración de modelos locales (Ollama) para DeepSeek Harness. | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | Diagnósticos, formato, autocompletado, acciones de código y renombrado LSP sobre servidores de lenguaje | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | Middleware de enmascaramiento de PII: anonimiza en el límite del modelo, restaura en la capa de visualización | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | Panel de tiempo de ejecución MCP de solo lectura: comando /mcp + pestaña Settings con estado, herramientas y errores | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | Memoria entre sesiones controlada por aprobación: costura ctx.memory + SQLite + herramienta de memoria | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | Exportador de observabilidad OpenTelemetry y Langfuse para DeepSeek Harness. | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Cambio de estilo en tiempo de ejecución equivalente a outputStyles de Claude Code | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | Reglas de permisos declarativas allow/deny/ask estilo Claude Code con auditoría | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | Base de conocimiento de desarrollo de plugins como habilidad de agente bajo demanda | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | Motor de informes de investigación verificables con evidencia direccionada por contenido | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | Puntuación de calidad multidimensional para plugins de DeepSeek Harness. | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | Fija sesiones en la barra lateral web con orden durable | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | Sincronización de sesiones entre dispositivos para DeepSeek Harness — un espejo git dedicado de tu almacén de sesiones. | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | Paquete de habilidades de auditoría de seguridad: escaneo de secretos, revisión de dependencias y cadena de suministro | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | Bucle de sesión con voz para DeepSeek Harness: háblale y escucha su respuesta. | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | Pruebas de instalación y humo aisladas para plugins de DeepSeek Harness. | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | Traducción de parámetros entre proveedores y reparación determinista de JSON para DeepSeek Harness. | |

## License

Apache-2.0 — consulta [LICENSE](LICENSE).
