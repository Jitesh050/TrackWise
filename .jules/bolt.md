## 2024-05-19 - [Consolidating React Renders with useMemo and Data Structures]
**Learning:** React dashboards that run multiple `.filter(condition).length` passes for stats counters alongside heavy filtering/sorting of lists directly in the functional component body cause unnecessary O(N) or O(N log N) work on every render.
**Action:** Consolidate these multiple passes into a single loop using `useMemo` and map over statically hoisted lookup tables for things like distances.

## 2024-05-19 - [Passenger Dashboard Optimization]
**Learning:** Optimizing `PassengerDashboard.tsx` reduced multiple O(N) array transformations into one O(N) loop and hoisted static dictionary mapping outside the render cycle.
**Action:** Ensure these kinds of patterns are refactored efficiently when found.
