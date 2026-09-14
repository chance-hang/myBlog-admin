# myBlog-admin 维护台

独立仓库中的博客维护台，**纯前端、无后端**。当前未部署 GitHub Pages，不设线上正式入口。

## 架构
- 维护台前端：本仓库（`myBlog-admin`），当前未部署 GitHub Pages
- 数据后端：**无**。浏览器用你的 Personal Access Token 直接调 `api.github.com`
  （公司网络放行 + 开放 CORS，无需任何中间云）
- Phase B 仅读取和写入 `myBlog-prod` 的 `review/admin-content` 分支根目录 `content.json`（`schemaVersion: 1`）
- 本阶段禁用图片写入，且不存在任何 Prod 读取、写入或提升能力

## 使用
1. 在受控的本地 HTTP 环境中打开本仓库页面；当前没有可用的 GitHub Pages 正式入口
2. 粘贴仅限 `myBlog-prod` review 分支的 Fine-grained PAT，权限仅为 `Contents: Read and write`
3. 读取并校验 Prod review `content.json`，新建或编辑文章、短记、专题；右侧可预览 Markdown
4. 「校验并写入 Prod review」后，使用回执中的 commit SHA、content blob SHA 和条目 ID 在受控 review 预览中核对

## 安全说明
- PAT 不上传任何服务器，也不写入 localStorage、sessionStorage、DOM 持久记录或 Git 内容；刷新页面即清除
- 仅使用 Fine-grained PAT，并只授权 `myBlog-prod` 的 `Contents: Read and write`；写入时必须带 `review/admin-content` branch
- 写入携带读取时的 `content.json` blob SHA；GitHub 报告冲突时停止并要求重新读取，不会覆盖远端基线
- Phase B 禁用图片写入，因为浏览器 Contents API 无法保证图片与内容单一原子提交

## 为什么没有用 EdgeOne Makers 做后端
Makers 部署后的 `*.edgeone.cool` 端点被预览网关 `eo_token` 保护（实测 401），
无法被跨站前端直接调用，且绑定自定义域名需 ICP 备案。故改用直连 GitHub 方案。
