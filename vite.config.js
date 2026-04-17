import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Myno Language Tutor',
          short_name: 'Myno',
          description: 'AI-powered language learning with spaced repetition',
          theme_color: '#3b82f6',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.groq\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'groq-api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 300 // 5 minutes
                },
                networkTimeoutSeconds: 10
              }
            },
            {
              urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firestore-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 3600 // 1 hour
                }
              }
            },
            {
              urlPattern: /\.(?:js|css|html)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                }
              }
            }
          ],
          skipWaiting: true,
          clientsClaim: true
        },
        devOptions: {
          enabled: false,
          type: 'module',
          navigateFallback: 'index.html'
        }
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api/mistral': {
          target: 'https://api.mistral.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/mistral/, '/v1/chat/completions'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.VITE_MISTRAL_API_KEY}`);
              proxyReq.setHeader('Content-Type', 'application/json');
            });
          }
        }
      }
    },
  }
})
