
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
          // Splitting heavy vendor dependencies into separate chunks resolves Vite dynamic import and size limit warnings, and improves browser caching.
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            if (id.includes('firestore')) return 'vendor-firebase-firestore';
            if (id.includes('auth')) return 'vendor-firebase-auth';
            return 'vendor-firebase-core';
          }
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
          if (id.includes('node_modules/radix-ui/') || id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/react-router/') || id.includes('node_modules/react-router-dom/')) return 'vendor-router';
          if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
        }
      }
    }
  }
}));
