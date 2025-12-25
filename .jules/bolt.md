## 2024-05-23 - Simulation Data Lookup Optimization
**Learning:** Simulation logic using nested `filter` inside `forEach` to match trains with schedules (O(N*M)) scales poorly.
**Action:** Pre-group data into Maps/Records (O(1) lookup) at module level for static data, or use `useMemo` for dynamic data. Implemented `SCHEDULES_BY_TRAIN` map in `useTrainStatus` reducing complexity to O(N).
