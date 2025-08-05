import { execa } from 'execa'
import { logger } from '../utils/logger.js'

/**
 * 包管理器操作类
 */
export class PackageManager {
  constructor() {
    this.preferredManager = 'bun'
    this.fallbackManager = 'npm'
    this.timeout = 300000 // 5分钟超时
  }

  /**
   * 检测可用的包管理器
   */
  async detectPackageManager() {
    try {
      await execa(this.preferredManager, ['--version'], { stdio: 'ignore' })
      return this.preferredManager
    } catch (error) {
      logger.warn(`${this.preferredManager} 不可用，将使用 ${this.fallbackManager}`)
      return this.fallbackManager
    }
  }

  /**
   * 安装依赖
   */
  async installDependencies(projectPath) {
    const originalCwd = process.cwd()
    process.chdir(projectPath)

    try {
      const packageManager = await this.detectPackageManager()
      
      logger.startSpinner(`📦 正在安装依赖 (使用 ${packageManager})...`)
      
      try {
        await execa(packageManager, ['install'], { 
          stdio: ['inherit', 'pipe', 'pipe'],
          timeout: this.timeout
        })
        
        logger.succeedSpinner(`✅ 依赖安装完成 (${packageManager})`)
        return true
      } catch (error) {
        logger.failSpinner(`❌ 依赖安装失败 (${packageManager})`)
        logger.showError(error, `${packageManager} 安装`)
        
        // 如果 bun 失败了，尝试 npm 作为备选
        if (packageManager === this.preferredManager) {
          return await this.fallbackInstall()
        } else {
          logger.warn(`\n建议手动运行: cd ${projectPath} && bun install`)
          return false
        }
      }
    } finally {
      process.chdir(originalCwd)
    }
  }

  /**
   * 使用备选包管理器安装
   */
  async fallbackInstall() {
    logger.warn(`\n正在尝试使用 ${this.fallbackManager} 作为备选方案...`)
    logger.startSpinner(`📦 使用 ${this.fallbackManager} 重新安装依赖...`)
    
    try {
      await execa(this.fallbackManager, ['install'], { 
        stdio: ['inherit', 'pipe', 'pipe'],
        timeout: this.timeout 
      })
      
      logger.succeedSpinner(`✅ 依赖安装完成 (${this.fallbackManager} 备选方案)`)
      return true
    } catch (npmError) {
      logger.failSpinner(`❌ ${this.fallbackManager} 安装也失败了`)
      logger.showError(npmError, `${this.fallbackManager} 安装`)
      logger.warn('\n建议手动运行: bun install')
      return false
    }
  }

  /**
   * 更新 package.json 依赖
   */
  static async updatePackageJsonDependencies(packageJson, features) {
    // 根据选择的功能添加依赖
    const { getFeatureDependencies } = await import('../config/features.js')
    const { dependencies, devDependencies } = getFeatureDependencies(features)

    if (Object.keys(dependencies).length > 0) {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...dependencies
      }
    }

    if (Object.keys(devDependencies).length > 0) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        ...devDependencies
      }
    }

    return packageJson
  }
}