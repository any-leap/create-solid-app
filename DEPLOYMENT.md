# 🚀 脚手架发布和部署指南

## 📦 发布策略

### 方案一：私有 NPM Registry（推荐）

#### 1. 设置私有 NPM Registry

如果您有私有npm服务器（如Verdaccio）：

```bash
# 配置私有registry
npm config set registry https://your-private-npm-registry.com

# 或者使用.npmrc文件
echo "registry=https://your-private-npm-registry.com" > .npmrc
```

#### 2. 发布到私有Registry

```bash
cd scaffold/

# 构建项目
bun run build

# 登录私有registry
npm login --registry=https://your-private-npm-registry.com

# 发布包
npm publish --registry=https://your-private-npm-registry.com
```

### 方案二：GitHub Packages（推荐）

#### 1. 配置GitHub Packages

修改 `scaffold/package.json`：

```json
{
  "name": "@your-github-username/create-solid-app",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/create-solid-app.git"
  }
}
```

#### 2. 创建GitHub Token

1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 创建 token，权限选择：
   - `read:packages`
   - `write:packages`
   - `delete:packages`

#### 3. 发布到GitHub Packages

```bash
# 登录GitHub Packages
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# 发布
npm publish
```

### 方案三：Git Template Repository

#### 1. 创建Template Repository

```bash
# 推送脚手架到GitHub
git init
git add .
git commit -m "feat: 初始化脚手架"
git branch -M main
git remote add origin https://github.com/your-username/solid-start-scaffold.git
git push -u origin main
```

#### 2. 设置为Template

在GitHub仓库设置中勾选 "Template repository"

## 🔧 自动化发布

### GitHub Actions 自动发布

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish Package

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Build package
        run: bun run build

      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish to GitHub Packages
        run: npm publish --registry=https://npm.pkg.github.com
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 版本管理

```bash
# 发布新版本
npm version patch  # 补丁版本 1.0.0 -> 1.0.1
npm version minor  # 次版本 1.0.0 -> 1.1.0
npm version major  # 主版本 1.0.0 -> 2.0.0

# 推送tag触发自动发布
git push --tags
```

## 🛠️ 企业级部署方案

### 内网部署

#### 1. 使用Verdaccio搭建私有NPM

```bash
# 安装Verdaccio
npm install -g verdaccio

# 启动服务
verdaccio

# 配置config.yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@your-company/*':
    access: $authenticated
    publish: $authenticated
```

#### 2. Docker部署Verdaccio

```yaml
# docker-compose.yml
version: "3"
services:
  verdaccio:
    image: verdaccio/verdaccio:5
    ports:
      - "4873:4873"
    volumes:
      - "./verdaccio/storage:/verdaccio/storage"
      - "./verdaccio/config:/verdaccio/conf"
      - "./verdaccio/plugins:/verdaccio/plugins"
    environment:
      - VERDACCIO_USER_UID=10001
      - VERDACCIO_USER_GID=65533
```

### CDN分发

#### 1. 使用阿里云OSS

```bash
# 上传到OSS
ossutil cp scaffold/ oss://your-bucket/scaffold/ -r

# 设置公共读权限
ossutil set-acl oss://your-bucket/scaffold/ public-read -r
```

#### 2. 使用脚本分发

```bash
#!/bin/bash
# deploy-scaffold.sh

# 打包脚手架
tar -czf scaffold-latest.tar.gz scaffold/

# 上传到多个服务器
servers=("server1.com" "server2.com" "server3.com")

for server in "${servers[@]}"; do
  echo "Deploying to $server..."
  scp scaffold-latest.tar.gz user@$server:/var/www/scaffold/
  ssh user@$server "cd /var/www/scaffold && tar -xzf scaffold-latest.tar.gz"
done
```

## 🔒 安全考虑

### 1. 访问控制

```bash
# 设置包访问权限
npm access restricted @any-l/create-solid-app

# 添加团队成员
npm team add any-l:developers your-username
```

### 2. 依赖扫描

```bash
# 安全审计
npm audit

# 自动修复
npm audit fix
```

### 3. 签名验证

```bash
# 生成GPG密钥
gpg --gen-key

# 配置npm使用GPG签名
npm config set sign-git-tag true
npm config set sign-git-commit true
```

## 📊 监控和分析

### 1. 使用统计

在CLI工具中添加使用统计：

```javascript
// 在create-app.js中添加
import { exec } from "child_process";

async function trackUsage(data) {
  // 发送使用统计到您的分析服务
  await fetch("https://your-analytics.com/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "scaffold_used",
      template: data.template,
      features: data.features,
      timestamp: new Date().toISOString(),
    }),
  });
}
```

### 2. 错误报告

```javascript
// 错误报告
process.on("unhandledRejection", (error) => {
  console.error("未处理的错误:", error);

  // 发送错误报告
  fetch("https://your-error-tracking.com/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }),
  });
});
```

## 🚀 发布检查清单

发布前确保：

- [ ] ✅ 所有测试通过
- [ ] ✅ 文档更新完整
- [ ] ✅ 版本号正确递增
- [ ] ✅ CHANGELOG.md 更新
- [ ] ✅ 安全扫描通过
- [ ] ✅ 模板文件完整
- [ ] ✅ CLI工具功能正常
- [ ] ✅ 权限配置正确
- [ ] ✅ 备份旧版本

## 📈 版本策略

### 语义化版本

- **主版本(Major)**: 不兼容的API修改
- **次版本(Minor)**: 向下兼容的功能性新增
- **修订版本(Patch)**: 向下兼容的问题修正

### 发布频率

- **稳定版**: 每月一次
- **测试版**: 每周一次
- **热修复**: 紧急发布

```bash
# 发布测试版
npm version prerelease --preid=beta
npm publish --tag beta

# 发布稳定版
npm version minor
npm publish --tag latest
```

这样您就有了一个完整的企业级脚手架发布方案！
