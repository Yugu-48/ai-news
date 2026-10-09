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
| P0 | 7. Normalize and deduplicate | Partial | URL canonicalization, timestamps, relevance, category, and exact-URL deduplication implemented. DB duplicate behavior and near-duplicate titles untested. |
| P0 | 8. Database and article APIs | Partial | Existing Prisma schema retained; GET/status/ingest routes built. Database URL is placeholder, so persistence is unverified. |
| P0 | 9. Connect live feed | Done for preview | Home, ticker, API and article detail use genuine source metadata when DB unconfigured. Fabricated seed URLs excluded from DB reads. |
| P0 | 10. Ingestion and refresh | Partial | Authenticated POST and 60-second browser refresh implemented; external scheduler still must be configured and DB writes tested. |
| P0 | 11. Critical tests and fixes | Partial | Typecheck and build pass; production routes and browser interactions pass. ESLint hung; no DB integration test. |
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

Current blockers: configured PostgreSQL credentials and scheduler are absent; automatic durable ingestion cannot be verified. ESLint did not complete. Next task: configure a real database, run migration and authenticated ingestion twice, verify persisted counts and deduplication, then configure scheduling and trending ranking.
