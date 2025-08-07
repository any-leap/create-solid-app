import chalk from 'chalk'
import ora from 'ora'

/**
 * 统一的日志和进度显示工具
 */
export class Logger {
  constructor() {
    this.spinner = null
  }

  /**
   * 显示信息消息
   */
  info(message) {
    console.log(chalk.blue(message))
  }

  /**
   * 显示成功消息
   */
  success(message) {
    console.log(chalk.green(message))
  }

  /**
   * 显示警告消息
   */
  warn(message) {
    console.log(chalk.yellow(message))
  }

  /**
   * 显示错误消息
   */
  error(message) {
    console.error(chalk.red(message))
  }

  /**
   * 显示灰色提示消息
   */
  hint(message) {
    console.log(chalk.gray(message))
  }

  /**
   * 显示青色命令消息
   */
  command(message) {
    console.log(chalk.cyan(message))
  }

  /**
   * 开始加载动画
   */
  startSpinner(message) {
    this.spinner = ora(message).start()
    return this.spinner
  }

  /**
   * 成功结束加载动画
   */
  succeedSpinner(message) {
    if (this.spinner) {
      this.spinner.succeed(message)
      this.spinner = null
    }
  }

  /**
   * 失败结束加载动画
   */
  failSpinner(message) {
    if (this.spinner) {
      this.spinner.fail(message)
      this.spinner = null
    }
  }

  /**
   * Show project creation success message
   */
  showSuccessMessage(projectName, features, hasGit, hasInstall) {
    this.success('\n🎉 Project created successfully!\n')
    this.command('Next steps:')
    console.log(chalk.white(`  cd ${projectName}`))
    
    if (!hasInstall) {
      console.log(chalk.white('  bun install  # Recommended: faster package manager'))
      this.hint('  # Or: npm install')
    }
    
    console.log(chalk.white('  bun run dev  # Recommended: faster runtime'))
    this.hint('  # Or: npm run dev')
    this.hint('\nVisit http://localhost:3000 to view your application')
    
    if (hasGit && hasInstall) {
      this.success('✅ Git repository initialized, bun.lock file included in initial commit')
    }
    
    this.command('💡 Tip: Use Bun for faster package management and build speeds\n')

    // Show enabled features
    if (features.length > 0) {
      this.info('📋 Enabled features:')
      features.forEach(feature => {
        this.success(`  ✅ ${feature}`)
      })
      console.log()
    }
  }

  /**
   * Show error details
   */
  showError(error, context = '') {
    this.error(`❌ ${context} failed`)
    if (error.message) {
      this.error(`错误详情: ${error.message}`)
    }
  }
}

// 导出单例实例
export const logger = new Logger()