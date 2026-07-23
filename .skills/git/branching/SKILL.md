---
name: branching
description: Use when starting any new task in this repo — branch naming and workflow when multiple agents (Antigravity, MiMo, etc.) work in parallel.
---

# Branching

## Agent Branches
Each agent has a dedicated branch. Never commit to main directly.

| Agent | Branch Name |
|-------|-------------|
| MiMo | `mimo` |
| Antigravity | `antigrav` |

**MiMo always commits to `mimo` branch.**
**Antigravity always commits to `antigrav` branch.**

## Workflow
1. Switch to your agent's branch before starting work.
2. Confirm no other active branch touches the same files — check with the user if unsure.
3. Do NOT modify PROGRESS.md on a task branch. PROGRESS.md entries are added manually after merge to main.
4. Push your branch when the task is done.
5. Do not merge to main yourself — the user reviews and merges.
