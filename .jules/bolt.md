
## 2024-05-18 - [Optimize user stats calculation and filtering in UserManagement]
**Learning:** Found another instance of the anti-pattern where components perform multiple `array.filter(condition).length` passes inside the render cycle to compute statistics alongside general list filtering. This specific component also recalculated `toLowerCase()` inside the filter loop and recreated the mock `users` array on every render.
**Action:** Use `useMemo` with a single `.reduce()` pass for statistics. Wrap the static array and filtered output in `useMemo` hooks, and hoist string operations outside loops.

## 2024-05-18 - [Fix Netlify chunk limits and deploy failure]
**Learning:** If a Netlify deploy fails silently with generic errors ("Deploy failed", "Pages changed", etc.) and the logs show Vite Rollup warnings about 500kb limits or chunking errors, providing a solid `vite.config.ts` manual chunking strategy alongside a clear `netlify.toml` solves the deployment blocker. The manual chunks must use string includes rather than static object maps to avoid module resolution errors.
**Action:** Use specific array filters or string matches inside `manualChunks` in `vite.config.ts`, group `firebase`, `react-router`, and major heavy UI dependencies to bypass the limits, and provide a `netlify.toml` fallback for single page applications.
