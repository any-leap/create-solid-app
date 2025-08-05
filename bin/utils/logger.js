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
   * 显示项目创建成功信息
   */
  showSuccessMessage(projectName, features, hasGit, hasInstall) {
    this.success('\n🎉 项目创建成功!\n')
    this.command('下一步:')
    console.log(chalk.white(`  cd ${projectName}`))
    
    if (!hasInstall) {
      console.log(chalk.white('  bun install  # 推荐使用 Bun (更快)'))
      this.hint('  # 或者: npm install')
    }
    
    console.log(chalk.white('  bun run dev  # 推荐使用 Bun'))
    this.hint('  # 或者: npm run dev')
    this.hint('\n访问 http://localhost:3000 查看您的应用')
    
    if (hasGit && hasInstall) {
      this.success('✅ Git 仓库已初始化，bun.lock 文件已包含在首次提交中')
    }
    
    this.command('💡 提示: 使用 Bun 可以获得更快的包管理和构建速度\n')

    // 显示功能模块信息
    if (features.length > 0) {
      this.info('📋 已启用的功能模块:')
      features.forEach(feature => {
        this.success(`  ✅ ${feature}`)
      })
      console.log()
    }
  }

  /**
   * 显示错误详情
   */
  showError(error, context = '') {
    this.error(`❌ ${context}失败`)
    if (error.message) {
      this.error(`错误详情: ${error.message}`)
    }
  }
}

// 导出单例实例
export const logger = new Logger()