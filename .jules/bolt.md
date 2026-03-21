## 2024-03-21 - [TicketManagement Performance]
**Learning:** Found another component (`TicketManagement.tsx`) suffering from the same O(N) multi-filter anti-pattern for calculating statistics. This codebase pattern is pervasive in list views.
**Action:** Always scan new list/table components for `array.filter(condition).length` calls used for summary stats. They can reliably be optimized into a single `reduce` pass wrapped in `useMemo`.
