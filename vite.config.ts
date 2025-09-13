import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import fs from "fs";

// Read package.json to get version
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const version = packageJson.version;
const buildTime = new Date().toISOString();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  plugins: [
    react(),
    // Custom plugin to inject version into HTML
    {
      name: "inject-version",
      transformIndexHtml(html) {
        return html.replace(
          "<title>FileSearch - Private File Search</title>",
          `<title>FileSearch v${version} - Private File Search</title>
    <!-- 🚨 CACHE BREAKER: ${Date.now()} -->
    <!-- FileSearch Version: ${version} -->
    <!-- Build Time: ${buildTime} -->
    <meta name="app-version" content="${version}" />
    <meta name="build-time" content="${buildTime}" />
    <meta name="cache-breaker" content="${Date.now()}" />
    <script>window.__APP_VERSION__="${version}";window.__BUILD_TIME__="${buildTime}";window.__CACHE_BREAKER__="${Date.now()}";</script>`,
        );
      },
    },
    VitePWA({
      registerType: "prompt",
      workbox: {
        // Include index.html but use network-first strategy
        globPatterns: [
          "**/*.{js,css,woff2,ttf,ico,png,jpg,jpeg,svg,webp,html}",
        ],
        globIgnores: ["**/sw.js", "**/workbox-*.js"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        skipWaiting: false, // Let user control updates
        clientsClaim: false, // Let user control updates
        cleanupOutdatedCaches: true,
        // Change cache ID to force cache invalidation
        cacheId: `filesearch-${Date.now()}`,
        mode: "generateSW",
        // Disable navigation fallback since we handle it with runtime caching
        navigateFallback: null,
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          // Network-First for HTML with aggressive cache bypass
          {
            urlPattern: ({ request }) =>
              request.mode === "navigate" ||
              request.destination === "document" ||
              /\.html$/.test(request.url),
            handler: "NetworkFirst",
            options: {
              cacheName: `html-cache-${Date.now()}`,
              networkTimeoutSeconds: 2,
              cacheableResponse: {
                statuses: [0, 200],
              },
              plugins: [
                {
                  requestWillFetch: async ({ request }) => {
                    // Force bypass cache with reload mode
                    return new Request(request, {
                      cache: "reload",
                      headers: {
                        ...request.headers,
                        "Cache-Control": "no-cache",
                      },
                    });
                  },
                },
              ],
            },
          },
          // StaleWhileRevalidate for JS/CSS with version checking
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: `assets-cache-${Date.now()}`,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // CacheFirst for images and fonts (rarely change)
          {
            urlPattern: /\.(?:woff2?|ttf|png|jpg|jpeg|svg|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: `media-cache-${Date.now()}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "FileSearch",
        short_name: "FileSearch",
        description:
          "Private, offline file search. Search PDF, DOCX, TXT, MD, CSV files instantly.",
        theme_color: "#FFD700",
        background_color: "#FAFAFA",
        display: "standalone",
        icons: [
          {
            src: "icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          "pdf-worker": ["pdfjs-dist"],
          "office-parser": ["mammoth"],
          "csv-parser": ["papaparse"],
          "search-engine": ["minisearch"],
          database: ["dexie"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["pdfjs-dist/build/pdf.worker.min.js"],
  },
});
