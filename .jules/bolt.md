## 2024-04-02 - Consolidate filtering with reduce and useMemo

**Learning:** When calculating derived statistics from a list in React components (like ticket stats: confirmed, waiting, cancelled), performing multiple `.filter().length` operations iterates over the array multiple times, causing O(N) operations multiplied by the number of categories. Also, placing string transformations like `.toLowerCase()` inside iteration loops causes redundant work.

**Action:** Consolidate multiple `.filter().length` passes into a single `.reduce()` block wrapped in a `useMemo` hook, ensuring a single O(N) pass over the data. Additionally, hoist static string transformations out of `.filter` loops to compute them only once per render or dependencies change.
