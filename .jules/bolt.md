## 2024-07-19 - [TicketManagement Performance Bottleneck]
**Learning:** React components that render lists and categorical statistics (like status counts) frequently suffer from O(N) anti-patterns where the same array is iterated multiple times via `.filter(condition).length` during every render phase.
**Action:** Consolidate multiple iterative array passes for stats into a single `reduce()` operation wrapped in `useMemo`, and hoist expensive string operations like `toLowerCase()` outside of loop bodies to prevent redundant calculations on every render.
