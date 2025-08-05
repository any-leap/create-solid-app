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

## 🔧 配置

脚手架会自动生成以下配置文件：

- `tailwind.config.mjs` - Tailwind CSS 配置
- `tsconfig.json` - TypeScript 配置
- `vite.config.ts` - Vite 构建配置
- `.env.example` - 环境变量模板
- `drizzle.config.ts` - 数据库配置（如选择）

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**🎉 开始构建您的下一个 Solid 应用吧！**
