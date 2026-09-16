## 2024-05-19 - UseMemo over derived state in TrainStatus
**Learning:** The `TrainStatus` component previously used `useEffect` to derive `filteredTrains` state from `trains`, `searchQuery`, and `activeTab`. This is a React anti-pattern that causes double renders (one for the dependency change, one for the subsequent `setFilteredTrains`).
**Action:** Replace derived state maintained in `useState`/`useEffect` with synchronous `useMemo` blocks to prevent unnecessary render cycles, and use `.reduce()` to consolidate multiple mapping and filtering passes into a single O(N) iteration.
