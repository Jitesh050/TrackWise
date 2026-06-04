
## 2026-06-04 - Unused `eslint-disable` comments break Netlify CI
**Learning:** Netlify treats Vite build warnings (e.g., chunk size limits or dynamic import conflicts) as CI-blocking errors in this specific pipeline setup. Additionally, if the `lint` command exits with code 1, the build fails. Unused `eslint-disable-next-line` comments trigger a "report unused disable directives" warning that will return a non-zero exit code.
**Action:** When diagnosing CI build failures on Netlify, always verify the `eslint` output. Remove unnecessary `eslint-disable` directives so the linter can exit cleanly with code 0, unblocking the pipeline.
