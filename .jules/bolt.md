## 2024-02-28 - Avoid CI failure from build warnings
**Learning:** A Netlify CI build failed after optimization because Vite dynamically importing Firebase (`await import("firebase/auth")`) while it was also statically imported elsewhere created a warning that CI treated as an error (or a similar build-breaking scenario in strict deployments).
**Action:** Always prefer statically importing the configured Firebase instance from `src/lib/firebase` instead of dynamic `await import` if it is already in the bundle.
