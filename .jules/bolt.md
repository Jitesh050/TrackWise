## 2026-02-17 - Caching Empty Results
**Learning:** Returning early on empty API responses (e.g., `[]`) often bypasses caching logic placed at the end of a function, leading to repeated fetches for "no results".
**Action:** Always ensure caching logic covers all return paths, or refactor to a single exit point where caching occurs.
