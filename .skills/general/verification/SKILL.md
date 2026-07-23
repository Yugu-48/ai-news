---
name: verification
description: Use before marking any FD/BD step complete or writing a PROGRESS.md entry — confirms the work actually runs before it's logged as done.
---

# Verification

Before writing a PROGRESS.md entry that marks a step complete:

1. Run the app (`pnpm dev`) or build (`pnpm build`) — confirm no errors in the terminal output. Don't assume it works because the code "looks right."
2. If the step touched a specific page/component, actually load that route and check it renders — don't just check that the file compiles.
3. Run `pnpm lint` if the step added or changed TypeScript/React code. Fix warnings before logging complete, don't leave them for later.
4. If a step's task description includes a specific check (e.g. FD19 — Lighthouse, FD17 — accessibility), run that specific check. Passing the build is not enough for those steps.
5. If verification fails: fix it before logging PROGRESS.md, or log it as "blocked" with the actual error — never log a step as complete when it isn't.

Never write "done" based on the code looking correct. Only write "done" based on having run it.
