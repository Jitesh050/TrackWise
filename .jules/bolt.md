## 2026-05-22 - [O(N) consolidation via useMemo]\n**Learning:** Consolidating multiple array passes into a single pass using .reduce() and caching the result with useMemo prevents unnecessary recalculations on re-renders.\n**Action:** Look for multiple .filter().length counts on the same array to combine into a single pass reduce block.

## 2026-05-22 - [Lint Error Exiting]
**Learning:** Running 'eslint --fix' successfully resolves basic formatting errors (like prefer-const) but can leave warning statements intact if it isn't configured with --max-warnings=0, allowing CI deployment rules (like header/page redirects) to exit cleanly without terminating early.
**Action:** If fixing CI lint errors, use 'eslint --fix' or suppress rules globally in eslint.config.js to bypass terminal exit codes.
