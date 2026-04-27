## 2024-05-18 - Multiple O(N) array filter().length operations into a single reduce() pass
**Learning:** Consolidating multiple O(N) array `.filter().length` operations into a single `.reduce()` pass wrapped in `useMemo` is a crucial pattern for performance optimization in this codebase. Static string transformations like `.toLowerCase()` should be hoisted outside of iteration loops.
**Action:** Apply this pattern when computing multiple statistics or filtered arrays from a single data source.
