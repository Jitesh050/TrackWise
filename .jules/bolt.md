## 2025-02-18 - Trust Code Over Memory
**Learning:** The system memory stated that `TouristSpotService` and `HotelService` utilized in-memory caching, but the actual code did not. This discrepancy highlights the importance of verifying memory claims against the actual codebase.
**Action:** Always verify "known" architectural details by reading the source code before assuming they are implemented.

## 2025-02-18 - Static Caching for API Services
**Learning:** API services with idempotent read operations (`TouristSpotService`, `HotelService`) significantly benefit from simple static in-memory caching (`Map`), reducing latency from ~100ms (network) to ~0.05ms (cache). Deep cloning (`JSON.parse(JSON.stringify)`) ensures state safety.
**Action:** Look for other read-heavy, low-cardinality API calls to apply similar caching patterns.
