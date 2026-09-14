# ACTIVE TASK — myBlog Admin

最后更新：2026-09-14（Prod-only 内容发布迁移，Awaiting ChatGPT Review）

## Status

`Awaiting ChatGPT Review`（Prod-only 内容发布迁移）

当前工作分支：`review/prod-only-content-target`

当前提交：`a722b0a`

本轮已将内容 review 目标切换为 `myBlog-prod` 的 `review/admin-content`，并通过 `scripts/publish-prod-review.cjs` 受控提升到 `myBlog-prod/main`；已退休的 Test 仓库不再作为执行入口。

Review 对象：

`d3477d95c933afb11a27e9bc5afaccc28af3140a`

本轮已在 `codex/admin-online-release` 整合经确认的三栏 UI 与 Phase C 受控发布能力，并新增 main-only GitHub Pages 部署准备 workflow；不得自行 merge main、不得触发真实 Prod 发布或 Pages Production 部署。

权威 Re-review：

`docs/reviews/2026-09-11-admin-workbench-v2-re-review.md`

当前权威 Plan：

`docs/plans/2026-09-11-admin-workbench-v2.md`

Phase C 安全 Review 继续有效：

`docs/reviews/2026-09-11-admin-phase-c-chatgpt-review.md`

## 当前唯一范围

### Blocker 1 — 元数据没有真正移出默认编辑视图

当前 stable ID、日期、分类、type、reading 等字段仍在 `#editor-write` 的默认编辑表单里；`#editor-meta` 只有说明文字。

必须真正把这些字段移入元数据视图，并保持原有 form / Test 写入语义不变。

默认编辑视图只保留高频编辑内容：文章标题 / 摘要 / 正文，短记对应主字段。

### Blocker 2 — 重复 preview ID

当前 `index.html` 存在两个 `id="preview"`。必须只保留一个唯一 Markdown preview 容器，并让 `preview()` 与 tab 切换明确使用它。

## 测试要求

当前 helper-only 测试不足以证明真实页面结构正确。

在不引入新框架 / jsdom / build system 的前提下，至少增加对 `index.html` / CSS contract 的静态结构测试：

- `preview` ID 唯一；
- `editor-write / editor-preview / editor-meta` 三个 view 存在；
- stable ID / 日期 / 分类 / type / reading 位于元数据视图，不在默认编辑区；
- 文章 / 短记 / 发布三个一级导航存在；
- 专题不在一级导航与默认新建类型下拉；
- 关键 16:9 布局 contract 继续存在；
- 原有导航 / 分类 / 搜索 / 排序 / state 保留测试继续通过；
- Phase B / Phase C plan safety / boundary / publisher mock / diff / review boundary 全部继续通过；
- `git diff --check` 通过。

## Executor 边界

继续在现有 `codex/admin-phase-c-implementation` 分支追加**最小 Review Fix**。

开始前：

1. `git pull --ff-only origin codex/admin-phase-c-implementation`；
2. 确认 worktree clean、分支与远端一致；
3. 重新读取 `AGENTS.md`、本文件、Re-review、Workbench V2 Plan、Phase C 安全 Review；
4. 继续使用 shell / PowerShell 文件修改路径；
5. 异常立即 STOP，不得 reset / clean / force。

继续禁止：

- 改变 Phase B Test-only 写入逻辑；
- 改 content schema / stable ID；
- 改 Phase C C1–C9 / publisher / release plan 语义；
- 真实 Prod 写入或真实 Prod PAT；
- 修改 myBlog-test / myBlog-prod 业务代码；
- merge main；
- reset / clean / force / 重写历史。

## STOP 状态机

- 当前：`P0 Active (Review Fixes)`。
- 修复 commit + push 后：`Awaiting ChatGPT Review`。
- ChatGPT Review PASS 后：`Awaiting User Acceptance`。
- 用户 16:9 桌面人工验收通过后：`Completed / Accepted`。
- 任意安全 / 治理 / 实现冲突：`Blocked`。

## 完成后只需报告

- branch
- previous Review Fix SHA
- final Review Fix SHA
- tests / checks
- push
- blocker

并确认：无真实 Prod 写入、无真实 Prod PAT、无 Test/Prod 业务代码修改、未 merge main。
