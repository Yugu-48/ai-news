# AGENTS.md

## Project
AI News is a Next.js 16, React 19, TypeScript, Tailwind 4 and Prisma 6 news prototype. Preserve the existing architecture and working components. `ROADMAP.md` records the original staged plan; `TASKS.md` tracks the current prototype brief and verified status.

## Before starting any task
1. Read the last two entries in `PROGRESS.md` and inspect `TASKS.md`.
2. Inspect affected source files before editing. Work through P0 priorities; keep changes small and testable.
3. Verify each completed task and record exact files, commands and outcomes in `TASKS.md`. Never mark an untested capability complete.

## After finishing any task
Append one entry to PROGRESS.md using the format shown in that file.
Never edit or delete past entries.

## Conventions
Use TypeScript strict, no `any`, named exports for components, server-side secrets and ingestion, and accessible responsive UI. Reuse existing components and avoid unnecessary dependencies. Run typecheck, lint, build and focused interaction checks after relevant changes. Never represent mock stories as live.

## Reference docs (open only when the task needs them — do not preload)
- docs/architecture/*.md — system design
- docs/database/schema.md — DB schema (Phase 2+)
- docs/ui/*.md — design tokens
- docs/decisions/ADR-*.md — why past decisions were made

## Do not
- Do not execute Git or other version-control commands. The owner manages version control.
- Do not scrape full copyrighted articles or bypass source access controls.
- Do not expose database credentials or ingestion secrets to browser code.
- Document new dependencies in `TASKS.md` and `README.md`.
