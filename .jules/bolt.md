## 2024-04-02 - Bolt Initialization\n**Learning:** Started performance optimization process.\n**Action:** Follow bolt process.
## 2026-04-02 - Consolidating Filters & Hoisting String Transformations
**Learning:** Found O(3N) pattern of repeated `.filter().length` for statistics generation in `src/pages/TicketManagement.tsx` and redundant string lowercasing inside iteration loops.
**Action:** Consolidated multiple `filter().length` passes into a single `reduce()` object wrapped in `useMemo`, reducing time complexity to O(N). Also hoisted `.toLowerCase()` outside the  loop to avoid redundant recalculation for every array element.
## 2024-04-02 - Consolidating Filters & Hoisting String Transformations
**Learning:** Found O(3N) pattern of repeated `.filter().length` for statistics generation in `src/pages/TicketManagement.tsx` and redundant string lowercasing inside iteration loops.
**Action:** Consolidated multiple `filter().length` passes into a single `reduce()` object wrapped in `useMemo`, reducing time complexity to O(N). Also hoisted `.toLowerCase()` outside the `.filter` loop to avoid redundant recalculation for every array element.
