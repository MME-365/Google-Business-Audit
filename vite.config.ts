import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          includeAssets: [
            'favicon.ico',
            'favicon-32x32.png',
            'apple-touch-icon.png',
            'brand-logo.png',
            'icon.svg',
            'pwa-192x192.png',
            'pwa-512x512.png',
            'pwa-maskable-512x512.png'
          ],
          manifest: {
            id: '/',
            name: 'GBP Auditor Pro',
            short_name: 'GBP Auditor',
            description: 'AI-driven Google Business Profile auditor, 6-pillar diagnostic, vector PDF generator, and regional lead prospector.',
            theme_color: '#080c16',
            background_color: '#080c16',
            display: 'standalone',
            display_override: ['standalone', 'minimal-ui'],
            orientation: 'portrait-primary',
            start_url: '/',
            scope: '/',
            categories: ['business', 'productivity', 'utilities'],
            icons: [
              {
                src: '/pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
              },
              {
                src: '/pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
              },
              {
                src: '/pwa-maskable-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            navigateFallbackDenylist: [/^\/api\//, /^\/__\//],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                  },
                  cacheableResponse: {
                    statuses: [0, 200],
                  },
                },
              },
            ],
          },
          devOptions: {
            enabled: true,
            type: 'module',
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
