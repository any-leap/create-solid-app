#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { execa } from 'execa'
import fs from 'fs-extra'
import validateNpmName from 'validate-npm-package-name'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

// 模板选项
const TEMPLATES = {
  'minimal': {
    name: '最小化应用',
    description: '基础的 Solid Start 应用，适合快速原型开发'
  },
  'full-stack': {
    name: '全栈应用',
    description: '完整的全栈应用，包含数据库、认证、Docker配置'
  },
  'admin': {
    name: '管理后台',
    description: '企业级管理后台，包含仪表板、数据管理功能'
  },
  'landing': {
    name: '着陆页',
    description: '营销着陆页模板，优化SEO和转化率'
  }
}

// 功能模块选项
const FEATURES = {
  database: { name: '数据库 (Drizzle ORM)', recommended: true },
  auth: { name: '用户认证', recommended: true },
  docker: { name: 'Docker 配置', recommended: true },
  ci: { name: 'CI/CD (GitHub Actions)', recommended: false },
  testing: { name: '测试配置 (Vitest)', recommended: false },
  monitoring: { name: '错误监控 (Sentry)', recommended: false },
  analytics: { name: '数据分析', recommended: false }
}

async function validateProjectName(name) {
  const validation = validateNpmName(name)
  
  if (!validation.validForNewPackages) {
    console.error(chalk.red('❌ 项目名称无效:'))
    validation.errors?.forEach(error => console.error(chalk.red(`  • ${error}`)))
    validation.warnings?.forEach(warning => console.error(chalk.yellow(`  • ${warning}`)))
    return false
  }
  
  if (fs.existsSync(name)) {
    console.error(chalk.red(`❌ 目录 "${name}" 已存在`))
    return false
  }
  
  return true
}

async function getProjectConfig(projectName) {
  console.log(chalk.blue('\n🎯 让我们配置您的项目...\n'))

  const response = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '选择项目模板:',
      choices: Object.entries(TEMPLATES).map(([key, template]) => ({
        title: template.name,
        description: template.description,
        value: key
      })),
      initial: 1 // 默认选择 full-stack
    },
    {
      type: 'multiselect',
      name: 'features',
      message: '选择需要的功能模块:',
      choices: Object.entries(FEATURES).map(([key, feature]) => ({
        title: feature.name,
        value: key,
        selected: feature.recommended
      })),
      hint: '使用空格选择/取消，回车确认'
    },
    {
      type: 'text',
      name: 'description',
      message: '项目描述:',
      initial: '基于 TanStack Solid Start 的现代化 Web 应用'
    },
    {
      type: 'text',
      name: 'author',
      message: '作者:',
      initial: ''
    },
    {
      type: 'confirm',
      name: 'git',
      message: '初始化 Git 仓库?',
      initial: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: '立即安装依赖?',
      initial: true
    }
  ])

  if (!response.template) {
    console.log(chalk.yellow('操作已取消'))
    process.exit(1)
  }

  return {
    projectName,
    ...response
  }
}

async function createProject(config) {
  const { projectName, template, features, description, author, git, install } = config
  
  console.log(chalk.green(`\n🚀 正在创建项目 "${projectName}"...\n`))

  // 创建项目目录
  const projectPath = join(process.cwd(), projectName)
  await fs.ensureDir(projectPath)

  let spinner = ora('📁 复制模板文件...').start()
  
  try {
    // 复制基础模板
    const templatePath = join(__dirname, '..', 'templates', template)
    await fs.copy(templatePath, projectPath)
    
    // 处理 .gitignore 文件 (npm 会忽略 .gitignore，所以我们使用 _gitignore)
    const gitignoreSource = join(templatePath, '_gitignore')
    const gitignoreTarget = join(projectPath, '.gitignore')
    const gitignoreTemp = join(projectPath, '_gitignore')
    
    if (await fs.pathExists(gitignoreSource)) {
      await fs.copy(gitignoreSource, gitignoreTarget)
      // 删除复制过来的临时 _gitignore 文件
      if (await fs.pathExists(gitignoreTemp)) {
        await fs.remove(gitignoreTemp)
      }
    }
    
    spinner.succeed('模板文件复制完成')

    // 生成 package.json
    spinner = ora('📝 配置 package.json...').start()
    const packageJsonPath = join(projectPath, 'package.json')
    const packageJson = await fs.readJson(packageJsonPath)
    
    packageJson.name = projectName
    packageJson.description = description
    if (author) packageJson.author = author
    
    // 根据选择的功能添加依赖
    if (features.includes('database')) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        'drizzle-orm': '^0.44.4'
      }
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        'drizzle-kit': '^0.31.4'
      }
    }
    
    // Note: @auth/solid-start is not compatible with TanStack Solid Start
    // Auth implementation can be added manually using TanStack Start's server functions
    if (features.includes('auth')) {
      // Auth dependencies will be added when TanStack-compatible auth solutions are available
      console.log('📝 Auth feature selected - implement using TanStack Start server functions')
    }
    
    if (features.includes('testing')) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        'vitest': '^3.2.4',
        '@solidjs/testing-library': '^0.8.10'
      }
    }
    
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
    spinner.succeed('package.json 配置完成')

    // 生成功能模块文件
    if (features.includes('docker')) {
      spinner = ora('🐳 配置 Docker...').start()
      await generateDockerConfig(projectPath)
      spinner.succeed('Docker 配置完成')
    }

    if (features.includes('ci')) {
      spinner = ora('⚙️ 配置 CI/CD...').start()
      await generateGithubActions(projectPath)
      spinner.succeed('GitHub Actions 配置完成')
    }

    // 生成环境变量模板
    spinner = ora('🔧 生成配置文件...').start()
    await generateEnvFile(projectPath, features)
    await generateReadme(projectPath, config)
    spinner.succeed('配置文件生成完成')

    // 先安装依赖，生成 lock 文件
    if (install) {
      process.chdir(projectPath)
      
      // 检测并优先使用 Bun
      let packageManager = 'npm'
      let installCmd = ['install']
      
      try {
        await execa('bun', ['--version'], { stdio: 'ignore' })
        packageManager = 'bun'
        installCmd = ['install']
      } catch (error) {
        // Bun 不可用，使用 npm
      }
      
      spinner = ora(`📦 正在安装依赖 (使用 ${packageManager})...`).start()
      
      try {
        await execa(packageManager, installCmd, { 
          stdio: ['inherit', 'pipe', 'pipe'],
          timeout: 300000 // 5分钟超时
        })
        spinner.succeed(`✅ 依赖安装完成 (${packageManager})`)
      } catch (error) {
        spinner.fail(`❌ 依赖安装失败 (${packageManager})`)
        console.error(chalk.red('\n错误详情:'))
        console.error(chalk.red(error.message))
        
        // 如果 bun 失败了，尝试 npm 作为备选
        if (packageManager === 'bun') {
          console.log(chalk.yellow('\n正在尝试使用 npm 作为备选方案...'))
          spinner = ora('📦 使用 npm 重新安装依赖...').start()
          
          try {
            await execa('npm', ['install'], { 
              stdio: ['inherit', 'pipe', 'pipe'],
              timeout: 300000 
            })
            spinner.succeed('✅ 依赖安装完成 (npm 备选方案)')
          } catch (npmError) {
            spinner.fail('❌ npm 安装也失败了')
            console.error(chalk.red('\nnpm 错误详情:'))
            console.error(chalk.red(npmError.message))
            console.log(chalk.yellow('\n建议手动运行: cd ' + projectName + ' && bun install'))
          }
        } else {
          console.log(chalk.yellow('\n建议手动运行: cd ' + projectName + ' && bun install'))
        }
      }
    }

    // 在安装依赖后初始化 Git，确保 lock 文件被包含在首次提交中
    if (git) {
      spinner = ora('📦 初始化 Git 仓库...').start()
      if (!install) process.chdir(projectPath) // 如果没有安装依赖，需要切换到项目目录
      
      await execa('git', ['init'])
      await execa('git', ['add', '.'])
      await execa('git', ['commit', '-m', 'feat: 初始化项目'])
      spinner.succeed('Git 仓库初始化完成')
    }

    // 成功消息
    console.log(chalk.green('\n🎉 项目创建成功!\n'))
    console.log(chalk.cyan('下一步:'))
    console.log(chalk.white(`  cd ${projectName}`))
    
    if (!install) {
      console.log(chalk.white('  bun install  # 推荐使用 Bun (更快)'))
      console.log(chalk.gray('  # 或者: npm install'))
    }
    
    console.log(chalk.white('  bun run dev  # 推荐使用 Bun'))
    console.log(chalk.gray('  # 或者: npm run dev'))
    console.log(chalk.gray('\n访问 http://localhost:3000 查看您的应用'))
    
    if (git && install) {
      console.log(chalk.green('✅ Git 仓库已初始化，bun.lock 文件已包含在首次提交中'))
    }
    
    console.log(chalk.cyan('💡 提示: 使用 Bun 可以获得更快的包管理和构建速度\n'))

    // 显示功能模块信息
    if (features.length > 0) {
      console.log(chalk.blue('📋 已启用的功能模块:'))
      features.forEach(feature => {
        console.log(chalk.green(`  ✅ ${FEATURES[feature].name}`))
      })
      console.log()
    }

  } catch (error) {
    if (spinner) spinner.fail('创建项目失败')
    console.error(chalk.red('错误:'), error.message)
    
    // 清理失败的项目目录
    if (fs.existsSync(projectPath)) {
      await fs.remove(projectPath)
    }
    
    process.exit(1)
  }
}

async function generateDockerConfig(projectPath) {
  const dockerfile = `FROM oven/bun:1-alpine AS base
WORKDIR /app

# 安装依赖
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# 构建应用
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 运行时
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 solidjs

COPY --from=builder /app/.output ./.output
RUN chown -R solidjs:nodejs /app

USER solidjs
EXPOSE 3000
ENV PORT 3000

CMD ["bun", ".output/server/index.mjs"]`

  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # 如果使用数据库，取消注释以下配置
  # db:
  #   image: postgres:15-alpine
  #   environment:
  #     POSTGRES_DB: myapp
  #     POSTGRES_USER: user
  #     POSTGRES_PASSWORD: password
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data
  #   ports:
  #     - "5432:5432"

# volumes:
#   postgres_data:`

  await fs.writeFile(join(projectPath, 'Dockerfile'), dockerfile)
  await fs.writeFile(join(projectPath, 'docker-compose.yml'), dockerCompose)
}

async function generateGithubActions(projectPath) {
  const workflow = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    
    - name: Install dependencies
      run: bun install --frozen-lockfile
    
    - name: Run tests
      run: bun run test
    
    - name: Build project
      run: bun run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to production
      run: echo "部署到生产环境"`

  await fs.ensureDir(join(projectPath, '.github', 'workflows'))
  await fs.writeFile(join(projectPath, '.github', 'workflows', 'ci.yml'), workflow)
}

async function generateEnvFile(projectPath, features) {
  let envContent = `# 应用配置
NODE_ENV=development
PORT=3000

# 应用密钥 (生产环境请修改)
APP_SECRET=your-super-secret-key-here
`

  if (features.includes('database')) {
    envContent += `
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
`
  }

  if (features.includes('auth')) {
    envContent += `
# 认证配置 (需要手动实现)
# 参考: https://tanstack.com/start/latest/docs/framework/react/authentication
# JWT_SECRET=your-jwt-secret-here
# SESSION_SECRET=your-session-secret-here
`
  }

  if (features.includes('monitoring')) {
    envContent += `
# 监控配置
SENTRY_DSN=your-sentry-dsn-here
`
  }

  await fs.writeFile(join(projectPath, '.env.example'), envContent)
  await fs.writeFile(join(projectPath, '.env'), envContent)
}

async function generateReadme(projectPath, config) {
  const { projectName, template, features, description } = config
  
  const readme = `# ${projectName}

${description}

## 🚀 技术栈

- **框架**: TanStack Solid Start
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **包管理**: Bun

${features.includes('database') ? '- **数据库**: Drizzle ORM\n' : ''}${features.includes('auth') ? '- **认证**: 手动实现 (TanStack Start 服务器函数)\n' : ''}${features.includes('docker') ? '- **部署**: Docker\n' : ''}${features.includes('testing') ? '- **测试**: Vitest\n' : ''}

## 📦 快速开始

\`\`\`bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 启动生产服务器
bun run start
\`\`\`

${features.includes('docker') ? `## 🐳 Docker 部署

\`\`\`bash
# 构建镜像
docker build -t ${projectName} .

# 运行容器
docker run -p 3000:3000 ${projectName}

# 或使用 docker-compose
docker-compose up -d
\`\`\`

` : ''}${features.includes('database') ? `## 🗄️ 数据库

\`\`\`bash
# 生成迁移文件
bun run db:generate

# 执行迁移
bun run db:migrate

# 查看数据库
bun run db:studio
\`\`\`

` : ''}## 📁 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── routes/        # 页面路由
├── styles/        # 样式文件
├── utils/         # 工具函数
└── router.tsx     # 路由配置
\`\`\`

## 🔧 环境变量

复制 \`.env.example\` 到 \`.env\` 并填写相应的配置:

\`\`\`bash
cp .env.example .env
\`\`\`

## 📚 文档

- [TanStack Solid Start](https://tanstack.com/start)
- [Solid.js](https://solidjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License
`

  await fs.writeFile(join(projectPath, 'README.md'), readme)
}

// CLI 命令定义
program
  .name('create-solid-app')
  .description('智能化的 TanStack Solid Start 项目脚手架')
  .version('1.2.3')

program
  .argument('[project-name]', '项目名称')
  .option('-t, --template <template>', '使用指定模板', 'full-stack')
  .option('--skip-git', '跳过 Git 初始化')
  .option('--skip-install', '跳过依赖安装')
  .action(async (projectName, options) => {
    // 如果没有提供项目名称，提示用户输入
    if (!projectName) {
      const response = await prompts({
        type: 'text',
        name: 'projectName',
        message: '项目名称:',
        validate: validateProjectName
      })
      
      if (!response.projectName) {
        console.log(chalk.yellow('操作已取消'))
        process.exit(1)
      }
      
      projectName = response.projectName
    } else {
      // 验证提供的项目名称
      if (!(await validateProjectName(projectName))) {
        process.exit(1)
      }
    }

    // 获取项目配置
    const config = await getProjectConfig(projectName)
    
    // 应用命令行选项
    if (options.skipGit) config.git = false
    if (options.skipInstall) config.install = false
    if (options.template) config.template = options.template

    // 创建项目
    await createProject(config)
  })

program.parse()