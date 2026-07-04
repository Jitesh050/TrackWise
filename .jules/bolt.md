## 2024-05-18 - Single Pass Stats & Hoisting in TicketManagement
**Learning:** Found multiple O(N) array `.filter().length` passes for stats and redundant `toLowerCase()` calls inside a `.filter` loop during every render in `src/pages/TicketManagement.tsx`.
**Action:** Consolidate stats calculation into a single `useMemo` block with `.reduce()`, and wrap `filteredTickets` in a `useMemo` block with `searchTerm.toLowerCase()` evaluated once outside the loop.
