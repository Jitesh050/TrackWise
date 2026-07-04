
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
        // Optimization: Splitting heavy vendor dependencies into separate chunks to resolve
        // 500kB chunk size warnings and Firebase static/dynamic import conflicts that break Netlify CI
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase/auth') || id.includes('node_modules/@firebase/auth')) return 'vendor-firebase-auth';
          if (id.includes('node_modules/firebase/firestore') || id.includes('node_modules/@firebase/firestore')) return 'vendor-firebase-firestore';
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) return 'vendor-firebase-core';
          if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
          if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/react-router/') || id.includes('node_modules/react-router-dom/')) return 'vendor-router';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor-react';
        }
      }
    }
  }
}));
