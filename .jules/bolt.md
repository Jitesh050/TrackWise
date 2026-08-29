## 2026-08-29 - PassengerDashboard Performance Optimization
**Learning:** Found an anti-pattern in PassengerDashboard where multiple O(N) array transformations (filter, map, reduce) and an O(N log N) sort were chained together on every render to calculate derived state variables like 'nextJourney' and 'milesTraveled'. Consolidating these into a single O(N) pass inside a useMemo significantly reduces computational overhead.
**Action:** Next time I see a chain of array iterations to find the 'next' or 'max' value, I will consolidate them into a single-pass O(N) loop and wrap it in a useMemo.
