## 2024-03-16 - [Optimize Redundant Filter Transformations]
**Learning:** React renders can be slow when .toLowerCase() is performed multiple times redundantly inside array .filter() functions that run on every keystroke, leading to high CPU usage on typing.
**Action:** Extract .toLowerCase() and static string processing variables outside loops, and always wrap computationally heavy component-level array transformations in useMemo hooks.
