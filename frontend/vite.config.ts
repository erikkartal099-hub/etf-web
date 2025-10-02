import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Lightweight plugin to log the actual dev server URL/port
function portLogger() {
  return {
    name: 'port-logger',
    configureServer(server: any) {
      server.httpServer?.once('listening', () => {
        const addr = server.httpServer?.address()
        const chosenPort = typeof addr === 'object' && addr ? addr.port : 'unknown'
        const host = server.config.server?.host || 'localhost'
        // eslint-disable-next-line no-console
        console.log(`\nℹ️  Vite dev server running on http://${host}:${chosenPort}`)
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), portLogger()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_APP_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_APP_ENV === 'production',
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 4173,
    host: true,
  },
})
