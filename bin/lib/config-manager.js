import { logger } from '../utils/logger.js'
import { getProjectPrompts, getProjectNamePrompt } from '../utils/prompts.js'
import { validateProjectName, validateTemplate, validateConfig } from '../utils/validators.js'

/**
 * Project configuration manager
 */
export class ConfigManager {
  /**
   * Get complete project configuration
   */
  async getProjectConfig(projectName, options = {}) {
    logger.info('\n🎯 Let\'s configure your project...\n')

    // If no project name provided, prompt user for input
    if (!projectName) {
      projectName = await getProjectNamePrompt(validateProjectName)
    } else {
      // Validate provided project name
      if (!(await validateProjectName(projectName))) {
        process.exit(1)
      }
    }

    // Validate template selection
    if (!(await validateTemplate(options.template))) {
      process.exit(1)
    }

    // Get project configuration
    const response = await getProjectPrompts(options)

    // If template provided via CLI, use it; otherwise check if user cancelled selection
    const template = options.template || response.template
    if (!template) {
      logger.warn('Operation cancelled')
      process.exit(1)
    }

    const config = {
      projectName,
      template,
      ...response
    }

    // Apply CLI options
    if (options.skipGit) config.git = false
    if (options.skipInstall) config.install = false

    // Validate final configuration
    if (!validateConfig(config)) {
      process.exit(1)
    }

    return config
  }
}