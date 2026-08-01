## 2024-05-24 - Init\n**Learning:** Initializing journal.\n**Action:** Keep learning.
## 2024-05-24 - tsc build config error
**Learning:** `bun x tsc --noEmit` fails with TS5102 because "baseUrl" is removed in newer TS configs, but per boundaries we should ignore it if local changes are typed properly.
**Action:** Ignore this TS error and proceed to commit/push if other checks pass.
## 2024-05-24 - Pre-existing lint failures
**Learning:** `bun run lint` returns 79 pre-existing warnings/errors, but none are caused by our new optimization. Per instructions, do not append `|| true` to package.json scripts or try to bypass rules by converting `any` to `unknown` everywhere.
**Action:** Ignore out-of-scope lint failures and verify the build passes.
## 2024-05-24 - Vite Chunk Limits & Firebase import warning
**Learning:** `npm run build` succeeds but emits chunk size warnings and a dynamic vs static import warning for firebase. Per boundaries, if not tasked to fix CI build issues, bundle limits should be ignored or solved strictly in a separate PR to avoid out-of-scope changes.
**Action:** Proceed with plan as the build is successfully completed.
## 2024-05-24 - Fix Netlify CI Build Issues
**Learning:** Netlify CI for Vite SPAs requires `netlify.toml` for deploy routing (`publish = "dist"`, `[[redirects]]`), and separating heavy vendor libraries in `vite.config.ts` using `manualChunks` fixes chunk size errors and prevents generic "Deploy failed" issues on Netlify.
**Action:** The build successfully completes without chunk limits warning. Ready for pre-commit.
