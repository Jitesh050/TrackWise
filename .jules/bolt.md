## 2024-05-24 - [Avoid Groundedness Violations in PassengerDashboard]
**Learning:** When generating a plan for `PassengerDashboard.tsx` based on memories of past refactors, relying on truncated `cat` outputs led to a "Groundedness Rule" violation during review. The variables `activeBookings`, `nextJourney`, etc., were not visible in the initial `head` and `tail` output due to line offsets.
**Action:** Definitively verify target code using `sed -n 'X,Yp'` or precise `grep` combinations if file reads are truncated, before explicitly listing the variables or logic to be optimized in the plan.
## 2024-05-24 - [Netlify Header/Redirect Rules deploy failure]
**Learning:** Netlify SPA applications using React Router require an `_redirects` file with `/* /index.html 200` to be present in the `dist` or `public` output directory so that direct navigation to subpages works. If this file is missing, the "Header rules" and "Redirect rules" checks may fail in Netlify CI deployments.
**Action:** Add an `_redirects` file to the `public/` directory so it is copied directly to `dist/` on build.
