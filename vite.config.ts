
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
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules')) {
            // Further split generic vendor chunk to avoid 500kb limit
            if (id.includes('mapbox-gl')) return 'vendor-mapbox';
            if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) return 'vendor-charts';
            if (id.includes('@radix-ui') || id.includes('framer-motion') || id.includes('clsx') || id.includes('tailwind')) return 'vendor-ui';
            if (id.includes('@tanstack') || id.includes('zod')) return 'vendor-utils';
            if (id.includes('date-fns')) return 'vendor-date-fns';
            if (id.includes('@hookform') || id.includes('react-hook-form')) return 'vendor-forms';
            if (id.includes('qrcode')) return 'vendor-qrcode';
            if (id.includes('lovable-tagger')) return 'vendor-lovable';
            return 'vendor';
          }
        }
      }
    }
  }
}));
