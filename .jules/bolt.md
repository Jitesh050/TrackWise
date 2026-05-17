
## 2024-05-17 - Prevent redundant allocations in module-level getter functions
**Learning:** Functions that provide static data (like `getAllStationsWithNames()`) using array transformations like `.map()` will create a new array instance on every call. In React components (e.g., `BookTicket.tsx`), calling these during render results in unnecessary O(N) array allocations and garbage collection overhead.
**Action:** Always cache the results of static data transformations at the module level when the underlying data is immutable.
