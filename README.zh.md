<div align="center">

# 🏭 dsh-industry-research

**DeepSeek Harness 的行业/公司研究领域包。**

*产业链建图、公开源跟踪、公司速览卡、可核查报告——每个数字都能回溯来源，每个缺口都如实声明。*

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

**仅供研究，不构成投资建议。** 本包只做研究支持：不接交易、不预测价格、不使用付费/需登录数据源。

## Compatibility

- DeepSeek Harness `0.1.1-rc.2`（peer 钉版 `0.1.1-rc.2`）。
- Node `^22.19.0 || >=24.0.0`，仅 ESM（`"type": "module"`）。
- Peer 依赖：`@deepseek-ai/cordis ^4.0.1`、`@deepseek-ai/schemastery ^3.18.0`，以及 `>=0.1.0-rc.8 <0.2.0` 的 `@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-skill-filesystem`（官方 `dsh-base` bundle 均已组合）。
- 可选能力在执行时查找（绝不注入）：`ctx.web`（公开源检索，`dsh-base` 已组合）与 `ctx.researchReport`（兄弟插件 `dsh-research-report` 的封存引擎）。

## What you get

- **`industry_map`**——构建/更新产业链结构图（`chain.json`）：上/中/下游节点、边、指标槽位。带 `value` 的指标必须带 `sourceRef`；无值槽位即显式缺口。种子笔记/文件与可选 `ctx.web` 摘要登记为可引用来源（`S1`、`S2`……）。
- **`industry_track`**——经官方 `ctx.web` 缝隙跟踪行业政策/要闻：按主题检索、来源主机白/黑名单、`since` 过滤、预算内快照抓取（SHA-256 溯源哈希），追加去重写入 `timeline.jsonl`（保留上限可配）。web 能力不可达时响亮失败。
- **`company_scan`**——以工作区数据文件生成公司速览卡（`card.json` + `card.md`）：SHA-256 哈希、Markdown 大纲、数字候选行（每个数字可标注文件与行号），另可选 `ctx.web` 引用补充。v1 只读文本格式（不解析 PDF）。
- **`industry_report`**——汇总结构图、时间线与公司卡产出可核查报告。挂载 `ctx.researchReport` 引擎时证据/章节/claims 提交其 `assemble` 封存并回传逐 claim 结论；缺席时内置降级路径写入版本化 `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json`（含 SHA-256 来源回溯表），并如实标注 `engine: 'builtin-fallback'`。
- **两个方法论技能**——`industry-research-method`（产业链拆分、供需框架、口径纪律、缺口声明纪律）与 `company-research-method`（公司研究框架、公开源清单、合规话术）。
- **类型化 Cordis 事件**——每份产物落盘后发出 `industry-research/map`、`industry-research/track`、`industry-research/report`。

## Quick start

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

## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # 安装
dsh plugin --profile demo remove dsh-industry-research    # 卸载
```

验证行已挂载：`dsh --profile demo --dump-config | grep dsh-industry-research`。

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

组装证据（`E-chain`、`E-timeline`、`E-company-<slug>`），读取时对照 `versions.jsonl` 校验哈希（不一致响亮失败），或校验你提供的 `draft`（章节 + claims；每条 claim 的 `evidenceIds` 必须引用已登记证据），或机械自动生成草稿（有来源的指标与近期时间线条目生成 claims，按 `evidenceCategory` 分组）。产出前跑确定性交付契约校验（缺区块/占位符/无来源或无日期断言即响亮失败）。确定性对抗机器检查始终执行；挂载 `ctx.jobs` 时派生红方审阅 job 写回 `red-review-note.md`（否则 `review: skipped(jobs unavailable)`）。引擎路径：封存目录 + `sealHash` + 逐 claim 结论。降级路径：版本化 Markdown + manifest，claims 如实标记 `unverified`。发出 `industry-research/report` 事件。

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

## License

Apache-2.0 — 见 [LICENSE](LICENSE)。
