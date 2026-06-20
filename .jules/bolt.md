## 2024-03-24 - LiveTrainStatus component
**Learning:** `mapStatusToCard` was recreated on every render in `LiveTrainStatus`, and multiple string transformations and array filtering functions were executed synchronously inside the render cycle.
**Action:** Move static utility functions out of the component scope and wrap expensive derived state like array filtering in `useMemo` hooks with tight dependency arrays, ensuring string `.toLowerCase()` evaluations are hoisted out of the O(N) array filter loops.
