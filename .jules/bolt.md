## 2026-08-25 - TicketManagement Multiple Iterations Optimization
**Learning:** Common pattern in this codebase involves running multiple `array.filter(condition).length` passes during renders to derive categorical statistics alongside the main list filtering.
**Action:** Always combine these multiple passes into a single `reduce()` operation wrapped inside a `useMemo` block to consolidate O(N) operations and eliminate redundant array filtering strings operations on each render cycle.
