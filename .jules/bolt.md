## 2024-05-23 - Duplicate Data Loading in Hooks
**Learning:** `src/hooks/useTrainStatus.tsx` was importing simulation JSONs directly and performing expensive O(N*M) filtering, unaware that `src/lib/train-sim.ts` already parsed and indexed this data in an optimized way.
**Action:** Before optimizing data processing, always check if a central service or library (like `train-sim.ts`) already handles the data and export necessary accessors from there to ensure single source of truth and performance.
