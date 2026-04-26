## 2024-04-26 - Consolidation of Dashboard Ticket Stats
**Learning:** Consolidate multiple iterative array passes into a single loop wrapped in `useMemo` and hoist static maps outside the component.
**Action:** Apply this to `src/pages/PassengerDashboard.tsx` to prevent redundant object creation and multiple map/filters on `tickets` per render.
