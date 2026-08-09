## 2024-05-19 - Optimizing Component with Maps and Consolidating Array passes
**Learning:** Found multiple expensive O(N) array filtering and sorting passes being executed directly on the render path, combined with local static data allocation.
**Action:** When working on React components, use useMemo to consolidate multiple related iterations into a single O(N) loop and replace sorts with single-pass min/max functions. Hoist static data lookups outside of components as globals to avoid reallocation on each render.
