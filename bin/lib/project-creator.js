import { join } from 'path'
import fs from 'fs-extra'
import { logger } from '../utils/logger.js'
import { TemplateManager } from './template-manager.js'
import { PackageManager } from './package-manager.js'
import { GitManager } from './git-manager.js'
import { DockerGenerator } from '../generators/docker.js'
import { GitHubActionsGenerator } from '../generators/github-actions.js'
import { DatabaseGenerator } from '../generators/database.js'
import { EnvGenerator } from '../generators/env.js'
import { ReadmeGenerator } from '../generators/readme.js'
import { MonitoringGenerator } from '../generators/monitoring.js'
import { AnalyticsGenerator } from '../generators/analytics.js'
import { AuthGenerator } from '../generators/auth.js'
import { AuthApiGenerator } from '../generators/auth-api.js'
import { FEATURES } from '../config/features.js'

/**
 * 项目创建器 - 统一管理项目创建流程
 */
export class ProjectCreator {
  constructor() {
    this.templateManager = new TemplateManager()
    this.packageManager = new PackageManager()
    this.gitManager = new GitManager()
  }

  /**
   * 创建项目
   */
  async createProject(config) {
    const { projectName, template, features, git, install } = config
    
    logger.success(`\n🚀 正在创建项目 "${projectName}"...\n`)

    const projectPath = join(process.cwd(), projectName)
    
    try {
      // 创建项目目录
      await fs.ensureDir(projectPath)

      // 复制模板文件
      await this.templateManager.copyTemplate(template, projectPath)

      // 更新 package.json
      await this.templateManager.updatePackageJson(projectPath, config)

      // 生成功能模块文件
      await this.generateFeatureFiles(projectPath, features)

      // 生成配置文件
      await this.generateConfigFiles(projectPath, config)

      // 安装依赖
      let installSuccess = true
      if (install) {
        installSuccess = await this.packageManager.installDependencies(projectPath)
      }

      // 修复潜在的 import 问题
      await this.fixDuplicateImports(projectPath)

      // 初始化 Git 仓库（在依赖安装后，确保 lock 文件被包含）
      let gitSuccess = true
      if (git) {
        const hasGit = await this.gitManager.checkGitInstallation()
        if (hasGit) {
          if (!install) {
            process.chdir(projectPath) // 如果没有安装依赖，需要切换到项目目录
          }
          gitSuccess = await this.gitManager.initRepository(projectPath)
        }
      }

      // 显示成功消息
      this.showSuccessMessage(config, gitSuccess && git, installSuccess && install)

    } catch (error) {
      logger.showError(error, '创建项目')
      
      // 清理失败的项目目录
      if (fs.existsSync(projectPath)) {
        await fs.remove(projectPath)
      }
      
      process.exit(1)
    }
  }

  /**
   * 生成功能模块文件
   */
  async generateFeatureFiles(projectPath, features) {
    const generators = [
      { feature: 'database', generator: DatabaseGenerator, name: '🗄️ 配置数据库...' },
      { feature: 'docker', generator: DockerGenerator, name: '🐳 配置 Docker...' },
      { feature: 'ci', generator: GitHubActionsGenerator, name: '⚙️ 配置 CI/CD...' },
      { feature: 'auth', generator: AuthGenerator, name: '🔐 配置用户认证...' },
      { feature: 'monitoring', generator: MonitoringGenerator, name: '📊 配置错误监控...' },
      { feature: 'analytics', generator: AnalyticsGenerator, name: '📈 配置数据分析...' }
    ]

    for (const { feature, generator, name } of generators) {
      if (features.includes(feature)) {
        logger.startSpinner(name)
        await generator.generate(projectPath)
        logger.succeedSpinner(`${name.replace('...', '完成')}`)
      }
    }
  }

  /**
   * 生成配置文件
   */
  async generateConfigFiles(projectPath, config) {
    logger.startSpinner('🔧 生成配置文件...')
    
    await EnvGenerator.generate(projectPath, config.features)
    await ReadmeGenerator.generate(projectPath, config)
    
    logger.succeedSpinner('配置文件生成完成')
  }

  /**
   * 修复重复的 createFileRoute import 问题
   */
  async fixDuplicateImports(projectPath) {
    try {
      logger.startSpinner('🔧 修复潜在的 import 问题...')
      const { fixDuplicateImports } = await import('../fix-imports.js')
      const fixedCount = await fixDuplicateImports(projectPath)
      if (fixedCount > 0) {
        logger.succeedSpinner(`修复了 ${fixedCount} 个文件的 import 问题`)
      } else {
        logger.succeedSpinner('检查完成，无需修复')
      }
    } catch (error) {
      logger.failSpinner('修复 import 问题时出错')
      logger.warn('警告:', error.message)
    }
  }

  /**
   * 显示成功消息
   */
  showSuccessMessage(config, hasGit, hasInstall) {
    const { projectName, features } = config
    
    // 转换功能键为显示名称
    const featureNames = features.map(featureKey => FEATURES[featureKey]?.name || featureKey)
    
    logger.showSuccessMessage(projectName, featureNames, hasGit, hasInstall)
  }
}