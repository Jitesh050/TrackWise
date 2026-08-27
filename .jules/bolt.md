## 2024-05-19 - [TicketManagement Performance]
**Learning:** Components frequently use an anti-pattern of multiple `array.filter(condition).length` passes during renders to generate categorical statistics alongside list filtering.
**Action:** Optimize this by consolidating the stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop.
