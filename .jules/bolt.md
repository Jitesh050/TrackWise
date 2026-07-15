## 2024-07-15 - Ticket Management Optimization
**Learning:** Found multiple O(N) `.filter().length` passes during renders to generate categorical statistics alongside list filtering in `src/pages/TicketManagement.tsx`. The `searchTerm.toLowerCase()` was also being called inside the filter loop for every item.
**Action:** Consolidate the stat counting and list filtering into a single `.reduce()` pass wrapped in a `useMemo` hook, and hoist repeated string operations like `.toLowerCase()` outside the loop to reduce computational overhead.
## 2024-07-15 - Ticket Management Type Verification
**Learning:** The linter threw errors due to `@typescript-eslint/no-explicit-any` globally, but my optimization in `src/pages/TicketManagement.tsx` was clean and passed typechecking (`bun x tsc --noEmit` compiled without errors before checking `tsconfig.json` config). The build command succeeded successfully as well.
**Action:** Ignore global linting errors that are pre-existing and out of scope, as modifying `package.json` or the global lint configuration is strictly prohibited for out-of-scope tasks.
