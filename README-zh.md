<div align="center">

# 🏭 dsh-industry-research
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-industry-research`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）。

**DeepSeek Harness 的行业/公司研究领域包。**

*产业链建图、公开源跟踪、公司速览卡、可核查报告——每个数字都能回溯来源，每个缺口都如实声明。*

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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads&lang=zh)](https://dshfind.com/zh/plugins/PerryLink/dsh-industry-research?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-industry-research
```


</div>

---

**仅供研究，不构成投资建议。** 本包只做研究支持：不接交易、不预测价格、不使用付费/需登录数据源。


**📖 生态实测知识库**（实测数据，不是营销）：[插件开发指南 · 选型实测数据 · 维护取舍判据](https://perrylink.github.io/dsh-plugin-guide/)。

<!-- star-cta -->
## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # 安装
dsh plugin --profile demo remove dsh-industry-research    # 卸载
```

验证行已挂载：`dsh --profile demo --dump-config | grep dsh-industry-research`。

## ⭐ 如果它帮到了你

这个插件是 [DSH 插件家族](https://github.com/PerryLink)的一员（40+ 个，全部 Apache-2.0）。如果你在用，**给个 star** —— 它不会解锁任何功能，但会让下一个人在搜索里更容易找到它。

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-industry-research?

DeepSeek Harness 的行业/公司研究领域包。

产业链建图、公开源跟踪、公司速览卡、可核查报告——每个数字都能回溯来源，每个缺口都如实声明。

![dsh-industry-research 终端演示：dsh-industry-research — install, then the three artifacts](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-hero.png)

![Animated terminal demo of dsh-industry-research](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-demo.gif)

*同一次运行，动图版。*

## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1`（npm 发布线，2026-09-24 已核验；peer 范围 `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`）。
0.1.2-rc.1（2026-09-02 已适配）：会话信封保留 ignorable 字段但仅用于存量日志读取兼容——Session.append 仍无法盖章，门控行为不变。
2026-09-24 已核验：对照 `0.1.7-rc.2` 已发布 peer 实测（完整门禁链；真实 profile 安装冒烟由每周及每 PR 的 `compat.yml` 任务执行）。
- Node `^22.19.0 || >=24.0.0`，仅 ESM（`"type": "module"`）。
- Peer 依赖：`@deepseek-ai/cordis ^4.0.2`、`@deepseek-ai/schemastery ^3.18.2`，以及 `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` 的 `@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-skill-filesystem`（官方 `dsh-base` bundle 均已组合）。
- 可选能力在执行时查找（绝不注入）：`ctx.web`（公开源检索，`dsh-base` 已组合）与 `ctx.researchReport`（兄弟插件 `dsh-research-report` 的封存引擎）。

## What you get

- **`industry_map`**——构建/更新产业链结构图（`chain.json`）：上/中/下游节点、边、指标槽位。带 `value` 的指标必须带 `sourceRef`；无值槽位即显式缺口。种子笔记/文件与可选 `ctx.web` 摘要登记为可引用来源（`S1`、`S2`……）。
- **`industry_track`**——经官方 `ctx.web` 缝隙跟踪行业政策/要闻：按主题检索、来源主机白/黑名单、`since` 过滤、预算内快照抓取（SHA-256 溯源哈希），追加去重写入 `timeline.jsonl`（保留上限可配）。web 能力不可达时响亮失败。
- **`company_scan`**——以工作区数据文件生成公司速览卡（`card.json` + `card.md`）：SHA-256 哈希、Markdown 大纲、数字候选行（每个数字可标注文件与行号），另可选 `ctx.web` 引用补充。v1 只读文本格式（不解析 PDF）。
- **`industry_report`**——汇总结构图、时间线与公司卡产出可核查报告。确定性正反方（bull/bear）合成将「有来源且带日期的数值」列为多方、「缺口与数据质量发现」列为空方，嵌入报告多视角小节，并派生 subagent job 写回 `perspectives-note.md` 入账本。挂载 `ctx.researchReport` 引擎时证据/章节/claims 提交其 `assemble` 封存并回传逐 claim 结论；缺席时内置降级路径写入版本化 `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json`（含 SHA-256 来源回溯表），并如实标注 `engine: 'builtin-fallback'`。
- **两个方法论技能**——`industry-research-method`（产业链拆分、供需框架、口径纪律、缺口声明纪律）与 `company-research-method`（公司研究框架、公开源清单、合规话术）。
- **类型化 Cordis 事件**——每份产物落盘后发出 `industry-research/map`、`industry-research/track`、`industry-research/report`。

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-industry-research
```

### git 渠道

```sh
# 在临时 profile 中（钉 commit；运行自包含 prepare 构建）
dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
# 首次 add 时 profile 的 pnpm-workspace.yaml 会加入 dsh-industry-research 的 allowBuilds 条目。
```

### npm 渠道

```sh
dsh plugin --profile demo add dsh-industry-research
```

两条渠道都会把 bundle 行（见 `cordis.patch.yml`）装入 profile 的 `dsh.profile.bundles` 栈，重启生效。

然后在会话中：

```
加载 industry-research-method 技能，然后研究白酒行业：
先 industry_map 建产业链图，再 industry_track 跟踪政策，最后 industry_report 出报告。
```

## Configuration

全部可调项均为 Schemastery `Config` 字段；非法值在加载期响亮失败。

| Key | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | 总开关；`false` 不挂载任何能力。 |
| `industryRoot` | `industry-research` | 产物根目录（相对会话工作区，或绝对路径）。 |
| `fetchTimeoutMs` | `20000` | `ctx.web` 检索/抓取的单次请求超时（毫秒）。 |
| `timelineMaxEntries` | `500` | 每个行业 `timeline.jsonl` 的保留条数（最旧先弃）。 |
| `sourceAllowlist` | `[]` | 跟踪来源主机白名单（空 = 全部允许）。 |
| `sourceBlocklist` | `[]` | 跟踪来源主机黑名单（优先于白名单）。 |
| `offline` | `false` | 离线模式：不触网，只用本地工作区数据。 |
| `skillsDir` | _(未设置)_ | 显式 skills 根目录覆盖；缺省用随包 `skills/`。 |
| `track.maxResultsPerTopic` | `10` | 每个主题的 `web_search` maxResults。 |
| `track.maxFetchesPerCall` | `10` | 每次 `industry_track` 调用的快照抓取预算。 |
| `scan.maxFileBytes` | `1048576` | 公司数据文件的单文件读取上限（字节）。 |
| `scan.maxFigureCandidates` | `100` | 每次公司扫描的数字候选行预算。 |
| `scan.strictTicker` | `true` | 公司卡 ticker 必须匹配内置格式（A 股 6 位数字、美股 1–5 字母、港股 1–5 数字）；`false` 豁免格式校验。 |

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

带 `chain` 调用：校验（悬空边、无来源数值、非法 tier、重复 id、status/statusAsOf、未知 `taxonomyCode`——带完整问题清单响亮失败）并落盘 `chain.json`，随后列出显式缺口槽位与瓶颈节点。不带 `chain` 调用：返回当前图、已登记来源与可选 `ctx.web` 产业链结构摘要，供模型迭代。`renderSvg: true` 时另写确定性的 `chain.svg`。`depth`（quick/standard/comprehensive）调节 web 辅助检索规模。返回与上次 `research-state.json` 相比的 `delta` 摘要。发出 `industry-research/map` 事件。

### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

经 `ctx.web` 逐主题检索，按白/黑名单与 `since` 过滤，在调用预算内抓取页面快照（SHA-256），合并进 `timeline.jsonl`（按规范化 URL 去重，保留上限）。`depth` 调节来源/抓取预算；`evidenceCategory` 为本批条目打分类标签并按六类枚举校验。快照失败的来源以纯引用条目保留并在 `note` 中说明原因。返回与上次 `research-state.json` 相比的 `delta` 摘要。`ctx.web` 未挂载或 `offline: true` 时响亮失败并指明缺失能力。发出 `industry-research/track` 事件。

### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

读取工作区数据文件（`.md/.txt/.csv/.tsv/.json`；v1 不解析 PDF），计算哈希，提取 Markdown 大纲与数字候选行，可选附加 `ctx.web` 引用，落盘速览卡。`status` 必须带非未来 `statusAsOf`；`ticker` 必须匹配内置格式（除非 `scan.strictTicker: false`）；每条 `metrics` 数值必须带 `source` + `asOf`。`companies`（批量）单公司失败不中断整批；`parallel: true` 且挂载 `ctx.jobs` 时按公司 fan-out 为独立 job（否则回退顺序路径并在结果 `mode` 注明）。未采纳文件带原因返回；卡片无法确立的内容一律写入显式缺口。

### `industry_report({ industry, sections?, companies?, draft? })`

组装证据（`E-chain`、`E-timeline`、`E-company-<slug>`），读取时对照 `versions.jsonl` 校验哈希（不一致响亮失败），或校验你提供的 `draft`（章节 + claims；每条 claim 的 `evidenceIds` 必须引用已登记证据），或机械自动生成草稿（有来源的指标与近期时间线条目生成 claims，按 `evidenceCategory` 分组）。产出前跑确定性交付契约校验（缺区块/占位符/无来源或无日期断言即响亮失败）。确定性对抗机器检查始终执行；挂载 `ctx.jobs` 时派生红方审阅 job 写回 `red-review-note.md`（否则 `review: skipped(jobs unavailable)`）。确定性正反方（bull/bear）合成嵌入报告多视角小节，挂载 `ctx.jobs` 时派生辩论 job 写回 `perspectives-note.md`。引擎路径：封存目录 + `sealHash` + 逐 claim 结论。降级路径：版本化 Markdown + manifest，claims 如实标记 `unverified`。发出 `industry-research/report` 事件。

## Skills

- **`industry-research-method`**——行业研究方法论：上/中/下游拆分、供需框架、口径纪律（每个数字：数值 + 单位 + 来源 + asOf）、缺口声明纪律（如实声明，绝不编造）。
- **`company-research-method`**——公司研究方法论：业务结构/财务要点/风险点卡片框架、公开源优先级清单（公司披露 → 监管 → 权威媒体）、合规话术。

两个技能经标准 `skill` 工具按需加载（`加载 industry-research-method 技能`）。

## Data layout

```
<工作区>/<industryRoot>/versions.jsonl        工件版本清单（SHA-256 + 时间戳 + 变更类型）
<工作区>/<industryRoot>/<行业>/research-state.json  研究状态记忆
<工作区>/<industryRoot>/<行业>/chain.json      industry_map
<工作区>/<industryRoot>/<行业>/chain.svg       industry_map（renderSvg: true）
<工作区>/<industryRoot>/<行业>/timeline.jsonl  industry_track
<工作区>/<industryRoot>/<行业>/sources.json    可引用来源登记（S1、S2……）
<工作区>/<industryRoot>/<行业>/notes/          种子笔记
<工作区>/<industryRoot>/<行业>/red-review-note.md  industry_report（红方审阅，需 jobs）
<工作区>/<industryRoot>/<行业>/perspectives-note.md  industry_report（正反方辩论，需 jobs）
<工作区>/<industryRoot>/<行业>/reports/<ts>/   industry_report（report.md + manifest.json）
<工作区>/<industryRoot>/companies/<公司>/card.*  company_scan
```

## Permissions & data

`dsh-industry-research` 只消费公开缝隙：`ctx.tools`、`ctx.skills`，以及可选查找的 `ctx.web` 与 `ctx.researchReport`。本插件自身不发起任何网络访问（一切检索经 `ctx.web`，provider 选择与超时由部署方与你的配置决定），不存凭据，只在会话工作区的 `industryRoot` 下写文件。只使用公开源；付费/需登录数据源不在范围内——请自行导出后作为 `dataFiles` 传入。

## Security boundaries

- **工作区隔离**——行业/公司名校验为单一路径段；数据文件对照会话 cwd 做包含性检查（双侧 resolve）。
- **构造即溯源**——来源带 SHA-256 哈希；无来源数字即校验错误；损坏时间线行跳过且计数如实上报，绝不静默。
- **诚实降级**——缺少 `ctx.web` / `ctx.researchReport` 时响亮失败或产出如实标注的降级产物，绝不静默编造。
- **可逆注册**——一切贡献经 `ctx.effect()` / `ctx.on()` / `register()`。
- **纯研究合规**——工具描述、卡片与报告均带「仅供研究，不构成投资建议」；数据点带 asOf 与来源。

## Known limitations

- **Cordis 事件而非会话日志事件**——`industry-research/*` 事件是类型化 Cordis 可观测性事件，绝不追加进会话日志；持久记录是工作区产物本身；可观测性走类型化 Cordis 事件；模型可见的工具结果走持久 `tool/result` 会话事件。
- **不写 `ctx.attachment`**——rc2 附件缝隙只接受图片（PNG/JPEG/WebP/GIF）；Markdown 报告因此保持为版本化工作区文件，工具结果中以绝对路径引用。
- **v1 只读文本格式**——不解析 PDF；请用户先把 PDF 转成文本/Markdown。
- **中文版技能**——随包方法论技能为中文版；英文版为后续工作。
- **前台工具**——`industry_track` 由 `track.maxFetchesPerCall` 与 `fetchTimeoutMs` 界定为前台任务；后台任务模式为后续工作。
- **自动草稿是机械组装**——它汇总产物并把有来源的数据点生成 claims；叙述质量来自模型撰写的 `draft`。

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

`dsh`、`dsh-plugin`、`deepseek-harness`、`cordis`、`industry-research`、`company-research`、`research`、`report`

## Contributors

- 初始设计与实现：`dsh-industry-research` 开发会话（DeepSeek Harness）。

欢迎外部贡献 —— 提交 issue 或 pull request。

**适用的 DSH 版本：** 已在 `dsh-v0.2.1-alpha.1`（本构建所针对的宿主版本）上验证；要求 `>=0.1.7-alpha.1 <0.2.0`。

## PerryLink DSH Plugin Family

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件家族成员：**87 个活跃维护**，名册共 **95** 个，其中 **5 个已冻结**、**3 个已退役**。完整名单默认折叠，避免每个 README 的首屏被长表淹没；点击展开可查看每一行，原因见「状态」列。

<details>
<summary>展开全部 95 个插件</summary>

| 插件 | 一句话 | 状态 |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 已退役 — 见仓库 README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 已冻结 — 见仓库 README |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 已冻结 — 见仓库 README |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 已冻结 — 见仓库 README |
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
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 已冻结 — 见仓库 README |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 已退役 — 见仓库 README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 已退役 — 见仓库 README |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## License

Apache-2.0 — 见 [LICENSE](LICENSE)。

### 从 DSH Desktop 市场安装

所有 PerryLink 插件均可在 DSH Desktop 内置市场中浏览：**市场 → 来源 → 添加来源 → 粘贴** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ 选中**。安装仍需通过市场的 npm 身份校验与你的确认。
