# Graph Report - AI-News  (2026-10-23)

## Corpus Check
- 140 files · ~110,360 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1121 nodes · 1432 edges · 92 communities (71 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a969984c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- home-feed.tsx
- PROJECT_BRIEF.md
- TASK_SKILL_MAPPING.md
- compilerOptions
- compilerOptions
- devDependencies
- caching.md - Caching Strategies Skill
- nextjs.md - Next.js App Router Skill
- dependencies
- Database Schema — AI News Platform
- react.md - React Patterns Skill
- components.json
- animations.md - Animations Skill
- performance.md - Performance Optimization Skill
- tailwind.md - Tailwind CSS Skill
- Core Rules
- Skill Categories
- accessibility.md - Accessibility Skill
- shadcn.md - Shadcn/UI Skill
- typescript.md - TypeScript Best Practices Skill
- architecture.md - Backend Architecture Skill
- authentication.md - Backend Authentication Skill
- prisma.md - Prisma ORM Skill
- redis.md - Redis Usage Skill
- seo.md - SEO Optimization Skill
- validation.md - Validation Skill
- seed.ts
- package.json
- rest-api.md - REST API Design Skill
- database.md - Database Design Skill
- rbac.md - Role-Based Access Control Skill
- workers.md - Background Workers Skill
- forms.md - Form Handling Skill
- AI News - AI Assistant Context
- AI News — Roadmap
- authorization.md - Backend Authorization Skill
- ingest.ts
- rules/graphify.md
- layout.tsx
- AI News implementation tracker
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
- workflows/graphify.md
- loading.tsx
- capture-mobile.mjs
- Verification record — 2026-10-09
- ARCHITECTURE.md
- DEPLOYMENT.md
- NEWS_SOURCES.md
- RESEARCH.md
- UI_SPEC.md
- use-article-selection.ts
- button.tsx
- validation.md - Backend Validation Skill
- start-demo.mjs
- scripts
- SKILL_DEPENDENCIES.md
- SKILL_CHANGELOG.md
- Editorial news desk
- frontend/package.json
- SKILLS_INDEX.md
- COLOR_DIRECTION.md
- fast-xml-parser
- react-dom
- Best Practices
- react
- verify-preview.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Article` - 26 edges
2. `HomeFeed()` - 21 edges
3. `fetchArticles()` - 18 edges
4. `compilerOptions` - 17 edges
5. `compilerOptions` - 16 edges
6. `nextjs.md - Next.js App Router Skill` - 15 edges
7. `react.md - React Patterns Skill` - 15 edges
8. `useArticleSelection()` - 13 edges
9. `architecture.md - Backend Architecture Skill` - 13 edges
10. `authentication.md - Backend Authentication Skill` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ingestSources()` --indirect_call--> `source()`  [INFERRED]
  frontend/src/lib/news/ingest-core.ts → frontend/tests/ingestion.test.mjs
- `GET()` --calls--> `calculateTrendingScore()`  [EXTRACTED]
  frontend/src/app/api/articles/route.ts → frontend/src/lib/feed-model.ts
- `LikedPage()` --calls--> `fetchArticles()`  [EXTRACTED]
  frontend/src/app/liked/page.tsx → frontend/src/lib/articles.ts
- `generateMetadata()` --calls--> `categoryFromSlug()`  [EXTRACTED]
  frontend/src/app/news/[category]/page.tsx → frontend/src/lib/feed-model.ts
- `AllNewsPage()` --calls--> `fetchArticles()`  [EXTRACTED]
  frontend/src/app/news/page.tsx → frontend/src/lib/articles.ts

## Import Cycles
- None detected.

## Communities (92 total, 21 thin omitted)

### Community 0 - "home-feed.tsx"
Cohesion: 0.05
Nodes (69): ArticlePage(), ArticlePageProps, generateMetadata(), getArticleBySlug, getRelatedArticles(), LikedPage(), metadata, CategoryPage() (+61 more)

### Community 1 - "PROJECT_BRIEF.md"
Cohesion: 0.05
Nodes (38): 10. Token Optimization, 11. Success Criteria, 12. Quick Reference, 1. Project Identity, 2. Current Development Phase, 3. Long-Term Vision, 4. Technology Stack, 5. Development Environment (+30 more)

### Community 2 - "TASK_SKILL_MAPPING.md"
Cohesion: 0.05
Nodes (38): Add Animations, Add Authentication, Add Authorization, Add Caching, Add SEO, AI Tasks, Backend Tasks, Background Jobs (+30 more)

### Community 3 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+22 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 5 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, prisma, tailwindcss, @tailwindcss/postcss (+11 more)

### Community 6 - "caching.md - Caching Strategies Skill"
Cohesion: 0.14
Nodes (13): Best Practices, caching.md - Caching Strategies Skill, Checklist, Common Mistakes, In-Memory Cache, Prerequisites, Problem Solved, Project Conventions (+5 more)

### Community 7 - "nextjs.md - Next.js App Router Skill"
Cohesion: 0.10
Nodes (19): Best Practices, Checklist, Client Component (When Needed), Common Mistakes, Future Improvements, nextjs.md - Next.js App Router Skill, Parallel Data Fetching, Prerequisites (+11 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (17): class-variance-authority, clsx, dependencies, class-variance-authority, clsx, lucide-react, next, next-themes (+9 more)

### Community 9 - "Database Schema — AI News Platform"
Cohesion: 0.10
Nodes (19): 1. `sources` — RSS Feed Sources, 2. `articles` — News Articles, 3. `tags` — Taxonomy Tags, 4. `article_tags` — Join Table, 5. `profiles` — User Profiles (Supabase Auth), 6. `user_bookmarks` — Saved Articles, 7. `reading_history` — Article Read Tracking, Database Schema — AI News Platform (+11 more)

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

### Community 16 - "Skill Categories"
Cohesion: 0.22
Nodes (9): AI Skills, Backend Skills, Deployment Skills, Frontend Skills, General Skills, Git Skills, Quality Skills, Security Skills (+1 more)

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

### Community 27 - "package.json"
Cohesion: 0.13
Nodes (14): description, engines, node, name, packageManager, private, scripts, build (+6 more)

### Community 28 - "rest-api.md - REST API Design Skill"
Cohesion: 0.12
Nodes (16): Best Practices, Checklist, Common Mistakes, Endpoint Design, Prerequisites, Problem Solved, Project Conventions, Purpose (+8 more)

### Community 29 - "database.md - Database Design Skill"
Cohesion: 0.13
Nodes (14): Best Practices, Checklist, Common Mistakes, database.md - Database Design Skill, Prerequisites, Problem Solved, Project Conventions, Purpose (+6 more)

### Community 30 - "rbac.md - Role-Based Access Control Skill"
Cohesion: 0.13
Nodes (14): Best Practices, Checklist, Common Mistakes, Permission Check, Prerequisites, Problem Solved, Project Conventions, Purpose (+6 more)

### Community 31 - "workers.md - Background Workers Skill"
Cohesion: 0.18
Nodes (11): Checklist, Common Mistakes, Prerequisites, Problem Solved, Project Conventions, Purpose, Related Skills, Rules (+3 more)

### Community 32 - "forms.md - Form Handling Skill"
Cohesion: 0.13
Nodes (14): Basic Form, Best Practices, Checklist, Common Mistakes, forms.md - Form Handling Skill, Prerequisites, Problem Solved, Project Conventions (+6 more)

### Community 33 - "AI News - AI Assistant Context"
Cohesion: 0.14
Nodes (13): AI News - AI Assistant Context, Anti-patterns to Avoid, Code Style, Commands (When Framework Added), Conventions, Current State, File Naming, Folder Structure (+5 more)

### Community 34 - "AI News — Roadmap"
Cohesion: 0.14
Nodes (13): AI News — Roadmap, Core pages, Design foundation, Full stack reference, Layout shell, Mock data, PHASE 1 — FRONTEND (mock data, no backend), PHASE 2 — BACKEND (real data, no AI yet) (+5 more)

### Community 35 - "authorization.md - Backend Authorization Skill"
Cohesion: 0.13
Nodes (14): authorization.md - Backend Authorization Skill, Best Practices, Checklist, Common Mistakes, Middleware Pattern, Prerequisites, Problem Solved, Project Conventions (+6 more)

### Community 36 - "ingest.ts"
Cohesion: 0.06
Nodes (60): args, categoryCounts, dbConfig, isDryRun, sourceArg, startTime, GET(), executeIngest() (+52 more)

### Community 38 - "layout.tsx"
Cohesion: 0.17
Nodes (8): metadata, Footer(), NAV_LINKS, Navbar(), subscribe(), NewsletterModal(), NewsletterModalProps, ThemeProvider()

### Community 39 - "AI News implementation tracker"
Cohesion: 0.10
Nodes (19): AI News, Checks, Development, Editorial reader, Local setup, Teacher demo (Windows terminal), AI News implementation tracker, Browser startup — 2026-10-12 (+11 more)

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

### Community 65 - "capture-mobile.mjs"
Cohesion: 0.33
Nodes (4): pending, socket, tabs, target

### Community 74 - "use-article-selection.ts"
Cohesion: 0.26
Nodes (16): mergeLibraryArticles(), parseSelectionIds(), parseStoredArticles(), selectLibraryArticles(), toggleSelection(), emptySnapshot(), memory, read() (+8 more)

### Community 75 - "button.tsx"
Cohesion: 0.11
Nodes (16): ShareButton(), Badge(), BadgeProps, badgeVariants, Button, ButtonProps, buttonVariants, Card (+8 more)

### Community 76 - "validation.md - Backend Validation Skill"
Cohesion: 0.14
Nodes (13): Best Practices, Checklist, Common Mistakes, Prerequisites, Problem Solved, Project Conventions, Purpose, Related Skills (+5 more)

### Community 77 - "start-demo.mjs"
Cohesion: 0.18
Nodes (8): args, frontend, [major, minor], marker, next, port, portArgument, root

### Community 78 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, ingest, lint, start, test

### Community 79 - "SKILL_DEPENDENCIES.md"
Cohesion: 0.22
Nodes (8): Authentication Chain, Circular Dependency Check, Database Chain, Prerequisite Chains, Purpose, Rules, Search Chain, Skill Dependency Graph

### Community 80 - "SKILL_CHANGELOG.md"
Cohesion: 0.25
Nodes (6): 2026-07-23, Actions, Changelog, Entry Template, Purpose, Version History

### Community 81 - "Editorial news desk"
Cohesion: 0.33
Nodes (5): Design, Editorial news desk, Reader behavior, Updates and performance, Verification

### Community 83 - "frontend/package.json"
Cohesion: 0.50
Nodes (3): name, private, version

### Community 84 - "SKILLS_INDEX.md"
Cohesion: 0.40
Nodes (4): By Size, By Task, Purpose, Quick Reference

### Community 88 - "Best Practices"
Cohesion: 0.67
Nodes (3): Best Practices, Job Definition, Worker Pattern

## Knowledge Gaps
- **694 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+689 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 2 inferred relationships involving `HomeFeed()` (e.g. with `createFeedState()` and `feedReducer()`) actually correct?**
  _`HomeFeed()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _694 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `home-feed.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05380333951762523 - nodes in this community are weakly interconnected._
- **Should `PROJECT_BRIEF.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `TASK_SKILL_MAPPING.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._