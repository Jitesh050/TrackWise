## 2024-01-01 - O(N*M) Filtering in Simulation Loop
**Learning:** Frequent recalculation (e.g., simulation loops) performing array filtering inside another loop (O(N*M)) can severely degrade performance, even with modest datasets.
**Action:** Always pre-index static or semi-static data into Maps or Records for O(1) lookups before entering loops.
