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
    
    logger.success(`\n🚀 Creating project "${projectName}"...\n`)

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

      // Fix potential import issues
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
   * Generate feature module files
   */
  async generateFeatureFiles(projectPath, features) {
    const generators = [
      { feature: 'database', generator: DatabaseGenerator, name: '🗄️ Configuring database...' },
      { feature: 'docker', generator: DockerGenerator, name: '🐳 Configuring Docker...' },
      { feature: 'ci', generator: GitHubActionsGenerator, name: '⚙️ Configuring CI/CD...' },
      { feature: 'auth', generator: AuthGenerator, name: '🔐 Configuring user authentication...' },
      { feature: 'monitoring', generator: MonitoringGenerator, name: '📊 Configuring error monitoring...' },
      { feature: 'analytics', generator: AnalyticsGenerator, name: '📈 Configuring analytics...' }
    ]

    for (const { feature, generator, name } of generators) {
      if (features.includes(feature)) {
        logger.startSpinner(name)
        await generator.generate(projectPath)
        logger.succeedSpinner(`${name.replace('...', 'complete')}`)
      }
    }
  }

  /**
   * Generate configuration files
   */
  async generateConfigFiles(projectPath, config) {
    logger.startSpinner('🔧 Generating configuration files...')
    
    await EnvGenerator.generate(projectPath, config.features)
    await ReadmeGenerator.generate(projectPath, config)
    
    logger.succeedSpinner('Configuration files generated successfully')
  }

  /**
   * Fix duplicate createFileRoute import issues
   */
  async fixDuplicateImports(projectPath) {
    try {
      logger.startSpinner('🔧 Fixing potential import issues...')
      const { fixDuplicateImports } = await import('../fix-imports.js')
      const fixedCount = await fixDuplicateImports(projectPath)
      if (fixedCount > 0) {
        logger.succeedSpinner(`Fixed import issues in ${fixedCount} files`)
      } else {
        logger.succeedSpinner('Check completed, no fixes needed')
      }
    } catch (error) {
      logger.failSpinner('Error occurred while fixing import issues')
      logger.warn('Warning:', error.message)
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