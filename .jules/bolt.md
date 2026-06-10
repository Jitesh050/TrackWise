## $(date +%Y-%m-%d) - [AIStationManagement.tsx] Consolidate array transforms & cache string ops
**Learning:** The `handleAnnounceArrivals` function in `AIStationManagement.tsx` had a chain of array operations (`.map().map().filter().sort().slice()`) that caused redundant object creation and array iterations per station update. Wrapping derived arrays in `useMemo` and hoisting evaluations such as `filter.toLowerCase()` significantly mitigates render overhead.
**Action:** Replaced chained array manipulations with a single-pass loop and hoisted/memoized computations to reduce overall render time.
## 2026-06-10 - [vite.config.ts] Fix Chunk Size Warnings with Manual Chunks
**Learning:** The build was generating chunk size warnings because of heavy dependencies (like Firebase, Lucide, Radix) being bundled into a single chunk. Netlify treats Vite build warnings as errors, so extracting these into separate manualChunks prevents deployment failures.
**Action:** Configured `manualChunks` in `vite.config.ts` to split heavy libraries out of the main index bundle.
