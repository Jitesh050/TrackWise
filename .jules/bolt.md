## 2024-05-23 - [Direct Data Access Optimizations]
**Learning:** React hooks processing static JSON data (like `useTrainStatus` with `schedules_100.json`) can unintentionally create O(N*M) bottlenecks if they perform array filters inside render/effect loops instead of pre-indexing.
**Action:** Always prefer module-level Map indexing for static datasets in `src/lib/` (e.g., `stopsByTrain` in `train-sim.ts`) and export O(1) accessors rather than importing raw JSON in components.
