## 2024-03-24 - [Auto-fix Hazards]
**Learning:** Running `eslint --fix` can remove intended, codebase-specific `eslint-disable` overrides in entirely out-of-scope files. In strict CI environments like Netlify that treat lint warnings/errors as build failures, this can unexpectedly break compilation in unrelated modules and cause a code review rejection.
**Action:** Always selectively run lint on the modified files, or thoroughly vet and revert all unstaged changes (e.g. `git checkout HEAD <files>`) to out-of-scope files before committing.
