# Deployment

Deploy `frontend/` as a Next.js Node.js application. Configure server-only `DATABASE_URL`, `DIRECT_URL`, and a long random `INGEST_SECRET`. Run the existing Prisma migration before enabling ingestion. `NEXT_PUBLIC_APP_URL` may be set to the public URL. Never use `NEXT_PUBLIC_` for database or ingestion secrets.

Configure a hosting scheduler or external cron to call `POST https://<site>/api/ingest` every 10–15 minutes with `Authorization: Bearer <INGEST_SECRET>`. The handler returns per-source counts and errors. Source failures do not stop later sources. Check `GET /api/status` for the last successful ingestion, article count and source error counts. Frontend refreshes approximately every minute while open.

Without PostgreSQL, the app can display live source metadata via read-through mode but cannot persist it. Its in-memory last-known-good cache is lost on process restart and is not shared across server instances. This mode is suitable for preview, not durable production. Source outages and rate limits can delay updates. No scheduler or deployment was configured in this work session.
