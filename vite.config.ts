
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
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('node_modules/firebase')) return 'firebase-vendor';
          if (id.includes('node_modules/@radix-ui')) return 'radix-ui-vendor';
          if (id.includes('node_modules/lucide-react')) return 'lucide-vendor';
          if (id.includes('node_modules/mapbox-gl')) return 'mapbox-vendor';
          if (id.includes('node_modules/date-fns')) return 'date-fns-vendor';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
}));
