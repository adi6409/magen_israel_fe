import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/zones': 'http://localhost:3939',
      '/ws': {
        target: 'http://localhost:3939',
        ws: true,
      },
    },
    host: true,
  },
  preview: {
    allowedHosts: ['magen.astroianu.dev'],
  }
})
