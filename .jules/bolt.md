## 2024-06-25 - Single loop O(N) Array Operations
**Learning:** O(N) Array operations running sequentially across different variables are easy to write synchronously but can scale terribly inside React render components leading to degraded UI.
**Action:** Use a single `useMemo` instance to calculate them all sequentially with one loop over the parent dataset to avoid heavy computational blocking and multiple allocations.
