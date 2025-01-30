import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      filename: 'sw.ts',
      injectRegister: 'inline',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ["**/*"],
      },
      includeAssets: [
          "**/*",
      ],
      srcDir: 'src/service-worker',
      strategies: 'injectManifest',
      manifest: {
        name: 'Wellness Tracker',
        short_name: 'Wellness Tracker',
        description: 'A simple daily health and wellness tracker',
        theme_color: '#EF5350',
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            "src": "images/icon/icon-72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-167.png",
            "sizes": "167x167",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "images/icon/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
    "@": path.resolve(__dirname, "./src"),
    },
  },
})