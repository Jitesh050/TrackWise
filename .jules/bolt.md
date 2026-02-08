## 2025-01-28 - External API Caching Strategy
**Learning:** External API calls (Geoapify) in `src/lib/apiService.ts` were uncached, causing ~1.7s latency per request. Implementing a simple `Map` cache reduced repeated calls to <1ms. However, caching by raw coordinates is inefficient due to GPS drift, and unbounded Maps cause memory leaks.
**Action:** Always implement: 1) A size limit (e.g., `MAX_CACHE_SIZE = 50`) to prevent leaks, 2) Coordinate rounding (e.g., `toFixed(4)` for ~11m precision) to maximize cache hits, and 3) Defensive copies (`[...cache.get(key)]`) to prevent mutation.
