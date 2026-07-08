## 2024-05-18 - Optimize Component Static Arrays & Filtering
**Learning:** Performance can be optimized by avoiding redundant O(N) array `.filter().length` evaluations, computing static statistics in a single pass while filtering, moving static arrays outside the component scope to avoid allocations on every render, and hoisting the term `.toLowerCase()` outside of a list loop.
**Action:** When finding multiple `.filter(condition).length` lines for stats alongside general list filtering, refactor them into a single pass block using `useMemo` that evaluates all constraints at once.
