## 2026-08-15 - Optimize Multiple Array Passes for Statistics
**Learning:** Found a common anti-pattern where components perform multiple `.filter().length` and `.reduce()` passes over arrays (like `trains` or `users`) during render to calculate statistics, plus a separate pass for list filtering.
**Action:** Combine these multiple passes into a single `.reduce()` pass wrapped in `useMemo` to calculate all stats simultaneously, and hoist the text search evaluation (e.g. `.toLowerCase()`) out of the filtering loop.
## 2026-08-15 - Optimization Scope Constraint
**Learning:** Even if I find an opportunity to fix a global build system warning (like chunk sizes in `vite.config.ts`), doing so alongside a component-level refactor violates the strict constraint to implement 'ONE small performance improvement' per PR. Global build configurations are considered architectural changes and shouldn't be bundled with local refactors.
**Action:** Revert out-of-scope architectural or global changes when asked to submit only one optimization. Focus purely on the component-level logic.
## 2026-08-15 - Handling CI Deployment Failures
**Learning:** Adding both `netlify.toml` and `public/_redirects` to fix SPA routing CI failures is redundant, although effective. Code reviewers will flag this redundancy and out-of-scope files if the task strictly mandates 'one performance optimization', even if the user explicitly provided the CI check suite failure later.
**Action:** When a user explicitly provides a CI deployment failure (like Netlify 'Deploy failed' header/redirect rules), fixing the CI takes priority to get the branch merged. However, ensure the fix is as minimal as possible (e.g. only `netlify.toml`) to avoid redundancy.
