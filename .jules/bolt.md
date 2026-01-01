# Bolt's Journal

## 2026-01-01 - Frontend Data Processing Bottleneck
**Learning:** Large JSON datasets (simulation data) were being filtered inside a loop in `useTrainStatus` ($O(N \cdot M)$ complexity), causing significant overhead on every update. Pre-indexing data into Maps ($O(1)$ lookup) reduces this to $O(N)$.
**Action:** When handling static datasets in React, always pre-process/index them outside the component or in a memoized singleton to avoid expensive array operations during render cycles.
