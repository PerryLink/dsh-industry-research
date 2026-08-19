---
name: industry-research-method
description: '行业研究方法论：产业链上中下游拆分法、供需分析框架、政策跟踪口径、数据口径纪律（每个数字必须有来源与 asOf）、缺口声明纪律（宁标缺口不编造）。做行业梳理、产业链建图、政策动态跟踪或行业报告撰写时使用；只查单一公司时用 company-research-method。'
whenToUse: '用户要求研究一个行业（梳理产业链、跟踪政策动态、写行业研究报告）时使用本技能；配合 industry_map / industry_track / industry_report 工具落盘可核查产物。只做公司层面研究时改用 company-research-method。'
metadata:
  pack: dsh-industry-research
  version: '0.1.0'
---

# 行业研究方法论（industry-research-method）

本技能规范一次行业研究的全流程，产出**每个数字都能回溯到来源**的可核查产物。合规底线：**仅供研究，不构成投资建议**；不接交易、不做实时告警、不使用需登录/付费/绕反爬的数据源。

## 工具配合关系

| 阶段 | 工具 | 产物 |
|---|---|---|
| 建图 | `industry_map` | `<industryRoot>/<行业>/chain.json`（校验过的产业链结构图） |
| 跟踪 | `industry_track` | `<industryRoot>/<行业>/timeline.jsonl`（政策/动态时间线） |
| 成文 | `industry_report` | `reports/<时间戳>/report.md` + `manifest.json`（引擎缺席时为 builtin-fallback） |

工作区默认根为 `industry-research/`（可用 `industryRoot` 配置）。方法论细节见 `references/frameworks.md`（供需框架与常见拆分模板），需要时再用 read 工具加载。

## 阶段 1：产业链拆分（industry_map）

1. 先调用 `industry_map({ industry })`（不带 chain）读取当前图与已登记来源；有用户笔记/文件时经 `seed`/`seedFiles` 登记为来源（得 ref，如 `S1`）。
2. 按上/中/下游拆分撰写 ChainMap：
   - **上游**：原材料、关键投入品、设备与基础设施。
   - **中游**：生产制造、核心工艺环节、主要参与者类型。
   - **下游**：分销渠道、终端应用、消费者/客户类型。
   - 边表示投入→产出关系，`note` 写明关系性质（如「原料供应」「渠道分销」）。
3. 每个节点挂指标槽位：**有 `value` 必须带 `sourceRef`**（sources.json 的 ref、URL 或工作区路径）并尽量带 `asOf`；暂时没有来源的指标**只写 `key` 不写 `value`**——这就是显式待补槽位，禁止填估计值。
4. 带 `chain` 再次调用 `industry_map`；校验失败（悬空边、无来源数值、非法 tier）按返回的问题清单修正后重试。
5. 工具返回的 `gaps` 是后续工作的清单，不是失败：逐项决定是补充来源还是保留待补。

## 阶段 2：政策与动态跟踪（industry_track）

1. 默认主题为「<行业> 行业 政策」与「<行业> 行业 动态 要闻」；用户给定点时经 `topics` 传入。
2. 条目纪律：每条带来源 URL、发布日期（来源无日期则为空，**不得编造日期**）、摘要与快照哈希；抓取失败的条目以纯引用形式记录并在 `note` 中说明。
3. 来源治理：部署方可用 `sourceAllowlist`/`sourceBlocklist` 收口（如只信 `gov.cn`）；被拦截与去重的计数在结果中如实报告。
4. `ctx.web` 未挂载或 `offline: true` 时工具会响亮失败——如实转告用户需要挂载 web provider 或关闭 offline，**不得**用记忆代替检索结果充数。

## 阶段 3：报告成文（industry_report）

1. 默认自动草稿即可成文；需要定制叙述结构时用 `draft` 撰写 sections + claims：
   - 每条 claim 必须登记 `evidenceIds`（`E-chain` / `E-timeline` / `E-company-<slug>`）。
   - claim 文本中的数字必须与证据内容一致——引擎路径会逐条核查，builtin-fallback 路径会把 claims 如实标记为 unverified。
2. 报告必须保留：免责声明（仅供研究，不构成投资建议）、来源回溯表、缺口与待补清单。
3. 挂载了 `ctx.researchReport` 引擎时报告经其 `assemble` 封存并回传 sealHash 与逐 claim 结论；未挂载时走 `reports/<时间戳>/` 的版本化降级目录，如实标注 `engine: builtin-fallback`。

## 口径纪律（违反即返工）

- **每个数字三要素齐全**：数值、单位、来源（+ 尽量 asOf）；缺来源的数字降级为待补槽位。
- **口径一致**：同一指标跨来源使用时注明口径差异（如「出厂口径 vs 零售口径」）。
- **缺口声明优于完整假象**：找不到的数据写进缺口清单，禁止编造产业链数据、公司数字或政策条文。
- **区分事实与判断**：检索到的事实带来源；研究者的判断/推测必须明示为判断，不混入证据区。
- **合规话术**：对用户的任何结论性表述以「仅供研究，不构成投资建议」收尾；不预测价格、不推荐买卖。
