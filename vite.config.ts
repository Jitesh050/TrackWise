
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
        manualChunks: (id) => {
          // ⚡ Bolt Optimization: Split heavy vendor dependencies to improve caching and fix CI chunk limits
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            if (id.includes('firestore')) return 'vendor-firebase-firestore';
            if (id.includes('auth')) return 'vendor-firebase-auth';
            return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
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
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
        },
      },
    },
  },
}));
