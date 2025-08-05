import { join } from 'path'
import fs from 'fs-extra'

/**
 * 错误监控配置生成器 (Sentry)
 */
export class MonitoringGenerator {
  /**
   * 生成 Sentry 配置文件
   */
  static generateSentryConfig() {
    return `import { init } from '@sentry/solid-js'

// 初始化 Sentry
init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  
  // 设置采样率
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // 性能监控
  integrations: [
    // 可以添加其他集成
  ],
  
  // 错误过滤
  beforeSend(event) {
    // 开发环境下打印错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('Sentry Event:', event)
    }
    return event
  }
})

export default init`
  }

  /**
   * 生成错误边界组件
   */
  static generateErrorBoundary() {
    return `import { ErrorBoundary } from 'solid-js'
import { withSentryErrorBoundary } from '@sentry/solid-js'

/**
 * 全局错误边界组件
 */
function GlobalErrorFallback(error: Error) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-red-50">
      <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.876c1.382 0 2.164-1.577 1.465-2.803L13.465 4.197c-.702-1.228-2.228-1.228-2.93 0L3.597 17.197c-.699 1.226.083 2.803 1.465 2.803z" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">
              出现了错误
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              我们已经记录了这个错误，请稍后重试
            </p>
          </div>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div class="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-600">
            <strong>错误详情:</strong><br/>
            {error.message}
          </div>
        )}
        
        <div class="mt-6">
          <button 
            onClick={() => window.location.reload()}
            class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            重新加载页面
          </button>
        </div>
      </div>
    </div>
  )
}

// 使用 Sentry 增强错误边界
export const SentryErrorBoundary = withSentryErrorBoundary(ErrorBoundary, {
  fallback: GlobalErrorFallback,
  showDialog: false
})`
  }

  /**
   * 生成监控配置文件
   */
  static async generate(projectPath) {
    // 创建 monitoring 目录
    const monitoringDir = join(projectPath, 'src', 'lib', 'monitoring')
    await fs.ensureDir(monitoringDir)
    
    // 生成 Sentry 配置
    await fs.writeFile(
      join(monitoringDir, 'sentry.ts'), 
      this.generateSentryConfig()
    )
    
    // 生成错误边界组件
    await fs.writeFile(
      join(projectPath, 'src', 'components', 'SentryErrorBoundary.tsx'),
      this.generateErrorBoundary()
    )
    
    // 生成使用说明
    const readme = `# 错误监控配置

## Sentry 集成

### 安装依赖
\`\`\`bash
bun add @sentry/solid-js
\`\`\`

### 环境变量配置
在 \`.env\` 文件中添加：
\`\`\`
SENTRY_DSN=your-sentry-dsn-here
\`\`\`

### 使用方法

1. 在应用入口初始化 Sentry：
\`\`\`tsx
import './lib/monitoring/sentry'
\`\`\`

2. 在根组件使用错误边界：
\`\`\`tsx
import { SentryErrorBoundary } from './components/SentryErrorBoundary'

function App() {
  return (
    <SentryErrorBoundary>
      <YourApp />
    </SentryErrorBoundary>
  )
}
\`\`\`

## 手动错误报告
\`\`\`tsx
import * as Sentry from '@sentry/solid-js'

// 捕获异常
Sentry.captureException(new Error('Something went wrong'))

// 记录消息
Sentry.captureMessage('Custom message', 'info')
\`\`\`
`
    
    await fs.writeFile(join(monitoringDir, 'README.md'), readme)
  }
}