## 2024-05-22 - O(N*M) Lookup in Simulation Loop
**Learning:** Frontend simulation logic iterating over mock data often skips indexing. In `useTrainStatus`, filtering a large schedule array inside a train loop caused massive overhead.
**Action:** Always pre-group static/mock data into Maps (O(1) lookup) at the module level if possible, especially for recurring operations like simulation ticks.
