## 2024-06-30 - [Optimize PassengerDashboard.tsx]
**Learning:** Consolidated multiple O(N) array passes into a single useMemo hook and replaced an O(N log N) sort with an O(N) min-finding logic. Hoisted a large reference data Map lookup out of the component to prevent reallocation per render.
**Action:** Always look to hoist static data mappings outside the render cycle and merge sequential filter/reduce/map operations into a single pass.
