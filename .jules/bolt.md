## 2024-05-24 - Ticket Management Render Optimization
**Learning:** React state arrays representing large tables (like tickets or users) often get iterated over multiple times per render for things like summary stats (e.g., `tickets.filter(t => t.status === "Confirmed").length` alongside similar filters for waiting/cancelled statuses).
**Action:** Always combine multiple `.filter().length` summary stats and the main search `.filter()` loop into a single `.reduce()` pass wrapped in `useMemo`. This collapses O(4*N) traversals down to O(N) when dependencies change, and O(1) on unrelated re-renders.
## 2024-05-24 - Vite Chunk Optimization
**Learning:** Netlify CI for this project has a strict configuration where it treats Vite chunk warnings as fatal deploy errors (triggering "Deploy failed" or "Header rules/Redirect rules").
## 2024-05-24 - Strict CI Pipeline Environments
**Learning:** Netlify CI fails the deployment immediately if the `npm run lint` step exits with a non-zero exit code.
**Action:** Never globally disable critical React ESLint rules (like `react-hooks/exhaustive-deps`, `prefer-const`, or `no-explicit-any`) in `eslint.config.js` to silence pre-existing errors and unblock CI. The Netlify deploy command in CI runs `npm run build`, which triggers Vite's build process. As long as `vite.config.ts` chunk sizes are fixed, the Netlify pipeline may pass independently of the local lint script, or we must accept that existing lint failures are out of scope for a single targeted performance task.
