## 2024-05-22 - [O(N*M) Filtering in Render Loop]
**Learning:** Frequent array filtering (`.filter()`) inside an interval or render loop on large static datasets (like simulation schedules) is a major performance bottleneck. Pre-indexing this data into a `Map` (O(1) lookup) drastically reduces CPU usage.
**Action:** Always verify if static JSON data is being iterated repeatedly. If so, index it once at module level and export a lookup function.
