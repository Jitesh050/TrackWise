## 2023-10-27 - Metric Derivations Trigger Redundant Re-allocations
**Learning:** In dashboards displaying ticket data, metric derivations are frequently unmemoized. Deriving values like `milesTraveled` inside the render cycle instantiates large map lookups (e.g., mapping station IDs) redundantly on every render.
**Action:** When calculating complex derived dashboard stats, always hoist static mappings (`STATIONS_BY_CODE`) outside the component and consolidate array operations inside a `useMemo` block.
