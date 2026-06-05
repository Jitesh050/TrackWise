## 2023-10-27 - [Optimization of `getAllStationsWithNames` via Caching]
**Learning:** `getAllStationsWithNames` in `src/lib/train-sim.ts` mapped an array of station codes to a new array of objects on every invocation. In components that rely on this for rendering (e.g., `<datalist>` populating in `BookTicket.tsx`), this causes O(N) memory allocations per render.
**Action:** When working with simulated static backend datasets on the client, always cache derived arrays at the module level to avoid GC pressure and O(N) overhead during renders.
## 2023-10-27 - [Fixing Netlify CI by clearing Vite build warnings]
**Learning:** Netlify CI treats Vite build warnings (such as chunk size limits > 500kB or dynamic import conflicts with Firebase) as errors, which causes deployment checks (like "Pages changed", "Header rules", "Redirect rules") to fail.
**Action:** Configure `build.rollupOptions.output.manualChunks` in `vite.config.ts` to logically split vendor dependencies (Firebase, React, Mapbox, Recharts, Lucide, Radix) into separate chunks. This eliminates all warnings during `npm run build` and allows Netlify CI deployments to succeed.
