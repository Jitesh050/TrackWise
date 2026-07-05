## 2024-07-05 - [SeatSelection Re-render Bug]
**Learning:** Component `SeatSelection` had unmemoized mock data generation using `Math.random()` that ran on every render.
**Action:** Always wrap randomly generated mock data or complex groupings in `useMemo` with an empty dependency array to prevent UI state resets and avoid redundant array allocation.
