## 2024-07-27 - TicketManagement Optimization
**Learning:** Consolidating multiple O(N) array `.filter().length` passes into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop, significantly reduces execution time by avoiding redundant array iterations and state allocations during component render.
**Action:** Always look for this pattern when components calculate summary statistics alongside filtering lists, and optimize them using a single-pass `reduce()` wrapped in `useMemo`.
