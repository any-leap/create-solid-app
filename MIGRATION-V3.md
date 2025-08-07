# 迁移到 v3.0.0 指南

## 🚨 重要提醒

v3.0.0 是一个基于最新 TanStack Start 官方文档的重大版本更新。我们修复了之前版本中的多个配置问题，确保生成的项目能够正常工作。

## 📋 主要变更概览

### ✅ 已修复的问题

1. **缺失依赖**: 添加了 `@tanstack/solid-router`
2. **错误的 TypeScript 配置**: 简化并优化配置
3. **错误的 Vite 插件顺序**: 修正插件加载顺序
4. **错误的导入路径**: 修复路由文件中的导入

## 🔧 如何迁移现有项目

### 方法 1: 创建新项目（推荐）

最简单的方法是使用新版本脚手架创建全新项目：

```bash
# 使用最新版本创建新项目
bunx @any-l/create-solid-app@3.0.0 my-new-project

# 或者
npx @any-l/create-solid-app@3.0.0 my-new-project
```

然后将您的业务代码迁移到新项目中。

### 方法 2: 手动更新现有项目

如果您希望更新现有项目，请按照以下步骤操作：

#### 1. 更新 package.json

**添加缺失的依赖**:
```bash
bun add @tanstack/solid-router
# 或
npm install @tanstack/solid-router
```

**更新现有依赖** (可选):
```bash
bun update @tanstack/solid-start solid-js
# 或
npm update @tanstack/solid-start solid-js
```

#### 2. 更新 tsconfig.json

将您的 `tsconfig.json` 替换为以下简化配置：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "types": ["vite/client"],
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

#### 3. 更新 vite.config.ts

确保您的 Vite 配置中插件顺序正确：

```typescript
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';
import viteSolid from 'vite-plugin-solid';

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),                                    // 1. 路径解析
    tanstackStart({ customViteSolidPlugin: true }),     // 2. TanStack Start
    viteSolid({ ssr: true }),                          // 3. SolidJS
    tailwindcss(),                                     // 4. TailwindCSS
  ],
  build: {
    target: 'esnext',
  },
});
```

#### 4. 更新路由文件导入

更新所有路由文件中的导入语句：

**之前**:
```typescript
import { createFileRoute } from '@tanstack/solid-start'
import { createRootRoute } from '@tanstack/solid-start'
```

**现在**:
```typescript
import { createFileRoute } from '@tanstack/solid-router'
import { createRootRoute } from '@tanstack/solid-router'
```

#### 5. 更新根路由配置

如果您的 `__root.tsx` 中有 `charSet`，请改为 `charset`：

**之前**:
```typescript
meta: [
  {
    charSet: 'utf-8',  // ❌ 错误
  },
]
```

**现在**:
```typescript
meta: [
  {
    charset: 'utf-8',  // ✅ 正确
  },
]
```

#### 6. 简化 router.tsx 配置

更新您的路由器配置：

```typescript
// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,  // 使用这个替代 defaultPreload
  })

  return router
}

declare module '@tanstack/solid-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

## ⚠️ 常见问题

### Q: 为什么需要添加 @tanstack/solid-router？

**A**: TanStack Start 框架将路由功能分离到了独立的包中。这是官方推荐的架构，确保了更好的模块化和维护性。

### Q: 之前的严格 TypeScript 配置为什么被简化了？

**A**: 之前的配置过于严格，与 TanStack Start 的推荐配置不兼容，会导致编译错误。新配置基于官方文档，确保项目能够正常运行。

### Q: Vite 插件顺序为什么重要？

**A**: 插件的加载顺序影响构建流程。正确的顺序确保：
1. 路径解析先于其他插件
2. TanStack Start 配置优先
3. SolidJS 编译正确
4. 样式处理最后进行

### Q: 我的现有项目会受到影响吗？

**A**: 如果您使用 v2.x 创建的项目可能无法正常运行。建议使用 v3.0.0 重新创建项目，然后迁移业务代码。

## 🔍 验证迁移是否成功

迁移完成后，运行以下命令验证项目是否正常工作：

```bash
# 清理依赖重新安装
rm -rf node_modules
bun install  # 或 npm install

# 启动开发服务器
bun dev      # 或 npm run dev
```

如果项目能够正常启动并在浏览器中显示，说明迁移成功！

## 🆘 需要帮助？

如果您在迁移过程中遇到问题：

1. 检查是否按照步骤正确更新了所有配置文件
2. 确保依赖安装完整：`bun install` 或 `npm install`
3. 清理构建缓存：删除 `dist/` 和 `.output/` 目录
4. 重启开发服务器

如果问题仍然存在，建议创建新项目并迁移业务代码。

## 📚 相关资源

- [TanStack Start 官方文档](https://tanstack.com/start/latest/docs/framework/solid/build-from-scratch)
- [项目 GitHub 仓库](https://github.com/any-leap/create-solid-app)
- [CHANGELOG.md](./CHANGELOG.md) - 详细变更记录

---

感谢您使用 @any-l/create-solid-app！v3.0.0 确保了最佳的开发体验和项目稳定性。
