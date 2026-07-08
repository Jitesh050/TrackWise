## 2024-05-30 - Optimize TicketManagement.tsx array iterations
**Learning:** Found an anti-pattern in `TicketManagement.tsx` where `.filter().length` is called multiple times on the same `tickets` array during render to calculate statistics (Confirmed, Waiting, Cancelled), alongside a separate unmemoized `.filter()` for the main ticket list.
**Action:** Consolidate these repeated O(N) filtering operations. Use `useMemo` to compute the filtered list and the statistics simultaneously in a single `.reduce()` pass, and hoist repeated string operations like `.toLowerCase()` outside the loop.
