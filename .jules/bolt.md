## 2023-10-27 - [Optimization of `getAllStationsWithNames` via Caching]
**Learning:** `getAllStationsWithNames` in `src/lib/train-sim.ts` mapped an array of station codes to a new array of objects on every invocation. In components that rely on this for rendering (e.g., `<datalist>` populating in `BookTicket.tsx`), this causes O(N) memory allocations per render.
**Action:** When working with simulated static backend datasets on the client, always cache derived arrays at the module level to avoid GC pressure and O(N) overhead during renders.
