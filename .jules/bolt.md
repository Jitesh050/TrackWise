## 2024-05-20 - Memoization of Derived State
**Learning:** Frequent recalculation of derived state in React components using expensive array operations (e.g. `filter`, `map`) inside the render loop causes unnecessary re-renders and degrades performance, especially as lists grow.
**Action:** Use `useMemo` to memoize the results of these operations, and hoist any static operations (like `toLowerCase()`) outside the inner loop to prevent redundant work on every item.
