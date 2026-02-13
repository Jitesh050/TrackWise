## 2025-02-13 - Double Renders in Search Forms
**Learning:** Using `useEffect` to filter lists based on search input creates a double-render: one for the input state update and one for the filtered list state update. This also often leads to re-mapping the entire source list on every keystroke.
**Action:** Always use `useMemo` for derived state like filtered lists. It eliminates the second render and allows memoizing intermediate transformations (like data mapping) to avoid expensive operations on every search interaction.
