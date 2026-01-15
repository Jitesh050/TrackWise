## 2024-05-22 - Static Data Processing Bottleneck
**Learning:** Processing static JSON datasets (like `schedules_100.json`) inside React components or hooks (e.g., via `filter` or `forEach`) causes significant performance degradation (O(N*M) complexity) and redundant memory allocation on every render.
**Action:** Always move static data processing to a shared utility (like `src/lib/train-sim.ts`), preprocess it into O(1) lookup structures (Maps) at the module level, and expose accessors. Use `useMemo` in components only for lightweight derivations from this static data.
