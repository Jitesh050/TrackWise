## 2024-05-24 - [Avoid Multiple O(N) Filters and Post-Increment]
**Learning:** This codebase's older ESLint setup crashes when using post-increment operators (`++`). Additionally, many components perform redundant O(N) array `.filter().length` passes to calculate statistics.
**Action:** Use `+= 1` instead of `++` for accumulators to prevent CI failures. Consolidate multiple O(N) array `.filter().length` operations into a single `.reduce()` pass wrapped in `useMemo`, and hoist static string transformations like `.toLowerCase()` outside of iteration loops.
