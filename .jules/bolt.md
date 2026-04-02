## 2025-04-02 - [TrainManagement Component Re-renders]
**Learning:** Found multiple array scans `.filter().length` and `.reduce()` running on every render in TrainManagement.tsx.
**Action:** Consolidate multiple O(N) `.filter()` passes to a single `.reduce()` step. Wrapped derived data processing in `useMemo` so stats and filtering are memoized. Wrapped static variables in `useMemo` to keep them stable and satisfy hook dependency checking without causing unneeded re-evaluations.
