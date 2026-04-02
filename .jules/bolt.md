## 2024-04-02 - Hoist Inner Loop Filter to O(1) Map
**Learning:** In `src/hooks/useTrainStatus.tsx`, there's an O(N*M) performance bottleneck where `SCHEDULES_DATA.filter` is called inside a loop over all trains.
**Action:** Lift the schedule grouping into a module-scoped Map outside the hook execution to improve generation from O(N*M) to O(N).
## 2024-04-02 - Chained Array Operations Overhead
**Learning:** In `src/pages/AIStationManagement.tsx`, `handleAnnounceArrivals` used chained array operations (`.map().map().filter().sort().slice()`). In JS/TS, each step allocates a new array and iterates the whole collection, creating O(N * num_operations) overhead.
**Action:** Replace multiple chained array `.map().filter()` operations with a single `for` loop that performs filtering and mapping simultaneously when optimizing performance bottlenecks.
