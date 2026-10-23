# Architecture

`frontend/src/app` holds Next.js App Router pages and route handlers. Server Components read articles through `src/lib/articles.ts`. With a configured PostgreSQL URL, Prisma reads the `Article`, `Source` and `Tag` tables. Without it, `src/lib/news/ingest.ts` concurrently reads five public feeds and keeps the last successful result in process memory for 60 seconds. This read-through mode is transient.

`POST /api/ingest` requires a server-only bearer token and writes normalized metadata to the existing Prisma schema. `ingest-core.ts` isolates failures by source, rejects invalid timestamps and URLs, strips tracking query parameters, checks basic AI relevance, and deduplicates within each source batch by canonical URL. The Prisma adapter inserts each batch with one `createMany({ skipDuplicates: true })` call. Existing unique URL and slug constraints provide the concurrency guard; only successful inserts count as inserted. Publication time and database fetch time are distinct fields. `GET /api/articles` supports pagination and filters; `GET /api/status` distinguishes an absent database configuration, a failed database connection, an empty database, and an operational database.

The database configuration helper only checks whether the runtime URL is syntactically usable and non-placeholder. It does not prove connectivity or that migrations ran. `POST /api/ingest` checks the `Source` table before fetching feeds and returns a 503 for a missing or unavailable schema. API errors use generic messages so connection strings and upstream exception details are not returned.

The browser receives only article metadata. It refreshes the Server Component feed every 60 seconds. A deployment scheduler must invoke ingestion; no scheduler is installed in this repository.

The initial migration includes Supabase `auth` schema dependencies. It has not been applied in this environment; the local database URLs are placeholders. The read-through cache is not durable storage and does not prove the Prisma insert path.
