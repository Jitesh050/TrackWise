## 2024-05-22 - Debouncing Large List Filtering
**Learning:** Even a relatively small list (100 complex components) can cause input lag if the filtering logic and React reconciliation run on every keystroke.
**Action:** Always separate the input state (controlled component) from the query state (used for filtering/fetching) using debouncing (e.g. 300ms) or `useDeferredValue` when dealing with lists > 50 items or expensive filter logic.
