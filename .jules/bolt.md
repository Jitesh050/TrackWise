## 2024-05-18 - Component-Level Static Map Reallocation
**Learning:** React components that repeatedly map over large static data arrays (e.g., `stations`) to build dictionaries (like `STATIONS_BY_CODE`) on every render introduce significant O(N) reallocation overhead.
**Action:** Always hoist static dictionary lookups, Maps, and Sets out of the component scope to module level, preventing redundant object creation during fast re-renders.
