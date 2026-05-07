## 2025-05-07 - Consolidated array operations in TicketManagement.tsx
**Learning:** Multiple consecutive array passes (`.filter().length` or `.map()`) can be expensive, especially within React components causing O(N) operations on every render.
**Action:** Consolidate iterative operations to a single pass (`.reduce()`) within `useMemo` when calculating statistics alongside filtering to maximize efficiency.
