## 2026-06-15 - [Vite Build Warnings Crashing Netlify CI]
**Learning:** The project failed Netlify CI deploy due to Vite outputting build warnings ('chunk size > 500kb' and dynamic vs static import conflicts) resulting in a non-zero exit code.
**Action:** Configured build.rollupOptions.output.manualChunks in vite.config.ts to isolate heavy dependencies (firebase, mapbox-gl, recharts, radix-ui) into explicit vendor chunks, thereby resolving the Vite build warnings and unblocking CI.
