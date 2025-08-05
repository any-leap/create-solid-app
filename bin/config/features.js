/**
 * 功能模块配置定义
 */
export const FEATURES = {
  database: { 
    name: '数据库 (Drizzle ORM)', 
    recommended: true,
    dependencies: {
      'drizzle-orm': '^0.44.4'
    },
    devDependencies: {
      'drizzle-kit': '^0.31.4'
    }
  },
  auth: { 
    name: '用户认证 (Session + SQLite)', 
    recommended: true,
    note: '安全的服务器端session认证，使用Bun SQLite存储用户数据',
    files: [
      'src/lib/auth/database.ts',
      'src/lib/auth/auth-store.tsx', 
      'src/components/Auth.tsx',
      'src/routes/api/auth/',
      'src/middleware/auth.ts',
      'data/auth.sqlite'
    ]
  },
  docker: { 
    name: 'Docker 配置', 
    recommended: true,
    files: ['Dockerfile', 'docker-compose.yml']
  },
  ci: { 
    name: 'CI/CD (GitHub Actions)', 
    recommended: false,
    files: ['.github/workflows/ci.yml']
  },
  testing: { 
    name: '测试配置 (Vitest)', 
    recommended: false,
    devDependencies: {
      'vitest': '^3.2.4',
      '@solidjs/testing-library': '^0.8.10'
    }
  },
  monitoring: { 
    name: '错误监控 (Sentry)', 
    recommended: false,
    envVars: ['SENTRY_DSN'],
    dependencies: {
      '@sentry/solid-js': '^7.100.0'
    },
    files: ['src/lib/monitoring/', 'src/components/SentryErrorBoundary.tsx']
  },
  analytics: { 
    name: '数据分析 (Google Analytics)', 
    recommended: false,
    envVars: ['ANALYTICS_ID'],
    files: ['src/lib/analytics/', 'src/components/Analytics.tsx'],
    note: '包含 Google Analytics 4 集成和性能监控'
  }
}

/**
 * 获取功能模块列表供选择器使用
 */
export function getFeatureChoices() {
  return Object.entries(FEATURES).map(([key, feature]) => ({
    title: feature.name,
    value: key,
    selected: feature.recommended
  }))
}

/**
 * 获取功能模块信息
 */
export function getFeature(featureKey) {
  return FEATURES[featureKey]
}

/**
 * 获取所有选中功能的依赖
 */
export function getFeatureDependencies(selectedFeatures) {
  const dependencies = {}
  const devDependencies = {}
  
  selectedFeatures.forEach(featureKey => {
    const feature = FEATURES[featureKey]
    if (feature.dependencies) {
      Object.assign(dependencies, feature.dependencies)
    }
    if (feature.devDependencies) {
      Object.assign(devDependencies, feature.devDependencies)
    }
  })
  
  return { dependencies, devDependencies }
}