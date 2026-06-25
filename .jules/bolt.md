## 2024-05-24 - Ticket Management Render Optimization
**Learning:** React state arrays representing large tables (like tickets or users) often get iterated over multiple times per render for things like summary stats (e.g., `tickets.filter(t => t.status === "Confirmed").length` alongside similar filters for waiting/cancelled statuses).
**Action:** Always combine multiple `.filter().length` summary stats and the main search `.filter()` loop into a single `.reduce()` pass wrapped in `useMemo`. This collapses O(4*N) traversals down to O(N) when dependencies change, and O(1) on unrelated re-renders.
## 2024-05-24 - Vite Chunk Optimization
**Learning:** Netlify CI for this project has a strict configuration where it treats Vite chunk warnings as fatal deploy errors (triggering "Deploy failed" or "Header rules/Redirect rules").
**Action:** When a project's vendor bundle is large enough to trigger Vite's 500kB warning, manually configure `build.rollupOptions.output.manualChunks` in `vite.config.ts` using specific path inclusion rules (`id.includes('node_modules/library/')`) to isolate heavy dependencies into distinct chunks.
