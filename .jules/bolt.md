## 2024-04-03 - [Consolidating loops and hoisting string ops for better performance]
**Learning:** Found multiple places where `.filter().length` was used to calculate stats repeatedly on the same array.
**Action:** Consolidate multiple passes over arrays into a single `reduce()` wrapped in `useMemo`, and hoist `toLowerCase()` transformations out of loops.
