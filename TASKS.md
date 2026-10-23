# AI News implementation tracker

Updated: 2026-10-23. Source code and executed checks determine completion.

| Priority | Task | Status | Acceptance evidence / blocker |
|---|---|---|---|
| P0 | 1. Audit existing source | Done | Next.js 16, React 19, Prisma 6, existing homepage and detail pages verified in source. Mock fallback, mock ticker, no ingestion, and missing refresh confirmed. |
| P0 | 2. Initialize accurate documentation | Done | README, AGENTS, env examples and six concise docs updated. |
| P0 | 3. Refine homepage UI | Done | Existing editorial design preserved; fake live claims and ticker corrected. Desktop and emulated mobile inspected; loading skeleton and retry error state added; live cover images extracted from feeds and OG metadata with robust category fallbacks across featured hero and article cards. |
| P0 | 4. Complete navigation, filters, article details | Done | Dedicated pages for all eight navigation topics, category/search filter, live article route, mobile menu and theme verified. Reader sort controls (Latest, Trending, Oldest) and API sort parameters implemented and verified. |
| P0 | 5. Browser and functional UI verification | Done | Chrome 390px emulation: no document overflow, menu 8 links, Research 46→24 cards, unmatched search 0, theme toggled. Live desktop and detail routes verified with full cover image rendering. |
| P0 | 6. Verify three live sources | Done | Five endpoints returned HTTP 200; final production API served 48 current stories across TechCrunch 9, arXiv AI 10, arXiv ML 9, HN 10 and HF 10. |
| P0 | 7. Normalize and deduplicate | Partial | URL canonicalization, timestamps, relevance, category, and exact-URL deduplication implemented. Per-source `createMany({skipDuplicates:true})` now relies on the database unique URL/slug constraints for concurrent safety. Eight focused tests pass, including repeated and concurrent ingestion against an atomic test store. PostgreSQL behavior remains unverified. |
| P0 | 8. Database and article APIs | Partial | Existing Prisma schema retained; GET/status/ingest routes distinguish unconfigured, unavailable, empty, and operational states. Prisma schema validation and client generation pass. Database URL is placeholder, so migration and persistence are unverified. |
| P0 | 9. Connect live feed | Done for preview | Home, ticker, API and article detail use genuine source metadata when DB unconfigured. Fabricated seed URLs excluded from DB reads. |
| P0 | 10. Ingestion and refresh | Done for prototype | Authenticated POST/GET and 60-second browser refresh implemented; Vercel Cron configured in vercel.json (every 15 min); manual RSS ingestion CLI built and verified via npm run ingest and --dry-run; reading time and word count estimation added; CRON_SECRET supported. Durable DB writes remain unverified until compatible PostgreSQL is connected. |
| P0 | 11. Critical tests and fixes | Partial | Earlier production build and browser interactions passed. Current stabilization pass: TypeScript, eight focused tests, Prisma validate/generate, and focused ESLint pass. Current production build is blocked by sandbox access to Google Fonts; local HTTP smoke test was blocked by socket permissions. No DB integration test. |
| P0 | 12. Final documentation | Done | README, source, architecture, test and deployment docs reflect verified state. |
| P1 | Research enhancements, ranking, polish, performance | Deferred | After P0. |
| P2 | Summaries, agents, RAG, personalization, auth, alerts, newsletters | Deferred | Outside prototype. |

## Files changed and evidence

- Audit and instructions: `AGENTS.md`, `TASKS.md`, `PROGRESS.md`.
- Documentation: `README.md`, `.env.example`, `frontend/.env.example`, `docs/RESEARCH.md`, `docs/UI_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/NEWS_SOURCES.md`, `docs/TEST_PLAN.md`, `docs/DEPLOYMENT.md`.
- News processing and API: `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/news/ingest-core.ts`, `frontend/src/lib/news/image-resolver.ts`, `frontend/src/lib/articles.ts`, `frontend/src/lib/categories.ts`, `frontend/src/app/api/articles/route.ts`, `frontend/src/app/api/status/route.ts`, `frontend/src/app/api/ingest/route.ts`, `frontend/package.json`, `frontend/pnpm-lock.yaml`.
- UI: `frontend/src/app/page.tsx`, `frontend/src/app/layout.tsx`, `frontend/src/app/loading.tsx`, `frontend/src/app/error.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/search-filter.tsx`, `frontend/src/components/trending-ticker.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/article-card.tsx`.
- Visual checks: `frontend/scripts/capture-mobile.mjs`, `docs/screenshots/home-desktop.png`, `docs/screenshots/home-mobile-emulated.png`.

New dependency: `fast-xml-parser` for structured RSS parsing; Node.js has no built-in XML feed parser. TypeScript and production build passed. Exact command results are recorded in `docs/TEST_PLAN.md`.

## P0 database and ingestion stabilization — 2026-10-09

Files changed: `frontend/.env.example`, `frontend/package.json`, `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/news/ingest-core.ts`, `frontend/src/lib/database-config.ts`, `frontend/src/lib/ingest-auth.ts`, `frontend/src/lib/status-core.ts`, `frontend/src/lib/article-mapper.ts`, `frontend/src/lib/articles.ts`, `frontend/src/app/api/articles/route.ts`, `frontend/src/app/api/status/route.ts`, `frontend/src/app/api/ingest/route.ts`, `frontend/tests/ingestion.test.mjs`, `README.md`, `docs/ARCHITECTURE.md`, `docs/DEPLOYMENT.md`, `docs/TEST_PLAN.md`, `TASKS.md`, `PROGRESS.md`. No dependency added in this pass.

Verification: `node node_modules/typescript/bin/tsc --noEmit` passed; `node --experimental-strip-types --test tests/ingestion.test.mjs` passed 8/8; Prisma `validate` and `generate` passed with non-secret dummy URLs; focused ESLint passed. The current `next build` failed because the sandbox could not fetch Geist fonts from Google Fonts. A local dev server started, but HTTP smoke requests were denied by sandbox socket permissions; its shutdown also reported a Turbopack junction error. Earlier successful production and browser checks above remain historical evidence, not verification of this pass.

Blockers: `.env.local` contains placeholder database URLs and no live `INGEST_SECRET`; Docker daemon and local PostgreSQL tools are unavailable. The initial SQL migration uses Supabase `auth` schema functions, so a compatible Supabase Postgres database is needed. No migration, actual insert, repeat/concurrent database run, persisted count, or restart survival was verified. A deployment scheduler is not configured.

Next task: supply a compatible database connection and ingestion secret, apply the initial migration once, invoke authenticated ingestion twice and concurrently, confirm inserted counts and unique URLs in PostgreSQL, restart the server and recheck `/api/articles` and `/api/status`, then configure a scheduler. Retry `next build` and HTTP smoke checks where Google Fonts and local sockets are reachable.

## News image extraction and category fallbacks — 2026-10-11

Files changed: `frontend/src/lib/news/image-resolver.ts`, `frontend/src/lib/news/ingest-core.ts`, `frontend/src/lib/news/ingest.ts`, `frontend/src/components/article-card.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `TASKS.md`, `PROGRESS.md`. No dependency added in this pass.

Verification:
- `node --experimental-strip-types --test tests/ingestion.test.mjs` passed (8/8).
- `node node_modules/typescript/bin/tsc --noEmit` compiled with 0 errors.
- Dev server running on `http://localhost:3000` via `next dev --webpack`.
- Verified `/api/articles` returns valid `imageUrl` for all ingested articles (TechCrunch OG images, Sanity CDN, BBC, and Unsplash fallbacks).
- Visual check via Chrome DevTools confirmed cover images render properly across Featured Hero, standard cards, and Article detail hero headers.

## Local startup — 2026-10-12

Files changed: `TASKS.md`, `PROGRESS.md` only. Started from `frontend` using `node node_modules/next/dist/bin/next dev --webpack --port 3000`; Next.js reported ready at http://localhost:3000. Verified homepage HTTP 200 using Node fetch with local network access. Initial sandbox HTTP checks failed with EACCES/timeout; restarted server with network access. No application code or dependencies changed; typecheck, lint, and build were not rerun for this startup-only task.


## Dedicated category pages — 2026-10-12

Files changed: `frontend/src/lib/categories.ts`, `frontend/src/app/page.tsx`, `frontend/src/app/news/page.tsx`, `frontend/src/app/news/[category]/page.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/layout/footer.tsx`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/search-filter.tsx`, `docs/screenshots/category-navigation.jpg`, `TASKS.md`, `PROGRESS.md`. No dependencies added.

- All News opens `/news`; the seven topic headings open `/news/breaking`, `/news/ai-models`, `/news/research`, `/news/companies`, `/news/open-source`, `/news/ai-policy`, and `/news/ai-hardware`. Each page has its own heading, description, browser title, matching feed/ticker, topic statistics, and accessible active navigation marker. Existing valid `/?category=...` URLs redirect to the corresponding page. Search/category tabs and footer links use the new routes; Saved/Liked remain local controls.
- `node node_modules/typescript/bin/tsc --noEmit` passed initially and on the final run (exit 0). An intermediate check overlapped the second build and failed because generated `.next/types` files were being replaced; rerunning after build completion passed.
- `node node_modules/next/dist/bin/next build --webpack` passed both before and after lint fixes (exit 0), including `/news` and `/news/[category]`. Run with network access for existing Google Fonts dependency.
- `node node_modules/eslint/bin/eslint.js src/app/page.tsx src/app/news src/components/layout/navbar.tsx src/components/layout/footer.tsx src/components/home-feed.tsx src/components/search-filter.tsx src/lib/categories.ts` passed on the final run (exit 0). The initial slow run eventually reported two existing `react-hooks/set-state-in-effect` errors. Fixed navbar hydration state with `useSyncExternalStore` and derived feed results from a stored filter function instead of copying refreshed props into state in an effect. Verified search, Saved, and returning to the current topic after the fix.
- Node fetch smoke checks returned HTTP 200 with correct browser titles for all eight pages. Browser clicked all eight main navigation links and confirmed their URLs and headings; topic active links reported `aria-current=page`. Observed counts: Breaking 32, AI Models 14, Research 29, Companies 17, Open Source 0, AI Policy 0, AI Hardware 1; live counts may change.
- Browser at 390px: all eight mobile links present; clicking Breaking changed the route and closed the menu. Breaking rendered after reload; unmatched search returned 0 cards and the empty state; the Research category tab opened `/news/research`, displayed Research, and reset the query. No horizontal document overflow (document width 375, viewport 390). Restored default viewport and saved desktop Research preview.
- Development server restarted with `node node_modules/next/dist/bin/next dev --webpack --port 3000` and left running at `http://localhost:3000`. Post-build Node fetch verified Research HTTP 200; browser rendered the topic pages.


## Site availability — 2026-10-12

Files changed: `TASKS.md`, `PROGRESS.md`. Reused the running local server. Verified `http://localhost:3000/news` with `node -e` using Node fetch and a 45-second timeout: HTTP 200, browser title `All News | AI News`. Opened the site in the Codex browser panel. No application changes; no build, lint, or typecheck rerun for this availability-only task.

## Browser startup — 2026-10-12

Files changed: TASKS.md, PROGRESS.md. Started from frontend with node node_modules/next/dist/bin/next dev --webpack --port 3000. Next.js reported ready; server request logs confirmed GET / HTTP 200. Initial Node fetch timed out during compilation. Browser panel opening queued for http://localhost:3000. No source or dependency changes; build/lint/typecheck not rerun for startup-only work.


## Editorial palette, faster sections and teacher demo — 2026-10-12

Files changed: `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/layout/footer.tsx`, `frontend/src/components/search-filter.tsx`, `frontend/src/components/article-card.tsx`, `frontend/src/components/reading-progress-bar.tsx`, `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/news/feed-cache.ts`, `frontend/tests/feed-cache.test.mjs`, `frontend/scripts/verify-preview.mjs`, `frontend/package.json`, `start-demo.mjs`, `README.md`, `docs/COLOR_DIRECTION.md`, `docs/screenshots/editorial-desktop.png`, `TASKS.md`, `PROGRESS.md`. No new dependencies.

Changed purple branding to paper/ink/forest with serif headings, charcoal dark mode, topic rules and quieter cards. Removed delayed article entrances, added reduced motion and local fonts. Research sources and contrast checks are recorded in `docs/COLOR_DIRECTION.md`. Preserved eight dedicated section URLs, added full link prefetching, removed transient old-page filter updates before navigation, fixed image-overlay click interception and eager hero loading.

Feed changes: shared concurrent cold requests, cached stories served immediately during refresh, 60-second retry interval, eight-second source timeout. Failed sources retain genuine previous headlines. Feed imagery/category illustrations replace article-page image scraping during navigation. Observed 17 articles retained when all five sources timed out; healthy restart displayed 46 articles across five sources. Cache remains memory-only; no fabricated news or database persistence added.

Commands/outcomes:
- From `frontend`, `node --experimental-strip-types --test tests/*.test.mjs`: 12/12 passed (concurrent cold fetches, nonblocking stale refresh, empty/error retention, cold-failure backoff plus ingestion tests).
- `node node_modules/typescript/bin/tsc --noEmit`: initial and final post-build checks passed, exit 0.
- `node node_modules/eslint/bin/eslint.js src/lib/news/feed-cache.ts src/lib/news/ingest.ts src/app/layout.tsx src/app/article src/components/home-feed.tsx src/components/article-card.tsx src/components/layout src/components/search-filter.tsx src/components/reading-progress-bar.tsx tests/feed-cache.test.mjs ../start-demo.mjs`: exit 0, no frontend errors; root launcher ignored outside frontend lint base path. Root `node --check start-demo.mjs` passed separately. Final `node node_modules/eslint/bin/eslint.js src/lib/news/ingest.ts`: exit 0.
- Root `node start-demo.mjs --no-open` and `node start-demo.mjs`: two production builds passed via `node <frontend>/node_modules/next/dist/bin/next build --webpack`; warmed feeds and opened default browser. Ctrl+C stopped server; final restart reused the build, Ready in 2.0 seconds. Invalid `node start-demo.mjs --port=abc` exited 1 with usage. Occupied-port test found a Windows IPv4/IPv6 mismatch; corrected probe to bind 127.0.0.1. Final `node start-demo.mjs --no-open` while server running exited 1 with clear port-in-use message and kept existing server intact.
- From `frontend`, `node scripts/verify-preview.mjs`: final exit 0. Eight topic routes HTTP 200/correct titles, article HTTP 200, unknown category missing-page UI and noindex. Initial assertion incorrectly required HTTP 404; corrected for documented Next.js streaming HTTP 200 behavior.
- Final warm full-response timing: All News 195 ms; Breaking 39, AI Models 31, Research 42, Companies 42, Open Source 32, AI Policy 51, AI Hardware 45 ms. Prefetched browser clicks across eight routes: 22–68 ms, correct URLs/headings/active links. Local warm observations, not guaranteed cold/network timings.
- Browser: unmatched search zero cards/empty state; clearing restored available cards. Theme toggle and desktop light/mobile dark inspected. At 390px: eight mobile links, Research route and menu close, document width 390/no overflow. Light body/muted/primary contrast pairs: 14.50:1, 5.47:1, 6.83:1. Final light preview displayed 46 real articles from five sources. Dark article screenshot saved. Host sleep interrupted browser automation; reconnecting recovered the preview.

Teacher command: from project root, `node .\start-demo.mjs`. Requires Node 20.9+ and installed frontend dependencies. Builds on first run/source changes, then reuses build, warms feeds and opens http://localhost:3000/news. Keep terminal open; Ctrl+C stops. Use `--port=3001` if occupied, `--rebuild` to rebuild, `--no-open` to skip browser launch. Current headlines/remote images require internet; cache does not survive restarts. Database ingestion/persistence and scheduling remain unverified. Final production server left running.

## Saved/Liked count fixes and prototype function audit — 2026-10-12

Files changed: `frontend/src/lib/article-selection.ts`, `frontend/src/lib/use-article-selection.ts`, `frontend/src/lib/use-bookmarks.ts`, `frontend/src/lib/use-likes.ts`, `frontend/src/components/bookmark-button.tsx`, `frontend/src/components/like-button.tsx`, `frontend/src/components/article-card.tsx`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/search-filter.tsx`, `frontend/src/components/share-button.tsx`, `frontend/src/components/newsletter-modal.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/layout/footer.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `frontend/src/app/rss/route.ts`, `frontend/tests/article-selection.test.mjs`, `frontend/scripts/verify-preview.mjs`, `README.md`, `TASKS.md`, `PROGRESS.md`. No dependencies added.

Findings and fixes:
- Saved/Liked filter callbacks closed over old ID arrays. Badge changed after removal but the derived card list could keep the removed article. Local-storage writes/events inside React state updaters also caused unnecessary cross-component updates. Replaced hooks with useSyncExternalStore subscriptions and click-time storage reads; filter state is controlled by HomeFeed and results derive from current IDs.
- Legacy arrays are validated and deduplicated. Available unique article counts drive badges; displayed cards drive header statistics. Search reports shown/total separately. Older ID-only references remain preserved with an explicit unavailable-details explanation, rather than inflating available article counts.
- Genuine selected metadata persists in local browser storage. Stories that leave the current feed remain in the collections, with links to the original publisher. Main-feed and current articles continue to use internal previews. No mock news added. Empty source feeds no longer block access to stored collections. Same-topic navbar and Show All Articles reset local filters correctly.
- Save/Like buttons expose aria-pressed and pass article metadata to the shared store. Storage events synchronize separate tabs; a session fallback handles unavailable browser storage.
- Footer RSS link had no route; added real server-rendered RSS with XML escaping, source headlines/excerpts and original publisher links. Share now handles clipboard rejection with a manual-copy field instead of an unhandled promise rejection.
- Newsletter had an unconnected form with fabricated subscription success and subscriber count. Replaced it with an explicitly labeled preview, no email collection/send, accessible dialog focus handling and Escape close. This is not live newsletter delivery.

Commands and outcomes:
- From `frontend`, `node --experimental-strip-types --test tests/*.test.mjs`: 18/18 passed. Six new cases cover duplicate/corrupt ID storage, rapid changes, feed rotation, current metadata precedence, removal from derived collections and malformed archived metadata.
- `node node_modules/typescript/bin/tsc --noEmit`: passed before build and after build, exit 0.
- `node node_modules/eslint/bin/eslint.js src/lib/article-selection.ts src/lib/use-article-selection.ts src/lib/use-bookmarks.ts src/lib/use-likes.ts src/components/bookmark-button.tsx src/components/like-button.tsx src/components/article-card.tsx src/components/home-feed.tsx src/components/search-filter.tsx src/components/share-button.tsx src/components/newsletter-modal.tsx src/components/layout/navbar.tsx src/components/layout/footer.tsx src/app/article src/app/rss tests/article-selection.test.mjs`: exit 0, no output/errors.
- Root `node start-demo.mjs --no-open`: production webpack build passed, including /rss; warmed sources and left production app on port 3000. Existing launcher process stopped with Ctrl+C before rebuilding. `node --check scripts/verify-preview.mjs` passed from `frontend`.
- `node scripts/verify-preview.mjs`: exit 0. All eight topic pages and article preview HTTP 200; unknown category displays missing-page UI/noindex; /rss HTTP 200/application/rss+xml and XMLValidator accepted XML. API search returned empty expected results, Research filtering returned only Research, limit=1 respected, invalid limit/offset returned 400, unauthenticated POST /api/ingest returned 401. Status correctly reported database not_configured; actual authenticated DB ingestion remains unverified.

Browser outcomes (isolated library-functional-qa browser context for repeatable final checks):
- Saved two: heading Saved, badge 2, two cards, Showing 2 of 2. Removing one while Saved open immediately produced badge 1/one card/Showing 1 of 1. Liked produced the same 2-to-1 behavior.
- Reload retained Saved 1/card 1/pressed true. An unmatched search produced zero visible cards with badge 1 and Showing 0 of 1; clear restored one. All News navbar reset the collection view. Ten rapid Save and ten rapid Like toggles left both original selections intact with no duplicate IDs.
- A second tab changed selection storage; first tab updated to Saved 0/Liked 0/zero cards. Foregrounding browser tabs was required because background automation stalled; final focused checks passed.
- Archive/legacy fixture used actual source headline metadata with an isolated archived ID: duplicate archived IDs plus one missing ID rendered one available card/badge 1, explicitly explained one unavailable older reference, and linked the archived card to its real original publisher in a new tab. QA fixtures remained isolated from the user's app collections.
- All eight navigation clicks verified corresponding URL and h1. Observed counts varied with real feed refresh: Breaking 34, AI Models 12, Research 29, Companies 17, Open Source 0, AI Policy 0, AI Hardware 1, All News 47. Empty topic results are genuine availability states.
- Article detail Save and Like became pressed true; returning to feed at 390px showed Saved 1/Liked 1 with one saved card, no horizontal overflow. Mobile menu had eight links; Research navigation closed it. Theme toggle changed light/dark state.
- Real clipboard sharing reported copied success. Injected clipboard rejection produced the correct current URL in manual-copy input; original clipboard implementation restored afterward. Newsletter dialog explained preview status/no delivery, had no email form, focused Close, closed on Escape and restored the previously focused opener. An initial programmatic-click focus check lacked an explicitly focused opener; corrected test passed.

Limits: newsletter delivery, account sync, durable database ingestion, database-specific tags and scheduler remain outside verified functionality. Current live feeds expose no tags, so tag-specific production filtering was not exercised. Existing older selections without stored metadata cannot be reconstructed automatically; IDs are kept. Selected snapshots persist only in that browser when browser storage is allowed; main server feed cache still does not survive restart. Refresh existing browser pages to load this production build.


## One-pass editorial redesign — implemented and verified 2026-10-13

Files changed: `frontend/src/lib/feed-model.ts`, `frontend/src/lib/categories.ts`, `frontend/src/lib/feed-poller.ts`, `frontend/src/lib/use-feed-layout.ts`, `frontend/src/lib/news/image-resolver.ts`, `frontend/src/components/home-feed.tsx`, `frontend/src/components/search-filter.tsx`, `frontend/src/components/article-card.tsx`, `frontend/src/components/story-image.tsx`, `frontend/src/components/topic-overview.tsx`, `frontend/src/components/article-preview.tsx`, `frontend/src/components/layout/navbar.tsx`, `frontend/src/components/layout/footer.tsx`, `frontend/src/components/bookmark-button.tsx`, `frontend/src/components/like-button.tsx`, `frontend/src/components/share-button.tsx`, `frontend/src/app/globals.css`, `frontend/src/app/page.tsx`, `frontend/src/app/news/page.tsx`, `frontend/src/app/news/[category]/page.tsx`, `frontend/src/app/saved/page.tsx`, `frontend/src/app/liked/page.tsx`, `frontend/src/app/article/[slug]/page.tsx`, `frontend/src/app/loading.tsx`, `frontend/src/app/error.tsx`, `frontend/src/app/not-found.tsx`, `frontend/tests/feed-reader.test.mjs`, `frontend/scripts/verify-preview.mjs`, `README.md`, `docs/EDITORIAL_DESK.md`, `docs/screenshots/news-desk-390.png`, `docs/screenshots/news-desk-768.png`, `docs/screenshots/news-desk-1366.png`, `docs/screenshots/news-desk-1920.png`, `docs/screenshots/news-desk-dark.png`, `TASKS.md`, `PROGRESS.md`. No dependencies, schema/API contract changes, migrations or version-control commands.

Implementation:
- Added a 1440px editorial desk with 6/4/2 lead/latest/topic columns, five stationary chronological headlines, remaining three-column grid and compact row alternative. Mobile/tablet stacking, compact title/toolbar, local font palette and token-based category colors apply to news, collection and article pages. Article preview text width verified at 720px. Research abstracts omit decorative images. Fallback photos are labeled illustrative and preserve error handling/reserved dimensions.
- Added /saved and /liked with titles/active links, preserved existing browser IDs and genuine archived metadata, retained older unavailable references, and maintained separate total/shown counts. Added combined source/search/tag filters, hiding absent tags, and browser-persisted Editorial/Compact preference. Topic counts reflect the loaded feed with overlap explained; no invented trend/popularity data.
- Replaced router.refresh with one 60-second polling interval per mounted view, skipping hidden documents and preventing overlap. Received data remains pending until the reader applies it; counts respect active filters and already-visible collection archives. Applying preserves filters/selections and focuses results without scrolling. Failures retain stories and offered updates. Unmount aborts requests. Existing server caching/source timeouts remain unchanged.
- Fixed a real hydration race discovered during final QA: an immediate source selection before React attached handlers was reset to All. Reader inputs/selects/layout buttons now remain briefly disabled until hydration, and the exact first-interaction regression passed. Fixed the existing unescaped apostrophe caught by expanded lint; enlarged all visible mobile interaction targets, restored focus on menu Escape, and replaced footer framework links with product-relevant copy.

Commands/outcomes:
- From frontend, `node --experimental-strip-types --test tests/*.test.mjs`: 28/28 passed, including ten new combined-filter, counts, layout, fingerprint, update-state, hidden/overlap/failure/abort regression cases. Existing 18 ingestion/cache/selection tests remain passing.
- `node node_modules/typescript/bin/tsc --noEmit`: passed before implementation build and on final post-build run, exit 0. Production compiler TypeScript checks passed on successful builds.
- `node node_modules/eslint/bin/eslint.js src/components src/app src/lib/feed-model.ts src/lib/feed-poller.ts src/lib/use-feed-layout.ts src/lib/categories.ts src/lib/news/image-resolver.ts tests/feed-reader.test.mjs scripts/verify-preview.mjs`: final exit 0. Expanded lint initially found one existing react/no-unescaped-entities error in not-found.tsx, corrected to does not. Subsequent `node node_modules/eslint/bin/eslint.js src/components/search-filter.tsx src/components/article-preview.tsx` and final `node node_modules/eslint/bin/eslint.js src/components/layout src/components/share-button.tsx src/components/search-filter.tsx src/components/article-preview.tsx`: exit 0.
- Root `node start-demo.mjs --rebuild --no-open` and subsequent `node start-demo.mjs --no-open` runs: production webpack builds passed with /saved and /liked included. Intermediate builds were followed by layout, hydration and mobile-touch refinements; final build passed and server Ready in 799 ms before warming sources. User interruptions were resumed without resetting source. Existing multiple-lockfile warning remains nonblocking.
- `node scripts/verify-preview.mjs`: final exit 0. Ten news/collection routes HTTP 200/correct titles; article preview HTTP 200; streamed missing-page UI/noindex verified; RSS valid XML/200; API search/category/pagination and unauthenticated ingestion rejection passed. Final single-route response observations: All News 227 ms, other sections/collections 23–99 ms. Database correctly reports not_configured; actual database ingestion remains unverified.
- Warm All News measurement used root `node -e` with ten sequential fetch/text requests to http://localhost:3000/news and performance.now. Samples [272,40,35,55,65,37,30,43,46,46] ms; median 44.5 ms. Cached desktop section clicks measured 57–218 ms across all eight URLs/headings. Targets below 300 ms met for these local warm observations; cold external feed/image timings are not guaranteed.

Browser/visual outcomes:
- Four screenshots captured and visually inspected at 390x844, 768x1024, 1366x768 and 1920x1080, plus dark desktop. No horizontal overflow or duplicate IDs; 46 unique source stories in the snapshot. At 1366x768, lead image bottom 718px, fourth latest headline bottom 691px and full topic panel bottom 747px: all visible within first screen. Larger photos filled their columns after correcting image width; earlier topic-panel overflow corrected before acceptance.
- Source selection arXiv AI produced 10 matching stories, unmatched search zero, clear restored full feed, empty tags hidden. Reload preserved layout preference. Default Saved Compact, two saves -> one after removal, search Showing 0 of 1 without changing total, clear restored one, reload retained metadata. Liked one -> zero after unlike.
- Real cross-tab storage change updated another Saved page to zero cards/totals. A legacy/archive fixture using actual source metadata plus isolated archived ID tested duplicate IDs, one unavailable reference, one counted card, and original publisher link with target _blank. QA used isolated browser contexts and did not reset user collection keys.
- Browser-controlled poll tests: one interval, received removal kept 47 visible until applied then 46, results-heading gained focus, restoring actual removed story offered 1 new story. Rejected fetch kept visible stories and displayed status; hidden document skipped request; two ticks generated one request; recovery cleared error. Fixture data reused actual source articles within isolated QA, not public mock stories.
- All eight topic navigation links passed with correct URLs/headings. Mobile drawer includes ten links (topics plus collections), closes on route selection and Escape restores opener focus. Final visible mobile a/button/input/select scan found no targets smaller than 44px in either dimension. Research cards rendered zero decorative images and no overflow.
- Article preview measured 720px width, correct source URL and Source Excerpt label; real clipboard sharing succeeded. Newsletter preview contained no email form, closed on Escape and returned focus. Specific body/muted/primary contrast pairs measured light 14.50/5.47/6.83:1 and dark 15.17/8.56/9.92:1. These are sampled pair checks, not a complete accessibility audit.
- Initial broad browser test timed out during immediate source interaction; narrowed checks exposed/fixed the hydration race. Clean isolated reruns passed; an earlier reload preference anomaly did not reproduce when instrumented and final reload persistence passed.

Delivery: production remains running at http://localhost:3000/news. Teacher command unchanged: from project root, `node .\start-demo.mjs`; keep terminal open, Ctrl+C to stop, --port=3001 if occupied. README and docs/EDITORIAL_DESK.md describe reader/update behavior. Existing pages need refresh to load the new build. Newsletter remains a preview; account sync, AI summaries, durable DB ingestion/scheduler and historical analytics remain excluded/unverified. Browser collections are local; main feed cache remains memory-only.


## Reader sort controls (Latest, Trending, Oldest) and API sort — implemented and verified 2026-10-21

Files changed: `frontend/src/lib/feed-model.ts`, `frontend/src/components/search-filter.tsx`, `frontend/src/app/api/articles/route.ts`, `frontend/tests/feed-reader.test.mjs`, `frontend/scripts/verify-preview.mjs`, `TASKS.md`, `PROGRESS.md`. No new dependencies.

Implementation:
- Added `FeedSort` type (`latest` | `trending` | `oldest`) and integrated `sort` into `FeedFilters` with default `"latest"`.
- Implemented `calculateTrendingScore(article, savedIds, likedIds)`: combines local reader interaction boosts (+50 for likes, +30 for bookmarks), recency velocity decay over 72h, topical impact keyword scoring (breakthrough, frontier, releases, reasoning, agentic, llm), and in-depth reading time weighting, with deterministic fallback to publication timestamp for ties.
- Added `<select aria-label="Sort articles">` into `SearchFilter` with options Sort: Latest, Sort: Trending, and Sort: Oldest. Integrated with hydration readiness and Clear Filters reset.
- Extended `GET /api/articles` with optional `sort` parameter (`latest`, `trending`, `oldest`) across both Prisma database queries and live-read-through mode.
- Added 3 new unit tests to `frontend/tests/feed-reader.test.mjs` verifying trending ranking with engagement boosts and recency velocity, oldest chronological ordering, and default latest sort behavior. Total test suite expanded to 31/31 passing tests.
- Extended `frontend/scripts/verify-preview.mjs` with API sort verification.

Commands and outcomes:
- `node --experimental-strip-types --test tests/feed-reader.test.mjs`: 13/13 passed.
- `node --experimental-strip-types --test tests/*.test.mjs`: 31/31 passed across all 4 test suites.
- `node node_modules/typescript/bin/tsc --noEmit`: passed with 0 errors.
- `node node_modules/eslint/bin/eslint.js src/lib/feed-model.ts src/components/search-filter.tsx src/app/api/articles/route.ts tests/feed-reader.test.mjs scripts/verify-preview.mjs`: passed with 0 errors.
- `graphify update .`: updated AST knowledge graph (1105 nodes, 1404 edges).

## Ingestion scheduling, manual CLI runner and reading time estimation (BD7/BD8) — 2026-10-23

Files changed: `frontend/vercel.json`, `frontend/scripts/run-ingest.mjs`, `frontend/package.json`, `frontend/tsconfig.json`, `frontend/src/lib/news/ingest-core.ts`, `frontend/src/lib/news/ingest.ts`, `frontend/src/lib/ingest-auth.ts`, `frontend/src/app/api/ingest/route.ts`, `frontend/tests/ingestion.test.mjs`, `frontend/scripts/verify-preview.mjs`, `ROADMAP.md`, `TASKS.md`, `PROGRESS.md`. No new dependencies.

Implementation:
- External Scheduler (BD8 / Task 10): Configured `frontend/vercel.json` with cron schedule `*/15 * * * *` invoking `/api/ingest` every 15 minutes.
- Ingestion API handler: Added `GET` export alongside `POST` in `frontend/src/app/api/ingest/route.ts` to support Vercel Cron invocations.
- Ingestion Authentication: Extended `isIngestAuthorized` in `frontend/src/lib/ingest-auth.ts` to accept `CRON_SECRET` alongside `INGEST_SECRET`.
- Manual Ingestion CLI Runner (BD7 / Task 10): Created `frontend/scripts/run-ingest.mjs` and added `"ingest": "node --experimental-strip-types scripts/run-ingest.mjs"` to `package.json`. Supports `--dry-run` and `--source=<slug>` flags. When DB is unconfigured, gracefully executes dry-run parsing across all 5 live feeds and displays candidate counts, category breakdown, and sample headlines. When DB is configured, executes Prisma ingestion with duplicate safety.
- Reading Time & Word Count: Added `estimateReadingTime(text)` in `ingest-core.ts` (minimum 1 minute, 200 words per minute). Added `wordCount` and `readingTime` to `Candidate`, `ArticleInsert`, Prisma `createMany` data, and live `Article` objects.
- Unit Tests: Added 2 new tests in `frontend/tests/ingestion.test.mjs` verifying `estimateReadingTime` calculations and `prepareArticles` reading time/word count attachment, plus verified `isIngestAuthorized` with GET requests and `CRON_SECRET`. Total test suite expanded to 33/33 passing tests across 4 test suites.

Commands and outcomes:
- `node --experimental-strip-types --test tests/*.test.mjs`: 33/33 passed across all 4 test suites (6 selection, 4 feed-cache, 13 feed-reader, 10 ingestion).
- `node --experimental-strip-types --test tests/feed-reader.test.mjs`: 13/13 passed.
- `node node_modules/typescript/bin/tsc --noEmit`: passed with 0 errors.
- `npm run ingest -- --dry-run`: successfully fetched and parsed all 5 live news sources (833 candidates, 176 AI-relevant and prepared, 51 Industry, 123 Research, 2 Policy).
- `node --check scripts/run-ingest.mjs` and `node --check scripts/verify-preview.mjs`: syntax checks passed with 0 errors.
- `graphify update .`: updated AST knowledge graph (1120 nodes, 1431 edges, 92 communities).
