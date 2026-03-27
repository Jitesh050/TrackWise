## 2024-06-18 - Replacing O(N*M) lookup with O(1) hash map inside a `.forEach`
**Learning:** Performing `Array.filter` inside a `.forEach` loop results in an O(N*M) operation, severely degrading performance when handling large datasets. Pre-computing a lookup map outside the `.forEach` transforms this into an O(1) lookup. This optimization reduced the time taken for `generateLiveStatus` by about 5x in benchmarking.
**Action:** When seeing `.filter()` nested inside iterative functions over a dataset, extract it into a pre-computed map keyed by the lookup property.
