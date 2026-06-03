import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const apiProxy = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': apiProxy,
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': apiProxy,
    },
  },
})
