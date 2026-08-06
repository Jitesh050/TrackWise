## 2024-05-15 - Bolt's Initial Journal
**Learning:** Mutating an external array (e.g. \`arr.sort()\`) inside a \`useMemo\` block during the React render phase is an anti-pattern. Pre-sort static data at the module level when hoisting computations.
**Action:** Always verify that hoisted static data is not mutated within React render lifecycle methods like \`useMemo\`.
