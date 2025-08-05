import { join } from 'path'
import fs from 'fs-extra'
import { FEATURES } from '../config/features.js'

/**
 * README.md 文件生成器
 */
export class ReadmeGenerator {
  /**
   * 生成技术栈部分
   */
  static generateTechStack(features) {
    let techStack = `## 🚀 技术栈

- **框架**: TanStack Solid Start
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **包管理**: Bun
`

    if (features.includes('database')) {
      techStack += '- **数据库**: Drizzle ORM\n'
    }
    
    if (features.includes('auth')) {
      techStack += '- **认证**: 手动实现 (TanStack Start 服务器函数)\n'
    }
    
    if (features.includes('docker')) {
      techStack += '- **部署**: Docker\n'
    }
    
    if (features.includes('testing')) {
      techStack += '- **测试**: Vitest\n'
    }

    return techStack
  }

  /**
   * 生成快速开始部分
   */
  static generateQuickStart() {
    return `## 📦 快速开始

\`\`\`bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 启动生产服务器
bun run start
\`\`\``
  }

  /**
   * 生成 Docker 部署部分
   */
  static generateDockerSection(projectName) {
    return `## 🐳 Docker 部署

\`\`\`bash
# 构建镜像
docker build -t ${projectName} .

# 运行容器
docker run -p 3000:3000 ${projectName}

# 或使用 docker-compose
docker-compose up -d
\`\`\`
`
  }

  /**
   * 生成数据库部分
   */
  static generateDatabaseSection() {
    return `## 🗄️ 数据库

\`\`\`bash
# 生成迁移文件
bun run db:generate

# 执行迁移
bun run db:migrate

# 查看数据库
bun run db:studio
\`\`\`
`
  }

  /**
   * 生成项目结构部分
   */
  static generateProjectStructure() {
    return `## 📁 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── routes/        # 页面路由
├── styles/        # 样式文件
├── utils/         # 工具函数
└── router.tsx     # 路由配置
\`\`\``
  }

  /**
   * 生成环境变量部分
   */
  static generateEnvironmentSection() {
    return `## 🔧 环境变量

复制 \`.env.example\` 到 \`.env\` 并填写相应的配置:

\`\`\`bash
cp .env.example .env
\`\`\``
  }

  /**
   * 生成文档和贡献部分
   */
  static generateDocsAndContribution() {
    return `## 📚 文档

- [TanStack Solid Start](https://tanstack.com/start)
- [Solid.js](https://solidjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License`
  }

  /**
   * 生成完整的 README 内容
   */
  static generateReadmeContent(config) {
    const { projectName, features, description } = config
    
    let readme = `# ${projectName}

${description}

`
    
    readme += this.generateTechStack(features)
    readme += '\n'
    readme += this.generateQuickStart()
    readme += '\n'

    if (features.includes('docker')) {
      readme += '\n'
      readme += this.generateDockerSection(projectName)
    }

    if (features.includes('database')) {
      readme += '\n'
      readme += this.generateDatabaseSection()
    }

    readme += '\n'
    readme += this.generateProjectStructure()
    readme += '\n\n'
    readme += this.generateEnvironmentSection()
    readme += '\n\n'
    readme += this.generateDocsAndContribution()

    return readme
  }

  /**
   * 生成 README.md 文件
   */
  static async generate(projectPath, config) {
    const readmeContent = this.generateReadmeContent(config)
    await fs.writeFile(join(projectPath, 'README.md'), readmeContent)
  }
}