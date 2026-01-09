## 2024-05-22 - [Cache Empty Results]
**Learning:** When implementing caching for API calls, always remember to cache "empty" results (like empty arrays) if they are valid responses. I initially missed this, causing the application to re-fetch even when we knew there were no results, negating the performance benefit for sparse data regions.
**Action:** Always verify if "not found" or "empty" is a cacheable state.
