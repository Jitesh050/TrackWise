## 2024-05-23 - [Optimization Anti-Pattern: Component-Level Data Processing]
**Learning:** Large static datasets (like simulation JSONs) should not be filtered/processed inside React components or hooks (like `useTrainStatus`). Even with `useMemo`, if the dependency changes or the component remounts, the expensive calculation runs again.
**Action:** Move static data processing (indexing/grouping) to the module level. This ensures it runs only once when the module loads, providing O(1) lookups for components.
