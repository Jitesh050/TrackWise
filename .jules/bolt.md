## 2023-10-01 - Passenger Dashboard Array Optimization
**Learning:** Multiple passes over unmemoized arrays for calculating `nextJourney` and `milesTraveled` with inner Map creation creates a rendering bottleneck.
**Action:** Extract static constants like `STATIONS_BY_CODE` to module scope and consolidate multiple O(N) array transformations into a single `useMemo` pass tracking mins/maxes.
