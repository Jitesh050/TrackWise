## 2024-06-24 - [Avoid Multiple Array Passes]
**Learning:** Found multiple instances where components iterate over arrays multiple times (e.g. `tickets.filter(t => t.status === "Confirmed").length`, `tickets.filter(t => t.status === "Waiting").length`, etc.) on every render.
**Action:** Consolidate these O(N) array traversals into a single `reduce` pass wrapped in `useMemo` to improve frontend performance.

## 2024-06-24 - [Vite Chunk Configuration for Netlify]
**Learning:** Generic Netlify "Deploy failed" errors with "Header rules" or "Redirect rules" annotations are often caused by silent failures in the Vite build process due to dynamic import conflicts (e.g., `firebase/auth`) or massive chunk sizes exceeding memory limits.
**Action:** Configure `manualChunks` in `vite.config.ts` using specific string matches on the module `id` to aggressively split heavy dependencies (like Firebase, React, Radix UI) into separate vendor chunks, eliminating Rollup warnings and resolving CI failures.
