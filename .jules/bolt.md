
## 2026-05-25 - [Optimize Food Ordering rendering loops]
**Learning:** In `src/pages/FoodOrdering.tsx`, repeated calculations in loops (specifically `cart.reduce` and `menu.filter` inside `categories.map`) caused O(C * N) time complexity on every render.
**Action:** Consolidate multiple `cart.reduce` iterations into a single memoized grouping pass, and pre-compute `menuByCategory` to convert O(C * N) lookups into O(N) grouping plus O(1) map lookups during render.
