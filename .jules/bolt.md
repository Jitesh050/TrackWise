## 2024-05-19 - Replace O(N log N) sorting with O(N) minimum-finding inside useMemo
**Learning:** In dashboards where we need to find the "next" or "most recent" item based on a timestamp (like `nextJourney`), sorting the entire array (O(N log N)) is inefficient if we only need the single minimum value that is greater than `Date.now()`.
**Action:** When refactoring iterative passes into a single `useMemo` block, look for opportunities to replace `.sort()[0]` patterns with a simple `O(N)` loop tracking the minimum/maximum value.
