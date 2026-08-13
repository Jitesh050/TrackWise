## 2025-02-28 - Optimize PriorityTicketManagement
**Learning:** This codebase frequently uses an anti-pattern of running multiple O(N) `array.filter().length` passes during component renders to generate categorical statistics alongside list filtering, resulting in O(M*N) complexity.
**Action:** Always look for opportunities to consolidate stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoist repeated string operations (like `.toLowerCase()`) outside the loop to optimize render performance.
