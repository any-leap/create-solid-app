#!/usr/bin/env node

import { Command } from 'commander'
import { ConfigManager } from './lib/config-manager.js'
import { ProjectCreator } from './lib/project-creator.js'
import { logger } from './utils/logger.js'
import { TEMPLATES } from './config/templates.js'

/**
 * 主应用类
 */
class CreateSolidApp {
  constructor() {
    this.program = new Command()
    this.configManager = new ConfigManager()
    this.projectCreator = new ProjectCreator()
    
    this.setupCLI()
  }

  /**
   * 设置 CLI 命令
   */
  setupCLI() {
    this.program
      .name('create-solid-app')
      .description('智能化的 TanStack Solid Start 项目脚手架')
      .version('1.3.1')

    this.program
      .argument('[project-name]', '项目名称')
      .option('-t, --template <template>', '使用指定模板 (minimal|full-stack|admin|landing)')
      .option('--skip-git', '跳过 Git 初始化')
      .option('--skip-install', '跳过依赖安装')
      .action(this.handleCommand.bind(this))
  }

  /**
   * 处理命令行输入
   */
  async handleCommand(projectName, options) {
    try {
      // 验证模板选择
      await this.validateTemplateOption(options.template)

      // 获取项目配置
      const config = await this.configManager.getProjectConfig(projectName, options)
      
      // 创建项目
      await this.projectCreator.createProject(config)
      
    } catch (error) {
      logger.showError(error, '执行')
      process.exit(1)
    }
  }

  /**
   * 验证模板选项
   */
  async validateTemplateOption(template) {
    if (template && !TEMPLATES[template]) {
      logger.error(`❌ 无效的模板: ${template}`)
      logger.info('可用的模板:')
      Object.entries(TEMPLATES).forEach(([key, template]) => {
        logger.hint(`  • ${key} - ${template.name}`)
      })
      process.exit(1)
    }
  }

  /**
   * 运行应用
   */
  run() {
    this.program.parse()
  }
}

// 运行应用
const app = new CreateSolidApp()
app.run()