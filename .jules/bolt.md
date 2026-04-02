
## 2025-01-20 - Memoizing list operations and reducing iterations
**Learning:** In components rendering lists of objects, calculating stats and filtering on every render is a common bottleneck. Iterating over the same array multiple times to derive different `.length` counts (e.g. pending, approved, rejected) wastes cycles.
**Action:** Consolidate multiple O(N) array `.filter().length` passes into a single `.reduce()` pass wrapped in `useMemo`. When filtering, hoist static string transformations like `.toLowerCase()` outside the loop and wrap the derivation in `useMemo`.
