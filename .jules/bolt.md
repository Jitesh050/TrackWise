## 2025-01-08 - Optimized Train Schedule Lookup
**Learning:**
I discovered that `useTrainStatus` was filtering a large `SCHEDULES_DATA` array (O(M)) for every train in `TRAINS_DATA` (O(N)), resulting in an O(N*M) complexity on every simulated tick (every 1s).
**Action:**
I implemented a module-level `Map` to index schedules by `train_no`, reducing the lookup to O(1) and the overall complexity to O(N).
This is a critical pattern for simulation data: pre-process static JSON datasets into Maps at module scope to avoid expensive array methods in render or interval loops.
