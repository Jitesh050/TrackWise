
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
          // ⚡ Bolt: Split heavy vendor code to eliminate Vite chunk warnings
          // and improve long-term cacheability of unchanged libraries.
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('mapbox-gl')) return 'vendor-mapbox';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('firebase')) {
              if (id.includes('firebase/auth')) return 'vendor-firebase-auth';
              if (id.includes('firebase/firestore')) return 'vendor-firebase-firestore';
              return 'vendor-firebase-core';
            }
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('react-router')) return 'vendor-react-router';
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
            return 'vendor-core';
          }
        }
      }
    }
  }
}));
