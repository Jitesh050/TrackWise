## 2024-05-15 - [Passenger Dashboard Optimization]
**Learning:** Found an opportunity to optimize \`PassengerDashboard.tsx\` by hoisting static Map creation outside the component and consolidating multiple iterations over \`tickets\` into a single \`useMemo\` pass.
**Action:** Lift \`byCode\` station lookup map outside component scope. Compute \`activeBookings\`, \`latestPnr\`, \`nextJourney\`, and \`milesTraveled\` in a single \`useMemo\` hook to prevent redundant O(N) array traversals on every render.
