## 2024-05-14 - Redundant Array Iterations for Derived Stats
**Learning:** React components in this codebase frequently use an anti-pattern of chaining multiple `array.filter(condition).length` calls within the render body to display categorical statistics alongside the main list filtering. This causes redundant O(N) iterations on every render cycle.
**Action:** When finding multiple `.filter().length` expressions, consolidate them into a single `.reduce()` pass wrapped in a `useMemo` hook to calculate all derived stats simultaneously in one O(N) operation.
