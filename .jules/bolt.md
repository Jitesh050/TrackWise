## 2024-03-14 - Consolidate Array Filters
**Learning:** Refactoring multiple O(N) array `.filter()` passes into a single `.reduce()` pass and hoisting static string transformations reduces CPU overhead in React components.
**Action:** Look for chained or repeated array iterations on the same dataset and combine them using `useMemo`.
