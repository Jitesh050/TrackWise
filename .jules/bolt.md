## 2026-02-15 - [Train Status Performance]
**Learning:** Performance bottlenecks in `useTrainStatus` were caused by nested O(N*M) array filtering inside `generateLiveStatus`. Replacing this with an O(1) `Map` lookup yielded a 108x speedup (2.02ms -> 0.02ms per call).
**Action:** When working with static simulation data, pre-compute lookup maps at the module level and export them via helper functions (e.g., `getTrainSchedule`) instead of re-filtering raw arrays in every component render or interval tick.
