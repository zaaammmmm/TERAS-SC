import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/auth': 'http://localhost:5000',
    //   '/api': 'http://localhost:5000'
    // },
    proxy: {
    '/auth': {
      target: 'http://express_teras_sc:8000',
      changeOrigin: true,
    },
    '/api': {
      target: 'http://express_teras_sc:8000',
      changeOrigin: true,
    }
  },

    host: true,
    allowedHosts: ['terassc.teknohole.com'],
    watch: {
      usePolling: true,
    },
  }
})
