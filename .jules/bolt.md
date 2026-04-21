## 2026-04-21 - [Consolidating array passes in PassengerDashboard]
**Learning:** React component `PassengerDashboard.tsx` previously exhibited a codebase-specific pattern where multiple redundant `O(N)` operations (filters, maps, reduces) over the tickets array were executed on every render alongside  allocations for . Netlify CI strictly treats Vite warnings like the dynamic import conflict in Vite output as a CI error.
**Action:** Consolidate array iterations into a single `useMemo` and hoist static maps to prevent redundant allocations.
## 2024-05-18 - [Consolidating array passes in PassengerDashboard]
**Learning:** React component `PassengerDashboard.tsx` previously exhibited a codebase-specific pattern where multiple redundant `O(N)` operations (filters, maps, reduces) over the tickets array were executed on every render alongside `new Map()` allocations for `STATIONS_BY_CODE`.
**Action:** Consolidate array iterations into a single `useMemo` and hoist static maps to prevent redundant allocations.
