
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
        // Optimize build chunks to reduce size and fix Netlify CI deploy errors
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
              if (id.includes('/auth/')) return 'vendor-firebase-auth';
              if (id.includes('/firestore/') || id.includes('/database/')) return 'vendor-firebase-db';
              return 'vendor-firebase-core';
            }
            if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
            if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
            if (id.includes('node_modules/lucide-react/')) return 'vendor-icons';
            if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) return 'vendor-react';
            return 'vendor';
          }
        }
      }
    }
  }
}));
