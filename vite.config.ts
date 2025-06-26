// Enhanced vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
import viteImagemin from 'vite-plugin-imagemin'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80, progressive: true },
      pngquant: { quality: [0.7, 0.85], speed: 4 },
      // Disable SVG optimization to avoid icon.svg errors
      // svgo: false,
      webp: { quality: 80, method: 6 },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  publicDir: 'public',
  build: {
    // Optimize chunk splitting for better caching
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) {
            return 'images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          masonry: ['masonry-layout', 'imagesloaded'],
          aos: ['aos']
        }
      }
    }
  },
  // Optimize dev server
  server: {
    host: '0.0.0.0', // Expose to all network interfaces
    port: 5173, // Default Vite port
    strictPort: false, // Allow fallback to next available port
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
    // Additional network configuration
    hmr: {
      host: 'localhost', // HMR host
      port: 5173, // HMR port
    }
  }
})