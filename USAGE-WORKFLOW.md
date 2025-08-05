# 🎯 新项目使用完整工作流程

## 📋 概览

这个工作流程文档详细说明了如何使用脚手架创建新项目，以及项目创建后的开发、部署和维护流程。

## 🚀 项目创建流程

### 方式一：使用 CLI 工具（推荐）

#### 1. 安装 CLI 工具

```bash
# 从私有NPM Registry安装
npm config set registry https://your-private-registry.com
bun add -g @any-l/create-solid-app

# 或从GitHub Packages安装
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
bun add -g @your-github-username/create-solid-app
```

#### 2. 创建新项目

```bash
# 交互式创建
bunx @any-l/create-solid-app

# 或指定项目名称
bunx @any-l/create-solid-app my-awesome-app

# 使用命令行选项
bunx @any-l/create-solid-app my-app --template=admin --skip-git
```

#### 3. 交互式配置过程

```
🎯 让我们配置您的项目...

? 选择项目模板: (Use arrow keys)
❯ 全栈应用 - 完整的全栈应用，包含数据库、认证、Docker配置
  最小化应用 - 基础的 Solid Start 应用，适合快速原型
  管理后台 - 企业级管理后台，包含权限管理、数据图表
  着陆页 - 营销着陆页模板，优化SEO和转化率

? 选择需要的功能模块: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ 数据库 (Drizzle ORM)
 ◉ 用户认证
 ◉ Docker 配置
 ◯ CI/CD (GitHub Actions)
 ◯ 测试配置 (Vitest)
 ◯ 错误监控 (Sentry)
 ◯ 数据分析

? 项目描述: 基于 TanStack Solid Start 的现代化 Web 应用
? 作者: Your Name <your.email@example.com>
? 初始化 Git 仓库? Yes
? 立即安装依赖? Yes
```

#### 4. 项目创建完成

```
🎉 项目创建成功!

下一步:
  cd my-awesome-app
  bun run dev

访问 http://localhost:3000 查看您的应用

📋 已启用的功能模块:
  ✅ 数据库 (Drizzle ORM)
  ✅ 用户认证
  ✅ Docker 配置
```

### 方式二：Git Template Repository

```bash
# 使用GitHub CLI
gh repo create my-new-project --template any-leap/solid-start-scaffold
cd my-new-project

# 或手动克隆
git clone https://github.com/any-leap/solid-start-scaffold.git my-new-project
cd my-new-project
rm -rf .git
git init
```

## 🛠️ 项目初始化和配置

### 1. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
nano .env
```

**.env 配置示例：**

```bash
# 应用配置
NODE_ENV=development
PORT=3000
APP_SECRET=your-super-secret-key-here

# 数据库配置（如果启用）
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# 认证配置（如果启用）
AUTH_SECRET=your-auth-secret-here
AUTH_TRUST_HOST=true

# 第三方服务（按需配置）
SENTRY_DSN=your-sentry-dsn-here
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### 2. 依赖安装和验证

```bash
# 安装依赖
bun install

# 类型检查
bun run typecheck

# 运行测试（如果启用）
bun run test

# 启动开发服务器
bun run dev
```

### 3. 数据库设置（如果启用）

```bash
# 生成数据库迁移文件
bun run db:generate

# 执行数据库迁移
bun run db:migrate

# 查看数据库（可选）
bun run db:studio
```

## 🏗️ 开发工作流程

### 1. 日常开发

```bash
# 启动开发服务器
bun run dev

# 新终端窗口 - 运行类型检查
bun run typecheck --watch

# 新终端窗口 - 运行测试
bun run test --watch
```

### 2. 添加新功能

#### 创建新页面

```bash
# 创建路由文件
touch src/routes/new-feature.tsx

# 添加路由逻辑
echo "export default function NewFeature() {
  return <div>New Feature Page</div>
}" > src/routes/new-feature.tsx
```

#### 创建新组件

```bash
# 创建组件目录
mkdir -p src/components/NewComponent

# 创建组件文件
touch src/components/NewComponent/index.tsx
touch src/components/NewComponent/NewComponent.module.css
```

#### 添加 API 端点

```bash
# 创建API路由
touch src/routes/api/new-endpoint.ts

# 添加API逻辑
echo "export async function GET() {
  return new Response(JSON.stringify({ message: 'Hello API' }))
}" > src/routes/api/new-endpoint.ts
```

### 3. 代码质量检查

```bash
# 代码格式化
bun run format

# ESLint检查
bun run lint

# 自动修复lint问题
bun run lint:fix

# 完整的质量检查
bun run typecheck && bun run lint && bun run test
```

### 4. Git 工作流程

```bash
# 创建功能分支
git checkout -b feature/new-awesome-feature

# 提交更改
git add .
git commit -m "feat: 添加新的awesome功能"

# 推送到远程
git push origin feature/new-awesome-feature

# 创建Pull Request（使用GitHub CLI）
gh pr create --title "feat: 添加新的awesome功能" --body "功能描述..."
```

## 🚀 部署流程

### 1. 本地构建验证

```bash
# 构建生产版本
bun run build

# 本地测试生产版本
bun run start

# 验证构建产物
ls -la .output/
```

### 2. Docker 部署

```bash
# 构建Docker镜像
docker build -t my-app:latest .

# 本地测试Docker镜像
docker run -p 3000:3000 my-app:latest

# 使用docker-compose
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### 3. 生产环境部署

#### 方式一：传统服务器部署

```bash
# 服务器上拉取代码
git pull origin main

# 安装依赖
bun install --production

# 构建应用
bun run build

# 重启服务
pm2 restart my-app
```

#### 方式二：容器化部署

```bash
# 推送镜像到registry
docker tag my-app:latest your-registry.com/my-app:latest
docker push your-registry.com/my-app:latest

# 在生产服务器上部署
docker pull your-registry.com/my-app:latest
docker-compose -f docker-compose.prod.yml up -d
```

#### 方式三：云平台部署

```bash
# Vercel部署
bunx vercel

# Netlify部署
bunx netlify deploy --prod

# Railway部署
bunx railway deploy
```

## 🔄 持续集成/持续部署 (CI/CD)

### GitHub Actions 工作流程

当您推送代码到主分支时，自动触发：

1. **代码质量检查**

   - TypeScript 类型检查
   - ESLint 代码规范检查
   - 单元测试运行

2. **构建验证**

   - 生产环境构建
   - Docker 镜像构建

3. **自动部署**
   - 部署到测试环境
   - 运行 E2E 测试
   - 部署到生产环境

### 手动触发部署

```bash
# 创建release tag触发生产部署
git tag v1.0.0
git push origin v1.0.0

# 或使用GitHub CLI
gh release create v1.0.0 --title "Release v1.0.0" --notes "发布说明..."
```

## 📊 监控和维护

### 1. 应用监控

```bash
# 查看应用状态
curl http://localhost:3000/health

# 查看应用日志
docker-compose logs -f app

# 性能监控（如果启用Sentry）
# 自动收集错误和性能数据
```

### 2. 数据库维护

```bash
# 备份数据库
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 查看数据库连接
bun run db:studio

# 运行数据库迁移
bun run db:migrate
```

### 3. 依赖更新

```bash
# 检查过期依赖
bunx npm-check-updates

# 更新依赖
bunx npm-check-updates -u
bun install

# 运行测试确保更新无问题
bun run test
```

## 🔧 故障排除

### 常见问题和解决方案

#### 1. 端口冲突

```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程
lsof -ti:3000 | xargs kill -9

# 或使用智能启动脚本
bun run smart-start
```

#### 2. 依赖问题

```bash
# 清理依赖
rm -rf node_modules bun.lock*
bun install

# 检查依赖冲突
bun run typecheck
```

#### 3. 构建失败

```bash
# 检查构建日志
bun run build --verbose

# 清理构建缓存
rm -rf .output .solid
bun run build
```

#### 4. 数据库连接问题

```bash
# 检查数据库连接
bunx drizzle-kit introspect:pg --config=drizzle.config.ts

# 重置数据库（开发环境）
bun run db:reset
```

## 📚 最佳实践

### 1. 代码组织

- 使用功能模块化的目录结构
- 保持组件单一职责
- 合理使用 TypeScript 类型

### 2. 性能优化

- 使用 Solid 的细粒度响应式
- 合理使用 memo 和 lazy loading
- 优化包体积

### 3. 安全最佳实践

- 定期更新依赖
- 使用环境变量管理敏感信息
- 启用 HTTPS

### 4. 团队协作

- 统一代码规范
- 详细的 commit message
- 完善的 PR 模板

## 📈 项目扩展

### 添加新功能模块

```bash
# 使用脚手架扩展工具（未来功能）
bunx @any-l/add-feature auth
bunx @any-l/add-feature payment
bunx @any-l/add-feature admin

# 手动添加功能
# 1. 安装相关依赖
# 2. 创建功能目录
# 3. 配置路由
# 4. 更新类型定义
```

### 微服务拆分

当项目变大时，考虑拆分为微服务：

```bash
# 使用微服务模板
bunx @any-l/create-solid-app auth-service --template=micro-service
bunx @any-l/create-solid-app user-service --template=micro-service
```

这个完整的工作流程确保了从项目创建到生产部署的每个环节都有清晰的指导！
