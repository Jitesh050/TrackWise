## 2024-05-22 - [Broken ESLint Rule]
**Learning:** `npm run lint` fails due to `TypeError` in `@typescript-eslint/no-unused-expressions`, likely a version incompatibility in `eslint-plugin`.
**Action:** When verifying, use `npx eslint <file>` or rely on manual checks if global lint is broken, but do not attempt to fix global config without explicit instruction as it may be out of scope.

## 2024-05-22 - [Inverted Index for Train Search]
**Learning:** Even with small datasets (100 trains), iterating all items for search is measurably slower (3x) than using an inverted index.
**Action:** Always prefer O(1) or O(M) lookups over O(N) scans for core search functions, even if N seems small, as it sets a scalable pattern.
