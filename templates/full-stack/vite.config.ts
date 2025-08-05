import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import viteSolid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
    open: true, // 自动打开浏览器
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({ 
      customViteSolidPlugin: true,
    }),
    viteSolid({ ssr: true }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 只在客户端构建时进行手动分块
          if (id.includes('node_modules')) {
            // UI 组件库单独分块
            if (id.includes('@kobalte/core')) {
              return 'ui'
            }
            // 工具库分块
            if (id.includes('lucide-solid') || id.includes('tailwind-merge')) {
              return 'utils'
            }
            // 表单和验证库分块
            if (id.includes('@modular-forms') || id.includes('valibot')) {
              return 'forms'
            }
            // 其他第三方库
            if (!id.includes('solid-js') && !id.includes('@tanstack')) {
              return 'vendor'
            }
          }
        },
      },
    },
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['solid-js', '@tanstack/solid-start'],
  },
})
