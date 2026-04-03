## 2024-04-03 - [Optimize React Component Re-renders]
**Learning:** Found multiple redundant `filter(x => ...).length` array passes inside render functions in React components using large or static mock datasets.
**Action:** Consolidate these static data sets by hoisting them outside the component to avoid recreation, and bundle multiple array `.filter().length` calculations into a single `.reduce()` loop wrapped inside a `useMemo` block. Also remember to hoist string transformations like `.toLowerCase()` outside the iterate loop.
