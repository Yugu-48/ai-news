# AI News implementation tracker

Updated: 2026-10-09. Source code and executed checks determine completion.

| Priority | Task | Status | Acceptance evidence / blocker |
|---|---|---|---|
| P0 | 1. Audit existing source | Done | Next.js 16, React 19, Prisma 6, existing homepage and detail pages verified in source. Mock fallback, mock ticker, no ingestion, and missing refresh confirmed. |
| P0 | 2. Initialize accurate documentation | Done | README, AGENTS, env examples and six concise docs updated. |
| P0 | 3. Refine homepage UI | Partial | Existing editorial design preserved; fake live claims and ticker corrected. Desktop and emulated mobile inspected; loading skeleton and retry error state added. Further image and hierarchy polish remains. |
| P0 | 4. Complete navigation, filters, article details | Partial | Eight topic lenses, working category/search filter, live article route, mobile menu and theme verified. Trending sort and dedicated research page remain. |
| P0 | 5. Browser and functional UI verification | Done | Chrome 390px emulation: no document overflow, menu 8 links, Research 46→24 cards, unmatched search 0, theme toggled. |
| P0 | 6. Verify three live sources | Done | Five endpoints returned HTTP 200; final production API served 48 current stories across TechCrunch 9, arXiv AI 10, arXiv ML 9, HN 10 and HF 10. |
| P0 | 7. Normalize and deduplicate | Partial | URL canonicalization, timestamps, relevance, category, and exact-URL deduplication implemented. Per-source `createMany({skipDuplicates:true})` now relies on the database unique URL/slug constraints for concurrent safety. Eight focused tests pass, including repeated and concurrent ingestion against an atomic test store. PostgreSQL behavior remains unverified. |
| P0 | 8. Database and article APIs | Partial | Existing Prisma schema retained; GET/status/ingest routes distinguish unconfigured, unavailable, empty, and operational states. Prisma schema validation and client generation pass. Database URL is placeholder, so migration and persistence are unverified. |
| P0 | 9. Connect live feed | Done for preview | Home, ticker, API and article detail use genuine source metadata when DB unconfigured. Fabricated seed URLs excluded from DB reads. |
| P0 | 10. Ingestion and refresh | Partial | Authenticated POST and 60-second browser refresh implemented; external scheduler still must be configured and DB writes tested. |
| P0 | 11. Critical tests and fixes | Partial | Earlier production build and browser interactions passed. Current stabilization pass: TypeScript, eight focused tests, Prisma validate/generate, and focused ESLint pass. Current production build is blocked by sandbox access to Google Fonts; local HTTP smoke test was blocked by socket permissions. No DB integration test. |
| P0 | 12. Final documentation | Done | README, source, architecture, test and deployment docs reflect verified state. |
| P1 | Research page, ranking, polish, performance | Deferred | After P0. |
| P2 | Summaries, agents, RAG, personalization, auth, alerts, newsletters | Deferred | Outside prototype. |

## Files changed and evidence

- Audit and instructions: `AGENTS.md`, `TASKS.md`, `PROGRESS.md`.
- Documentation: `README.md`, `.env.example`, `frontend/.env.example`, `docs/RESEARCH.md`, `docs/UI_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/NEWS_SOURCES.md`, `docs/TEST_PLAN.md`, `docs/DEPLOYMENT.md`.
- News processing and API: `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/articles.ts`, `frontend/src/lib/categories.ts`, `frontend/src/app/api/articles/route.ts`, `frontend/src/app/api/status/route.ts`, `frontend/src/app/api/ingest/route.ts`, `frontend/package.json`, `frontend/pnpm-lock.yaml`.
- UI: `frontend/src/app/page.tsx`, `frontend/src/app/layout.tsx`, `frontend/src/app/loading.tsx`, `frontend/src/app/error.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/search-filter.tsx`, `frontend/src/components/trending-ticker.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/article-card.tsx`.
- Visual checks: `frontend/scripts/capture-mobile.mjs`, `docs/screenshots/home-desktop.png`, `docs/screenshots/home-mobile-emulated.png`.

New dependency: `fast-xml-parser` for structured RSS parsing; Node.js has no built-in XML feed parser. TypeScript and production build passed. Exact command results are recorded in `docs/TEST_PLAN.md`.

## P0 database and ingestion stabilization — 2026-10-09

Files changed: `frontend/.env.example`, `frontend/package.json`, `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/news/ingest-core.ts`, `frontend/src/lib/database-config.ts`, `frontend/src/lib/ingest-auth.ts`, `frontend/src/lib/status-core.ts`, `frontend/src/lib/article-mapper.ts`, `frontend/src/lib/articles.ts`, `frontend/src/app/api/articles/route.ts`, `frontend/src/app/api/status/route.ts`, `frontend/src/app/api/ingest/route.ts`, `frontend/tests/ingestion.test.mjs`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/TEST_PLAN.md`, `TASKS.md`, `PROGRESS.md`. No dependency added in this pass.

Verification: `node node_modules/typescript/bin/tsc --noEmit` passed; `node --experimental-strip-types --test tests/ingestion.test.mjs` passed 8/8; Prisma `validate` and `generate` passed with non-secret dummy URLs; focused ESLint passed. The current `next build` failed because the sandbox could not fetch Geist fonts from Google Fonts. A local dev server started, but HTTP smoke requests were denied by sandbox socket permissions; its shutdown also reported a Turbopack junction error. Earlier successful production and browser checks above remain historical evidence, not verification of this pass.

Blockers: `.env.local` contains placeholder database URLs and no live `INGEST_SECRET`; Docker daemon and local PostgreSQL tools are unavailable. The initial SQL migration uses Supabase `auth` schema functions, so a compatible Supabase Postgres database is needed. No migration, actual insert, repeat/concurrent database run, persisted count, or restart survival was verified. A deployment scheduler is not configured.

Next task: supply a compatible database connection and ingestion secret, apply the initial migration once, invoke authenticated ingestion twice and concurrently, confirm inserted counts and unique URLs in PostgreSQL, restart the server and recheck `/api/articles` and `/api/status`, then configure a scheduler. Retry `next build` and HTTP smoke checks where Google Fonts and local sockets are reachable.
