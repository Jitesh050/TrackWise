## 2024-05-11 - Cache external API calls
**Learning:** The Trip Planner repeatedly queries Geoapify and OpenTripMap APIs for identical lat/lon coordinates when switching components or stations. This architecture causes slow UI updates and redundant network roundtrips. In-memory Maps are a lightweight solution.
**Action:** When working with external API calls that return static or slowly-changing data based on geographical coordinates, always implement a local Map-based cache in the service layer to prevent redundant queries.
