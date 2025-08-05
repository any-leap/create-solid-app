/**
 * 模板配置定义
 */
export const TEMPLATES = {
  'minimal': {
    name: '最小化应用',
    description: '基础的 Solid Start 应用，适合快速原型开发',
    features: ['typescript', 'tailwind']
  },
  'full-stack': {
    name: '全栈应用',
    description: '完整的全栈应用，包含数据库、认证、Docker配置',
    features: ['typescript', 'tailwind', 'database', 'auth', 'docker']
  },
  'admin': {
    name: '管理后台',
    description: '企业级管理后台，包含仪表板、数据管理功能',
    features: ['typescript', 'tailwind', 'database', 'auth', 'dashboard']
  },
  'landing': {
    name: '着陆页',
    description: '营销着陆页模板，优化SEO和转化率',
    features: ['typescript', 'tailwind', 'seo', 'analytics']
  }
}

/**
 * 获取模板列表供选择器使用
 */
export function getTemplateChoices() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    title: template.name,
    description: template.description,
    value: key
  }))
}

/**
 * 验证模板是否存在
 */
export function isValidTemplate(template) {
  return template && TEMPLATES.hasOwnProperty(template)
}

/**
 * 获取模板信息
 */
export function getTemplate(templateKey) {
  return TEMPLATES[templateKey]
}