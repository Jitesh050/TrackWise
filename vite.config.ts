
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
          // Optimize: Split heavy dependencies into separate chunks to improve caching and prevent CI errors due to warnings
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            if (id.includes('/auth/')) return 'firebase-auth';
            if (id.includes('/database/') || id.includes('/firestore/')) return 'firebase-db';
            return 'firebase-core';
          }
          if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
          if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (id.includes('node_modules/')) return 'vendor';
        }
      }
    }
  }
}));
