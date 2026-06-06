
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
    // ⚡ Bolt Optimization: Split heavy vendor dependencies into distinct chunks to improve browser caching
    // and eliminate Vite chunk size limit and dynamic import conflicts that break Netlify CI.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            // Split out specific Firebase submodules to prevent massive unified chunks
            if (id.includes('/auth/')) return 'vendor-firebase-auth';
            if (id.includes('/firestore/')) return 'vendor-firebase-firestore';
            if (id.includes('/database/')) return 'vendor-firebase-database';
            return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
          if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run/')) return 'vendor-router';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor-react';
          if (id.includes('node_modules/')) return 'vendor-other';
        }
      }
    }
  }
}));
