## 2024-05-23 - [Optimizing Train Schedule Lookups]
**Learning:** Processing large static datasets (like `schedules_100.json`) inside React hooks or components leads to O(N*M) complexity on every render or interval, causing main thread blocking.
**Action:** Move data processing (indexing/sorting) to the module level (e.g., in a `lib` file) and expose O(1) accessors (like Maps). This resulted in a ~45x speedup (1.08ms -> 0.024ms per call) in simulation logic.
