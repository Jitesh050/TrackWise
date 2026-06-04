
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Performance optimization: Split heavy third-party vendor dependencies into their own separate chunks.
        // This resolves chunk size limits and dynamic import conflicts, allowing better code-splitting,
        // caching, and a faster overall build and loading process.
        manualChunks(id) {
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/@recharts/')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          if (id.includes('node_modules/firebase/auth/') || id.includes('node_modules/@firebase/auth/')) {
            return 'vendor-firebase-auth';
          }
          if (id.includes('node_modules/firebase/database/') || id.includes('node_modules/@firebase/database/')) {
            return 'vendor-firebase-database';
          }
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/react-router/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react-router';
          }
          if (id.includes('node_modules/mapbox-gl/')) {
            return 'vendor-mapbox';
          }
        }
      }
    }
  }
}));
