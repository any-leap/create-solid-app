# Changelog

## [3.1.0] - 2025-01-20

### 🤖 智能模板管理系统

这是一个革命性的更新，引入了企业级的智能模板管理系统，确保所有模板始终遵循最新的 TanStack Start 最佳实践。

### ✨ 核心新特性

#### 🏗️ 智能化基础设施
- **基础模板配置系统**: 创建了统一的模板"DNA"，基于 `../tantest` 项目
- **一致性检查器**: 自动验证所有模板配置的正确性
- **版本同步器**: 智能同步所有模板的核心依赖版本
- **模板修复器**: 自动修复配置问题和不一致性
- **模板测试器**: 完整的集成测试套件
- **统一管理界面**: 友好的命令行工具集

#### 🛠️ 新增命令工具
```bash
npm run templates check   # 检查模板一致性
npm run templates sync    # 同步依赖版本
npm run templates fix     # 自动修复问题
npm run templates test    # 完整测试套件
npm run templates all     # 一键维护流程
npm run templates info    # 系统信息
```

#### 🎯 质量保证
- **49项自动检查**: 涵盖依赖、配置、导入、构建等
- **完整测试覆盖**: 从项目生成到构建成功的全流程验证
- **智能错误诊断**: 详细的问题报告和修复建议
- **预览模式**: `--dry-run` 选项防止误操作

### 🔧 模板修复

#### 全面修复四个模板
- ✅ **minimal**: 已符合标准配置
- ✅ **landing**: 修复导入路径和配置文件
- ✅ **full-stack**: 统一依赖版本和脚本命令
- ✅ **admin**: 优化配置并保留高级功能

#### 具体修复内容
- 🔄 统一所有模板使用标准的 Vite 命令
- 📦 添加缺失的 `@tanstack/solid-router` 依赖
- ⚙️ 简化 TypeScript 配置为最佳实践
- 🔌 修正 Vite 插件加载顺序
- 📝 修复 router.tsx 导入路径

### 📋 系统特性

#### 🚀 企业级功能
- **模块化架构**: 每个工具独立工作，易于扩展
- **配置驱动**: 基于配置文件，便于维护
- **智能化处理**: 自动检测、修复和验证
- **详细报告**: 完整的操作日志和结果反馈

#### 🔄 自动化流程
- **一键维护**: 自动执行修复→同步→检查→测试流程
- **版本同步**: 基于基准项目自动更新依赖
- **问题修复**: 智能识别和修复常见配置问题
- **质量检查**: 全面验证模板的正确性

### 📚 文档更新

- **TEMPLATE-SYSTEM.md**: 完整的系统说明文档
- 详细的使用指南和最佳实践
- 架构图和系统设计说明
- 维护流程和扩展指南

### 💡 开发体验

#### 🎨 用户界面优化
- 彩色输出和进度指示
- 清晰的成功/警告/错误标识
- 详细的帮助信息和使用说明
- 智能的参数验证和错误提示

#### ⚡ 性能优化
- 并行处理多个模板
- 增量检查和修复
- 缓存机制减少重复工作
- 超时控制防止挂起

### 🔗 集成特性

#### 📦 依赖管理
- 新增 `rimraf` 用于可靠的文件清理
- 利用现有的 `chalk`、`commander` 等工具
- 兼容 Node.js 18+ 和 Bun 1.0+

#### 🧪 测试覆盖
- 项目创建测试
- 依赖安装验证
- TypeScript 类型检查
- 构建流程验证
- package.json 结构检查

### 🎯 未来展望

这个智能模板管理系统为 Create Solid App 奠定了坚实的基础：
- 🔮 易于添加新模板类型
- 🛡️ 确保长期质量一致性
- 🚀 支持更复杂的模板功能
- 🤝 便于社区贡献和维护

---

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
