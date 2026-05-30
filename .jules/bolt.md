## 2024-05-30 - [Performance] Scope Control in Performance Tasks
**Learning:** When a task strictly mandates "ONE performance improvement", modifying build configuration files (like `vite.config.ts`) to fix pre-existing chunk warnings alongside a React component optimization will be rejected as multiple distinct optimizations.
**Action:** Stick strictly to a single optimization layer (e.g., *only* the React component memoization). Do not attempt to fix unrelated build warnings unless they actively block the required CI for the specific code being modified.
