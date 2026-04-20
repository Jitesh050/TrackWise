## 2023-10-27 - [Optimize Component Filter Reductions]
**Learning:** Consolidating multiple O(N) array `.filter().length` passes into a single `.reduce()` pass and wrapping it in `useMemo` significantly reduces unnecessary recalculations on every render, especially on unmemoized dynamic inputs (like search bars). Hoisting static string transformations like `.toLowerCase()` outside the loop also improves performance.
**Action:** Always look for O(N) loops during render inside React components and attempt to collapse them into single passes with `reduce` combined with `useMemo`.
