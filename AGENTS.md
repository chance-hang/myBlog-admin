# AGENTS.md — myBlog Admin

## 仓库角色
本仓库是独立博客内容维护台。它不是 Test 前台开发仓库，也不是 Prod 前台发布仓库。

目标职责：
- 编辑文章、短记、专题
- Markdown 预览
- 上传博客图片
- 将内容写入从 `myBlog-prod/main` 创建的 `review/admin-content` 分支
- 用户核对后，再把批准的内容提升到 `myBlog-prod/main`

## 与前台代码的边界
- `myBlog-prod` 的 `review/*`：前台代码与内容的待验收来源；不再依赖 Test 仓库。
- `myBlog-prod`：正式前台代码发布。
- `myBlog-admin`：内容维护和内容发布工具自身的开发。

Admin 自身代码如果要改，也应在本仓库独立开发、Review、验收；不要通过复制 Test/Prod 的旧 `admin/` 目录直接覆盖本仓库。

## 当前实现事实
当前维护台为纯前端 GitHub Pages，浏览器通过用户提供的 GitHub PAT 直接调用 GitHub API。

现有内容路径：
- 文章/短记/专题：目标仓库 content.json；content.js 仅由 Test 前台作为 legacy 只读回退源。
- 上传图片：目标仓库 `assets/uploads/`

## 安全规则
- 绝不把 PAT、token、Cookie、密码或其他凭据提交到 Git。
- 不在代码中硬编码真实 PAT。
- 涉及凭据存储方式、权限范围或发布权限的修改必须明确写入 ACTIVE_TASK 并单独 Review。
- 不因为开发方便而增加第三方后端或外部数据传输，除非用户明确授权。

## 内容发布安全
- 默认先写 Prod 的 review 分支，不直接写 Prod `main`。
- Prod `main` 提升必须有明确的用户确认动作和可审计发布计划。
- 提升内容时只处理内容协议明确允许的文件，不同步前台业务代码。
- 不允许内容提升覆盖 Prod 的 HTML/CSS/JS 前台环境差异。

## Codex 启动任务前必须先同步 GitHub
GitHub 是规则和 ACTIVE_TASK 的权威来源，本地治理文件可能过期。

每次用户要求执行当前任务时，Codex 必须先：
1. 确认当前 Workspace / Git 仓库是 `myBlog-admin`。
2. 执行 `git status`；若存在未知未提交修改，停止并中文报告，不直接 pull。
3. 常规新任务从 `main` 基线开始，执行 `git pull --ff-only origin main`。
4. pull 成功后重新读取最新 `AGENTS.md`、`docs/ACTIVE_TASK.md` 和 ACTIVE_TASK 引用的计划文档。
5. 只执行重新读取后的最新任务，不依据 pull 前缓存/旧文件行动。

若 fast-forward 失败、remote 异常、分支状态有歧义或工作区不干净：停止并报告，不自行 reset/clean/force/rebase 覆盖。

## Codex 工作方式
只执行 ACTIVE_TASK 授权范围。完成后 push 分支，等待 ChatGPT Review；未经授权不自行合并 main。

活跃任务分支建立后，原则上不要在 Review 前无关推进 `main`；若 `main` 必须前进，Review 前必须先把最新 main 安全同步到任务分支并重新验证，且不得扩大任务范围。

## 完成报告
用中文报告分支、commit SHA、修改文件、测试结果、push 状态和未完成风险。

## Workflow 3.0 跨项目同步（2026-09-10）

本节把总控仓库 [`chance-hang/AI-Coding-Control-Center`](https://github.com/chance-hang/AI-Coding-Control-Center) 的跨项目规则同步到本仓库。它**不替代**本仓库既有规则；冲突时本节服从上文"安全规则"、"内容发布安全"、"与前台代码的边界"、"当前实现事实"，最终由 ChatGPT 按 `GLOBAL_RULES.md §19` 恢复权威顺序裁决。

权威来源：

- [GLOBAL_RULES.md](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/GLOBAL_RULES.md)
- [docs/WORKFLOW.md](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/docs/WORKFLOW.md)
- [docs/EXECUTOR_HANDOFF.md](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/docs/EXECUTOR_HANDOFF.md)
- [docs/MULTI_DEVICE.md](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/docs/MULTI_DEVICE.md)
- [docs/DISASTER_RECOVERY.md](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/docs/DISASTER_RECOVERY.md)

### 角色与执行器抽象

- 用户：提出需求、批准 Prod 内容发布、执行关键人工验收。
- ChatGPT：总控。读取 GitHub 事实、维护治理文件、Review Executor 推送结果。
- Executor：在真实本地仓库中执行明确任务的工程层。**Codex 与 Workbuddy 都是可替换 Executor**；Admin Phase C 等高风险能力的执行不绑定单一 Executor，且必须先升 `P0 Active`。
- GitHub：对 Executor 中立的长期共享状态中心。
- myBlog 三仓（Test / Prod / Admin）是三套独立 Workspace，不视为单一项目仓库；Admin 不作为 Test / Prod 的第三环境。

### ACTIVE_TASK / Task Queue 优先级模型

本仓库 `docs/ACTIVE_TASK.md` 必须为每条任务标注优先级：

| 优先级 | 含义 | Executor 允许行为 |
| --- | --- | --- |
| `P0 Active` | 当前唯一允许实施的任务 | Implementation、测试、commit、push |
| `P1 Queued` | 下一任务 | 读取、规划、写文档；**不得提前 Implementation** |
| `P2 Backlog` | 未来任务 | 不主动执行 |

**Executor 不得自行把 P1 / P2 提升为 P0。** Admin Phase C 当前标记为 `P1 Queued`；Executor 不得在没有 ChatGPT 显式升级到 `P0 Active` 之前启动 Phase C 的 Implementation、写 Prod 内容、或降低安全标准。

### STOP 状态机

| 状态 | 后续推进必须由谁激活 |
| --- | --- |
| `Awaiting ChatGPT Review` | ChatGPT |
| `Awaiting User Acceptance` | 用户 |
| `Blocked` | ChatGPT + 用户 |
| `Completed / Accepted` | ChatGPT 派发下一 Task 或执行发布 |

Phase C 经 ChatGPT GitHub Review 通过并完成后续人工验收前，Executor 不得合并分支或启用不受控的 Prod 写入；任何 Phase C 实施必须停在 `Awaiting ChatGPT Review`。

### 上下文高效指令与汇报

- ChatGPT → Executor 默认指令只给三件事：仓库绝对路径、动作、读取入口（`AGENTS.md` / `docs/ACTIVE_TASK.md` / Phase Plan / 设计文档）。
- Executor 默认完成汇报只四件事：`commit SHA` / 测试验证 / `push 成功/失败` / `blocker`。
- 仅当新需求尚未进入 GitHub、高风险操作、异常恢复、需要用户决策时才展开长指令。

### 多电脑 / Executor 接管 / 云同步盘

- 每台电脑使用独立 Git clone；GitHub 负责跨设备同步。
- 同一个仓库同一时间只能有一个写入 Executor。
- dirty worktree 接管必须先保护前一执行器遗留工作；禁止直接 `reset --hard` / `clean -fd` / `checkout --`。
- 百度同步盘**不能视为 Git 状态同步机制**；不得让两个 Executor / 设备同时写同一 clone。
- 遇到 ref 异常先停止、检查 `git reflog` 与 `git fsck`，**不得** reset / clean / 重写历史。详细恢复流程见 [docs/DISASTER_RECOVERY.md §场景 E](https://github.com/chance-hang/AI-Coding-Control-Center/blob/main/docs/DISASTER_RECOVERY.md)。

### 与本仓库既有规则的关系

- 上文"安全规则"（绝不提交 PAT、不硬编码 PAT、权限变更须 ACTIVE_TASK 单独 Review）、"内容发布安全"（先 Test 后 Prod、必须用户确认、不覆盖 Prod 环境差异）、"与前台代码的边界"、"当前实现事实"等仍然有效且优先。
- 本节只在不冲突的范围内补充跨项目同步要求；冲突时按权威顺序由 ChatGPT 显式裁决。
