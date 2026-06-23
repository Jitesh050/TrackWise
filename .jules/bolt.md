## 2024-06-23 - TicketManagement Optimization
**Learning:** Consolidating multiple O(N) array '.filter().length' passes into a single '.reduce()' pass wrapped in 'useMemo', and hoisting the 'searchTerm.toLowerCase()' evaluation outside the filter loop optimizes the TicketManagement component.
**Action:** Implement this optimization to improve performance by reducing redundant iterations.
