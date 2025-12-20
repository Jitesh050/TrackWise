## 2025-12-20 - Derived State vs useEffect
**Learning:** In `TrainStatus.tsx`, `useEffect` was used to synchronize derived state (`filteredTrains`) from props/other state (`trains`, `searchQuery`). This caused an extra render cycle.
**Action:** Replaced `useEffect` + `useState` with `useMemo` for derived data. This is cleaner, avoids the extra render, and keeps the data in sync during the same render pass.
