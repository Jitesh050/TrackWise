## 2024-02-12 - Optimize Train Status Generation
**Learning:** Simulation data loaded from large JSON files can be pre-indexed in memory (e.g., using a Map) to avoid O(N*M) lookups during frequent re-renders or interval updates. The `useTrainStatus` hook was filtering the entire schedule array for every train on every tick.
**Action:** Centralize data access in a helper library (`src/lib/train-sim.ts`) that exports efficient lookup functions (like `getTrainSchedule`) and use these in hooks instead of raw JSON imports.
