# RELEASE-HANDOFF — 收尾链盘点与发布会话待办

> 本文件由开发会话在 2026-08-20 以**匿名只读**方式核验生成（GitHub 公开 REST API / npm registry / GitHub contents API，全程无令牌、无写操作）。所有「已完成/已收录」结论均来自真实核验输出；所有写操作（push/PR/发帖/分支保护/npm publish）本会话一律未执行——任务红线（禁止 push、发 PR、npm publish、读取或使用发布令牌）与无 GitHub 写权限。发布会话按 `PHASE2-GROUP-PROMPTS.md` §0.3 原文执行剩余项即可，本文件是执行清单与草稿，不替代原文。

## 事实基线（2026-08-20 只读核验）

| 项 | 结果 | 核验方式 |
|---|---|---|
| 远程仓库 | `PerryLink/dsh-industry-research`，public，默认分支 `main` | `git ls-remote` + repo API |
| 远程同步 | `main` 与 `v0.1.0` tag 均指向本地 HEAD `0eaa782`，本地零未提交改动 | `git ls-remote` / `git status` |
| npm 发布 | `dsh-industry-research@0.1.0` 已发布，dist-tag `latest: 0.1.0` | `npm view` |
| 发布流水线 | Release workflow 于 `0eaa782` **success**（provenance 发布路径已跑通）；CI ×2 success | Actions API |
| About/homepage/description | homepage 指向 npm 包页，description 已设 | repo API |
| GitHub topics | `dsh`、`dsh-plugin`、`deepseek-harness`、`cordis`、`industry-research`、`company-research`、`research`、`report`（与 keywords 完全一致） | repo API |
| Discussions | 已开启（`has_discussions: true`） | repo API |
| 欢迎帖 | #1 Announcements「Welcome to dsh-industry-research」已发，**0 回复** | discussions API |
| Issues / PRs | 0 open / 0 closed，无任何社区反馈 | issues / pulls API |
| 分支保护 | 匿名读取返回 401，**无法核验**（需认证 API） | branches API |
| 生态收录 | `AdamPlatin123/awesome-dsh-plugins` 的 `PLUGINS.md` **已收录**（topic 自动扫描生效） | contents API |

## 步骤 0 · 社区反馈检查 — ✅ 完成（结果：零反馈）

issues/pulls 均为 0，欢迎帖 0 回复。无未回复的社区评论，无回复草稿需求，无 bug 需修复。

## 步骤 1 · 标准件 B — 本地全部完成，剩 1 项 GitHub 侧待办

已核实完成（无需重复创建）：

- P0：`.github/ISSUE_TEMPLATE/bug_report.yml`、`feature_request.yml`、`.github/PULL_REQUEST_TEMPLATE.md` 均符合 §0.3 P0 规范（含日志脱敏加粗警告、checklist 六项）；`SECURITY.md` 含私密报告渠道/脱敏/响应时间/致谢与披露。
- 徽章：五语 README 均含 npm version、npm downloads、CI 徽章（shields.io，指向本仓库与包名）。
- P2：五语 README 末尾（License 前）Contributors 致谢段已同步。
- GitHub 侧已就位：topics、About、homepage、Discussions 开启、欢迎帖。

剩余待办（需认证 API / 网页操作，发布会话执行）：

1. **分支保护**（当前状态无法匿名核验，需先 `GET` 核对再决定是否 `PUT`）：

```bash
gh api repos/PerryLink/dsh-industry-research/branches/main/protection   # 200=已设；404=未设
```

未设时执行（上下文用 CI 实际 job 名 `gates`；按 §0.3 不设 PR review，保留直推工作流）：

```bash
gh api -X PUT repos/PerryLink/dsh-industry-research/branches/main/protection -f required_status_checks.strict=false -f required_status_checks.contexts[]=gates -f enforce_admins=false -f allow_force_pushes=true -f required_pull_request_reviews=null -f restrictions=null
```

复核 JSON（全文进验收报告）：`required_status_checks {strict:false, contexts:["gates"]}`、`enforce_admins:false`、`allow_force_pushes:true`、`required_pull_request_reviews:null`。

2. **Discussions 分类核验**：Announcements 已存在（欢迎帖）；Ideas 💡 / Q&A 🙏 / Show and tell 🎉 三类若缺，按 §0.3 用 GraphQL 创建，不便时在验收报告给出网页路径（Settings → General → Features → Discussions）。

## 步骤 2 · 标准件 A — 部分已收录，剩余 PR/发帖待发布会话

核验结果与待办（**先读各目标仓自己的规则再动手**，格式以各仓原文为准；一个 PR 只改一个目标仓库、单独 fork、分支命名 `add/dsh-industry-research`；对外文本不含密钥/个人信息）：

| 目标 | 状态（只读核验） | 待办 |
|---|---|---|
| awesome-dsh-plugin/awesome-dsh-plugin | 双语 README 均未收录 | PR：先读根 `contributing.md`（小写）与 `README.md` 的 `## Contents` 分类，中英 README 同分类各加一行 |
| AdamPlatin123/awesome-dsh-plugins | ✅ `PLUGINS.md` 已收录（topic 自动扫描） | 无需动作；运行时状态列如实，未跑其 k8s 实测不得填「运行级可用」 |
| 0xsline/awesome-deepseek-harness | 双语 README 均未收录 | PR：先读 `contributing.md`；`README.md` 与 `README.zh-CN.md` 同一分类各加一条，同一 PR；标题按该仓约定（现为 `docs: add <repo>`） |
| bruc3van/awesome-dsh-plugin | CATALOG/MARKET/SHOWCASE/README 均未命中（topic 每日快照未收录） | 按 `CONTRIBUTING.md` 与 README「作者自荐」区规范提交自荐；topic 自动目录以每日快照为准，勿手改全量目录 |
| omdsh-dev/dsh-hub-workshop（`OMDSH_HUB=on`） | 未核验到（homepage 匿名抓取受限） | 先读 `INTAKE.md` 走五维验证与 review PR；证据可用本仓 SUMMARY.md「试装验证」节（dsh-test-drive verdict pass）与 `dsh-industry-research-0.1.0.tgz` |
| deepseek-ai/deepseek-harness Discussions（阶段三） | 50 条近期帖无 industry 相关 → 未投 | 按既有 showcase 格式发帖（草稿见下）；无合适类目则跳过并说明 |
| 自动聚合（阶段四） | like-study1/Oh-My-DSH、wangshunnn/oh-my-dsh、YELEBAI/dsh-plugin-marketplace 均未收录 | 延迟类：记录预期时间与复核命令，不等待 |

### 收录条目草稿（供发布会话按各仓规则改写后使用）

- 一句话定位（中）：行业/公司研究领域包：产业链建图、公开源政策动态跟踪、公司速览卡与可核查研究报告（引擎封存桥 + 内置降级路径）。
- 一句话定位（英）：Industry and company research domain pack: chain maps, public-source policy/news tracking, company cards, and auditable research reports.
- 仓库：https://github.com/PerryLink/dsh-industry-research · 已打 `dsh-plugin` topic、已声明完整 `dsh.bundle` manifest。
- 建议分类：研究/分析类（以目标仓实际分类名为准，说明理由；非主题/皮肤，不放 Themes & Appearance）。

### 官方 Discussions showcase 帖草稿（中英各一段，按既有帖子格式调整）

> **dsh-industry-research — 行业/公司研究领域包**：解决行业研究「数字无法溯源、缺口靠编造」的问题——产业链建图（上游/中游/下游 + 缺口槽位）、经官方 `ctx.web` 的政策动态时间线、公司速览卡（数字标注来源文件与行号）、可核查研究报告（可选 `ctx.researchReport` 引擎封存，缺席时诚实降级并标注）。
> 安装：`dsh plugin --profile web add dsh-industry-research` · 仓库：https://github.com/PerryLink/dsh-industry-research
> Research only — not investment advice.

## 步骤 3 · 标准件 C — ✅ 已完成（无需重复发布）

npm `0.1.0@latest` 已发布，`v0.1.0` tag 在远程，Release workflow success。发布会话**不要重复发布**；后续版本 bump 走 `PHASE2-GROUP-PROMPTS.md` 原文（历史 tag 用 API 创建而非 push）。

## 本会话未执行事项与原因（如实记录，不伪造成功）

1. 分支保护设置（步骤 1 P1）：需要认证 API；本会话无 GitHub 写权限，且任务红线禁止使用发布令牌。
2. 三个榜单 PR + bruc3van 自荐 + 官方 showcase 帖（步骤 2）：红线「禁止 push、发 PR」；发布与投递属发布会话。
3. OMDSH hub INTAKE：需 review PR，同上。
4. 未读取 `PHASE2-GROUP-PROMPTS.md` 步骤 3 细节（文件受 dsh-defend 令牌保护）：本会话不读取、不使用发布令牌。

## 待执行命令清单（发布会话，gh 登录后）

```bash
gh auth status                                  # 步骤 0/2 前置；未登录立即停下报告
gh repo view PerryLink/dsh-industry-research --json nameWithOwner,url,visibility,repositoryTopics,defaultBranchRef
gh issue list --repo PerryLink/dsh-industry-research --state all --limit 100
gh pr list --repo PerryLink/dsh-industry-research --state all --limit 100
gh api repos/PerryLink/dsh-industry-research/branches/main/protection   # 分支保护核验（见步骤 1）
# 步骤 2 各目标：按上表逐一读规则 → fork → add/dsh-industry-research 分支 → 最小改动 PR
# 自动聚合复核（预期延迟类）：重跑本文件「步骤 2」核验表对应 contents API 查询
```
