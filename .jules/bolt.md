## 2024-05-22 - [Optimizing Simulation Data Access]
**Learning:** Centralizing access to large static datasets (like simulation JSONs) via a service module with pre-computed indices (Maps) is critical. Direct imports in components/hooks lead to redundant processing (O(N) or O(N*M)) on every render/update.
**Action:** Always check if large JSON data is being processed inside components. Move it to a module-level cache/index and export accessors.
