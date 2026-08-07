## 2024-05-18 - Avoid optimizing mock data
**Learning:** Optimizing static array data marked as mock data (e.g., `// Mock data - in real app, this would come from API`) destined to become stateful API data provides zero real-world benefit and violates rules against premature micro-optimization.
**Action:** Do not hoist or precompute mock data into module level Maps or arrays if it's meant to be replaced by dynamic data later. Focus on optimizing existing code patterns like multiple iterative loops for metrics and filtering that run inside functional components.

## 2024-05-18 - Single pass metric & filter calculation
**Learning:** React components in this codebase frequently use multiple `array.filter(condition).length` passes alongside list filtering during render to calculate metrics.
**Action:** Optimize these anti-patterns by wrapping them in a single `useMemo` loop with `reduce()` that computes both the statistics and the filtered list in a single pass O(N) instead of O(C * N) where C is the number of categories.

## 2024-05-18 - Hoist Expensive Loops & Static Data Transformations
**Learning:** Re-computing `.toLowerCase()` repeatedly inside an array iteration/filter process within the render lifecycle adds unnecessary overhead.
**Action:** Hoist the string normalization (like `searchTerm.toLowerCase()`) outside the loop or `.filter()` evaluation.

## 2024-05-18 - Strictly specify plan steps
**Learning:** Using 'or' logic or failing to name explicit shell scripts in verification instructions can cause `request_plan_review` errors.
**Action:** Be precise. Always state commands exactly, e.g. "Run `bun run lint` and `bun x tsc --noEmit` and `npm run build`" instead of abstract options.
