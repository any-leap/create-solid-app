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
    name: '用户认证', 
    recommended: true,
    note: '使用 TanStack Start 服务器函数手动实现'
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
    envVars: ['SENTRY_DSN']
  },
  analytics: { 
    name: '数据分析', 
    recommended: false,
    envVars: ['ANALYTICS_ID']
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