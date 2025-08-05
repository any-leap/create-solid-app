import { join } from 'path'
import fs from 'fs-extra'

/**
 * 数据分析配置生成器
 */
export class AnalyticsGenerator {
  /**
   * 生成 Google Analytics 配置
   */
  static generateGoogleAnalytics() {
    return `import { createSignal, onMount } from 'solid-js'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

/**
 * Google Analytics 配置
 */
export class Analytics {
  private static initialized = false
  private static measurementId = ''

  /**
   * 初始化 Google Analytics
   */
  static init(measurementId: string) {
    if (this.initialized || !measurementId) return
    
    this.measurementId = measurementId
    
    // 加载 Google Analytics 脚本
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = \`https://www.googletagmanager.com/gtag/js?id=\${measurementId}\`
    document.head.appendChild(script1)
    
    // 初始化 gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href
    })
    
    this.initialized = true
  }

  /**
   * 跟踪页面访问
   */
  static trackPageView(path: string, title?: string) {
    if (!this.initialized) return
    
    window.gtag('config', this.measurementId, {
      page_path: path,
      page_title: title || document.title
    })
  }

  /**
   * 跟踪事件
   */
  static trackEvent(action: string, category?: string, label?: string, value?: number) {
    if (!this.initialized) return
    
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }

  /**
   * 跟踪自定义事件
   */
  static trackCustomEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.initialized) return
    
    window.gtag('event', eventName, parameters)
  }

  /**
   * 设置用户属性
   */
  static setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) return
    
    window.gtag('config', this.measurementId, {
      custom_map: properties
    })
  }
}

/**
 * 路由跟踪 Hook
 */
export function useRouteTracking() {
  onMount(() => {
    // 监听路由变化
    const handleRouteChange = () => {
      const path = window.location.pathname
      Analytics.trackPageView(path)
    }
    
    // 监听浏览器历史变化
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  })
}

/**
 * 事件跟踪 Hook
 */
export function useEventTracking() {
  return {
    trackClick: (elementName: string) => {
      Analytics.trackEvent('click', 'UI', elementName)
    },
    trackFormSubmit: (formName: string) => {
      Analytics.trackEvent('submit', 'Form', formName)
    },
    trackDownload: (fileName: string) => {
      Analytics.trackEvent('download', 'File', fileName)
    },
    trackError: (errorMessage: string) => {
      Analytics.trackEvent('exception', 'Error', errorMessage)
    }
  }
}`
  }

  /**
   * 生成简化的分析组件
   */
  static generateAnalyticsComponent() {
    return `import { onMount } from 'solid-js'
import { Analytics, useRouteTracking } from '../lib/analytics/google-analytics'

/**
 * 分析跟踪组件
 */
export function AnalyticsProvider(props: { children: any }) {
  // 初始化分析
  onMount(() => {
    const analyticsId = process.env.ANALYTICS_ID
    if (analyticsId) {
      Analytics.init(analyticsId)
    }
  })
  
  // 启用路由跟踪
  useRouteTracking()
  
  return <>{props.children}</>
}

/**
 * 性能监控组件
 */
export function PerformanceMonitor() {
  onMount(() => {
    // 监控页面加载性能
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (perfData) {
          Analytics.trackCustomEvent('page_performance', {
            page_load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            first_byte: Math.round(perfData.responseStart - perfData.fetchStart)
          })
        }
      }, 1000)
    })
  })
  
  return null
}`
  }

  /**
   * 生成分析配置文件
   */
  static async generate(projectPath) {
    // 创建 analytics 目录
    const analyticsDir = join(projectPath, 'src', 'lib', 'analytics')
    await fs.ensureDir(analyticsDir)
    
    // 生成 Google Analytics 配置
    await fs.writeFile(
      join(analyticsDir, 'google-analytics.ts'), 
      this.generateGoogleAnalytics()
    )
    
    // 生成分析组件
    await fs.writeFile(
      join(projectPath, 'src', 'components', 'Analytics.tsx'),
      this.generateAnalyticsComponent()
    )
    
    // 生成使用说明
    const readme = `# 数据分析配置

## Google Analytics 集成

### 环境变量配置
在 \`.env\` 文件中添加：
\`\`\`
ANALYTICS_ID=G-XXXXXXXXXX
\`\`\`

### 使用方法

1. 在应用根组件包装分析提供者：
\`\`\`tsx
import { AnalyticsProvider, PerformanceMonitor } from './components/Analytics'

function App() {
  return (
    <AnalyticsProvider>
      <PerformanceMonitor />
      <YourApp />
    </AnalyticsProvider>
  )
}
\`\`\`

2. 在组件中使用事件跟踪：
\`\`\`tsx
import { useEventTracking } from './lib/analytics/google-analytics'

function MyComponent() {
  const { trackClick, trackFormSubmit } = useEventTracking()
  
  return (
    <button onClick={() => trackClick('hero-button')}>
      点击我
    </button>
  )
}
\`\`\`

## 手动事件跟踪
\`\`\`tsx
import { Analytics } from './lib/analytics/google-analytics'

// 跟踪自定义事件
Analytics.trackCustomEvent('user_signup', {
  method: 'email',
  user_type: 'premium'
})

// 跟踪页面访问
Analytics.trackPageView('/about', 'About Page')
\`\`\`

## 支持的分析平台
- ✅ Google Analytics 4
- 🔄 未来支持：Plausible, Umami, Mixpanel
`
    
    await fs.writeFile(join(analyticsDir, 'README.md'), readme)
  }
}