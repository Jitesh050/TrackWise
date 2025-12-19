## 2024-05-23 - Critical Performance Win: Grouping & String Caching

**Learning:**
In `useTrainStatus.tsx`, `generateLiveStatus` was running periodically.
1. It used `SCHEDULES_DATA.filter` inside a loop of 100 trains, causing O(N*M) complexity (N=trains, M=schedules).
2. It called `now.toDateString()` multiple times per train loop to reconstruct Date objects.

**Impact:**
- Initial benchmark: ~1.50ms per iteration.
- After grouping schedules: ~1.11ms per iteration.
- After caching `now.toDateString()`: ~0.22ms per iteration.
- Total improvement: ~85% reduction in execution time.

**Action:**
- Always pre-group data when performing lookups inside loops.
- Move invariant calculations (like `now.toDateString()`) outside of tight loops.
