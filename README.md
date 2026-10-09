# AI News

A responsive AI news reader built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and Prisma 6. The site reads current headlines from TechCrunch AI, arXiv cs.AI/cs.LG, Hacker News Algolia and Hugging Face Daily Papers. It links to original publications and displays excerpts only.

The homepage, article previews, local search and filters, theme switcher, saved and liked controls, and `/api/articles` are available. Without PostgreSQL, the site uses a live read-through feed with a 60-second in-memory cache. This mode does **not** persist articles across restarts. The database ingestion path and `/api/status` and `/api/ingest` routes are implemented, but have not been exercised against a real PostgreSQL instance in this workspace.

`fast-xml-parser` is the only new runtime dependency in this pass; it parses RSS metadata because Node.js has no built-in XML feed parser.

## Local setup

1. Use a current Node.js release and pnpm.
2. Run `cd frontend` and `pnpm install`.
3. Copy `frontend/.env.example` to `frontend/.env.local`. Configure `DATABASE_URL` and `DIRECT_URL` for persistence, and set a long random `INGEST_SECRET` before enabling ingestion. Leave the database values empty to use live read-through mode. Copy connection strings from the Supabase Dashboard's Connect dialog: use the transaction pooler for serverless runtime and a direct connection for migrations. If direct access is unavailable on an IPv4-only network, use the session pooler for the migration connection after confirming access.
4. Run `pnpm dev` and open `http://localhost:3000`.

The Prisma schema and initial migration are in `frontend/prisma`. With a compatible, configured **Supabase** PostgreSQL instance, run `pnpm exec prisma validate`, `pnpm exec prisma migrate deploy`, and `pnpm exec prisma generate` from `frontend` before starting the app. The initial migration uses `auth.users`, `auth.role()` and `auth.uid()` and cannot run unchanged on plain PostgreSQL. Do not run `prisma/migrations/post_migrate.sql` after `migrate deploy`: it duplicates parts of the initial migration. Do not run `prisma/seed.ts` for a public news feed: it contains fabricated demonstration articles. Never reset an existing database to troubleshoot migrations.

To trigger ingestion manually, send `POST /api/ingest` with `Authorization: Bearer <INGEST_SECRET>`; for example, `curl -X POST http://localhost:3000/api/ingest -H "Authorization: Bearer $INGEST_SECRET"`. Configure an external scheduler to call this endpoint every 10–15 minutes. Browser data refresh runs every 60 seconds. Polling does not guarantee immediate coverage. `GET /api/status` reports `not_configured`, `operational`, `awaiting_first_ingestion`, or `unavailable` database states; the live read-through feed is explicitly marked as nonpersistent.

## Checks

From `frontend`: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`. `GET /api/articles` supports `category`, `tag`, `search`, `limit`, and `offset`; `GET /api/status` reports persistence or live read-through status.

See [TASKS.md](TASKS.md) for actual verification results and remaining work. Operational details are in `docs/DEPLOYMENT.md` and source notes in `docs/NEWS_SOURCES.md`.
