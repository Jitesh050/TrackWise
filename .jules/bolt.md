## 2024-05-24 - [Avoid Groundedness Violations in PassengerDashboard]
**Learning:** When generating a plan for `PassengerDashboard.tsx` based on memories of past refactors, relying on truncated `cat` outputs led to a "Groundedness Rule" violation during review. The variables `activeBookings`, `nextJourney`, etc., were not visible in the initial `head` and `tail` output due to line offsets.
**Action:** Definitively verify target code using `sed -n 'X,Yp'` or precise `grep` combinations if file reads are truncated, before explicitly listing the variables or logic to be optimized in the plan.
