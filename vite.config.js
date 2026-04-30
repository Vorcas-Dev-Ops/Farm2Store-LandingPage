import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for better performance
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          react: ['react', 'react-dom'],
          icons: ['react-icons/ri', 'react-icons/fi'],
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
  server: {
    // Performance optimization for dev server
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'react-icons/ri', 'react-icons/fi'],
  }
})
