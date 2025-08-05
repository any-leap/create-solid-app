import { logger } from '../utils/logger.js'
import { getProjectPrompts, getProjectNamePrompt } from '../utils/prompts.js'
import { validateProjectName, validateTemplate, validateConfig } from '../utils/validators.js'

/**
 * 项目配置管理器
 */
export class ConfigManager {
  /**
   * 获取完整的项目配置
   */
  async getProjectConfig(projectName, options = {}) {
    logger.info('\n🎯 让我们配置您的项目...\n')

    // 如果没有项目名称，提示用户输入
    if (!projectName) {
      projectName = await getProjectNamePrompt(validateProjectName)
    } else {
      // 验证提供的项目名称
      if (!(await validateProjectName(projectName))) {
        process.exit(1)
      }
    }

    // 验证模板选择
    if (!(await validateTemplate(options.template))) {
      process.exit(1)
    }

    // 获取项目配置
    const response = await getProjectPrompts(options)

    // 如果命令行提供了模板，使用命令行的值；否则检查用户是否取消了选择
    const template = options.template || response.template
    if (!template) {
      logger.warn('操作已取消')
      process.exit(1)
    }

    const config = {
      projectName,
      template,
      ...response
    }

    // 应用命令行选项
    if (options.skipGit) config.git = false
    if (options.skipInstall) config.install = false

    // 验证最终配置
    if (!validateConfig(config)) {
      process.exit(1)
    }

    return config
  }
}