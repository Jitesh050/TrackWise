## 2024-03-24 - SeatSelection Re-render Optimization
**Learning:** `Math.random()` inside a render function causes erratic behavior and unmounting due to changing statuses on every state update.
**Action:** Use `useMemo` to memoize the generated data with an empty dependency array.
## 2024-03-24 - React Spread Props Override False Positives
**Learning:** Automated code review can misinterpret valid React patterns like `<Seat {...seat} isSelected={...} />` where the later prop correctly overrides the spread object, assuming that removing the property from the spread object breaks functionality.
**Action:** When refactoring to memoize list items by dropping dynamic props from the generated objects, explicitly pass all individual props to the child component instead of using the spread operator `{...seat}` to satisfy static analysis.
