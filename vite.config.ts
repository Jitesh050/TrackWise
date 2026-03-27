
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
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('@radix-ui')) return 'ui';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('recharts')) return 'chart';
            if (id.includes('react') || id.includes('@tanstack/react-query')) return 'vendor';
            return 'deps'; // catch-all for other dependencies
          }
        },
      },
    },
  },
}));
