## 2024-06-24 - [Avoid Multiple Array Passes]
**Learning:** Found multiple instances where components iterate over arrays multiple times (e.g. `tickets.filter(t => t.status === "Confirmed").length`, `tickets.filter(t => t.status === "Waiting").length`, etc.) on every render.
**Action:** Consolidate these O(N) array traversals into a single `reduce` pass wrapped in `useMemo` to improve frontend performance.
