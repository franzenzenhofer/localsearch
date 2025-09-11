import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // CRITICAL: Exclude ALL HTML files from precaching to force network-first
        globPatterns: ['**/*.{js,css,woff2,ttf,ico,png,jpg,jpeg,svg,webp}'],
        globIgnores: ['**/index.html', '**/*.html'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Force cache name change to break existing caches
        cacheId: 'localsearch-v2',
        runtimeCaching: [
          // NetworkFirst for ALL navigation/HTML requests (app shell)
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache-v2',
              networkTimeoutSeconds: 3,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // StaleWhileRevalidate for static assets 
          {
            urlPattern: /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-v2'
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