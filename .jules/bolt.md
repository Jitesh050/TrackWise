## 2026-08-31 - [O(N) Multiple Iteration Anti-Pattern]
**Learning:** Components frequently use an anti-pattern of executing multiple unmemoized `array.filter(condition).length` passes during renders to generate categorical statistics alongside standard list filtering. This causes O(K*N) iterations (where K is the number of categories) on every render, including during unrelated state changes like search input.
**Action:** Optimize this by consolidating the statistical counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop.


## 2026-08-31 - O(N) Multiple Iteration Anti-Pattern
**Learning:** Components frequently use an anti-pattern of executing multiple unmemoized `array.filter(condition).length` passes during renders to generate categorical statistics alongside standard list filtering. This causes O(K*N) iterations (where K is the number of categories) on every render, including during unrelated state changes like search input.
**Action:** Optimize this by consolidating the statistical counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoisting repeated string operations (like `.toLowerCase()`) outside the loop.
