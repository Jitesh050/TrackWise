
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
          // Splitting vendor code into separate chunks improves caching and reduces the main bundle size.
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            if (id.includes('/auth/')) return 'firebase-auth';
            if (id.includes('/firestore/') || id.includes('/database/')) return 'firebase-db';
            return 'firebase-core';
          }
          if (id.includes('node_modules/recharts')) return 'recharts';
          if (id.includes('node_modules/mapbox-gl')) return 'mapbox';
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          if (id.includes('node_modules/@radix-ui')) return 'radix-ui';
          if (id.includes('node_modules/react-router')) return 'react-router';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react-core';
        }
      }
    }
  }
}));
