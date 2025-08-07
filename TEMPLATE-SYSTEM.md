# 智能模板管理系统

## 🎯 概述

Create Solid App 现在拥有一个智能化的模板管理系统，确保所有模板都遵循最新的 TanStack Start 最佳实践，并与基准项目 `../tantest` 保持完全一致。

## 🏗️ 系统架构

### 基础组件

1. **基础模板配置** (`bin/config/base-template.js`)

   - 定义所有模板的"DNA"
   - 基于 `../tantest` 项目的最佳实践
   - 提供模板特定的扩展机制

2. **一致性检查器** (`scripts/template-consistency-checker.js`)

   - 自动验证模板配置的正确性
   - 检查依赖版本、配置文件、导入语句等
   - 生成详细的检查报告

3. **版本同步器** (`scripts/sync-template-versions.js`)

   - 自动同步所有模板的核心依赖版本
   - 保持与基准项目的版本一致性
   - 支持预览模式

4. **模板修复器** (`scripts/fix-templates.js`)

   - 自动修复模板的配置问题
   - 统一配置文件格式
   - 保留模板特定的功能

5. **模板测试器** (`scripts/test-templates.js`)

   - 自动测试所有模板的可用性
   - 验证项目生成、依赖安装、类型检查、构建等
   - 生成详细的测试报告

6. **模板管理器** (`scripts/template-manager.js`)
   - 统一的命令行界面
   - 集成所有管理功能
   - 支持完整的维护流程

## 🚀 使用方法

### 快速开始

```bash
# 查看帮助
npm run templates

# 运行完整的维护流程
npm run templates all

# 检查模板一致性
npm run templates check

# 修复模板问题
npm run templates fix

# 同步版本
npm run templates sync

# 测试模板
npm run templates test
```

### 详细命令

#### 1. 检查一致性

```bash
# 检查所有模板
npm run templates check

# 检查特定模板
npm run templates check --templates minimal,landing
```

#### 2. 修复模板

```bash
# 修复所有模板
npm run templates fix

# 预览修复内容（不实际修改）
npm run templates fix --dry-run

# 修复特定模板
npm run templates fix --templates full-stack,admin
```

#### 3. 同步版本

```bash
# 同步所有模板的依赖版本
npm run templates sync

# 预览同步内容
npm run templates sync --dry-run
```

#### 4. 测试模板

```bash
# 测试所有模板
npm run templates test

# 测试特定模板
npm run templates test --templates minimal

# 保留测试文件（调试用）
npm run templates test --no-cleanup
```

#### 5. 完整流程

```bash
# 执行完整维护流程
npm run templates all

# 预览模式（不实际修改）
npm run templates all --dry-run

# 跳过测试步骤
npm run templates all --skip-test
```

## 📋 模板标准

### 基础配置

所有模板都必须遵循以下基准配置：

#### package.json

```json
{
  "scripts": {
    "start": "vite",
    "dev": "vite dev",
    "build": "vite build",
    "serve": "vite preview"
  },
  "dependencies": {
    "@tanstack/solid-router": "^1.130.12",
    "@tanstack/solid-start": "^1.130.15",
    "solid-js": "^1.9.8"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.7",
    "tailwindcss": "^4.0.7",
    "typescript": "^5.9.2",
    "vite": "^7.1.0",
    "vite-plugin-solid": "^2.11.6",
    "vite-tsconfig-paths": "^5.1.4"
  }
}
```

#### tsconfig.json

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

#### vite.config.ts

```typescript
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import viteSolid from "vite-plugin-solid";

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
    target: "esnext",
  },
});
```

#### router.tsx

```typescript
import { createRouter as createTanStackRouter } from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

### 模板特定扩展

不同模板可以在基础配置上添加特定功能：

- **minimal**: 仅包含基础配置
- **landing**: 可添加 UI 相关依赖
- **full-stack**: 添加表单、状态管理、HTTP 客户端等
- **admin**: 包含所有高级功能和开发工具

## 🔧 维护流程

### 日常维护

1. **定期检查**: 每周运行 `npm run templates check`
2. **依赖更新**: 更新 `../tantest` 后运行 `npm run templates sync`
3. **问题修复**: 发现问题后运行 `npm run templates fix`
4. **发布前测试**: 发布前运行 `npm run templates test`

### 添加新模板

1. 在 `templates/` 目录创建新模板
2. 在 `base-template.js` 中添加模板配置
3. 更新 `TEMPLATES` 数组
4. 运行完整维护流程: `npm run templates all`

### 修改基准配置

1. 更新 `../tantest` 项目
2. 修改 `bin/config/base-template.js`
3. 运行 `npm run templates all` 应用到所有模板

## 📊 系统特性

### ✨ 智能化功能

- **自动依赖版本同步**
- **配置文件标准化**
- **自动问题修复**
- **全面的一致性检查**
- **可靠的集成测试**

### 🛡️ 质量保证

- **基于官方文档**的配置标准
- **完整的测试覆盖**
- **详细的错误报告**
- **预览模式**防止误操作
- **模块化设计**易于扩展

### 🚀 开发体验

- **统一的命令界面**
- **详细的进度反馈**
- **灵活的参数配置**
- **完整的文档说明**
- **智能的错误处理**

## 🎯 最佳实践

1. **始终基于 tantest**: 所有配置变更都应该先在 `../tantest` 中验证
2. **使用预览模式**: 重要操作前先用 `--dry-run` 预览
3. **定期运行检查**: 保持模板的一致性和正确性
4. **完整测试流程**: 发布前确保所有模板都能正常工作
5. **文档同步更新**: 配置变更后及时更新相关文档

这个系统确保了 Create Solid App 的所有模板都能保持最新、一致和可靠的状态，为用户提供最佳的开发体验。
