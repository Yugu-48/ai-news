# AGENTS.md

## Project
AI News — Next.js/TypeScript/Tailwind AI news platform.
Full step-by-step plan: see ROADMAP.md.

## Before starting any task
1. Read the last 2 entries in PROGRESS.md.
2. Open ROADMAP.md, find the next unchecked step (FD#/BD#).
3. Do ONLY that one step. Never do multiple steps in one run.

## After finishing any task
Append one entry to PROGRESS.md using the format shown in that file.
Never edit or delete past entries.

## Conventions
Detailed conventions live in .agents/skills/ — these load automatically
when a task matches their description. Quick rules: TypeScript strict,
no `any`, named exports for components, Conventional Commits for git.

## Reference docs (open only when the task needs them — do not preload)
- docs/architecture/*.md — system design
- docs/database/schema.md — DB schema (Phase 2+)
- docs/ui/*.md — design tokens
- docs/decisions/ADR-*.md — why past decisions were made

## Do not
- Do not add new dependencies without explaining why in the commit message.
- Do not touch backend/ during Phase 1.
- Do not create new top-level status/context files — use PROGRESS.md only.
