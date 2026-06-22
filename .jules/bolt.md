## 2024-05-18 - [Optimizing O(N) Array Operations]
**Learning:** Consolidating multiple `O(N)` `array.filter().length` passes into a single `array.reduce()` pass wrapped in `useMemo` is a standard optimization that improves computational efficiency in React components, especially for derived stat arrays.
**Action:** Look for multiple `.filter` statements on the same dataset in future UI components and group them into a single `reduce` pass if possible.
## 2024-05-18 - [Netlify Build Failure - Vite Chunks]
**Learning:** Netlify CI will silently fail the React build if Rollup emits dynamic import conflicts or chunk size warnings (`> 500kB`), which manifest as "Deploy failed" errors. Splitting submodules (like `firebase/auth` and `firebase/firestore`) from the core firebase chunk using explicit path matching avoids these warnings and fixes the build.
**Action:** Always include a comprehensive Rollup `manualChunks` configuration splitting heavy dependencies (`firebase`, `react`, `recharts`, `mapbox-gl`) when handling frontend build or CI errors for this project.
## 2024-05-18 - [Netlify Build Failure - Missing Routing Rules]
**Learning:** Netlify CI for SPA (Single Page Application) projects built with Vite and React Router fail "Pages changed", "Header rules", and "Redirect rules" checks if `_redirects` and `_headers` files are missing from the build output.
**Action:** Always add `public/_redirects` (containing `/* /index.html 200` to support client-side routing) and basic security headers in `public/_headers` to explicitly satisfy Netlify configuration validations for SPAs.
