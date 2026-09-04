## 2024-05-18 - Passenger Dashboard Optimization
**Learning:** Multiple separate passes on React props/state arrays (like filter.length, reduce, map.sort) inside a component render block can cause performance bottlenecks. Always consolidate these into a single O(N) loop and wrap them in useMemo to cache derived states across renders.
**Action:** Use a single loop to tally counts, aggregate sums, and build derivative arrays simultaneously, and extract static lookup mapping out of the functional component scope.
