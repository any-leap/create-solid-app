# @any-l/create-solid-app

> 🚀 现代化的 TanStack Solid Start 项目脚手架工具

## 📦 快速开始

使用 Bun（推荐）：

```bash
bunx @any-l/create-solid-app my-project
```

使用 npm：

```bash
npx @any-l/create-solid-app my-project
```

## ✨ 特性

- 🎨 **交互式配置** - 根据需求定制项目功能
- ⚡ **多种模板** - 最小化、全栈、管理后台、着陆页
- 🛠️ **可选功能模块** - 数据库、认证、Docker、CI/CD、测试
- 📦 **智能依赖管理** - 只安装需要的依赖包
- 🔄 **自动化配置** - 一键生成完整项目结构

## 🎯 项目模板

### 📌 最小化版本 (minimal)

- 基础 TanStack Solid Start 配置
- TypeScript + Tailwind CSS
- 开发工具配置

### 🚀 全栈版本 (full-stack)

- 完整的全栈应用框架
- 数据库集成 (Drizzle ORM)
- API 路由和中间件
- 用户认证系统

### 🏢 管理后台 (admin)

- 现代化管理界面
- 数据表格和表单组件
- 权限管理系统
- 仪表板布局

### 🌐 着陆页 (landing)

- 营销导向的页面结构
- SEO 优化配置
- 响应式设计
- 性能优化

## ⚙️ 可选功能

- **🗄️ 数据库** - Drizzle ORM + SQLite/PostgreSQL
- **🔐 用户认证** - Auth.js 集成
- **🐳 Docker** - 容器化部署配置
- **⚙️ CI/CD** - GitHub Actions 工作流
- **🧪 测试** - Vitest 测试框架
- **📊 监控** - 性能和错误监控

## 📖 使用示例

```bash
# 创建项目
bunx @any-l/create-solid-app my-awesome-app

# 选择模板和功能
? 选择项目模板: Full Stack Application
? 选择功能模块: Database, Authentication, Docker

# 进入项目目录
cd my-awesome-app

# 启动开发服务器
bun run dev
```

## 🚀 生成的项目结构

```
my-awesome-app/
├── src/
│   ├── components/     # 可复用组件
│   ├── routes/        # 页面路由
│   ├── lib/           # 工具库
│   └── styles/        # 样式文件
├── public/            # 静态资源
├── drizzle/          # 数据库相关（可选）
├── docker/           # Docker 配置（可选）
├── .github/          # CI/CD 工作流（可选）
└── package.json
```

## 🛠️ 开发命令

生成的项目包含以下命令：

```bash
bun run dev        # 启动开发服务器
bun run build      # 构建生产版本
bun run start      # 启动生产服务器
bun run test       # 运行测试
bun run lint       # 代码检查
```

## 📋 系统要求

- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0（推荐）或 **npm** >= 8.0.0

## 🏗️ 技术架构说明

### 为什么选择 Bun + Node.js 混合架构？

本脚手架采用 **Bun 作为包管理器 + Node.js 作为运行时** 的混合架构，原因如下：

#### ✅ Bun 的优势（包管理）

- 🚀 **极速安装**: 比 npm/yarn 快 10-20 倍
- 📦 **兼容性好**: 完全兼容 npm 生态
- 🔧 **内置工具**: 集成了 bundler、test runner、package manager

#### ✅ Node.js 的必要性（运行时）

- 🏛️ **官方支持**: TanStack Start 官方基于 Node.js 设计
- 🔌 **API 兼容**: 依赖 Node.js 特有的 API 和功能
- 🛡️ **稳定可靠**: 生产环境的最佳选择

> **重要提示**: 根据 [Bun 官方文档](https://bun.sh/guides/ecosystem/solidstart)，TanStack Start 目前依赖一些 Bun 尚未实现的 Node.js API。因此，我们使用 Bun 来初始化项目和安装依赖，但使用 Node.js 来运行开发服务器。

### 🗄️ 数据库集成（Drizzle ORM）

如果选择了数据库功能，脚手架会自动配置 [Drizzle ORM](https://bun.sh/guides/ecosystem/drizzle)：

```bash
# 安装 Drizzle ORM（运行时）
bun add drizzle-orm

# 安装 Drizzle Kit（开发工具）
bun add -D drizzle-kit
```

这样既利用了 Bun 的快速安装优势，又确保了与 TanStack Start 的完美兼容。

### 🔄 完整的开发流程

```bash
# 1. 使用 Bun 快速安装依赖
bun install

# 2. 使用 Node.js 运行开发服务器（通过 Vite）
bun run dev     # 这实际上运行的是 vite dev（使用 Node.js）

# 3. 使用 Bun 添加新依赖
bun add some-package

# 4. 使用 Node.js 构建生产版本
bun run build  # 这实际上运行的是 vite build（使用 Node.js）
```

## 🔧 配置

脚手架会自动生成以下配置文件：

- `tailwind.config.mjs` - Tailwind CSS 配置
- `tsconfig.json` - TypeScript 配置
- `vite.config.ts` - Vite 构建配置
- `.env.example` - 环境变量模板
- `drizzle.config.ts` - 数据库配置（如选择）
- `package.json` - 使用标准 Vite 命令，兼容 Node.js 运行时

## 💡 最佳实践

### 🚀 推荐的开发工作流

1. **使用 Bun 管理依赖**:

   ```bash
   bun add package-name     # 添加依赖
   bun remove package-name  # 移除依赖
   bun update              # 更新所有依赖
   ```

2. **使用标准命令开发**:

   ```bash
   bun run dev    # 开发服务器（底层使用 Node.js + Vite）
   bun run build  # 生产构建（底层使用 Node.js + Vite）
   ```

3. **数据库开发**（如果选择了数据库功能）:
   ```bash
   bun run db:generate  # 生成迁移文件
   bun run db:migrate   # 应用迁移
   bun run db:studio    # 打开数据库管理界面
   ```

### ❓ 常见问题

**Q: 为什么不直接使用 Bun 运行 TanStack Start？**

A: TanStack Start 依赖一些 Bun 尚未完全实现的 Node.js API。按照 [Bun 官方建议](https://bun.sh/guides/ecosystem/solidstart)，我们使用 Bun 来管理依赖（更快），使用 Node.js 来运行应用（更稳定）。

**Q: 生产环境怎么部署？**

A: 生产环境建议使用 Node.js。构建命令 `bun run build` 会生成兼容 Node.js 的产物，可以直接部署到任何支持 Node.js 的环境。

**Q: 可以完全使用 npm 吗？**

A: 当然可以！所有命令都兼容 npm：

```bash
npx @any-l/create-solid-app my-project
cd my-project
npm install
npm run dev
```

**Q: Vite 为什么选择 Node.js 而不是 Bun？**

A: 虽然 Bun 有自己的 bundler，但 Vite 在 SolidJS 生态系统中有更好的插件支持和稳定性。我们的策略是"包管理用 Bun，构建用 Vite"，充分利用两者的优势。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📝 版本历史

### v3.0.0 (最新) - 重大更新

- ✅ **修复核心问题**: 基于 TanStack Start 官方文档重新设计
- ✅ **Bun + Node.js 架构**: 最佳的性能和兼容性平衡
- ✅ **依赖修复**: 添加缺失的 `@tanstack/solid-router`
- ✅ **配置优化**: TypeScript 和 Vite 配置符合最佳实践
- ✅ **路由修复**: 正确的导入路径和配置

### v2.x - 已弃用

⚠️ v2.x 版本存在配置问题，强烈建议升级到 v3.0.0

## 🔗 相关链接

- [📚 CHANGELOG.md](./CHANGELOG.md) - 详细更新日志
- [🔄 MIGRATION-V3.md](./MIGRATION-V3.md) - v3.0.0 迁移指南
- [🌐 TanStack Start 文档](https://tanstack.com/start/latest/docs/framework/solid/build-from-scratch)
- [⚡ Bun 生态指南](https://bun.sh/guides/ecosystem/solidstart)

---

**🎉 开始构建您的下一个 Solid 应用吧！**
