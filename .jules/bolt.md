
## 2024-05-18 - [Optimizing Multiple .filter().length Calls]
**Learning:** In React components dealing with data visualization or statistics (like `TicketManagement.tsx` or `UserManagement.tsx`), using multiple O(N) array `.filter(condition).length` calls within the render body causes unnecessary redundant array iterations on every render.
**Action:** Consolidate these multiple array traversals into a single pass using `.reduce()` to tally the statistics, and wrap the result in `useMemo` with appropriate dependencies to guarantee it only recalculates when the underlying data changes.
