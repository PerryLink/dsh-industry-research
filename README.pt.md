<div align="center">

# 🏭 dsh-industry-research

**Pacote de domínio para pesquisa de indústrias e empresas no DeepSeek Harness.**

*Mapas de cadeia industrial, acompanhamento de fontes públicas, cartões de empresa e relatórios auditáveis — cada número remonta a uma fonte, cada lacuna é declarada.*

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

**仅供研究，不构成投资建议 — Apenas para pesquisa; não constitui aconselhamento de investimento.** Este pacote só apoia pesquisa: sem trading, sem previsão de preços, sem fontes pagas ou com login.

## Compatibility

- DeepSeek Harness `0.1.1-rc.2` (peers fixados em `0.1.1-rc.2`).
- Node `^22.19.0 || >=24.0.0`, apenas ESM (`"type": "module"`).
- Dependências peer: `@deepseek-ai/cordis ^4.0.1`, `@deepseek-ai/schemastery ^3.18.0`, e `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` em `>=0.1.0-rc.8 <0.2.0` (todas compostas pelo bundle oficial `dsh-base`).
- Capacidades opcionais, resolvidas em tempo de execução (nunca injetadas): `ctx.web` (recuperação de fontes públicas, composta pelo `dsh-base`) e `ctx.researchReport` (o motor de selagem do plugin irmão `dsh-research-report`).

## What you get

- **`industry_map`** — cria ou atualiza um mapa de cadeia industrial (`chain.json`): nós upstream/midstream/downstream, arestas e slots de métricas. Uma métrica com `value` exige `sourceRef`; um slot sem valor é uma lacuna explícita. Notas/arquivos-semente e um resumo opcional do `ctx.web` são registrados como fontes citáveis (`S1`, `S2`, …).
- **`industry_track`** — acompanhamento de políticas e notícias de fontes públicas pela costura oficial `ctx.web`: busca por tópico, listas de hosts permitidos/bloqueados, filtro `since`, capturas de snapshots limitadas com hashes SHA-256 de proveniência, e fusão com deduplicação em `timeline.jsonl` com teto de retenção. Falha em voz alta quando a capacidade web está inalcançável.
- **`company_scan`** — cartões de empresa (`card.json` + `card.md`) a partir dos seus arquivos de dados do workspace (hash SHA-256, esboços Markdown e linhas candidatas de números para que cada número cite arquivo e linha), com complemento opcional de citações `ctx.web`. Apenas formatos de texto na v1 (sem PDF).
- **`industry_report`** — um relatório auditável a partir do mapa + linha do tempo + cartões. Com o motor `ctx.researchReport` montado, evidência/seções/claims são seladas pelo seu `assemble` e os veredictos por claim retornam; sem ele, a rota integrada escreve `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` versionados com tabela de rastreabilidade SHA-256 e rotula honestamente `engine: 'builtin-fallback'`.
- **Duas skills de metodologia** — `industry-research-method` (decomposição da cadeia, estrutura oferta/demanda, disciplina de fontes, disciplina de declaração de lacunas) e `company-research-method` (estrutura de empresa, lista de fontes públicas, redação de conformidade).
- **Eventos Cordis tipados** — `industry-research/map`, `industry-research/track`, `industry-research/report` emitidos após cada artefato confirmado.

## Quick start

### Canal git

```sh
# A partir de um profile temporário (fixa o commit; executa o build `prepare` autocontido)
dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
# O pnpm-workspace.yaml do profile ganha uma entrada allowBuilds para dsh-industry-research no primeiro add.
```

### Canal npm

```sh
dsh plugin --profile demo add dsh-industry-research
```

Ambos os canais instalam a linha do bundle (ver `cordis.patch.yml`) na pilha `dsh.profile.bundles` do profile e fazem efeito ao reiniciar.

Depois, numa sessão:

```
加载 industry-research-method 技能，然后研究白酒行业：
先 industry_map 建产业链图，再 industry_track 跟踪政策，最后 industry_report 出报告。
```

## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # instalar
dsh plugin --profile demo remove dsh-industry-research    # desinstalar
```

Verifique se a linha monta: `dsh --profile demo --dump-config | grep dsh-industry-research`.

## Configuration

Todos os ajustes são campos `Config` de Schemastery; valores inválidos falham ruidosamente ao carregar o profile.

| Key | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Interruptor mestre; `false` não monta nada. |
| `industryRoot` | `industry-research` | Raiz de artefatos, relativa ao workspace da sessão (ou absoluta). |
| `fetchTimeoutMs` | `20000` | Tempo limite por requisição (ms) para chamadas `ctx.web`. |
| `timelineMaxEntries` | `500` | Entradas retidas por `timeline.jsonl` (as mais antigas são descartadas). |
| `sourceAllowlist` | `[]` | Lista de hosts permitidos (vazia = todos). |
| `sourceBlocklist` | `[]` | Lista de hosts bloqueados (prevalece sobre a permitida). |
| `offline` | `false` | Modo offline: nunca toca `ctx.web`; apenas dados locais. |
| `skillsDir` | _(não definido)_ | Raiz de skills explícita; por padrão o `skills/` empacotado. |
| `track.maxResultsPerTopic` | `10` | maxResults do `web_search` por tópico. |
| `track.maxFetchesPerCall` | `10` | Orçamento de capturas por chamada `industry_track`. |
| `scan.maxFileBytes` | `1048576` | Teto de leitura por arquivo de dados de empresa. |
| `scan.maxFigureCandidates` | `100` | Orçamento de linhas candidatas por varredura. |
| `scan.strictTicker` | `true` | Tickers de cartões devem corresponder a um formato integrado (A-share 6 dígitos, EUA 1–5 letras, HK 1–5 dígitos); `false` isenta a verificação. |

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

Com `chain`: valida (arestas pendentes, valores sem fonte, tiers ilegais, ids duplicados, status/statusAsOf, `taxonomyCode` desconhecido — falha ruidosa com a lista completa) e persiste `chain.json`, depois lista as lacunas explícitas e os nós gargalo. Sem `chain`: devolve o mapa atual, as fontes registradas e um resumo opcional de estrutura via `ctx.web` para iterar. Com `renderSvg: true` também grava um `chain.svg` determinístico. `depth` escala a assistência web. Emite `industry-research/map`.

### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

Busca cada tópico via `ctx.web`, filtra pelas listas e `since`, captura snapshots (SHA-256) dentro do orçamento e funde em `timeline.jsonl` (deduplicação por URL normalizada, com teto). `depth` escala o orçamento; `evidenceCategory` rotula cada entrada e é validado contra a enumeração de seis categorias. Fontes cujo snapshot falhou são mantidas como entradas só-citação com a razão em `note`. Falha em voz alta nomeando a capacidade ausente quando `ctx.web` não está montada ou `offline: true`. Emite `industry-research/track`.

### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

Lê os arquivos de dados do workspace (`.md/.txt/.csv/.tsv/.json`; v1 não analisa PDF), calcula hashes, extrai esboços Markdown e linhas candidatas de números, anexa citações `ctx.web` opcionais e persiste o cartão. Um `status` exige um `statusAsOf` não futuro; um `ticker` deve corresponder a um formato integrado salvo `scan.strictTicker: false`; cada valor de `metrics` deve levar `source` + `asOf`. `companies` (lote) isola uma empresa falha sem abortar o lote; `parallel: true` distribui cada empresa em um job independente quando `ctx.jobs` está montado (senão volta a sequencial, refletido em `mode`). Arquivos rejeitados retornam com razões; tudo o que o cartão não consegue estabelecer é uma lacuna explícita.

### `industry_report({ industry, sections?, companies?, draft? })`

Reúne a evidência (`E-chain`, `E-timeline`, `E-company-<slug>`), verifica os artefatos lidos contra `versions.jsonl` (hash divergente falha em voz alta) e valida o seu `draft` (seções + claims; cada `evidenceIds` deve referenciar evidência registrada) ou constrói o rascunho mecânico (métricas com fonte e entradas recentes viram claims, agrupadas por `evidenceCategory`). Um contrato de entrega determinístico roda antes de produzir e falha em voz alta ante blocos faltantes, marcadores de posição ou asserções sem fonte/data. Uma verificação adversária determinística sempre roda, e um job de revisão vermelho (`red-review-note.md`) é lançado quando `ctx.jobs` está montado (senão `review: skipped(jobs unavailable)`). Rota do motor: diretório selado + `sealHash` + veredictos por claim. Rota integrada: Markdown versionado + manifesto, claims honestamente marcados `unverified`. Emite `industry-research/report`.

## Skills

- **`industry-research-method`** — metodologia de pesquisa industrial: decomposição upstream/midstream/downstream, estrutura oferta/demanda, disciplina de fontes (cada número: valor + unidade + fonte + asOf) e disciplina de lacunas (declarar, nunca fabricar).
- **`company-research-method`** — metodologia de pesquisa de empresas: estrutura de negócio / finanças / riscos, lista de prioridade de fontes públicas (divulgações da empresa → reguladores → mídia autorizada) e redação de conformidade.

Ambas carregam sob demanda pela ferramenta padrão `skill` (`加载 industry-research-method 技能`).

## Data layout

```
<workspace>/<industryRoot>/versions.jsonl             registro de versões (SHA-256 + timestamp + mudança)
<workspace>/<industryRoot>/<indústria>/research-state.json  memória de estado de pesquisa
<workspace>/<industryRoot>/<indústria>/red-review-note.md    industry_report (revisão vermelha, jobs)
<workspace>/<industryRoot>/<indústria>/chain.json      industry_map
<workspace>/<industryRoot>/<indústria>/chain.svg       industry_map (renderSvg: true)
<workspace>/<industryRoot>/<indústria>/timeline.jsonl  industry_track
<workspace>/<industryRoot>/<indústria>/sources.json    registro de fontes citáveis (S1, S2, …)
<workspace>/<industryRoot>/<indústria>/notes/          notas-semente
<workspace>/<industryRoot>/<indústria>/reports/<ts>/   industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<empresa>/card.*  company_scan
```

## Permissions & data

`dsh-industry-research` consome apenas costuras públicas: `ctx.tools`, `ctx.skills` e — resolvidas opcionalmente — `ctx.web` e `ctx.researchReport`. Não realiza acesso de rede próprio (toda recuperação passa por `ctx.web` com a seleção de provedor do deployment e os seus tempos limite configurados), não armazena credenciais e só escreve dentro do workspace da sessão sob `industryRoot`. Apenas fontes públicas são usadas; fontes pagas ou com login estão fora do escopo — passe as suas próprias exportações como `dataFiles`.

## Security boundaries

- **Contenção no workspace** — nomes de indústria/empresa validados como segmentos de caminho; arquivos de dados verificados contra o cwd da sessão (ambos os lados resolvidos).
- **Proveniência por construção** — fontes carregam hashes SHA-256; números sem fonte são erros de validação; linhas corrompidas da linha do tempo são ignoradas com contagem visível, nunca em silêncio.
- **Degradação honesta** — a ausência de `ctx.web` / `ctx.researchReport` produz falhas ruidosas ou artefatos fallback honestamente rotulados, nunca fabricação silenciosa.
- **Registros reversíveis** — tudo passa por `ctx.effect()` / `ctx.on()` / `register()`.
- **Conformidade apenas-pesquisa** — descrições de ferramentas, cartões e relatórios carregam 「仅供研究，不构成投资建议」; os dados carregam asOf e fontes.

## Known limitations

- **Eventos Cordis, não eventos de log de sessão** — os eventos `industry-research/*` são observabilidade Cordis tipada e nunca são anexados ao log de sessão; o registro duradouro são os artefatos do workspace; a observabilidade viaja pelos eventos Cordis tipados; os resultados de ferramentas visíveis ao modelo viajam pelo evento duradouro `tool/result`.
- **Sem escritas em `ctx.attachment`** — a costura de anexos do rc2 só aceita imagens (PNG/JPEG/WebP/GIF); os relatórios Markdown permanecem como arquivos versionados do workspace, referenciados por caminho absoluto no resultado da ferramenta.
- **v1 só lê formatos de texto** — sem análise de PDF; peça aos usuários para converter os PDFs em texto/Markdown primeiro.
- **Skills em edição chinesa** — as skills de metodologia empacotadas são publicadas em chinês; uma edição em inglês é trabalho futuro.
- **Ferramentas em primeiro plano** — `industry_track` é limitada por `track.maxFetchesPerCall` e `fetchTimeoutMs` e corre em primeiro plano; um modo com trabalhos em segundo plano é trabalho futuro.
- **O rascunho automático é mecânico** — resume artefatos e converte dados com fonte em claims; a qualidade narrativa vem dos `draft` escritos pelo modelo.

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

- Design e implementação iniciais pela sessão de desenvolvimento de `dsh-industry-research` (DeepSeek Harness).

Contribuições externas são bem-vindas — abra uma issue ou um pull request.

## License

Apache-2.0 — veja [LICENSE](LICENSE).
