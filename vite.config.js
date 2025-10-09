import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/api': 'http://localhost:5000'
    },

    host: true,
    allowedHosts: ['terassc.teknohole.com'],
    watch: {
      usePolling: true,
    },
  }
})
