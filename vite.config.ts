import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import svgr from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue'],
    }),
    svgr()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        // three 佔了首頁 chunk 的大半，拆出來才能被獨立快取
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
})
