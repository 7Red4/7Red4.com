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
  }
})
