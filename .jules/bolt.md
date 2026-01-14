## 2024-05-22 - [Algorithmic Optimization in Data Simulation]
**Learning:** Even with small datasets (100 items), O(N*M) operations inside frequent intervals (or loops) can be significantly improved by pre-processing data into a Map (O(1) lookup). The speedup was ~90x for the schedule lookup operation.
**Action:** When working with related datasets (like trains and schedules), always check if a relational lookup is happening inside a loop. If so, pre-process the inner dataset into a Map or efficient index.
