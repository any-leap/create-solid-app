/**
 * 基础模板配置系统
 * 所有模板都应该基于这个基准配置
 * 参考：../tantest 项目的最佳实践
 */

// 基础 package.json 配置
export const basePackageJson = {
  name: "my-solid-app",
  private: true,
  sideEffects: false,
  type: "module",
  scripts: {
    start: "vite",
    dev: "vite dev", 
    build: "vite build",
    serve: "vite preview"
  },
  dependencies: {
    "@kobalte/core": "^0.13.11",
    "@tanstack/solid-router": "^1.130.12",
    "@tanstack/solid-start": "^1.130.15",
    "solid-js": "^1.9.8"
  },
  devDependencies: {
    "@tailwindcss/vite": "^4.0.7",
    "tailwindcss": "^4.0.7",
    "typescript": "^5.9.2",
    "vite": "^7.1.0",
    "vite-plugin-solid": "^2.11.6",
    "vite-tsconfig-paths": "^5.1.4"
  }
};

// 基础 tsconfig.json 配置
export const baseTsConfig = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "bundler",
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    jsx: "preserve",
    jsxImportSource: "solid-js",
    types: ["vite/client"],
    noEmit: true,
    isolatedModules: true,
    skipLibCheck: true,
    strictNullChecks: true
  }
};

// 基础 vite.config.ts 模板
export const baseViteConfig = `import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import viteSolid from 'vite-plugin-solid';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart({ customViteSolidPlugin: true }),
    viteSolid({ ssr: true }),
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
  },
});`;

// 基础 router.tsx 模板
export const baseRouterTemplate = `// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  })

  return router
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}`;

// 基础 __root.tsx 模板
export const baseRootTemplate = `// src/routes/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/solid-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return <Outlet />
}`;

// 模板扩展配置
export const templateExtensions = {
  minimal: {
    // minimal 使用基础配置，无额外扩展
  },
  
  landing: {
    // landing 可以添加一些 UI 依赖
    additionalDependencies: {},
    additionalDevDependencies: {}
  },
  
  'full-stack': {
    // full-stack 添加更多功能性依赖
    additionalDependencies: {
      "@modular-forms/solid": "^0.25.1",
      "@tanstack/solid-query": "^5.83.1",
      "clsx": "^2.1.1",
      "lucide-solid": "^0.536.0",
      "redaxios": "^0.5.1",
      "tailwind-merge": "^2.6.0",
      "valibot": "^1.1.0"
    },
    additionalDevDependencies: {
      "vitest": "^3.2.4"
    },
    additionalScripts: {
      "test": "vitest",
      "typecheck": "tsc --noEmit"
    }
  },
  
  admin: {
    // admin 包含所有高级功能
    additionalDependencies: {
      "@modular-forms/solid": "^0.25.1",
      "@tanstack/solid-devtools": "^0.1.1",
      "@tanstack/solid-query": "^5.83.1",
      "clsx": "^2.1.1",
      "lucide-solid": "^0.536.0",
      "redaxios": "^0.5.1",
      "tailwind-merge": "^2.6.0",
      "valibot": "^1.1.0"
    },
    additionalDevDependencies: {
      "vitest": "^3.2.4",
      "vite-bundle-analyzer": "^0.11.0"
    },
    additionalScripts: {
      "test": "vitest",
      "test:ui": "vitest --ui",
      "typecheck": "tsc --noEmit",
      "analyze": "vite-bundle-analyzer dist/stats.html"
    }
  }
};

/**
 * 生成特定模板的 package.json
 */
export function generatePackageJson(templateName) {
  const extension = templateExtensions[templateName] || {};
  
  return {
    ...basePackageJson,
    scripts: {
      ...basePackageJson.scripts,
      ...(extension.additionalScripts || {})
    },
    dependencies: {
      ...basePackageJson.dependencies,
      ...(extension.additionalDependencies || {})
    },
    devDependencies: {
      ...basePackageJson.devDependencies,
      ...(extension.additionalDevDependencies || {})
    }
  };
}

/**
 * 生成特定模板的 vite.config.ts
 */
export function generateViteConfig(templateName) {
  const extension = templateExtensions[templateName] || {};
  
  // 如果需要特殊的 vite 配置（如 admin 的 rollup 优化），可以在这里处理
  if (templateName === 'admin' || templateName === 'full-stack') {
    return baseViteConfig.replace(
      'build: {\n    target: \'esnext\',\n  },',
      `build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@kobalte/core')) {
              return 'ui'
            }
            if (id.includes('lucide-solid') || id.includes('tailwind-merge')) {
              return 'utils'
            }
            if (id.includes('@modular-forms') || id.includes('valibot')) {
              return 'forms'
            }
            if (!id.includes('solid-js') && !id.includes('@tanstack')) {
              return 'vendor'
            }
          }
        },
      },
    },
  },`
    );
  }
  
  return baseViteConfig;
}
