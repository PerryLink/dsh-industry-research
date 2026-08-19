# dsh-industry-research — 开发总结

行业/公司研究领域插件（DeepSeek Harness 第三方插件，独立仓库）。纯研究用途，不构成投资建议。

## 实现清单

- **装配面**：`name: industry-research`，`inject: [skills, tools]`，无默认导出；`Config`/`apply` 显式 `resolveConfig`（无隐藏 `?? default`）。
- **4 个工具**：`industry_map`（链图+缺口）、`industry_track`（时间线+快照，并发抓取+预算）、`company_scan`（文本数据扫描+卡片）、`industry_report`（双路径：冻结契约引擎桥 + builtin 回退渲染）。
- **2 个 SKILL**：`industry-research-method`、`company-research-method`（中文版），经官方 `FileSystemSkillProvider` 发布。
- **typed Cordis 事件**：`industry-research/map|track|report`（`@mode emit`，declaration merging）。
- **可选能力结构型查找**：`ctx.web`、`ctx.researchReport` 均 `ctx.get(...)` 运行时解析；缺失时 `industry_track` 响亮失败并给出挂载指引、`industry_report` 走 builtin 回退。
- **冻结契约**：`src/engine-bridge.ts` 与任务 §7 逐字节一致，不 import 对方包。
- **数据模型**：`chain.ts`（唯一 id/合法 tier/无悬空边/有值必有 sourceRef）、`timeline.ts`（URL 规范化去重/allow-block/损坏行计数/保留上限）、`sources.ts`（S<n> 稳定 ref + SHA-256）。
- **工作区约束**：`safeSegment` + 双侧 `resolve()` 包含性检查（Windows 反斜杠陷阱已处理）。
- **文档**：五语 README（英文为源，结构/配置键门禁一致）、AGENTS.md、CHANGELOG、SECURITY、THIRD_PARTY_NOTICES、Apache-2.0 LICENSE。
- **CI 三件套**：ci.yml（完整门禁）、compat.yml（rc.5 兼容冒烟）、release.yml（版本标签发布）。

## 验收逐项

| 门禁 | 命令 | 结果 |
|---|---|---|
| 类型检查 | `pnpm run typecheck` | src + test 全绿 |
| CI 严格检查 | `pnpm run typecheck:ci` | skipLibCheck=false + verbatimModuleSyntax 全绿 |
| 测试 | `pnpm test` | 53/53 通过（12 文件），真实 Context/Session/ToolRuntime/SkillRegistry/WebRuntime |
| 构建 | `pnpm run build` | lib/index.js + lib/types 产出，fix-dts 46 处 specifier 重写 |
| 自包含 | `pnpm run verify:self-contained` | 所有 peer/依赖可从 registry 解析 |
| 产物 | `pnpm run verify:artifacts` | 语法/ESM/插件面/bundle 补丁/skills 均在包内 |
| 文档同步 | `pnpm run verify:readme-sync` | 5 个 README 章节结构与配置键一致 |
| 打包 | `pnpm run pack:check` | tarball 内容齐全 |
| lint | `pnpm run lint` | 39 文件 0 警告 0 错误 |
| 覆盖率 | `pnpm run test:coverage` | 94.01 / 80.89 / 100 / 94.01（阈值 80/70/80/80，已实际运行验证） |

### 试装验证（dsh-test-drive 完整 pipeline，真实 dsh CLI + pnpm，已清理）

- 按任务 §2 优先复用 `dsh-test-drive`：在其真实 `DriveRunner` 上驱动（隔离临时 DSH_HOME/workspace/store，前缀 `dsh-test-drive-`，宿主 profile 零接触），target 为本插件 `pnpm pack` 产物 tgz。
- 结果 **verdict: pass**（4.9s）：install pass（真实 `dsh plugin add`，33 包）→ config pass 且 `patchEffective: true`（dump-config 出现 `# == dsh-industry-research` 层与全部 10 个配置键）→ smoke `boot-ok`（无 loader 失败标记，keyless 下 MISSING_CREDENTIAL 属预期）→ capability skipped（无 API key）→ uninstall pass（真实 `dsh plugin remove`）→ cleanup pass（quarantine 重命名 + 删除，零残留）。
- 补充：手动临时 profile 复验一致（dump-config 行 + keyless headless 冒烟 + 安装包直 import 插件面 OK）；手动方式下曾观察到 remove 中途挂起（300s 超时中断），dsh-test-drive 驱动的完整 pipeline 中 remove 正常完成，判断为中断时序所致而非 CLI 缺陷。

## 关键偏差（记录在 README/AGENTS/CHANGELOG）

1. **rc.6 会话事件限制**：`Session.append` 对非 surface 事件无 `ignorable` 标记、无外部事件注册面 → 追加自定义会话事件会让持久化协调器拒绝日志。因此只声明/发送 typed Cordis 事件；模型可见结果走 `tool/result` 会话事件，持久记录为工作区产物。
2. **`ctx.attachment` 仅图片**（PNG/JPEG/WebP/GIF）→ 报告不写 attachment，保持版本化工作区文件。

## 已知限制与后续建议

- 引擎桥 `assemble` 未被仓库内包导入（插件侧仅有结构性适配），跨仓库类型演化风险由冻结契约 + 双路径测试兜底；建议发布后与 `dsh-research-report` 做一次互操作联调。
- 白酒 e2e 基于 `fixtures/baijiu/` 虚构教学数据（报告中明确标注），真实数据需接 `ctx.web` 提供者。
- 方法论 skills 仅中文版；如发布需要可补英文版（任务未要求，记录在案）。
- 下一个发布会话按 PHASE2-GROUP-PROMPTS.md §0.3 执行（版本号 bump + CHANGELOG + 全门禁 + tag，不 push）。

## 收尾链只读盘点（2026-08-20 匿名核验，详见 `RELEASE-HANDOFF.md`）

- **步骤 0 社区反馈检查**：✅ 完成——0 issues / 0 PRs / 欢迎帖 0 回复，无任何待回复反馈。
- **步骤 1 标准件 B**：本地项全部完成（P0 三件套 + SECURITY + 徽章 + Contributors + topics/About/homepage + Discussions 已开启 + 欢迎帖已发）；剩余 1 项 GitHub 侧待办：main 分支保护（匿名读取 401，无法核验，待认证 API 核验/设置，JSON 草稿见交接文档）。
- **步骤 2 标准件 A**：`AdamPlatin123/awesome-dsh-plugins` 已自动收录 ✅；awesome-dsh-plugin（双语）、0xsline（双语）、bruc3van 自荐区、官方 Discussions showcase、OMDSH hub INTAKE 均未投——PR/发帖需 GitHub 写权限，属发布会话；条目草稿、showcase 帖草稿、各目标先读规则提醒均在 `RELEASE-HANDOFF.md`。
- **步骤 3 标准件 C**：✅ 已完成——npm `0.1.0@latest` 已发布、`v0.1.0` tag 在远程、Release workflow success（provenance 路径已跑通）。
- 本会话**未执行任何写操作**（push/PR/发帖/分支保护/npm publish）：任务红线（禁止 push、发 PR、npm publish、读取或使用发布令牌）+ 无 GitHub 写权限，如实记录，不伪造成功。
