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
    tsConfigPaths(),
    tanstackStart({ customViteSolidPlugin: true }),
    viteSolid({ ssr: true }),
    tailwindcss(),
  ],
  build: {
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
  },
});