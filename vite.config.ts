import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg}'], // Exclude HTML from precaching
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB for PDF.js
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // NetworkFirst for HTML/navigation requests (app shell)
          {
            urlPattern: /^https:\/\/localsearch\.franzai\.com\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell-v1',
              networkTimeoutSeconds: 5
            }
          },
          // StaleWhileRevalidate for static assets 
          {
            urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-v1'
            }
          },
          // CacheFirst for external CDN resources
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      manifest: {
        name: 'LocalSearch',
        short_name: 'LocalSearch',
        description: 'Private, offline folder search. Search PDF, DOCX, TXT, MD, CSV files instantly.',
        theme_color: '#646cff',
        background_color: '#242424',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-worker': ['pdfjs-dist'],
          'office-parser': ['mammoth'],
          'csv-parser': ['papaparse'],
          'search-engine': ['minisearch'],
          'database': ['dexie'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.min.js']
  }
})