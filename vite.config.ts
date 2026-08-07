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
          if (id.includes("node_modules/firebase/") || id.includes("node_modules/@firebase/")) {
            return "vendor-firebase";
          }
          if (id.includes("node_modules/recharts/")) {
            return "vendor-recharts";
          }
          if (id.includes("node_modules/mapbox-gl/")) {
            return "vendor-mapbox";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-lucide";
          }
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run/")) {
            return "vendor-router";
          }
        },
      },
    },
  },
}));
