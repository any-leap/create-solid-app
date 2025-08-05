import { execa } from 'execa'
import { logger } from '../utils/logger.js'

/**
 * Git 操作管理器
 */
export class GitManager {
  /**
   * 初始化 Git 仓库
   */
  async initRepository(projectPath) {
    logger.startSpinner('📦 初始化 Git 仓库...')
    
    try {
      const originalCwd = process.cwd()
      process.chdir(projectPath)
      
      // 初始化 git 仓库
      await execa('git', ['init'])
      
      // 添加所有文件
      await execa('git', ['add', '.'])
      
      // 创建初始提交
      await execa('git', ['commit', '-m', 'feat: 初始化项目'])
      
      process.chdir(originalCwd)
      
      logger.succeedSpinner('Git 仓库初始化完成')
      return true
    } catch (error) {
      logger.failSpinner('Git 仓库初始化失败')
      logger.showError(error, 'Git 初始化')
      return false
    }
  }

  /**
   * 检查是否安装了 Git
   */
  async checkGitInstallation() {
    try {
      await execa('git', ['--version'], { stdio: 'ignore' })
      return true
    } catch (error) {
      logger.warn('⚠️ Git 未安装，跳过 Git 仓库初始化')
      return false
    }
  }
}