# Architecture

`frontend/src/app` holds Next.js App Router pages and route handlers. Server Components read articles through `src/lib/articles.ts`. With a configured PostgreSQL URL, Prisma reads the `Article`, `Source` and `Tag` tables. Without it, `src/lib/news/ingest.ts` concurrently reads five public feeds and keeps the last successful result in process memory for 60 seconds. This read-through mode is transient.

`POST /api/ingest` requires a server-only bearer token and writes normalized metadata to the existing Prisma schema. It isolates failures by source, rejects invalid timestamps and URLs, strips tracking query parameters, checks basic AI relevance, and deduplicates by canonical URL. Publication time and database fetch time are distinct fields. `GET /api/articles` supports pagination and filters; `GET /api/status` reports database or read-through status.

The browser receives only article metadata. It refreshes the Server Component feed every 60 seconds. A deployment scheduler must invoke ingestion; no scheduler is installed in this repository.
