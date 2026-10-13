# AI News

A responsive AI news reader built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Prisma 6. The site reads current headlines from TechCrunch AI, arXiv cs.AI/cs.LG, Hacker News Algolia and Hugging Face Daily Papers. It links to original publications and displays excerpts only.

The homepage, dedicated topic pages, article previews, local search and filters, theme switcher, saved and liked controls, and `/api/articles` are available. Without PostgreSQL, the site uses a shared in-memory feed cache: refreshes begin after 60 seconds and the last successful headlines remain readable while sources update. Cold requests share a single fetch, with an eight-second timeout per source. Each failed source retains its previously fetched headlines, while status continues to report the failure. Feed images and illustrative category fallbacks avoid article-page image lookups during navigation. This mode does **not** persist articles across restarts. The database ingestion path and `/api/status` and `/api/ingest` routes are implemented, but have not been exercised against a real PostgreSQL instance in this workspace.

`fast-xml-parser` parses RSS metadata because Node.js has no built-in XML feed parser. The editorial redesign adds no dependencies.

Saved and Liked selections share browser storage and update cards/counts immediately, including across tabs. Selected story metadata is kept locally after a headline leaves the current feed; those archived cards link directly to the original publisher. Counts refer to available unique articles; older ID-only references with no recoverable metadata are preserved and identified separately. Search can reduce the displayed count without changing the collection total. These collections belong to this browser, without account synchronization. Newsletter is explicitly a preview with no email collection/delivery; `/rss` is an actual RSS feed of source headlines and excerpts. Share copies the article link, with manual-copy fallback if clipboard access fails.

## Local setup

### Teacher demo (Windows terminal)

With Node.js 20.9+ and the frontend dependencies installed, run:

```powershell
cd D:\CLAUDE-WORKSPACE\AI-News
node .\start-demo.mjs
```

The launcher builds production pages once, starts at **http://localhost:3000/news**, warms the real source feed, and opens your browser. Keep the terminal open during the presentation; press **Ctrl+C** to stop. Later runs reuse the build unless application source/configuration changes. Local system fonts mean the build does not need Google Fonts. Internet is still required for current headlines and remote images; source outages show available cached headlines or an honest empty state.

Use `node .\start-demo.mjs --rebuild` to force a new build, `--port=3001` if 3000 is occupied, or `--no-open` to start without opening a browser. Stop a development server before starting the demo on the same port. This launcher does not migrate or seed a database.

### Development

1. Use a current Node.js release and pnpm.
2. Run `cd frontend` and `pnpm install`.
3. Copy `frontend/.env.example` to `frontend/.env.local`. Configure `DATABASE_URL` and `DIRECT_URL` for persistence, and set a long random `INGEST_SECRET` before enabling ingestion. Leave the database values empty to use live read-through mode. Copy connection strings from the Supabase Dashboard's Connect dialog: use the transaction pooler for serverless runtime and a direct connection for migrations. If direct access is unavailable on an IPv4-only network, use the session pooler for the migration connection after confirming access.
4. Run `pnpm dev` and open `http://localhost:3000`.

The Prisma schema and initial migration are in `frontend/prisma`. With a compatible, configured **Supabase** PostgreSQL instance, run `pnpm exec prisma validate`, `pnpm exec prisma migrate deploy`, and `pnpm exec prisma generate` from `frontend` before starting the app. The initial migration uses `auth.users`, `auth.role()` and `auth.uid()` and cannot run unchanged on plain PostgreSQL. Do not run `prisma/migrations/post_migrate.sql` after `migrate deploy`: it duplicates parts of the initial migration. Do not run `prisma/seed.ts` for a public news feed: it contains fabricated demonstration articles. Never reset an existing database to troubleshoot migrations.

To trigger ingestion manually, send `POST /api/ingest` with `Authorization: Bearer <INGEST_SECRET>`; for example, `curl -X POST http://localhost:3000/api/ingest -H "Authorization: Bearer $INGEST_SECRET"`. Configure an external scheduler to call this endpoint every 10–15 minutes. Visible tabs check for source updates every 60 seconds. New results are offered through a button and applied only when the reader chooses; hidden tabs pause polling. Polling does not guarantee immediate coverage. `GET /api/status` reports `not_configured`, `operational`, `awaiting_first_ingestion`, or `unavailable` database states; the live read-through feed is explicitly marked as nonpersistent.

## Checks

From `frontend`: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`. `GET /api/articles` supports `category`, `tag`, `search`, `limit`, and `offset`; `GET /api/status` reports persistence or live read-through status.

See [TASKS.md](TASKS.md) for actual verification results and remaining work. Operational details are in `docs/DEPLOYMENT.md` and source notes in `docs/NEWS_SOURCES.md`.


## Editorial reader

The news desk combines a lead story, five compact latest headlines, and a topic overview derived from the loaded feed. Research pages emphasize source abstracts/excerpts. Source/search/tag filters combine; the tag control is hidden when no tags are available. Editorial/Compact is a browser-stored layout preference; news defaults to Editorial and collections to Compact when no preference exists.

Collections have their own URLs: `/saved` and `/liked`. Existing browser selections are preserved, including archived metadata and unavailable older references. The loaded feed remains unchanged during background checks until you click `N new stories` or `Feed updated`. Filters and collections are preserved when applying an update. Poll failures keep displayed stories available. Illustrative fallback photos are labeled, and imagery is omitted from compact rows and research abstracts.

Run `node scripts/verify-preview.mjs` from `frontend` while the demo is running to verify all ten section/collection pages, article previews, RSS and API checks. Design details and regression outcomes are recorded in `docs/EDITORIAL_DESK.md` and `TASKS.md`.

