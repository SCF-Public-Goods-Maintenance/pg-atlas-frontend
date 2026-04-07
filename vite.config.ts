import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
