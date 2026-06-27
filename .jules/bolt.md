## 2024-06-27 - [Optimize TicketManagement array filtering]
**Learning:** Multiple array `.filter().length` passes across large lists in React components directly multiply rendering overhead. String `.toLowerCase()` evaluation inside O(N) loops is repeatedly computed unecessarily.
**Action:** Consolidate multiple related O(N) calculations (such as filtering an array AND getting lengths by status) into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoist static operations like `.toLowerCase()` outside the reduce loop.
