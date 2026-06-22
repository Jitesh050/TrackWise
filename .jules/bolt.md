## 2024-05-18 - [Optimizing O(N) Array Operations]
**Learning:** Consolidating multiple `O(N)` `array.filter().length` passes into a single `array.reduce()` pass wrapped in `useMemo` is a standard optimization that improves computational efficiency in React components, especially for derived stat arrays.
**Action:** Look for multiple `.filter` statements on the same dataset in future UI components and group them into a single `reduce` pass if possible.
## 2024-05-18 - [Netlify Build Failure - Vite Chunks]
**Learning:** Netlify CI will silently fail the React build if Rollup emits dynamic import conflicts or chunk size warnings (`> 500kB`), which manifest as "Deploy failed" errors. Splitting submodules (like `firebase/auth` and `firebase/firestore`) from the core firebase chunk using explicit path matching avoids these warnings and fixes the build.
**Action:** Always include a comprehensive Rollup `manualChunks` configuration splitting heavy dependencies (`firebase`, `react`, `recharts`, `mapbox-gl`) when handling frontend build or CI errors for this project.
