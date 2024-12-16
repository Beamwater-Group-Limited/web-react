import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import legacy from '@vitejs/plugin-legacy'
import autoprefixer from 'autoprefixer'
import { fileURLToPath, URL } from 'node:url'
// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    // 打包后去掉console，debugger
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'] // 支持旧环境
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  server: {
    // 开启局域网
    host: true,
    port: 1024,
    open: true
  }
})
