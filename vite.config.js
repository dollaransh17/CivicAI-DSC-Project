import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request from the frontend to /api/... gets forwarded to the backend
      // and the /api prefix is stripped before hitting the backend.
      // e.g.  fetch('/api/reports')  →  http://localhost:8000/reports
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
