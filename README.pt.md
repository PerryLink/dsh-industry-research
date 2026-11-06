<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-industry-research-hero-en-dark.webp">
  <img src="docs/assets/dsh-industry-research-hero-en-light.webp" width="100%" alt="Capa do dsh-industry-research: à esquerda, o nome do plugin, o título «Industry research», duas linhas de valor (cada número com fonte e data; cada lacuna declarada, nunca preenchida), o subtítulo do pipeline e as linhas meta; à direita, um dossiê de pesquisa de exemplo didático — cadeia de três níveis do baijiu (upstream sorgo a 10 CNY com fonte S1 e data 2026-01-01; midstream e downstream marcados como pendentes, lacunas explícitas), o registro de evidência E-chain / E-timeline / E-company-&lt;slug&gt; com sha256, um contrato de entrega 4/4 (blocos completos / checagem de fonte e asOf / placeholders 0 / claims→evidência) e as duas vias para reports/&lt;YYYYMMDD-HHmmss&gt;/report.md + manifest.json: o motor de selagem ctx.researchReport ou o fallback integrado; abaixo, o livro versions.jsonl">
</picture>

# dsh-industry-research

**Transforme uma pesquisa setorial em uma cadeia de evidências verificável: cada número leva fonte e data, cada lacuna é declarada.**

Um pacote de domínio de pesquisa setorial e empresarial para o DeepSeek Harness: quatro ferramentas ligadas ao workspace e dois skills de metodologia, apenas fontes públicas e apenas apoio à pesquisa.

[Instalação](#instalação-em-três-passos) · [Configuração](#configuração) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#compatibilidade)
[![npm](https://img.shields.io/npm/v/dsh-industry-research?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-industry-research)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-industry-research/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%5E22.19.0%20%7C%7C%20%3E%3D24.9.0-339933?style=flat-square&labelColor=2B3245)](#compatibilidade)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-industry-research?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-industry-research/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-industry-research)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-industry-research?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-industry-research/badge)](https://securityscorecards.dev/viewer/?uri=github.com/PerryLink/dsh-industry-research)
[![DSH Market](https://img.shields.io/badge/DSH_Market-listed-4B67B4?style=flat-square&labelColor=2B3245)](https://dsh.market/)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-C71D23?style=flat-square&labelColor=2B3245&logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)

```sh
dsh plugin --profile <name> add dsh-industry-research
```

</div>

<sub>Plugin da comunidade, sem vínculo com a DeepSeek. Repositório único: <https://github.com/PerryLink/dsh-industry-research> (o Gitee é um espelho).</sub>

## O que é

O `dsh-industry-research` divide a pesquisa setorial em um pipeline reproduzível: montar o mapa da cadeia industrial, acompanhar políticas e notícias de fontes públicas, escanear empresas em cartões e, por fim, montar um relatório auditável. Toda métrica com valor precisa de um `sourceRef`; toda lacuna é um espaço explícito e não um número inventado; o relatório vai para o motor de selagem ou segue o caminho de fallback embutido e declara isso com honestidade. Apenas apoio à pesquisa: sem trading, sem previsão de preços e sem fontes pagas ou com login.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-industry-research-flow-v5-dark.svg">
  <img src="docs/assets/dsh-industry-research-flow-v5-light.svg" width="100%" alt="Estrutura do dsh-industry-research: três produtores convergem — industry_map (chain.json + sources.json, chain.svg opcional), industry_track (timeline.jsonl) e company_scan (card.json + card.md) — num registro de evidência (E-chain / E-timeline / E-company-&lt;slug&gt;, cada um com sha256); o portão de contrato do industry_report verifica blocos e parágrafos, requisitos de fonte e asOf, resíduos de placeholder e claims→evidenceIds, além de uma checagem adversarial determinística e, opcionalmente, revisão vermelha e notas bull/bear via ctx.jobs; duas saídas: ctx.researchReport selado (sealHash + veredictos por claim) ou builtin-fallback (reports/&lt;ts&gt;/report.md + manifest.json, claims unverified); a fita versions.jsonl registra cada gravação de map/scan/report e verifica o hash na leitura, falhando alto se não coincidir; linhas tracejadas marcam capacidades opcionais como ctx.web e ctx.jobs">
</picture>

## Instalação em três passos

1. **Instalar** (escolha um canal; ambos montam a linha do bundle na pilha `dsh.profile.bundles` do perfil e passam a valer após reiniciar):

   ```sh
   # canal git (fixa o commit; o primeiro add grava uma entrada allowBuilds no pnpm-workspace.yaml do perfil)
   dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
   # canal npm (publicado 0.3.25)
   dsh plugin --profile demo add dsh-industry-research
   ```

2. **Configuração mínima** (os padrões já funcionam; só sobrescreva se precisar de outra raiz de artefatos ou do modo offline):

   ```yaml
   - insert:
       - id: dsh-industry-research
         name: dsh-industry-research
         config:
           industryRoot: industry-research
           offline: false
   ```

3. **Verificar que montou**:

   ```sh
   dsh --profile demo --dump-config | grep dsh-industry-research
   ```

   Depois, em uma sessão, chame as ferramentas em ordem:

   ```
   Carregue o skill industry-research-method e então pesquise a indústria de baijiu:
   monte a cadeia com industry_map, acompanhe a política com industry_track e finalize com industry_report.
   ```

**Desinstalar**: `dsh plugin --profile demo remove dsh-industry-research` (ou remova a linha do patch do perfil).

<details>
<summary>Instalar pelo mercado do DSH Desktop</summary>

Todos os plugins da PerryLink podem ser navegados no mercado embutido do DSH Desktop: **Market → Sources → Add source → cole** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecione**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.

</details>

## Capacidades principais

- **`industry_map`** — constrói ou atualiza o mapa da cadeia industrial (`chain.json`): nós upstream/midstream/downstream, arestas e espaços de métricas. Uma métrica com `value` precisa de `sourceRef`; um espaço sem valor é uma lacuna explícita. Afirmações de `status` de um nó levam `statusAsOf`, e um `taxonomyCode` opcional precisa casar com a tabela embutida de classificação nacional de indústrias. Com `renderSvg: true` grava também um `chain.svg` determinístico, em camadas, com destaque de gargalos tipo funil/hub. O argumento `depth` escala a ajuda web. Notas/arquivos semente e um resumo opcional de `ctx.web` são registrados como fontes citáveis (`S1`, `S2`, …).
- **`industry_track`** — acompanhamento de políticas e notícias de fontes públicas pela costura oficial `ctx.web`: busca por tema, listas brancas/negras de hosts, filtro `since`, capturas limitadas com hash de procedência SHA-256 e anexação com deduplicação em `timeline.jsonl` (com teto de retenção). As entradas podem levar um `evidenceCategory` validado; `depth` escala o número de fontes. Falha em voz alta quando a capacidade web não está disponível.
- **`company_scan`** — cartões de empresa (`card.json` + `card.md`) a partir de arquivos de dados do workspace (hash SHA-256, esboços Markdown e linhas candidatas a número para que cada número cite arquivo e linha), mais um complemento opcional de citações de `ctx.web`. Os cartões levam `status` de listagem (com `statusAsOf`), `ticker` validado por formato e `metrics` com fonte e `asOf`. O modo lote (`companies`) isola uma empresa problemática sem abortar o lote; `depth` escala o complemento web. Na v1, apenas formatos de texto (sem PDF).
- **`industry_report`** — um relatório auditável a partir do mapa + linha do tempo + cartões. Antes de produzir, um contrato de entrega determinístico verifica blocos, afirmações de status/preço e resíduos de placeholder (falha em voz alta, nunca um relatório pela metade). As entradas da linha do tempo são agrupadas por `evidenceCategory`. Uma síntese determinística bull/bear lista valores com fonte e data contra as lacunas declaradas e achados de qualidade de dados, é embutida como seção multiperspectiva do relatório e é bifurcada como job de subagente que grava `perspectives-note.md` no livro de versões. Com um motor `ctx.researchReport` montado, evidência/seções/claims são selados pelo `assemble` dele e os veredictos por claim voltam; sem ele, o fallback embutido grava `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` versionados com tabela de rastreabilidade SHA-256 e rotula honestamente `engine: 'builtin-fallback'`.
- **Livro de versões de artefatos** — `industry_map` / `company_scan` / `industry_report` acrescentam uma entrada a `versions.jsonl` (caminho relativo à raiz + SHA-256 + carimbo de tempo + tipo de mudança) a cada gravação; as leituras verificam o hash e falham em voz alta se não bater.
- **Dois skills de metodologia** — `industry-research-method` (decomposição da cadeia, quadro de oferta/demanda, disciplina de fontes e de declaração de lacunas) e `company-research-method` (quadro de empresa, lista de fontes públicas, redação de conformidade).
- **Eventos Cordis tipados** — `industry-research/map`, `industry-research/track` e `industry-research/report` são emitidos após cada artefato confirmado.

Os dois skills de metodologia carregam sob demanda pela ferramenta padrão `skill` (`carregue o skill industry-research-method`).

### Superfícies das ferramentas

#### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

Chamada com `chain`: valida (arestas soltas, valores sem fonte, tiers ilegais, ids duplicados, status/statusAsOf, `taxonomyCode` desconhecido — falha em voz alta com a lista completa de problemas) e persiste `chain.json`, depois lista os espaços de lacuna explícitos e os nós gargalo. Sem `chain`: devolve o mapa atual, as fontes registradas e um resumo opcional da estrutura da cadeia via `ctx.web` para o modelo iterar. Com `renderSvg: true` grava também um `chain.svg` determinístico. `depth` (quick/standard/comprehensive) escala a ajuda web. Devolve um resumo `delta` em relação ao `research-state.json` anterior. Emite `industry-research/map`.

#### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

Busca cada tema por `ctx.web`, filtra pelas listas branca/negra e por `since`, captura snapshots de página (SHA-256) dentro do orçamento da chamada e os funde em `timeline.jsonl` (deduplicação por URL normalizada, com teto). `depth` escala o orçamento de fontes/capturas; `evidenceCategory` rotula cada entrada acrescentada e é validado contra o enum de seis categorias. Fontes cuja captura falhou ficam como entradas apenas de citação com o motivo em `note`. Devolve um resumo `delta` em relação ao `research-state.json` anterior. Falha em voz alta nomeando a capacidade ausente quando `ctx.web` não está montado ou `offline: true`. Emite `industry-research/track`.

#### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

Lê os arquivos de dados do workspace (`.md/.txt/.csv/.tsv/.json`; a v1 não parseia PDF), calcula hash, extrai esboços Markdown e linhas candidatas a número, anexa opcionalmente citações de `ctx.web` e persiste o cartão. Um `status` exige `statusAsOf` não futuro; um `ticker` precisa casar com um formato embutido salvo `scan.strictTicker: false`; cada valor de `metrics` precisa de `source` + `asOf`. `companies` (lote) isola uma empresa problemática sem abortar o lote; `parallel: true` distribui cada empresa em um job independente quando `ctx.jobs` está montado (senão cai para sequencial, informado em `mode`). Arquivos rejeitados voltam com motivo; tudo o que o cartão não consegue estabelecer é uma lacuna explícita.

#### `industry_report({ industry, sections?, companies?, draft? })`

Monta a evidência (`E-chain`, `E-timeline`, `E-company-<slug>`), verifica os artefatos lidos contra `versions.jsonl` (hash divergente falha em voz alta) e valida seu `draft` (seções + claims; os `evidenceIds` de cada claim precisam referenciar evidência registrada) ou constrói o rascunho automático mecânico (métricas com fonte e entradas recentes da linha do tempo viram claims, agrupadas por `evidenceCategory`). Antes de produzir roda um contrato de entrega determinístico que falha em voz alta diante de bloco faltante, placeholder residual ou afirmação sem fonte ou sem data. A checagem adversária determinística sempre roda, e um job de revisão red-team (`red-review-note.md`) é disparado quando `ctx.jobs` está montado (senão `review: skipped(jobs unavailable)`). Uma síntese determinística bull/bear embute uma seção multiperspectiva e bifurca um job de debate (`perspectives-note.md`) quando `ctx.jobs` está montado. Caminho com motor: diretório selado + `sealHash` + veredictos por claim. Caminho de fallback: Markdown versionado + manifest, com claims marcados honestamente como `unverified`. Emite `industry-research/report`.

### Exemplos

Estes são os pontos de entrada reais do plugin; instale uma vez e chame um.

**Exemplo detalhado** — comando `industry_map`, entrada:

~~~sh
industry_map({
  industry: "示例",
  web: false,
  chain: {
    nodes: [
      { id: "up", name: "上游原料", tier: "upstream", metrics: [{ key: "价格", value: 10, unit: "元", asOf: "2026-01-01", sourceRef: "S1" }] },
      { id: "down", name: "下游渠道", tier: "downstream", metrics: [{ key: "占比" }] }
    ],
    edges: [{ from: "up", to: "down" }]
  }
})
~~~

Saída:

~~~text
行业「示例」产业链图：已校验并写入 /tmp/dsh-industry-research-test-Pxf1l8/industry-research/示例/chain.json
节点 2 / 边 1；缺口 2 项。
与上次相比：新增源 0，移除源 0，未变化证据 0。
缺口清单：节点「下游渠道」(down) 的指标「占比」待补（无来源数值）；产业链缺少 midstream 层节点
web 辅助未执行：调用方指定 web: false
~~~

*Observed from `README.md:151-153; test/map.spec.ts:44-51; src/tools/map.ts:157-163; src/chain.ts:177-194`*

**Ramo de falha** — entrada:

~~~text
{"industry":"白酒","web":false,"chain":{"industry":"白酒","nodes":[{"id":"upstream-1","name":"高粱种植","tier":"upstream","metrics":[{"key":"市场规模","value":120,"unit":"亿元"}]}],"edges":[]}}
~~~

Saída:

~~~text
isError=true; error.message=chain 校验失败（1 项）：node "upstream-1" metric "市场规模" carries a value without a sourceRef — register the source or mark the slot 待补 (omit value)
~~~

*Observed from `plugins/dsh-industry-research/src/chain.ts:158-159 (rule); plugins/dsh-industry-research/src/tools/map.ts:232-234 (throw); plugins/dsh-industry-research/README.md:179 (unsourced values fail loud); exercised through plugins/dsh-industry-research/test/harness.ts`*

**Exemplos curtos**: `industry_track` · `company_scan` · `industry_report`

### Layout dos dados

```
<workspace>/<industryRoot>/versions.jsonl              livro de versões de artefatos (SHA-256 + carimbo de tempo + mudança)
<workspace>/<industryRoot>/<indústria>/research-state.json  memória de estado da pesquisa
<workspace>/<industryRoot>/<indústria>/chain.json      industry_map
<workspace>/<industryRoot>/<indústria>/chain.svg       industry_map (renderSvg: true)
<workspace>/<industryRoot>/<indústria>/timeline.jsonl  industry_track
<workspace>/<industryRoot>/<indústria>/sources.json    registro de fontes citáveis (S1, S2, …)
<workspace>/<industryRoot>/<indústria>/notes/          notas semente
<workspace>/<industryRoot>/<indústria>/red-review-note.md  industry_report (revisão red-team, jobs)
<workspace>/<industryRoot>/<indústria>/perspectives-note.md  industry_report (debate bull/bear, jobs)
<workspace>/<industryRoot>/<indústria>/reports/<ts>/   industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<empresa>/card.*  company_scan
```

## Configuração

Todas as opções são campos `Config` do Schemastery (sobrescrevíveis pelo cordis.yml); um valor inválido faz a carga do perfil falhar em voz alta. Sobrescrever por id substitui a linha inteira: redeclare todas as chaves necessárias. O `cordis.patch.yml` documenta cada chave em linha.

Chaves mais usadas:

| Chave | Padrão | Descrição |
|---|---|---|
| `enabled` | `true` | Interruptor mestre; `false` não monta nada. |
| `industryRoot` | `industry-research` | Raiz de artefatos, relativa ao workspace da sessão (ou absoluta). |
| `fetchTimeoutMs` | `20000` | Timeout por requisição (ms) para busca/captura do `ctx.web`. |
| `timelineMaxEntries` | `500` | Entradas retidas por `timeline.jsonl` de cada indústria (as mais antigas saem). |
| `sourceAllowlist` | `[]` | Lista branca de hosts para fontes acompanhadas (vazia = todos). |
| `sourceBlocklist` | `[]` | Lista negra de hosts para fontes acompanhadas (vence a branca). |
| `offline` | `false` | Modo offline: nunca toca o `ctx.web`; só dados locais do workspace. |
| `skillsDir` | _(não definido)_ | Raiz explícita de skills; por padrão, o `skills/` empacotado. |

<details>
<summary>Tabela completa de configuração (13 chaves)</summary>

| Chave | Padrão | Descrição |
|---|---|---|
| `enabled` | `true` | Interruptor mestre; `false` não monta nada. |
| `industryRoot` | `industry-research` | Raiz de artefatos, relativa ao workspace da sessão (ou absoluta). |
| `fetchTimeoutMs` | `20000` | Timeout por requisição (ms) para busca/captura do `ctx.web`. |
| `timelineMaxEntries` | `500` | Entradas retidas por `timeline.jsonl` de cada indústria (as mais antigas saem). |
| `sourceAllowlist` | `[]` | Lista branca de hosts para fontes acompanhadas (vazia = todos). |
| `sourceBlocklist` | `[]` | Lista negra de hosts para fontes acompanhadas (vence a branca). |
| `offline` | `false` | Modo offline: nunca toca o `ctx.web`; só dados locais do workspace. |
| `skillsDir` | _(não definido)_ | Raiz explícita de skills; por padrão, o `skills/` empacotado. |
| `track.maxResultsPerTopic` | `10` | `web_search` maxResults por tema. |
| `track.maxFetchesPerCall` | `10` | Orçamento de capturas por chamada de `industry_track`. |
| `scan.maxFileBytes` | `1048576` | Teto de leitura por arquivo de dados de empresa. |
| `scan.maxFigureCandidates` | `100` | Orçamento de linhas candidatas a número por varredura de empresa. |
| `scan.strictTicker` | `true` | O ticker do cartão precisa casar com um formato embutido (A-share 6 dígitos, EUA 1–5 letras, HK 1–5 dígitos); `false` dispensa a validação. |

</details>

Exemplo de sobrescrita no patch do perfil:

```yaml
- insert:
    - id: dsh-industry-research
      name: dsh-industry-research
      config:
        industryRoot: industry-research
        offline: false
        track:
          maxFetchesPerCall: 5
        scan:
          strictTicker: false
```

## FAQ

<details>
<summary>Onde ficam os dados? Podem vazar?</summary>

Todos os artefatos ficam sob `<industryRoot>/` no workspace da sessão (por padrão `industry-research/`): `chain.json`, `timeline.jsonl`, `sources.json`, `reports/<ts>/`, os cartões de empresa e o livro `versions.jsonl`. O plugin não faz requisições de rede por conta própria e não guarda credenciais; toda a recuperação passa pelo `ctx.web`, com a seleção de provedor e os timeouts a cargo do deployment e da sua configuração. Fontes pagas ou com login ficam fora: exporte você mesmo e passe como `dataFiles`.

</details>

<details>
<summary>O que acontece sem `ctx.web` ou `ctx.researchReport`? Falha em silêncio?</summary>

Nunca em silêncio. Sem `ctx.web`, o `industry_track` falha em voz alta nomeando a capacidade ausente; sem `ctx.researchReport`, o `industry_report` segue o fallback embutido e grava `report.md` + `manifest.json` versionados, rotulados honestamente `engine: 'builtin-fallback'` e com claims marcados `unverified`. Sem `ctx.jobs`, `parallel: true` degrada para sequencial e a revisão red-team e o debate bull/bear são informados como `skipped(jobs unavailable)`.

</details>

<details>
<summary>Conflita com outros plugins?</summary>

Não. Injeta apenas `skills` e `tools`; não registra listener waterfall, comando, slot de cliente nem rota `webServer`, e busca `ctx.web` / `ctx.researchReport` / `ctx.jobs` com `ctx.get(...)` em tempo de execução em vez de injetá-los, então a ausência de um irmão nunca deixa a árvore de plugins em PENDING. A evidência ponto a ponto está em «Interoperabilidade com outros plugins DSH».

</details>

<details>
<summary>Qual é o custo de desempenho?</summary>

Tudo é trabalho local determinístico: ler e gravar Markdown/JSON, calcular SHA-256 e validar estruturas, sem chamadas ao modelo. A rede só é usada no `industry_track` (e na ajuda web de `industry_map` / `company_scan`) e é limitada como orçamento em primeiro plano por `track.maxFetchesPerCall`, `track.maxResultsPerTopic` e `fetchTimeoutMs`; `offline: true` a desliga por completo.

</details>

<details>
<summary>Dá para ler PDF diretamente?</summary>

Não. A v1 lê apenas formatos de texto (`.md/.txt/.csv/.tsv/.json`) e não parseia PDF. Converta o PDF para texto ou Markdown primeiro e passe como `dataFiles`.

</details>

## Limites de segurança

- **Contenção no workspace** — nomes de indústria/empresa são validados como segmentos de caminho; arquivos de dados são checados contra o cwd da sessão (ambos os lados resolvidos).
- **Procedência por construção** — fontes levam hash SHA-256; número sem fonte é erro de validação; linhas corrompidas da linha do tempo são puladas com contagem visível, nunca em silêncio.
- **Degradação honesta** — a falta de `ctx.web` / `ctx.researchReport` produz falhas em voz alta ou artefatos de fallback rotulados honestamente, nunca fabricação silenciosa.
- **Registros reversíveis** — tudo passa por `ctx.effect()` / `ctx.on()` / `register()`.
- **Conformidade de apenas pesquisa** — descrições de ferramentas, cartões e relatórios levam «apenas pesquisa, não é aconselhamento de investimento»; pontos de dados levam asOf e fontes.

## Limitações conhecidas

- **Eventos Cordis, não eventos do log de sessão** — os eventos `industry-research/*` são eventos de observabilidade Cordis tipados e nunca são anexados ao log da sessão; o registro durável são os artefatos do workspace, e os resultados de ferramenta visíveis ao modelo viajam no evento durável `tool/result`.
- **Sem escrita em `ctx.attachment`** — a costura de anexos do rc2 só aceita imagens (PNG/JPEG/WebP/GIF); relatórios Markdown continuam como arquivos versionados do workspace, referenciados por caminho absoluto no resultado da ferramenta.
- **A v1 lê apenas formatos de texto** — sem parse de PDF; peça ao usuário para converter PDFs em texto/Markdown antes.
- **Skills em edição chinesa** — os skills de metodologia empacotados vêm em chinês; a edição em inglês é trabalho futuro.
- **Ferramentas em primeiro plano** — o `industry_track` é limitado por `track.maxFetchesPerCall` e `fetchTimeoutMs` e roda em primeiro plano; o modo de jobs em segundo plano é trabalho futuro.
- **O rascunho automático é mecânico** — resume artefatos e transforma pontos de dados com fonte em claims; a qualidade narrativa vem dos `draft`s escritos pelo modelo.

## Interoperabilidade com outros plugins DSH

O plugin só consome costuras públicas e não assume nenhum recurso compartilhado:

- **Apenas dois serviços injetados** — `inject = ['skills', 'tools']`; `ctx.web`, `ctx.researchReport` e `ctx.jobs` são buscas estruturais `ctx.get(...)` em tempo de execução (com guardas de forma), então a ausência de um nunca deixa o plugin em PENDING.
- **Sem listeners** — não há listener waterfall nem assinatura de eventos compartilhados como `agent/pre-step` ou `tools/post-execute`, portanto não há como curto-circuitar ou sufocar outro plugin.
- **Sem tomar nomes** — não registra comandos, slots de cliente nem prefixo `webServer`; os quatro nomes de ferramenta (`industry_map`, `industry_track`, `company_scan`, `industry_report`) são namespaceados e não ocupam nomes nus.
- **Skills com provider dedicado** — monta como `industry-research` com `includeDefaultRoots: false`, então não assume nem substitui a raiz global de skills; um `skillsDir` inválido falha em voz alta na carga.
- **O patch só insere a si mesmo** — o patch do bundle insere a própria linha e nunca sobrescreve o `config` de uma linha embutida.
- **O contrato com o `dsh-research-report` é de tipos** — `AssembleReportRequest` e companhia entram como devDependency type-only, apagada no build; em tempo de execução só se busca `ctx.get('researchReport')`, e sem ele roda o fallback embutido: resultados selados nunca são inventados.
- **Com o `dsh-base`** — o `ctx.web` é composto pelo bundle base; quando falta, o `industry_track` falha em voz alta com orientação de montagem.
- **Verificações contínuas** — o `.github/workflows/plugin-doctor.yml` roda o doctor de plugins; o veredicto é o que esse workflow reportar.

## Permissões e dados

O `dsh-industry-research` só consome costuras públicas: `ctx.tools`, `ctx.skills` e, com busca opcional, `ctx.web` e `ctx.researchReport`. Não faz nenhum acesso de rede próprio (toda a recuperação passa pelo `ctx.web` com a seleção de provedor do deployment e seus timeouts configurados), não guarda credenciais e só grava dentro do workspace da sessão em `industryRoot`. Apenas fontes públicas são usadas; as pagas ou com login ficam fora: passe suas próprias exportações como `dataFiles`.

## Compatibilidade

| Dimensão | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (linha npm publicada, verificada em 2026-09-25); o `package.json` declara `engine.dsh` `>=0.2.1-0 <0.3.0 \|\| >=0.2.2-0 <0.3.0`. 0.1.2-rc.1 (adaptado em 2026-09-02): o envelope de sessão mantém o campo ignorable apenas para compatibilidade de leitura de logs existentes — Session.append continua sem poder carimbá-lo, então o comportamento do gate de auditoria não muda. Verificado em 2026-09-24 contra os peers publicados `0.1.7-rc.2` (cadeia completa de gates; o smoke de instalação real no perfil roda no job semanal e por PR `compat.yml`). |
| Node | `^22.19.0 \|\| >=24.9.0`, só ESM (`"type": "module"`). |
| Peer dependencies | `@deepseek-ai/cordis ^4.0.5-alpha.1`, `@deepseek-ai/schemastery ^3.18.5-alpha.1` e `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` (faixa peer `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0 \|\| >=0.2.2-0 <0.3.0`; todos compostos pelo bundle oficial `dsh-base`). |
| Plataforma | Onde o DSH rodar; as ferramentas são TypeScript puro do lado host, sem metade de navegador. |
| Capacidades opcionais | Buscadas em tempo de execução (nunca injetadas): `ctx.web` (recuperação de fontes públicas — composto pelo `dsh-base`) e `ctx.researchReport` (o motor de selagem do plugin irmão `dsh-research-report`). |

## Ecossistema e qualidade

- [Espelho no Gitee](https://gitee.com/perrylink/dsh-industry-research) (espelho sincronizado; o GitHub é a referência)
- [Página no dshfind](https://dshfind.com/plugins/PerryLink/dsh-industry-research) (instalações e ranking)
- [Relatório OpenSSF Scorecard](https://securityscorecards.dev/viewer/?uri=github.com/PerryLink/dsh-industry-research) (movido por [.github/workflows/scorecard.yml](.github/workflows/scorecard.yml))
- [Relatório de verificação do dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
- [DSH Market](https://dsh.market/) (listado)
- **Canal da loja 1024**: rode `npm i -g dsh1024` uma vez e depois `dsh1024 plugin --profile web add dsh-industry-research` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com))
- [Base de conhecimento do ecossistema](https://perrylink.github.io/dsh-plugin-guide/) (dados medidos, não marketing): guia de desenvolvimento de plugins · dados de seleção · critérios de manutenção

## Desenvolvimento

```sh
pnpm install
pnpm run typecheck && pnpm run typecheck:ci     # face dos peers publicados + linha publicada com skipLibCheck desligado
pnpm test                                       # vitest
pnpm run build                                  # scripts/prepare.mjs → lib/
pnpm run verify:self-contained && pnpm run verify:artifacts
pnpm run verify:readme-sync                     # paridade de estrutura e chaves de configuração entre os cinco README
pnpm run verify:skills                          # gate de frontmatter de skills
pnpm run pack:check
```

As imagens são geradas por [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) (Python + Pillow) e podem ser regeradas: `python scripts/gen-readme-assets.py`. Os SVGs claro e escuro ficam em `docs/assets/`; o texto visível são apenas tokens de comandos e artefatos, então os cinco idiomas os compartilham.

| Caminho | Conteúdo |
|---|---|
| `src/` | Entrada de plugin de função (`index.ts`), `config.ts`, as quatro ferramentas e os modelos de dados puros |
| `skills/` | Os dois skills de metodologia em edição chinesa (pacotes `SKILL.md`) |
| `cordis.patch.yml` | Declaração da linha do bundle, com cada chave documentada em linha |
| `test/` | Suíte vitest (Context / ToolRuntime / SkillRegistry / WebRuntime reais) |
| `fixtures/` | Fixtures didáticos de baijiu (fictícios, claramente marcados) |
| `scripts/` | Build e gates: `prepare.mjs`, `verify-*`, `check-readme-sync.mjs`, `check-skills.mjs` |
| `docs/assets/` | Imagens do README (geradas por este script) |
| `.github/workflows/` | CI, compat, plugin-doctor, release, scorecard |

Tópicos: `dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report`

## Família e agradecimentos

Este projeto faz parte da família de plugins do DeepSeek Harness mantida pela [PerryLink](https://github.com/PerryLink) (todos Apache-2.0). Se ele for útil, **uma estrela ajuda a próxima pessoa a encontrá-lo** — nada fica bloqueado por isso.

- Design e implementação iniciais pela sessão de desenvolvimento do `dsh-industry-research` (DeepSeek Harness).
- Contribuições externas são bem-vindas: abra uma issue ou um pull request.

<details>
<summary>Expandir todos os plugins</summary>

| Plugin | Estado |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver o README do repo |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 APOSENTADO (repo arquivado) |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 APOSENTADO (repo arquivado) |

</details>

## Licença

Apache-2.0 — veja [LICENSE](LICENSE).

<p align="center"><sub>Apache-2.0 · plugin da comunidade, sem vínculo com a DeepSeek.</sub></p>
