## 2024-01-01 - O(N*M) to O(N+M) Data Processing
**Learning:** Simulation data processing inside hooks can inadvertently create O(N*M) complexities when filtering arrays inside loops. Pre-grouping data into Maps is a critical pattern for this codebase.
**Action:** Always check `src/lib/train-sim.ts` for existing data structures or build module-level Maps for static JSON data.

## 2024-01-01 - Package.json Restrictions
**Learning:** `package.json` must not be modified even for tooling like `typescript`. This limits the ability to run `tsc` in CI/CD if not already present.
**Action:** Rely on existing tools or `bun` which has built-in TS support for running scripts.
