
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
  build: {
    rollupOptions: {
      output: {
        // ⚡ Bolt: Split heavy dependencies into separate chunks to resolve chunk size limit warnings and Netlify CI deploy failures.
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase/auth')) return 'vendor-firebase-auth';
          if (id.includes('node_modules/firebase/firestore')) return 'vendor-firebase-firestore';
          if (id.includes('node_modules/firebase/')) return 'vendor-firebase-core';
          if (id.includes('node_modules/@firebase/auth')) return 'vendor-firebase-auth';
          if (id.includes('node_modules/@firebase/firestore')) return 'vendor-firebase-firestore';
          if (id.includes('node_modules/@firebase/')) return 'vendor-firebase-core';
          if (id.includes('node_modules/recharts/')) return 'vendor-recharts';
          if (id.includes('node_modules/lucide-react/')) return 'vendor-lucide';
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          if (id.includes('node_modules/mapbox-gl/')) return 'vendor-mapbox';
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
