## 2024-05-18 - Avoid Multiple O(N) Array Filters per Render
**Learning:** Performing multiple unmemoized `Array.prototype.filter(...).length` iterations on large datasets during each React component render introduces significant overhead.
**Action:** Consolidate these multiple passes into a single `.reduce()` step to calculate aggregate statistics, and wrap the computation in `useMemo` so it only recalculates when the base data actually changes.
