
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // ⚡ Bolt: Configure manualChunks to split heavy vendor dependencies into separate chunks.
        // This improves browser caching, reduces initial load times, and fixes Netlify CI build limits.
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/mapbox-gl/')) {
            return 'vendor-mapbox';
          }
          if (id.includes('node_modules/@radix-ui/') || id.includes('node_modules/lucide-react/')) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/react-router/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-router';
          }
        }
      }
    }
  }
}));
