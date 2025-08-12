#!/usr/bin/env node

import { Command } from 'commander'
import { ConfigManager } from './lib/config-manager.js'
import { ProjectCreator } from './lib/project-creator.js'
import { logger } from './utils/logger.js'
import { TEMPLATES } from './config/templates.js'

/**
 * Main application class
 */
class CreateSolidApp {
  constructor() {
    this.program = new Command()
    this.configManager = new ConfigManager()
    this.projectCreator = new ProjectCreator()
    
    this.setupCLI()
  }

  /**
   * Setup CLI commands
   */
  setupCLI() {
    this.program
      .name('create-solid-app')
      .description('Intelligent TanStack Solid Start project scaffolding tool')
      .version('1.3.1')

    this.program
      .argument('[project-name]', 'Project name')
      .option('-t, --template <template>', 'Use specified template (minimal|start-bare|start-basic|full-stack|admin|landing)')
      .option('--skip-git', 'Skip Git initialization')
      .option('--skip-install', 'Skip dependency installation')
      .action(this.handleCommand.bind(this))
  }

  /**
   * Handle command line input
   */
  async handleCommand(projectName, options) {
    try {
      // Validate template selection
      await this.validateTemplateOption(options.template)

      // Get project configuration
      const config = await this.configManager.getProjectConfig(projectName, options)
      
      // Create project
      await this.projectCreator.createProject(config)
      
    } catch (error) {
      logger.showError(error, 'execution')
      process.exit(1)
    }
  }

  /**
   * Validate template option
   */
  async validateTemplateOption(template) {
    if (template && !TEMPLATES[template]) {
      logger.error(`❌ Invalid template: ${template}`)
      logger.info('Available templates:')
      Object.entries(TEMPLATES).forEach(([key, template]) => {
        logger.hint(`  • ${key} - ${template.name}`)
      })
      process.exit(1)
    }
  }

  /**
   * Run application
   */
  run() {
    this.program.parse()
  }
}

// Run application
const app = new CreateSolidApp()
app.run()