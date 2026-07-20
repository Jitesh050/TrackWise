# Bolt's Performance Journal

## 2024-07-20 - [Optimize TicketManagement component rendering]
**Learning:** React components frequently use an anti-pattern of multiple O(N) `array.filter(condition).length` passes during renders to generate categorical statistics alongside list filtering.
**Action:** Optimize this by consolidating the stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop.
