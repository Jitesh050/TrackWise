## 2023-10-27 - [Component Stats Anti-Pattern Optimization]
**Learning:** Found a recurrent codebase-specific performance anti-pattern where components perform multiple `array.filter().length` passes inside the main render function to derive summary statistics, alongside a separate `array.filter()` to generate the list view.
**Action:** When encountering components that display both filtered lists and numerical state summaries (e.g., TicketManagement), consolidate all iterations into a single `useMemo` wrapped `array.reduce()` pass to lower the time complexity from O(M*N) to O(N).
