## 2024-05-18 - Optimize multiple filter loops
**Learning:** React components often run multiple `array.filter().length` passes inside renders to generate statistics, slowing down renders.
**Action:** Consolidate these stat counting passes into a single `.reduce()` loop wrapped in a `useMemo` hook, and extract static processing like `.toLowerCase()` outside the loop.
