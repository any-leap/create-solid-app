/**
 * Feature module configuration definitions
 */
export const FEATURES = {
  database: { 
    name: 'Database (Drizzle ORM + SQLite)', 
    recommended: true,
    dependencies: {
      'drizzle-orm': '^0.44.4',
      'better-sqlite3': '^9.4.3'
    },
    devDependencies: {
      'drizzle-kit': '^0.31.4',
      '@types/better-sqlite3': '^7.6.9'
    },
    scripts: {
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
      'db:studio': 'drizzle-kit studio',
      'db:reset': 'rm -f data/app.db && bun run db:migrate'
    },
    files: [
      'drizzle.config.ts',
      'src/lib/db/',
      'data/',
      'drizzle/'
    ]
  },
  auth: { 
    name: 'User Authentication (Session + SQLite)', 
    recommended: true,
    note: 'Secure server-side session authentication using Bun SQLite to store user data',
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
    name: 'Docker Configuration', 
    recommended: true,
    files: ['Dockerfile', 'docker-compose.yml']
  },
  ci: { 
    name: 'CI/CD (GitHub Actions)', 
    recommended: false,
    files: ['.github/workflows/ci.yml']
  },
  testing: { 
    name: 'Testing Configuration (Vitest)', 
    recommended: false,
    devDependencies: {
      'vitest': '^3.2.4',
      '@solidjs/testing-library': '^0.8.10'
    }
  },
  monitoring: { 
    name: 'Error Monitoring (Sentry)', 
    recommended: false,
    envVars: ['SENTRY_DSN'],
    dependencies: {
      '@sentry/solid-js': '^7.100.0'
    },
    files: ['src/lib/monitoring/', 'src/components/SentryErrorBoundary.tsx']
  },
  analytics: { 
    name: 'Data Analytics (Google Analytics)', 
    recommended: false,
    envVars: ['ANALYTICS_ID'],
    files: ['src/lib/analytics/', 'src/components/Analytics.tsx'],
    note: 'Includes Google Analytics 4 integration and performance monitoring'
  }
}

/**
 * Get feature module list for selector use
 */
export function getFeatureChoices() {
  return Object.entries(FEATURES).map(([key, feature]) => ({
    title: feature.name,
    value: key,
    selected: feature.recommended
  }))
}

/**
 * Get feature module information
 */
export function getFeature(featureKey) {
  return FEATURES[featureKey]
}

/**
 * Get all dependencies for selected features
 */
export function getFeatureDependencies(selectedFeatures) {
  const dependencies = {}
  const devDependencies = {}
  const scripts = {}
  
  selectedFeatures.forEach(featureKey => {
    const feature = FEATURES[featureKey]
    if (feature.dependencies) {
      Object.assign(dependencies, feature.dependencies)
    }
    if (feature.devDependencies) {
      Object.assign(devDependencies, feature.devDependencies)
    }
    if (feature.scripts) {
      Object.assign(scripts, feature.scripts)
    }
  })
  
  return { dependencies, devDependencies, scripts }
}