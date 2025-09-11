import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB for PDF.js
        runtimeCaching: [
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