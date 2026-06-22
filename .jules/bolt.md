## 2024-05-18 - [Optimizing O(N) Array Operations]
**Learning:** Consolidating multiple `O(N)` `array.filter().length` passes into a single `array.reduce()` pass wrapped in `useMemo` is a standard optimization that improves computational efficiency in React components, especially for derived stat arrays.
**Action:** Look for multiple `.filter` statements on the same dataset in future UI components and group them into a single `reduce` pass if possible.
