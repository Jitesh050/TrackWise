## 2024-06-30 - [Optimize PassengerDashboard.tsx]
**Learning:** Consolidated multiple O(N) array passes into a single useMemo hook and replaced an O(N log N) sort with an O(N) min-finding logic. Hoisted a large reference data Map lookup out of the component to prevent reallocation per render.
**Action:** Always look to hoist static data mappings outside the render cycle and merge sequential filter/reduce/map operations into a single pass.
## 2024-06-30 - [Fix Vite Netlify Build Warning]
**Learning:** Configured `manualChunks` in `vite.config.ts` using a function mapping to split large vendor dependencies and resolve build warnings regarding chunk sizes and dynamic imports that cause silent failures on Netlify CI.
**Action:** Always verify chunk sizes during builds and apply `manualChunks` functions for heavy vendor libraries to improve caching and unblock CI pipelines.
