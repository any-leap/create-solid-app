import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import viteSolid from 'vite-plugin-solid'

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: false,
    open: true,
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
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['solid-js', '@tanstack/solid-router'],
  },
})