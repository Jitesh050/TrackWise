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
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('leaflet')) return 'vendor-leaflet';
            if (id.includes('framer-motion')) return 'vendor-framer-motion';
            return 'vendor';
          }
        }
      }
    }
  }
}));
