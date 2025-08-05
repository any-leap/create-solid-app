import fs from 'fs-extra'
import validateNpmName from 'validate-npm-package-name'
import { isValidTemplate } from '../config/templates.js'
import { logger } from './logger.js'

/**
 * 项目验证器类
 */
export class ProjectValidator {
  /**
   * 验证项目名称
   */
  static async validateProjectName(name) {
    const validation = validateNpmName(name)
    
    if (!validation.validForNewPackages) {
      logger.error('❌ 项目名称无效:')
      validation.errors?.forEach(error => logger.error(`  • ${error}`))
      validation.warnings?.forEach(warning => logger.warn(`  • ${warning}`))
      return false
    }
    
    if (fs.existsSync(name)) {
      logger.error(`❌ 目录 "${name}" 已存在`)
      return false
    }
    
    return true
  }

  /**
   * 验证模板选择
   */
  static async validateTemplate(template) {
    if (!template) {
      return true // 允许为空，将通过交互式选择
    }

    if (!isValidTemplate(template)) {
      logger.error(`❌ 无效的模板: ${template}`)
      logger.info('可用的模板:')
      const { TEMPLATES } = await import('../config/templates.js')
      Object.entries(TEMPLATES).forEach(([key, template]) => {
        logger.hint(`  • ${key} - ${template.name}`)
      })
      return false
    }
    
    return true
  }

  /**
   * 验证项目配置
   */
  static validateConfig(config) {
    const { projectName, template } = config
    
    if (!projectName) {
      logger.error('❌ 项目名称不能为空')
      return false
    }
    
    if (!template) {
      logger.error('❌ 必须选择一个模板')
      return false
    }
    
    return true
  }
}

// 导出便捷函数
export const validateProjectName = ProjectValidator.validateProjectName
export const validateTemplate = ProjectValidator.validateTemplate
export const validateConfig = ProjectValidator.validateConfig