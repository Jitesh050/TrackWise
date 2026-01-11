## 2025-01-27 - [Duplicate Data Loading Anti-Pattern]
**Learning:** I discovered that `useTrainStatus.tsx` was manually loading and filtering JSON data that was already efficiently indexed in `src/lib/train-sim.ts`. This duplication led to an O(N*M) bottleneck instead of O(N).
**Action:** Always check `src/lib` or similar utility folders for existing data access layers before implementing raw data processing in components/hooks.
