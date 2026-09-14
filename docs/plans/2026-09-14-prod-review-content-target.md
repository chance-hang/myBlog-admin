# Admin Prod review 内容目标迁移

## 目标

在不依赖 `myBlog-test` 的情况下，允许 Admin 将内容草稿写入从 `myBlog-prod/main` 创建的临时 `review/*` 分支；人工验收通过后，再由受控发布流程把已选择内容提升到 Prod `main`。

## 目标链路

```text
myBlog-prod/main
  → 创建 review/admin-content-<task>
  → Admin 读取 review 分支 content.json
  → Admin 使用读取到的 blob SHA 写入 review 分支
  → 本地/受控预览验收
  → 记录 review commit、content blob、字段差异和图片清单
  → GitHub Environment approval
  → 单次 Git Data API 提交到 myBlog-prod/main
```

## 实现要求

1. Admin 目标仓库固定为 `chance-hang/myBlog-prod`，默认分支仍为 `main`。
2. 每次任务必须使用显式 review 分支；禁止 Admin 直接通过 Contents API 写 Prod `main`。
3. Admin 启动时读取目标仓库和分支的实际 ref，并将 branch、commit SHA、content blob SHA 显示在界面中。
4. 内容写入必须携带读取时的 blob SHA，并传递 branch 参数；409/422 时停止并要求重新读取。
5. 创建 review 分支必须基于当时读取到的 Prod `main` SHA；分支已存在但基线不一致时拒绝继续。
6. Phase C 的 source 不再是 Test 文档，而是 review 分支文档；发布前仍须重新检查 Prod `main` baseline。
7. 单次发布提交只允许写入 `content.json`、经过 hash 校验的 `assets/uploads/` 文件和 `docs/releases/<releaseId>.json`。
8. 浏览器内不得保存 Prod PAT；真实 Prod PAT 只由 GitHub Environment secret 提供给发布 workflow。
9. review 分支不自动部署到正式 Pages；验收使用本地导出/本地 HTTP 预览或独立 review 预览目标。

## 兼容与退役

- 在迁移代码和一次完整演练通过前，保留旧 Test 目标，但不新增 Test 业务内容。
- 迁移完成后删除 Admin 中的 Test 常量、Test Pages URL、Test token 文案、Test acceptance 字段和 Test publisher adapter。
- 发布记录字段改为 `reviewBranch`、`reviewCommitSha`、`reviewContentBlobSha`、`prodBaselineCommitSha`。
- 旧 Test 发布记录只作为历史，不再作为新任务输入。

## 验收门槛

- Admin 单元测试覆盖 review 分支创建、分支基线冲突、content blob 冲突和禁止直接写 `main`。
- Phase C publisher 测试覆盖 review source → Prod main 的原子提交和零写入失败路径。
- `node --check`、全量 `node --test`、`git diff --check` 通过。
- 至少一次真实 GitHub API review 分支演练通过；演练只写 review 分支，不写 Prod main。
- 迁移完成前不得删除 `myBlog-test`。
