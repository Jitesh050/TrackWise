## 2024-12-25 - [Hoisting Static Data Aggregation in React Renders]
**Learning:** Re-processing static large imported JSON inside component render functions leads to unnecessary O(M) processing (where M is static data length) every time the component updates with O(N) dynamic data.
**Action:** Hoist static data aggregation (like schedule grouping and sorting) outside the component and consolidate dynamic array passes into a single `useMemo` hook.
