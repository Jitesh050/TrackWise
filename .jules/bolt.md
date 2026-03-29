## 2024-03-10 - Consolidate filter loops and string ops
**Learning:** Found an anti-pattern in React functional components where arrays were being sequentially filtered multiple times (O(N) operations) to derive scalar statistics (like lengths of specific subsets) alongside string `toLowerCase()` conversions executed repeatedly per array item.
**Action:** Consolidate multiple O(N) `.filter(…).length` passes into a single `.reduce()` pass wrapped in `useMemo`, and hoist static string transformations outside of loops.
