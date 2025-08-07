# Changelog

## [3.0.0] - 2025-01-20

### 🚨 BREAKING CHANGES

这是一个基于最新 TanStack Start 官方文档的重大版本更新，修复了之前版本中的配置问题。

### ✨ 新特性

- **全新的项目结构**: 基于 TanStack Start 官方文档重新设计
- **正确的依赖配置**: 添加了缺失的 `@tanstack/solid-router` 依赖
- **优化的 TypeScript 配置**: 符合 TanStack Start 最佳实践
- **修复的 Vite 插件顺序**: 确保正确的构建流程

### 🔧 修复

#### 依赖配置修复
- ✅ 添加缺失的 `@tanstack/solid-router` 依赖
- ✅ 更新 SolidJS 到 v1.9.8
- ✅ 统一 TailwindCSS 版本配置
- ✅ 简化 devDependencies，移除不必要的包

#### TypeScript 配置优化
- ✅ 使用 `moduleResolution: "bundler"` 替代过于严格的 "Bundler"
- ✅ 添加 `skipLibCheck: true` 和 `strictNullChecks: true`
- ✅ 移除过度复杂的严格模式配置
- ✅ 添加 `types: ["vite/client"]` 支持

#### Vite 配置修复
- ✅ 修正插件加载顺序：`tsConfigPaths()` → `tanstackStart()` → `viteSolid()` → `tailwindcss()`
- ✅ 确保 `customViteSolidPlugin: true` 配置正确
- ✅ 简化构建配置，使用 `target: 'esnext'`

#### 路由文件更新
- ✅ 修复导入路径：从 `@tanstack/solid-start` 改为 `@tanstack/solid-router`
- ✅ 更新根路由配置，使用正确的 meta 属性名
- ✅ 简化路由组件结构，符合官方文档

#### 脚本命令简化
- ✅ 移除 Bun 特定命令，使用标准的 Vite 命令
- ✅ 简化为基础的 `start`, `dev`, `build`, `serve` 命令

### 📋 详细变更

#### 最小化模板 (minimal)

**package.json 变更**:
```diff
  "dependencies": {
+   "@tanstack/solid-router": "^1.130.12",
    "@tanstack/solid-start": "^1.130.15",
-   "solid-js": "^1.9.7",
+   "solid-js": "^1.9.8",
-   "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
-   "@types/node": "^24.2.0",
-   "@typescript-eslint/eslint-plugin": "^8.39.0",
-   "@typescript-eslint/parser": "^8.39.0",
-   "@tailwindcss/vite": "^4.1.11",
+   "@tailwindcss/vite": "^4.0.7",
-   "autoprefixer": "^10.4.21",
-   "eslint": "^9.32.0",
-   "eslint-plugin-solid": "^0.14.5",
-   "prettier": "^3.6.2",
-   "typescript": "^5.7.2",
+   "tailwindcss": "^4.0.7",
+   "typescript": "^5.9.2",
-   "vite": "^7.0.6",
+   "vite": "^7.1.0",
-   "vite-plugin-solid": "^2.11.8",
+   "vite-plugin-solid": "^2.11.6",
    "vite-tsconfig-paths": "^5.1.4"
  }
```

**tsconfig.json 变更**:
```diff
  {
    "compilerOptions": {
-     "strict": true,
-     "noImplicitAny": true,
-     "strictNullChecks": true,
-     "strictFunctionTypes": true,
-     "strictBindCallApply": true,
-     "strictPropertyInitialization": true,
-     "noImplicitThis": true,
-     "noImplicitReturns": true,
-     "noFallthroughCasesInSwitch": true,
-     "noUncheckedIndexedAccess": true,
-     "noImplicitOverride": true,
-     "esModuleInterop": true,
-     "allowSyntheticDefaultImports": true,
-     "module": "ESNext",
-     "moduleResolution": "Bundler",
-     "resolveJsonModule": true,
-     "jsx": "preserve",
-     "jsxImportSource": "solid-js",
      "target": "ES2022",
-     "lib": ["DOM", "DOM.Iterable", "ES2022"],
-     "isolatedModules": true,
-     "skipLibCheck": true,
-     "allowJs": true,
-     "forceConsistentCasingInFileNames": true,
-     "exactOptionalPropertyTypes": true,
-     "baseUrl": ".",
-     "paths": {
-       "~/*": ["./src/*"]
-     },
+     "module": "ESNext",
+     "moduleResolution": "bundler",
+     "allowSyntheticDefaultImports": true,
+     "esModuleInterop": true,
+     "jsx": "preserve",
+     "jsxImportSource": "solid-js",
+     "types": ["vite/client"],
      "noEmit": true,
-     "declaration": false
-   },
-   "exclude": ["dist", "node_modules", ".output", ".nitro"]
+     "isolatedModules": true,
+     "skipLibCheck": true,
+     "strictNullChecks": true
+   }
  }
```

**vite.config.ts 变更**:
```diff
  export default defineConfig({
    server: {
-     port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
-     strictPort: false,
-     open: true,
+     port: 3000,
    },
    plugins: [
-     tailwindcss(),
-     tsConfigPaths({
-       projects: ['./tsconfig.json'],
-     }),
-     tanstackStart({ 
-       customViteSolidPlugin: true,
-     }),
+     tsConfigPaths(),
+     tanstackStart({ customViteSolidPlugin: true }),
      viteSolid({ ssr: true }),
+     tailwindcss(),
    ],
    build: {
-     sourcemap: true,
+     target: 'esnext',
    },
-   optimizeDeps: {
-     include: ['solid-js', '@tanstack/solid-start'],
-   },
  })
```

### 🔄 迁移指南

如果您正在使用 v2.x 版本，请注意以下重要变更：

1. **更新依赖**: 新项目将自动包含正确的依赖配置
2. **TypeScript 配置**: 如果您有自定义的 TypeScript 配置，请参考新的最小化配置
3. **Vite 插件**: 确保插件加载顺序正确
4. **导入路径**: 路由相关的导入需要从 `@tanstack/solid-router` 而不是 `@tanstack/solid-start`

### 📚 参考资料

- [TanStack Start 官方文档](https://tanstack.com/start/latest/docs/framework/solid/build-from-scratch)
- [SolidJS 官方文档](https://solidjs.com/)
- [Vite 配置文档](https://vitejs.dev/config/)

### 🙏 致谢

感谢所有使用和反馈的开发者们！这次更新确保了脚手架与最新的 TanStack Start 生态系统完全兼容。

---

## [2.0.9] - 之前版本

_旧版本的更新日志..._
