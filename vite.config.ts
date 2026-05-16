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
            if (id.includes('firebase/auth') || id.includes('firebase/app')) return 'firebase-auth';
            if (id.includes('firebase/firestore') || id.includes('firebase/database')) return 'firebase-db';
            if (id.includes('firebase')) return 'firebase-core';
            if (id.includes('react-dom')) return 'react-dom';
            if (id.includes('react-router-dom')) return 'react-router';
            if (id.includes('react')) return 'react-core';
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('lucide-react')) return 'lucide';
            return 'vendor';
          }
        }
      }
    }
  }
}));
