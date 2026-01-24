## 2025-02-18 - [Linting Dependency Mismatch]
**Learning:** The project fails to lint (`npm run lint`) due to a `TypeError` in `@typescript-eslint/no-unused-expressions`. This indicates a version mismatch between ESLint and the TypeScript plugin in the environment.
**Action:** Do not rely solely on `pnpm lint` for verification. Use `npx tsc --noEmit` to check for type safety and `npm run build` to verify the build passes.
