## 2024-05-15 - [Ticket Management Optimization]
**Learning:** Components frequently use an anti-pattern of multiple `array.filter(condition).length` passes during renders to generate categorical statistics.
**Action:** Optimize this by consolidating the stat counting into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside any list filtering loops.
