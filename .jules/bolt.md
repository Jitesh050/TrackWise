## 2024-05-18 - Single-Pass Stat Counting and List Filtering
**Learning:** Components frequently use an anti-pattern of multiple `array.filter(condition).length` passes during renders to generate categorical statistics alongside list filtering.
**Action:** Consolidate stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoist repeated string operations (like `.toLowerCase()`) outside the loop to reduce O(N*M) passes down to a single O(N) pass.
