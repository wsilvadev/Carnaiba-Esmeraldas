import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  root: resolve(import.meta.dirname),
  envDir: resolve(import.meta.dirname, '..'),
  resolve: {
    alias: {
      '@shared': resolve(import.meta.dirname, '../src'),
    },
  },
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    fs: {
      allow: ['..'],
    },
  },
})
