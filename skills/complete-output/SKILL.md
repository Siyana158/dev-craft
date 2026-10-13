---
name: complete-output
description: Deliver exactly what was asked, in full, with nothing truncated, stubbed or hand-waved. Use when the request is for complete files, whole implementations, several components or sections, long documents, or anything where "and the rest is similar" would be a failure. Works by agreeing a delivery list up front and checking it off at the end.
---

# complete-output

A response is finished when every promised item exists in usable form, not when it feels long enough. This skill makes that checkable.

## 1. Delivery list (do this first)
Turn the request into a numbered list of concrete deliverables: each file, function, component, section, test or answer. Keep the list in the working notes (or at the top of the reply when the user benefits from seeing it). If the request is ambiguous about count or scope, state the interpretation you chose in one line and proceed; ask only if the choice changes the work substantially.

## 2. Build each item to its final form
- Code is complete and runnable: real bodies, real imports, real error handling where the surrounding code has it.
- Repeated structure is written out, not described. Ten similar components means ten components.
- Prefer writing large deliverables to files with the file tools, one file per call, then summarise paths. This avoids chat length limits and leaves the user with real artifacts.
- When editing existing files, make each edit whole. Never leave an edit half-applied.

## 3. Forbidden shortcuts
These are failures, whether they appear in code, prose or comments:
- Stand-ins for missing code: `...`, `// rest of the code`, `// same as above`, `// implement later`, `TODO`, `pass`, empty bodies, `throw new Error('not implemented')`.
- Stand-ins for missing writing: "etc." or "and so on" replacing listed content, "for brevity", "the remaining follow the same pattern", "left as an exercise", placeholder text such as Lorem ipsum.
- Sampling instead of delivering: first and last items with the middle skipped, one worked example plus a description of the others, a skeleton when an implementation was requested.
- Deferring to the user: "let me know if you want the rest", "I can expand on this if needed" in place of the content itself.
Scaffolding the user explicitly asked for (a stub, a TODO list, an outline) is a deliverable, not a shortcut.

## 4. Close-out audit
Before replying, compare against the delivery list and print a short ledger:

```
1. src/Header.tsx        done, builds
2. src/Footer.tsx        done, builds
3. tests/header.test.ts  done, not run (no test runner configured)
```
Every line has one of: **done and verified**, **done, not verified (reason)**, or **not done (reason)**. Verification means actually running the build, tests, linter or page. Never mark an item verified from reading alone.

## 5. When output must be split
If a single response cannot hold everything:
- Stop at a clean boundary (end of a file, function or section). Do not compress the remainder to squeeze it in.
- Finish with one line: `CONTINUE-FROM: <next item> (<n> of <total> done)`.
- On "continue", resume at that item with no recap and no repetition.

## 6. Honesty overrides completeness
If something cannot be completed (missing information, no access, contradictory requirements), say so in the ledger and state the assumption made. Do not fill the gap with invented data, fake citations, fabricated test results or placeholder values presented as real.
