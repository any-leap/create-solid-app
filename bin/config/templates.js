/**
 * Template configuration definitions
 */
export const TEMPLATES = {
  'minimal': {
    name: 'Minimal Application',
    description: 'Basic Solid Start application, perfect for rapid prototyping',
    features: ['typescript', 'tailwind']
  },
  'full-stack': {
    name: 'Full-stack Application',
    description: 'Complete full-stack application with database, authentication, and Docker configuration',
    features: ['typescript', 'tailwind', 'database', 'auth', 'docker']
  },
  'admin': {
    name: 'Admin Dashboard',
    description: 'Enterprise-level admin dashboard with dashboard and data management features',
    features: ['typescript', 'tailwind', 'database', 'auth', 'dashboard']
  },
  'landing': {
    name: 'Landing Page',
    description: 'Marketing landing page template, optimized for SEO and conversion rates',
    features: ['typescript', 'tailwind', 'seo', 'analytics']
  }
}

/**
 * Get template list for selector use
 */
export function getTemplateChoices() {
  return Object.entries(TEMPLATES).map(([key, template]) => ({
    title: template.name,
    description: template.description,
    value: key
  }))
}

/**
 * Validate if template exists
 */
export function isValidTemplate(template) {
  return template && TEMPLATES.hasOwnProperty(template)
}

/**
 * Get template information
 */
export function getTemplate(templateKey) {
  return TEMPLATES[templateKey]
}