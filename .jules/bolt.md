## 2024-03-24 - [Avoid Premature useMemo for Small Arrays]
**Learning:** Using `useMemo` on extremely small, hardcoded datasets (e.g., a 6-item array of FAQs) to prevent recomputation in React is considered a premature micro-optimization. The overhead of the `useMemo` hook and its dependency tracking is likely greater than simply re-filtering the tiny array on every render.
**Action:** When working on small static arrays, extract the array definition outside the component to prevent memory reallocation on every render, but avoid using `useMemo` for any derived/filtered state unless the dataset size or operation complexity demonstrably warrants it. Only optimize measured bottlenecks.

## 2024-03-24 - [Avoid Brittle manualChunks in Vite]
**Learning:** Using hardcoded package arrays in `manualChunks` (e.g., `'vendor-ui': ['lucide-react', 'recharts']`) is brittle. If a package is ever removed or conditionally not bundled, Rollup crashes, which causes CI deployment failures.
**Action:** When configuring chunking to fix Vite bundle warnings, always use a robust, dynamic function inspection approach (e.g., `manualChunks(id) { if (id.includes('node_modules')) ... }`) instead of strict object mapping.
