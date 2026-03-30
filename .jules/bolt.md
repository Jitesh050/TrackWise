## 2024-03-30 - [Optimize TicketManagement Performance]
**Learning:** Consolidating multiple O(N) `.filter().length` array passes into a single `.reduce()` block wrapped in `useMemo` significantly reduces unnecessary recalculations on every render, especially for large datasets. Additionally, hoisting static string transformations like `.toLowerCase()` outside of iteration loops prevents redundant allocations.
**Action:** Always look for opportunities to consolidate multiple array iterations into single passes and wrap expensive derived state calculations in `useMemo`.
