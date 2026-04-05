
## 2024-03-24 - [Avoid Mixing Dynamic and Static Imports]
**Learning:** Mixing dynamic imports (e.g., `await import('firebase/auth')`) with static imports of the same module in other files breaks Vite's ability to code-split properly, triggering build warnings that cause Netlify CI to fail.
**Action:** When a heavy dependency is already statically imported (e.g., in `src/lib/firebase.ts`), just import the static instance instead of dynamically importing it again.
