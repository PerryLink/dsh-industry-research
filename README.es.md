<div align="center">

# 🏭 dsh-industry-research

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

- DeepSeek Harness `0.1.1-rc.2` (peers fijados en `0.1.1-rc.2`).
- Node `^22.19.0 || >=24.0.0`, solo ESM (`"type": "module"`).
- Dependencias peer: `@deepseek-ai/cordis ^4.0.1`, `@deepseek-ai/schemastery ^3.18.0`, y `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` en `>=0.1.0-rc.8 <0.2.0` (todas compuestas por el bundle oficial `dsh-base`).
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

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain? })`

Con `chain`: valida (aristas colgadas, valores sin fuente, tiers ilegales, ids duplicados — fallo ruidoso con la lista completa) y persiste `chain.json`, luego lista las lagunas explícitas. Sin `chain`: devuelve el mapa actual, las fuentes registradas y un resumen opcional de estructura vía `ctx.web` para iterar. Emite `industry-research/map`.

### `industry_track({ industry, topics?, since? })`

Busca cada tema a través de `ctx.web`, filtra por las listas y `since`, captura instantáneas (SHA-256) dentro del presupuesto y fusiona en `timeline.jsonl` (deduplicación por URL normalizada, con tope). Las fuentes cuya instantánea falló se conservan como entradas solo-cita con la razón en `note`. Falla en voz alta nombrando la capacidad faltante cuando `ctx.web` no está montada o `offline: true`. Emite `industry-research/track`.

### `company_scan({ name, dataFiles?, web? })`

Lee los archivos de datos del workspace (`.md/.txt/.csv/.tsv/.json`; v1 no analiza PDF), los hashea, extrae esquemas Markdown y líneas candidatas de cifras, adjunta citas `ctx.web` opcionales y persiste la tarjeta. Los archivos rechazados regresan con razones; todo lo que la tarjeta no puede establecer es una laguna explícita.

### `industry_report({ industry, sections?, companies?, draft? })`

Reúne la evidencia (`E-chain`, `E-timeline`, `E-company-<slug>`) y valida tu `draft` (secciones + claims; cada `evidenceIds` debe referenciar evidencia registrada) o construye el borrador mecánico (métricas con fuente y entradas recientes se convierten en claims). Ruta del motor: directorio sellado + `sealHash` + veredictos por claim. Ruta integrada: Markdown versionado + manifiesto, claims honestamente marcados `unverified`. Emite `industry-research/report`.

## Skills

- **`industry-research-method`** — metodología de investigación industrial: descomposición upstream/midstream/downstream, marco oferta/demanda, disciplina de fuentes (cada número: valor + unidad + fuente + asOf) y disciplina de lagunas (declarar, nunca fabricar).
- **`company-research-method`** — metodología de investigación de empresas: marco de estructura de negocio / finanzas / riesgos, lista de prioridad de fuentes públicas (divulgaciones de la empresa → reguladores → medios autorizados) y redacción de cumplimiento.

Ambas se cargan bajo demanda con la herramienta estándar `skill` (`加载 industry-research-method 技能`).

## Data layout

```
<workspace>/<industryRoot>/<industria>/chain.json      industry_map
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

## License

Apache-2.0 — consulta [LICENSE](LICENSE).
