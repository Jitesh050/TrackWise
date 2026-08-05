## 2024-05-24 - Optimizing Multiple Array Traversals in Render
**Learning:** Components frequently use an anti-pattern of multiple array iterations (e.g., `.filter().length`) to generate statistics alongside list filtering during render cycles. This causes redundant O(N) operations.
**Action:** Consolidate these operations into a single `.reduce()` pass wrapped in `useMemo`, calculating both stats and the filtered list in O(N) time.
