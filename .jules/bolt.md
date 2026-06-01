## 2024-05-24 - [Optimize TicketManagement]
**Learning:** Consolidating multiple O(N) array passes (like calculating statistics) into a single O(N) reduce pass wrapped in `useMemo` is a straightforward optimization in React component rendering.
**Action:** Always look for chained array methods (`.filter().length`) or duplicate array passes when calculating derived state from the same source data array.
