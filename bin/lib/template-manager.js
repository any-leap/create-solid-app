import { join } from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import { logger } from '../utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 模板管理器类
 */
export class TemplateManager {
  constructor() {
    this.templatesDir = join(__dirname, '..', '..', 'templates')
  }

  /**
   * 复制模板文件到项目目录
   */
  async copyTemplate(template, projectPath) {
    logger.startSpinner('📁 复制模板文件...')
    
    try {
      const templatePath = join(this.templatesDir, template)
      
      // 检查模板目录是否存在
      if (!(await fs.pathExists(templatePath))) {
        throw new Error(`模板 "${template}" 不存在`)
      }
      
      // 复制模板文件
      await fs.copy(templatePath, projectPath)
      
      // 处理 .gitignore 文件 (npm 会忽略 .gitignore，所以我们使用 _gitignore)
      await this.handleGitignoreFile(templatePath, projectPath)
      
      logger.succeedSpinner('模板文件复制完成')
    } catch (error) {
      logger.failSpinner('模板文件复制失败')
      throw error
    }
  }

  /**
   * 处理 .gitignore 文件
   */
  async handleGitignoreFile(templatePath, projectPath) {
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
  }

  /**
   * 更新 package.json 文件
   */
  async updatePackageJson(projectPath, config) {
    logger.startSpinner('📝 配置 package.json...')
    
    try {
      const packageJsonPath = join(projectPath, 'package.json')
      const packageJson = await fs.readJson(packageJsonPath)
      
      // 更新基本信息
      packageJson.name = config.projectName
      packageJson.description = config.description
      if (config.author) {
        packageJson.author = config.author
      }
      
      // 根据功能更新依赖
      const { PackageManager } = await import('./package-manager.js')
      const updatedPackageJson = await PackageManager.updatePackageJsonDependencies(
        packageJson, 
        config.features
      )
      
      await fs.writeJson(packageJsonPath, updatedPackageJson, { spaces: 2 })
      
      logger.succeedSpinner('package.json 配置完成')
    } catch (error) {
      logger.failSpinner('package.json 配置失败')
      throw error
    }
  }
}