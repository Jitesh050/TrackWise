## YYYY-MM-DD - [Optimizing O(N) array filtering in loops]
**Learning:** `useTrainStatus` was performing `SCHEDULES_DATA.filter((s) => s.train_no === trainNo)` inside the `TRAINS_DATA.forEach` loop. This resulted in O(N*M) complexity on every render or status update interval.
**Action:** Replace `SCHEDULES_DATA.filter` with a Map initialized outside the `generateLiveStatus` function.
