## 2025-02-10 - [Optimized Train Status Lookup]
**Learning:** `useTrainStatus` hook was performing O(N*M) filtering of schedules inside a loop, which is inefficient for large datasets. Centralizing data access in `src/lib/train-sim.ts` with pre-computed Maps allows O(1) lookup.
**Action:** Always prefer module-level pre-computation for static datasets over per-render filtering. Use `getTrainSchedule` instead of importing raw JSON.
