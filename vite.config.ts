
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ⚡ Bolt Performance Optimization:
          // Separate heavy dependencies into distinct vendor chunks to eliminate
          // Vite chunk size limits and dynamic import conflict warnings,
          // which allows Netlify CI deployments to pass.
          if (id.includes('node_modules/recharts/') || id.includes('node_modules/@recharts/')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/mapbox-gl/') || id.includes('node_modules/@mapbox/')) {
            return 'vendor-mapbox';
          }
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            if (id.includes('/auth/')) return 'vendor-firebase-auth';
            if (id.includes('/database/')) return 'vendor-firebase-database';
            return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/@radix-ui/')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
        }
      }
    }
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
}));
