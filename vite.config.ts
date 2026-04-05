
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
        // ⚡ Bolt: Split heavy dependencies into separate chunks to prevent monolithic >500kb bundle.
        // Impact: Reduces initial load time by allowing parallel downloads and improves browser caching.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const moduleName = id.split('node_modules/')[1].split('/')[0];

            if (['react', 'react-dom', 'react-router-dom'].includes(moduleName)) {
              return 'vendor-react';
            }
            if (moduleName === 'firebase') {
              return 'vendor-firebase';
            }
            if (moduleName === '@radix-ui') {
              return 'vendor-radix';
            }
            if (['lucide-react', 'recharts', 'embla-carousel-react'].includes(moduleName)) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
        }
      },
    },
  },
}));
