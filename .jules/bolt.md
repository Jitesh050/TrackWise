## 2024-07-03 - [Missing SeatSelection Memoization]
**Learning:** The `generateSeats()` function in `SeatSelection.tsx` randomly generates seat availability (`Math.random() < 0.3`) on *every single render*.
**Action:** Wrap the generation in a `useMemo` hook so seats persist across re-renders (like when selecting a seat), solving a bug and improving performance.
