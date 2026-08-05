# Graph Report - AI-News  (2026-07-28)

## Corpus Check
- 77 files · ~23,537 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 874 nodes · 883 edges · 63 communities (58 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba1ad31d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- PROJECT_BRIEF.md
- TASK_SKILL_MAPPING.md
- compilerOptions
- compilerOptions
- devDependencies
- SKILLS_INDEX.md
- nextjs.md - Next.js App Router Skill
- dependencies
- Start development server
- react.md - React Patterns Skill
- components.json
- animations.md - Animations Skill
- performance.md - Performance Optimization Skill
- tailwind.md - Tailwind CSS Skill
- Core Rules
- rest-api.md - REST API Design Skill
- accessibility.md - Accessibility Skill
- shadcn.md - Shadcn/UI Skill
- typescript.md - TypeScript Best Practices Skill
- architecture.md - Backend Architecture Skill
- authentication.md - Backend Authentication Skill
- prisma.md - Prisma ORM Skill
- redis.md - Redis Usage Skill
- seo.md - SEO Optimization Skill
- validation.md - Validation Skill
- mcp.json
- package.json
- authorization.md - Backend Authorization Skill
- database.md - Database Design Skill
- rbac.md - Role-Based Access Control Skill
- workers.md - Background Workers Skill
- forms.md - Form Handling Skill
- AI News - AI Assistant Context
- AI News — Roadmap
- caching.md - Caching Strategies Skill
- validation.md - Backend Validation Skill
- Skill Categories
- layout.tsx
- AI News
- AGENTS.md
- FEATURE.md
- ARCHITECTURE.md
- BUGFIX.md
- COMMIT.md
- COMPONENT.md
- DECISION.md
- HANDOFF.md
- SKILL.md
- AI_WORKFLOW.md
- PROJECT_HEALTH.md
- RESEARCH.md
- CHANGELOG.md
- Color Palette
- Typography
- TODO.md
- frontend/README.md
- Branching
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- PROGRESS.md
- verification/SKILL.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `compilerOptions` - 16 edges
3. `nextjs.md - Next.js App Router Skill` - 15 edges
4. `react.md - React Patterns Skill` - 15 edges
5. `architecture.md - Backend Architecture Skill` - 13 edges
6. `authentication.md - Backend Authentication Skill` - 13 edges
7. `database.md - Database Design Skill` - 13 edges
8. `prisma.md - Prisma ORM Skill` - 13 edges
9. `redis.md - Redis Usage Skill` - 13 edges
10. `rest-api.md - REST API Design Skill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ArticleCardProps` --references--> `Article`  [EXTRACTED]
  frontend/src/components/article-card.tsx → frontend/src/lib/types.ts
- `SearchFilterProps` --references--> `Article`  [EXTRACTED]
  frontend/src/components/search-filter.tsx → frontend/src/lib/types.ts
- `Badge()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/components/ui/badge.tsx → frontend/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (63 total, 5 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.08
Nodes (28): ArticlePageProps, CATEGORY_ACCENT, CATEGORY_GRADIENT, STAGGER_CLASSES, ArticleCard(), ArticleCardProps, CATEGORY_ACCENT, CATEGORY_GRADIENTS (+20 more)

### Community 1 - "PROJECT_BRIEF.md"
Cohesion: 0.05
Nodes (38): 10. Token Optimization, 11. Success Criteria, 12. Quick Reference, 1. Project Identity, 2. Current Development Phase, 3. Long-Term Vision, 4. Technology Stack, 5. Development Environment (+30 more)

### Community 2 - "TASK_SKILL_MAPPING.md"
Cohesion: 0.05
Nodes (38): Add Animations, Add Authentication, Add Authorization, Add Caching, Add SEO, AI Tasks, Backend Tasks, Background Jobs (+30 more)

### Community 3 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "SKILLS_INDEX.md"
Cohesion: 0.10
Nodes (14): 2026-07-23, Actions, Changelog, Entry Template, Purpose, Version History, Authentication Chain, Circular Dependency Check (+6 more)

### Community 7 - "nextjs.md - Next.js App Router Skill"
Cohesion: 0.10
Nodes (19): Best Practices, Checklist, Client Component (When Needed), Common Mistakes, Future Improvements, nextjs.md - Next.js App Router Skill, Parallel Data Fetching, Prerequisites (+11 more)

### Community 8 - "dependencies"
Cohesion: 0.11
Nodes (19): class-variance-authority, clsx, dependencies, class-variance-authority, clsx, lucide-react, next, next-themes (+11 more)

### Community 9 - "Start development server"
Cohesion: 0.11
Nodes (18): Actions (8 Steps), Clone the repository, Execution Order, Files Created, Install dependencies, Objective, Phase 0: Critical Setup Plan, Start development server (+10 more)

### Community 10 - "react.md - React Patterns Skill"
Cohesion: 0.11
Nodes (18): Best Practices, Checklist, Common Mistakes, Component Structure, Composition, Custom Hooks, Future Improvements, Prerequisites (+10 more)

### Community 11 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 12 - "animations.md - Animations Skill"
Cohesion: 0.11
Nodes (17): animations.md - Animations Skill, Basic Animation, Best Practices, Checklist, Common Mistakes, Hover Effect, Page Transition, Prerequisites (+9 more)

### Community 13 - "performance.md - Performance Optimization Skill"
Cohesion: 0.11
Nodes (17): Best Practices, Checklist, Code Splitting, Common Mistakes, Font Optimization, Image Optimization, performance.md - Performance Optimization Skill, Prerequisites (+9 more)

### Community 14 - "tailwind.md - Tailwind CSS Skill"
Cohesion: 0.11
Nodes (17): Basic Styling, Best Practices, Checklist, Common Mistakes, Conditional Classes, Dark Mode, Prerequisites, Problem Solved (+9 more)

### Community 15 - "Core Rules"
Cohesion: 0.12
Nodes (16): Common Mistakes, Core Rules, Loading Sequence, MCP Integration, Purpose, Rule 1: Never Load Unrelated Skills, Rule 2: Never Load an Entire Category, Rule 3: Prefer 2-5 Skills Maximum (+8 more)

### Community 16 - "rest-api.md - REST API Design Skill"
Cohesion: 0.12
Nodes (16): Best Practices, Checklist, Common Mistakes, Endpoint Design, Prerequisites, Problem Solved, Project Conventions, Purpose (+8 more)

### Community 17 - "accessibility.md - Accessibility Skill"
Cohesion: 0.12
Nodes (16): accessibility.md - Accessibility Skill, ARIA Labels, Best Practices, Checklist, Common Mistakes, Keyboard Navigation, Prerequisites, Problem Solved (+8 more)

### Community 18 - "shadcn.md - Shadcn/UI Skill"
Cohesion: 0.12
Nodes (16): Adding Components, Best Practices, Checklist, Common Mistakes, Custom Variants, Prerequisites, Problem Solved, Project Conventions (+8 more)

### Community 19 - "typescript.md - TypeScript Best Practices Skill"
Cohesion: 0.12
Nodes (16): Best Practices, Checklist, Common Mistakes, Discriminated Unions, Function Types, Interfaces, Prerequisites, Problem Solved (+8 more)

### Community 20 - "architecture.md - Backend Architecture Skill"
Cohesion: 0.12
Nodes (15): architecture.md - Backend Architecture Skill, Best Practices, Checklist, Common Mistakes, Directory Structure, Layer Pattern, Prerequisites, Problem Solved (+7 more)

### Community 21 - "authentication.md - Backend Authentication Skill"
Cohesion: 0.12
Nodes (15): authentication.md - Backend Authentication Skill, Best Practices, Checklist, Common Mistakes, Password Hashing, Prerequisites, Problem Solved, Project Conventions (+7 more)

### Community 22 - "prisma.md - Prisma ORM Skill"
Cohesion: 0.12
Nodes (15): Best Practices, Checklist, Common Mistakes, Prerequisites, prisma.md - Prisma ORM Skill, Problem Solved, Project Conventions, Purpose (+7 more)

### Community 23 - "redis.md - Redis Usage Skill"
Cohesion: 0.12
Nodes (15): Best Practices, Cache Pattern, Checklist, Common Mistakes, Key Naming, Prerequisites, Problem Solved, Project Conventions (+7 more)

### Community 24 - "seo.md - SEO Optimization Skill"
Cohesion: 0.12
Nodes (15): Best Practices, Checklist, Common Mistakes, Page Metadata, Prerequisites, Problem Solved, Project Conventions, Purpose (+7 more)

### Community 25 - "validation.md - Validation Skill"
Cohesion: 0.12
Nodes (15): Basic Schema, Best Practices, Checklist, Common Mistakes, Complex Validation, Prerequisites, Problem Solved, Project Conventions (+7 more)

### Community 26 - "mcp.json"
Cohesion: 0.17
Nodes (14): npx, uvx, mcp-server-fetch, @modelcontextprotocol/server-filesystem, @modelcontextprotocol/server-sequential-thinking, @playwright/mcp, @upstash/context7-mcp, chrome-devtools (+6 more)

### Community 27 - "package.json"
Cohesion: 0.13
Nodes (14): description, engines, node, name, packageManager, private, scripts, build (+6 more)

### Community 28 - "authorization.md - Backend Authorization Skill"
Cohesion: 0.13
Nodes (14): authorization.md - Backend Authorization Skill, Best Practices, Checklist, Common Mistakes, Middleware Pattern, Prerequisites, Problem Solved, Project Conventions (+6 more)

### Community 29 - "database.md - Database Design Skill"
Cohesion: 0.13
Nodes (14): Best Practices, Checklist, Common Mistakes, database.md - Database Design Skill, Prerequisites, Problem Solved, Project Conventions, Purpose (+6 more)

### Community 30 - "rbac.md - Role-Based Access Control Skill"
Cohesion: 0.13
Nodes (14): Best Practices, Checklist, Common Mistakes, Permission Check, Prerequisites, Problem Solved, Project Conventions, Purpose (+6 more)

### Community 31 - "workers.md - Background Workers Skill"
Cohesion: 0.13
Nodes (14): Best Practices, Checklist, Common Mistakes, Job Definition, Prerequisites, Problem Solved, Project Conventions, Purpose (+6 more)

### Community 32 - "forms.md - Form Handling Skill"
Cohesion: 0.13
Nodes (14): Basic Form, Best Practices, Checklist, Common Mistakes, forms.md - Form Handling Skill, Prerequisites, Problem Solved, Project Conventions (+6 more)

### Community 33 - "AI News - AI Assistant Context"
Cohesion: 0.14
Nodes (13): AI News - AI Assistant Context, Anti-patterns to Avoid, Code Style, Commands (When Framework Added), Conventions, Current State, File Naming, Folder Structure (+5 more)

### Community 34 - "AI News — Roadmap"
Cohesion: 0.14
Nodes (13): AI News — Roadmap, Core pages, Design foundation, Full stack reference, Layout shell, Mock data, PHASE 1 — FRONTEND (mock data, no backend), PHASE 2 — BACKEND (real data, no AI yet) (+5 more)

### Community 35 - "caching.md - Caching Strategies Skill"
Cohesion: 0.14
Nodes (13): Best Practices, caching.md - Caching Strategies Skill, Checklist, Common Mistakes, In-Memory Cache, Prerequisites, Problem Solved, Project Conventions (+5 more)

### Community 36 - "validation.md - Backend Validation Skill"
Cohesion: 0.14
Nodes (13): Best Practices, Checklist, Common Mistakes, Prerequisites, Problem Solved, Project Conventions, Purpose, Related Skills (+5 more)

### Community 37 - "Skill Categories"
Cohesion: 0.14
Nodes (13): AI Skills, Backend Skills, By Size, By Task, Deployment Skills, Frontend Skills, General Skills, Git Skills (+5 more)

### Community 38 - "layout.tsx"
Cohesion: 0.21
Nodes (7): geistMono, geistSans, metadata, Footer(), NAV_LINKS, Navbar(), ThemeProvider()

### Community 39 - "AI News"
Cohesion: 0.20
Nodes (9): AI News, Documentation, Features (Planned), Getting Started, Installation, License, Prerequisites, Project Structure (+1 more)

### Community 40 - "AGENTS.md"
Cohesion: 0.25
Nodes (6): After finishing any task, Before starting any task, Conventions, Do not, Project, Reference docs (open only when the task needs them — do not preload)

### Community 41 - "FEATURE.md"
Cohesion: 0.25
Nodes (7): Description, FEATURE.md, Feature Name, Implementation Plan, Requirements, Status, Testing

### Community 42 - "ARCHITECTURE.md"
Cohesion: 0.29
Nodes (6): ARCHITECTURE.md, Components, Data Flow, Decisions, Overview, Trade-offs

### Community 43 - "BUGFIX.md"
Cohesion: 0.29
Nodes (6): BUGFIX.md, Issue, Root Cause, Solution, Status, Testing

### Community 44 - "COMMIT.md"
Cohesion: 0.29
Nodes (6): Changes, COMMIT.md, Description, Notes, Testing, Type

### Community 45 - "COMPONENT.md"
Cohesion: 0.29
Nodes (6): COMPONENT.md, Component Name, Examples, Props, Purpose, Usage

### Community 46 - "DECISION.md"
Cohesion: 0.29
Nodes (6): Consequences, Context, Decision, DECISION.md, Options Considered, Rationale

### Community 47 - "HANDOFF.md"
Cohesion: 0.29
Nodes (6): Context, Current State, Files Modified, HANDOFF.md, Next Steps, Notes

### Community 48 - "SKILL.md"
Cohesion: 0.29
Nodes (6): Examples, Purpose, SKILL.md, Skill Name, Trigger Conditions, Workflow

### Community 49 - "AI_WORKFLOW.md"
Cohesion: 0.33
Nodes (4): Prompt Engineering, Quality Gates, Review Process, Workflow Phases

### Community 50 - "PROJECT_HEALTH.md"
Cohesion: 0.33
Nodes (4): Blockers, Metrics, Recommendations, Status

### Community 51 - "RESEARCH.md"
Cohesion: 0.33
Nodes (5): Findings, Recommendations, RESEARCH.md, Sources, Topic

### Community 52 - "CHANGELOG.md"
Cohesion: 0.40
Nodes (3): [0.1.0] - 2026-07-23, Added, [Unreleased]

### Community 53 - "Color Palette"
Cohesion: 0.40
Nodes (4): Color Palette, Dark Mode, Light Mode, Notes

### Community 54 - "Typography"
Cohesion: 0.40
Nodes (4): Font Stack, Notes, Type Scale, Typography

### Community 55 - "TODO.md"
Cohesion: 0.40
Nodes (3): Backlog, Completed, Current Sprint

### Community 56 - "frontend/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 57 - "Branching"
Cohesion: 0.50
Nodes (3): Agent Branches, Branching, Workflow

## Knowledge Gaps
- **632 isolated node(s):** `@upstash/context7-mcp`, `@playwright/mcp`, `@modelcontextprotocol/server-sequential-thinking`, `@modelcontextprotocol/server-filesystem`, `uvx` (+627 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `@upstash/context7-mcp`, `@playwright/mcp`, `@modelcontextprotocol/server-sequential-thinking` to the rest of the system?**
  _632 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0824524312896406 - nodes in this community are weakly interconnected._
- **Should `PROJECT_BRIEF.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `TASK_SKILL_MAPPING.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._