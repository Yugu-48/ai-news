# Verification record — 2026-10-09

Executed from `frontend` unless noted:

- `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `node node_modules/next/dist/bin/next build`: passed after the article route was made dynamic.
- Final production `GET /api/articles?limit=100`: returned 48 current stories from five sources (TechCrunch AI 9, arXiv AI 10, arXiv Machine Learning 9, Hacker News 10, Hugging Face Papers 10) in live read-through mode.
- Production homepage: HTTP 200, fabricated GPT-5 seed headline absent.
- Production article URL selected from the live API: HTTP 200 and headline present.
- Unauthenticated `POST /api/ingest`: HTTP 401.
- Production `GET /api/articles?category=Research&limit=100`: 24 stories; invalid `limit=abc`: HTTP 400.
- Production `GET /api/status` after a feed request: `live_read_through`, five source-health entries. The earlier four-source build showed 46 cached stories and no reported source errors; the final five-source build reported 48 stories.
- Source endpoint checks: four HTTP 200 responses.
- Desktop headless Chrome screenshot inspected in `docs/screenshots/home-desktop.png`.
- Chrome device emulation at 390px: viewport and document width both 390px; menu opened with eight links; Research filter changed card count 46 → 24; unmatched search changed count to zero; theme toggle changed the root class to `light`.
- Final production build passed after adding route loading skeleton and error retry state; those states were not forced in a browser test.

Blocked or incomplete: PostgreSQL URL is a placeholder, so ingestion writes, persistence across restart and deduplication in the database remain unverified. ESLint hung without output and was stopped. The dev server showed a Turbopack manifest/module error; the production server passed route checks. No automated unit or integration suite exists yet, and physical-device coverage remains open.

## Stabilization pass — 2026-10-09

The results above describe the earlier prototype pass. The following checks were executed after the ingestion and API stabilization edits:

- `node node_modules/typescript/bin/tsc --noEmit`: passed.
- `node --experimental-strip-types --test tests/ingestion.test.mjs`: 8 tests passed. They cover URL normalization, repeated and concurrent ingestion using an atomic in-memory store, source failure isolation, configuration states, health summaries, row mapping, and bearer authentication. The in-memory store does not validate PostgreSQL uniqueness or persistence.
- Prisma CLI `validate --schema prisma/schema.prisma`: passed using dummy, non-secret URL environment variables. Prisma CLI `generate --schema prisma/schema.prisma`: passed, v6.19.3. Neither operation connects to a database or applies SQL.
- Focused ESLint on the changed TypeScript files: passed (exit 0; about 85 seconds).
- `node node_modules/next/dist/bin/next build`: failed when `next/font` could not retrieve Geist and Geist Mono CSS from `fonts.googleapis.com` in the restricted environment. This was not a TypeScript compilation failure. A direct font URL request also failed.
- `next dev` reached ready, but the sandbox denied an HTTP request to `localhost:3000`. Shutdown logged a Turbopack junction `File exists (os error 80)` error. Current API and UI interaction checks could not be repeated in this environment.

Database integration remains blocked: `.env.local` has placeholder database URLs, Docker daemon is stopped, and PostgreSQL CLI tools are unavailable. Initial migration SQL depends on Supabase `auth` schema functions. No live migration, authenticated ingestion, repeat/concurrent PostgreSQL run, persisted row count, or restart check was executed. The next verification requires a compatible database and real server-only `INGEST_SECRET`.
