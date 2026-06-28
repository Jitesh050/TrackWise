## 2024-11-20 - [Optimization: Bundle Chunking for CI Failures]
**Learning:** Netlify CI fails with cryptic "Deploy failed" or "Header rules" errors when Vite's default 500kB chunk limit is exceeded, especially due to mixed static and dynamic imports (e.g., `firebase/auth`).
**Action:** When a project fails CI with build warnings, split heavy dependencies into separate chunks using `build.rollupOptions.output.manualChunks` in `vite.config.ts`, ensuring string matching paths are exact and Rollup handles them distinctly.
