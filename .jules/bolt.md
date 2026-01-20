## 2025-02-23 - Map vs Filter on Simulation Data
**Learning:** The simulation data (trains and schedules) is static but relational. Using `array.filter` inside render loops or frequent intervals is a major bottleneck (O(N*M)). Pre-indexing this data into Maps (O(1)) at the module level is crucial for performance.
**Action:** Always check if relational data in JSONs can be pre-indexed in `lib/` before using it in hooks to avoid expensive repeated filtering.
