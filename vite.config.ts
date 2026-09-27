import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Allow mobile access via LAN IP
    port: 5173,
    proxy: {
      '/youdao-api': {
        target: 'https://dict.youdao.com',
        changeOrigin: true,
        headers: {
          'Referer': 'https://dict.youdao.com',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        rewrite: (path) => path.replace(/^\/youdao-api/, ''),
      },
    },
  },
})
