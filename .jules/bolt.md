## 2024-05-22 - [API Caching Pattern]
**Learning:** Static in-memory caching with simple size-based eviction is highly effective for geo-based API calls in this project. Using `JSON.parse(JSON.stringify())` ensures safety against mutation.
**Action:** Apply this pattern to other expensive, non-user-specific data fetchers.
