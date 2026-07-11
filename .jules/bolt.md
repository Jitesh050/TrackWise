## 2026-07-11 - [Multi-pass list traversal anti-pattern]
**Learning:** Found an anti-pattern in `src/pages/TicketManagement.tsx` where the application runs multiple `.filter(t => t.status === X).length` over the same array per render. This scales poorly with large lists.
**Action:** Consolidate these multiple passes, along with standard search filtering, into a single `.reduce` loop wrapped in a `useMemo`.
