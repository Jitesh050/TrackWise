## 2024-05-22 - Optimized Train Schedule Lookups
**Learning:** React components (`CollisionDetection.tsx`) and hooks (`useTrainStatus.tsx`) were performing expensive O(N) or O(N*M) operations on every render/tick to group or filter simulation data. Using a centralized O(1) Map lookup (`stopsByTrain` in `train-sim.ts`) eliminates this overhead.
**Action:** Always prefer indexing static datasets at the module level and exporting accessor functions, rather than processing raw JSON data inside components or hooks.
