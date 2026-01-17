## 2025-01-26 - Missing API Caching in Service Layer
**Learning:** The `TouristSpotService` and `HotelService` were making redundant network requests to Geoapify for the same inputs, leading to wasted quota and latency.
**Action:** Always verify service layer caching for expensive external API calls, and implement static Map-based caching with defensive copying.
