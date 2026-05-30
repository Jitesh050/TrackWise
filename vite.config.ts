
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
        manualChunks(id) {
          // OPTIMIZATION: Separating large vendors and firebase out of main bundle
          // to fix vite chunk size and static/dynamic import conflicts, which fail Netlify CI.
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
             if (id.includes('/auth/')) return 'vendor-firebase-auth';
             if (id.includes('/firestore/')) return 'vendor-firebase-firestore';
             return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/mapbox-gl/')) {
            return 'vendor-mapbox';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        }
      }
    }
  }
}));
