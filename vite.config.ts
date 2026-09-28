import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  base: process.env.VITE_BASE ?? '/', // على GitHub Pages: /اسم-الـrepo/
  plugins: [react(), VitePWA({ registerType: 'autoUpdate',
    manifest: { name: 'XERIA Medical', short_name: 'XERIA', lang: 'ar', dir: 'rtl',
      theme_color: '#6D28D9', background_color: '#FFFFFF', display: 'standalone',
      icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] } })],
})
