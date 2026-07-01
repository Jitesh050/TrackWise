
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
        // Splitting vendor code improves caching by creating smaller, more persistent chunks
        // that change less frequently than application code, improving load performance.
        manualChunks: (id) => {
          if (id.includes('node_modules/firebase/auth') || id.includes('node_modules/@firebase/auth')) {
            return 'vendor-firebase-auth';
          }
          if (id.includes('node_modules/firebase/firestore') || id.includes('node_modules/@firebase/firestore')) {
            return 'vendor-firebase-firestore';
          }
          if (id.includes('node_modules/firebase/') || id.includes('node_modules/@firebase/')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-recharts';
          }
          if (id.includes('node_modules/mapbox-gl/')) {
            return 'vendor-mapbox';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-lucide';
          }
          if (id.includes('node_modules/react-router/') || id.includes('node_modules/react-router-dom/')) {
            return 'vendor-react-router';
          }
        },
      },
    },
  },
}));
