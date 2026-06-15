## 2026-06-15 - [FoodOrdering Component Unnecessary Recalculations]
**Learning:** Found an O(N * C) nested filter loop (where N is menu items and C is categories) occurring on every render in FoodOrdering.tsx, and multiple O(N) cart.reduce calls.
**Action:** Consolidate data grouping and aggregations into useMemo hooks to transform O(N * C) into O(1) rendering map lookups.
