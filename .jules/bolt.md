## 2024-04-16 - Initial bolt journal

## 2024-04-16 - TicketManagement Performance Optimization
**Learning:** Consolidating multiple O(N) array `.filter().length` passes into a single `.reduce()` block wrapped in `useMemo` is a highly effective, repeatable pattern for reducing overhead in dashboard/management views. String allocations from `.toLowerCase()` within loops are also a common bottleneck that can be trivially hoisted.
**Action:** Before optimizing complex states or adding external memoization libraries, always check if multiple O(N) array scans can be merged into a single pass.
