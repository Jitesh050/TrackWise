## 2024-12-22 - [Optimized Train Schedule Lookup]
**Learning:** Found an O(N*M) performance bottleneck in `useTrainStatus` where schedules were being filtered for every train on every update.
**Action:** Replaced array filtering with a pre-computed Hash Map (Record) lookup, reducing complexity to O(N). Verified with a benchmark showing ~4x speedup (130ms -> 30ms for 100 iterations). Always look for nested array iterations that can be flattened with a Map.
