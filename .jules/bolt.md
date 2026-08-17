## 2024-05-24 - Node.js Multi-line Patching Fragility
**Learning:** Using JavaScript `.replace()` with regex or multi-line strings to patch components can be highly fragile, often matching earlier or incomplete fragments of code and leading to syntax errors like `Unexpected "}"`.
**Action:** When patching code via Node.js scripts, use precise index-based replacement (`indexOf` + `substring`) targeting a highly unique, complete block of code, and always run `tsc --noEmit` immediately to verify syntax correctness.
