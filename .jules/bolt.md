## 2024-06-19 - [Ticket Management Optimization]
**Learning:** In `TicketManagement.tsx`, multiple O(N) array passes were used to calculate ticket stats (`.filter().length`), and `searchTerm.toLowerCase()` was being evaluated repeatedly for every ticket inside the filter loop on every render.
**Action:** Consolidate multiple O(N) passes into a single `.reduce()` block wrapped in `useMemo`, and wrap the `filteredTickets` logic in `useMemo` while hoisting `searchTerm.toLowerCase()` outside the loop.
