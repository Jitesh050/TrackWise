## 2025-02-14 - Optimize TrainStatus Double Re-renders
**Learning:** `src/pages/TrainStatus.tsx` was using `useEffect` to synchronize local state (`filteredTrains`) with props/other state, causing an unnecessary second render on every keystroke. This is a common React anti-pattern.
**Action:** Replace `useEffect` + `useState` for derived data with `useMemo`. This eliminates the double render and improves responsiveness. Also, extract pure helper functions (like `mapStatusToCard`) outside the component to avoid recreation.
