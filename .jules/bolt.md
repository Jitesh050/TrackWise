## 2026-06-15 - [Vite Build Warnings Crashing Netlify CI]
**Learning:** The project failed Netlify CI deploy due to Vite outputting build warnings ('chunk size > 500kb' and dynamic vs static import conflicts) resulting in a non-zero exit code.
**Action:** Configured build.rollupOptions.output.manualChunks in vite.config.ts to isolate heavy dependencies (firebase, mapbox-gl, recharts, radix-ui) into explicit vendor chunks, thereby resolving the Vite build warnings and unblocking CI.

## 2026-06-15 - [Netlify CI Deploy Redirect Rules Failure]
**Learning:** Netlify CI deployment on SPAs failing with 'Header rules' or 'Redirect rules' errors often occur when the client-side router configuration is missing in the public directory.
**Action:** Added a public/_redirects file containing '/* /index.html 200' to explicitly instruct Netlify to map all paths to the index.html entry point, resolving the CI redirect rule failures.
