## 2025-02-28 - Optimized PassengerDashboard Component
**Learning:** The PassengerDashboard component was recreating a station lookup map and iterating over the tickets array multiple times on every render to calculate derived state (active bookings, next journey, and miles traveled).
**Action:** Always hoist static data lookups outside of React components and use `useMemo` to consolidate multiple O(N) operations into a single O(N) pass for derived state calculations to prevent redundant re-renders.
