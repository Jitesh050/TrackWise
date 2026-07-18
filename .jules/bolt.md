## 2026-07-18 - [Optimize Ticket Management Stats]
**Learning:** Consolidating multiple array map/filter iterations into a single reduce pass, while simultaneously hoisting invariant strings and string evaluations (e.g. .toLowerCase()) outside the iteration, is an effective and robust pattern to avoid the overhead of multiple O(N) evaluations in functional React components.
**Action:** Look for chained O(N) array transformations combined with identical conditional criteria inside renders, and condense them into single-pass loops wrapped in useMemo.
