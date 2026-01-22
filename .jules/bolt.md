## 2025-02-20 - [O(N*M) Filter replaced by O(1) Map Lookup]
**Learning:** Frequent iterations (e.g. simulation loops) over large datasets using `.filter()` can cause significant bottlenecks (100x+ slowdown). Pre-indexing data into Maps at module level solves this.
**Action:** Always verify data access patterns in loops. Use Maps for lookups by ID.
