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
  },
});