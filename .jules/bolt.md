# Bolt's Journal
## 2024-05-24 - Codebase pattern: Multiple array filters during render
**Learning:** Components frequently use an anti-pattern of multiple `array.filter(condition).length` passes during renders to generate categorical statistics alongside list filtering. This causes redundant O(N) array iterations.
**Action:** Optimize this by consolidating the stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop.
