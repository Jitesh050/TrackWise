
## 2024-05-18 - [Optimize user stats calculation and filtering in UserManagement]
**Learning:** Found another instance of the anti-pattern where components perform multiple `array.filter(condition).length` passes inside the render cycle to compute statistics alongside general list filtering. This specific component also recalculated `toLowerCase()` inside the filter loop and recreated the mock `users` array on every render.
**Action:** Use `useMemo` with a single `.reduce()` pass for statistics. Wrap the static array and filtered output in `useMemo` hooks, and hoist string operations outside loops.
