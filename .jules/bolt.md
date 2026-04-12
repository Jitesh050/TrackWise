## 2024-03-24 - [Auto-fix Hazards]
**Learning:** Running `eslint --fix` can remove intended, codebase-specific `eslint-disable` overrides in entirely out-of-scope files. In strict CI environments like Netlify that treat lint warnings/errors as build failures, this can unexpectedly break compilation in unrelated modules and cause a code review rejection.
**Action:** Always selectively run lint on the modified files, or thoroughly vet and revert all unstaged changes (e.g. `git checkout HEAD <files>`) to out-of-scope files before committing.

## 2024-03-24 - [Avoid removing dynamic imports for build size optimization]
**Learning:** Converting a heavy dynamic import like `await import("firebase/auth")` into a static import `import { auth } from "@/lib/firebase"` inside event handlers (like login) causes the bundler to include the heavy module in the main bundle. This completely defeats the original purpose of the dynamic import, resulting in an anti-pattern that increases initial page load time instead of making the application faster.
**Action:** When a linter or bundler complains about dynamic imports overlapping with static imports, address the bundler config (e.g. `manualChunks`) to group them efficiently, rather than blindly converting deferred imports into eagerly loaded static imports which hurts performance.
