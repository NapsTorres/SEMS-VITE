import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin'; // Import the plugin

export default defineConfig({
  plugins: [
    react(),
    viteCompression(), // Compress assets
    viteImagemin() // Optimize images
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.split('node_modules/')[1].split('/')[0]; // Split node_modules
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase the chunk size limit
    minify: 'esbuild', // Fast minification with esbuild
  }
});
