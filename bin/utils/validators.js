import fs from 'fs-extra'
import validateNpmName from 'validate-npm-package-name'
import { isValidTemplate } from '../config/templates.js'
import { logger } from './logger.js'

/**
 * Project validator class
 */
export class ProjectValidator {
  /**
   * Validate project name
   */
  static async validateProjectName(name) {
    const validation = validateNpmName(name)
    
    if (!validation.validForNewPackages) {
      logger.error('❌ Invalid project name:')
      validation.errors?.forEach(error => logger.error(`  • ${error}`))
      validation.warnings?.forEach(warning => logger.warn(`  • ${warning}`))
      return false
    }
    
    if (fs.existsSync(name)) {
      logger.error(`❌ Directory "${name}" already exists`)
      return false
    }
    
    return true
  }

  /**
   * Validate template selection
   */
  static async validateTemplate(template) {
    if (!template) {
      return true // Allow empty, will be selected interactively
    }

    if (!isValidTemplate(template)) {
      logger.error(`❌ Invalid template: ${template}`)
      logger.info('Available templates:')
      const { TEMPLATES } = await import('../config/templates.js')
      Object.entries(TEMPLATES).forEach(([key, template]) => {
        logger.hint(`  • ${key} - ${template.name}`)
      })
      return false
    }
    
    return true
  }

  /**
   * Validate project configuration
   */
  static validateConfig(config) {
    const { projectName, template } = config
    
    if (!projectName) {
      logger.error('❌ Project name cannot be empty')
      return false
    }
    
    if (!template) {
      logger.error('❌ Must select a template')
      return false
    }
    
    return true
  }
}

// Export convenience functions
export const validateProjectName = ProjectValidator.validateProjectName
export const validateTemplate = ProjectValidator.validateTemplate
export const validateConfig = ProjectValidator.validateConfig