## 2026-06-18 - [Optimize LiveTrainStatus generation]
**Learning:** The `generateLiveStatus` loop heavily utilized `SCHEDULES_DATA.filter` for O(N*M) lookups inside an interval. Pre-computing this at the module-level to an O(1) Map (`SCHEDULES_BY_TRAIN`) significantly reduced computational overhead without sacrificing readability.
**Action:** Always look to hoist static data transformations that group or filter related entities out of interval/render loops and into module-level Maps.
