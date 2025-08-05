import { join } from 'path'
import fs from 'fs-extra'

/**
 * 环境变量文件生成器
 */
export class EnvGenerator {
  /**
   * 生成基础环境变量配置
   */
  static generateBaseEnv() {
    return `# 应用配置
NODE_ENV=development
PORT=3000

# 应用密钥 (生产环境请修改)
APP_SECRET=your-super-secret-key-here`
  }

  /**
   * 生成数据库相关环境变量
   */
  static generateDatabaseEnv() {
    return `
# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/myapp`
  }

  /**
   * 生成认证相关环境变量
   */
  static generateAuthEnv() {
    return `
# 认证配置 (需要手动实现)
# 参考: https://tanstack.com/start/latest/docs/framework/react/authentication
# JWT_SECRET=your-jwt-secret-here
# SESSION_SECRET=your-session-secret-here`
  }

  /**
   * 生成监控相关环境变量
   */
  static generateMonitoringEnv() {
    return `
# 监控配置
SENTRY_DSN=your-sentry-dsn-here`
  }

  /**
   * 生成分析相关环境变量
   */
  static generateAnalyticsEnv() {
    return `
# 数据分析配置
ANALYTICS_ID=your-analytics-id-here`
  }

  /**
   * 根据选择的功能生成完整环境变量文件
   */
  static generateEnvContent(features) {
    let envContent = this.generateBaseEnv()

    if (features.includes('database')) {
      envContent += this.generateDatabaseEnv()
    }

    if (features.includes('auth')) {
      envContent += this.generateAuthEnv()
    }

    if (features.includes('monitoring')) {
      envContent += this.generateMonitoringEnv()
    }

    if (features.includes('analytics')) {
      envContent += this.generateAnalyticsEnv()
    }

    return envContent
  }

  /**
   * 生成环境变量文件
   */
  static async generate(projectPath, features) {
    const envContent = this.generateEnvContent(features)
    await fs.writeFile(join(projectPath, '.env.example'), envContent)
    await fs.writeFile(join(projectPath, '.env'), envContent)
  }
}