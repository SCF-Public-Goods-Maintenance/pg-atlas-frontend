import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = process.env.VITE_API_BASE_URL ?? 'https://api.pgatlas.xyz'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-only: forward /api/* to the backend so browser requests don't
      // trip CORS on localhost. The frontend uses /api as its baseUrl in
      // dev; in prod it points directly at the backend.
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Heavy chart library shared across Home / ProjectDetail / RepoDetail.
          // Split into its own chunk so page chunks stay small and the chart
          // bundle gets cached independently of page code changes.
          recharts: ['recharts'],
          // Router, query, table libs are also used by most pages.
          vendor: [
            '@tanstack/react-query',
            '@tanstack/react-query-devtools',
            '@tanstack/react-router',
            '@tanstack/react-table',
          ],
        },
      },
    },
  },
})
