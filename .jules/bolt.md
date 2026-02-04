## 2024-05-22 - [API Caching Implementation]
**Learning:** In-memory caching for repeated API calls (like `TouristSpotService` and `HotelService`) can drastically reduce latency (10x speedup) and API usage (90% reduction).
**Action:** When implementing caching, always include all parameters that affect the result (like `radius`) in the cache key to prevent stale/incorrect data.
