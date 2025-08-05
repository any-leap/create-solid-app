import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import viteSolid from 'vite-plugin-solid'

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
    open: true, // 自动打开浏览器
  },
  plugins: [
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
        manualChunks: {
          ui: ['@kobalte/core'],
        },
      },
    },
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['solid-js', '@tanstack/solid-router'],
  },
})
