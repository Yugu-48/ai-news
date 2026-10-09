# AI News — Roadmap

How to use this: work on **one numbered step at a time**. When you talk to Mimo/Cursor,
tell it only that one step (e.g. "Do FD1, nothing else"). Check it off. Move to the next.
Never paste a whole phase at once — that's how you lost track before.

Current status: repo scaffolding done, no app code yet. **Next action: FD1.**

---

## PHASE 1 — FRONTEND (mock data, no backend)

### Setup
- [x] **FD1** — Initialize Next.js in `frontend/`: `pnpm create next-app@latest frontend` → select TypeScript, Tailwind, App Router. Verify `pnpm dev` runs and shows the default page.
- [x] **FD2** — Install and initialize Shadcn/UI in the frontend. Add just one test component (e.g. Button) to confirm it works.
- [x] **FD3** — Set up root layout (`app/layout.tsx`): fonts, base HTML structure, metadata placeholder. No styling yet, just structure.

### Design foundation
- [x] **FD4** — Define design tokens in `tailwind.config.ts`: color palette, font sizes, spacing scale. Write these into `docs/ui/colors.md` and `docs/ui/typography.md` as you decide them.
- [x] **FD5** — Build 2-3 core UI primitives via Shadcn (Button, Card, Badge). No page yet — just confirm they render in isolation.

### Layout shell
- [x] **FD6** — Build Navbar component (logo, nav links, placeholder for dark-mode toggle).
- [x] **FD7** — Build Footer component.
- [x] **FD8** — Wire Navbar + Footer into root layout so every page has them.

### Mock data
- [x] **FD9** — Define the `Article` TypeScript type (title, source, summary, publishedAt, url, tags, etc.) in `frontend/lib/types.ts`.
- [x] **FD10** — Create `frontend/lib/mock-data.ts` with ~10-15 realistic fake articles matching the `Article` type.

### Core pages
- [x] **FD11** — Build `ArticleCard` component (single article preview, uses mock data type).
- [x] **FD12** — Build homepage (`app/page.tsx`): grid/list of `ArticleCard`s from mock data.
- [x] **FD13** — Build article detail page (`app/article/[slug]/page.tsx`): full article view, dynamic route from mock data.
- [x] **FD14** — Build search/filter UI: client-side filter over mock data by keyword and/or tag. No real search backend yet.

### Polish (Phase 1 gate)
- [x] **FD15** — Responsive pass: check mobile, tablet, desktop breakpoints on every page built so far.
- [x] **FD16** — Dark/light mode toggle, wired to Navbar.
- [x] **FD17** — Accessibility pass: keyboard navigation, alt text, color contrast (WCAG AA).
- [x] **FD18** — SEO metadata: Next.js Metadata API on each page, Open Graph tags.
- [x] **FD19** — Run Lighthouse audit, fix anything scoring under 90.

**Phase 1 gate:** all boxes above checked → deploy to Vercel now, even with mock data. Seeing it live is a real milestone and catches issues early.

- [x] **FD20** — Deploy `frontend/` to Vercel. Confirm live URL works end-to-end.

---

## PHASE 2 — BACKEND (real data, no AI yet)

Don't start this until Phase 1 is fully checked off and deployed.

- [x] **BD1** — Create Supabase project. Store credentials in `.env.local` (never commit this).
- [x] **BD2** — Design the database schema on paper first: `articles`, `sources` tables minimum. Write it into `docs/database/schema.md` before touching code.
- [x] **BD3** — Set up Prisma, connect to Supabase Postgres, run first migration matching BD2's schema.
- [x] **BD4** — Build one real API route: `GET /api/articles` returning real DB rows (seed the DB manually with a few rows first).
- [x] **BD5** — Replace mock data in the homepage (FD12) with a real fetch from BD4. Confirm it still renders correctly.
- [x] **BD6** — Replace article detail page (FD13) with real data fetch by ID/slug.
- [ ] **BD7** — Build RSS ingestion script: fetch 1-2 RSS feeds, parse, insert into `articles` table manually (run by hand, not automated yet).
- [ ] **BD8** — Automate BD7 as a scheduled job (cron / Vercel cron / worker) so articles come in on their own.
- [ ] **BD9** — Add Supabase Auth: basic signup/login, even if nothing is gated yet.
- [ ] **BD10** — Only now, if pages are actually slow: add caching. Don't add Redis before this point.

**Phase 2 gate:** homepage shows real, auto-updating articles from at least one live RSS source.

---

## PHASE 3 — AI PIPELINE

Don't start until Phase 2 gate is met.

- [ ] **AI1** — Get Gemini API key, test one summarization call in isolation (script, not integrated yet).
- [ ] **AI2** — Add summarization to the ingestion pipeline (BD8): each new article gets an AI summary stored in DB.
- [ ] **AI3** — Add duplicate detection (start simple: title similarity) before ranking/embeddings.
- [ ] **AI4** — Add embeddings + vector search (pick vector store once you're here — don't decide now).
- [ ] **AI5** — Semantic search UI, replacing the keyword filter from FD14.
- [ ] **AI6** — Basic ranking/trending logic.
- [ ] **AI7** — AI chat over news (stretch goal — only after AI1-AI6 are solid).

---

## PHASE 4 — PRODUCTION HARDENING

- [ ] **PR1** — Analytics (page views, basic usage).
- [ ] **PR2** — Monitoring/error tracking on backend.
- [ ] **PR3** — Newsletter generation.
- [ ] **PR4** — Admin dashboard.
- [ ] **PR5** — Scaling review (caching, DB indexing, rate limits) based on real usage data, not guesses.

---

## Full stack reference

| Layer | Choice | Status |
|---|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript strict, Tailwind, Shadcn/UI | Active — Phase 1 |
| Hosting (frontend) | Vercel | Deploy at FD20 |
| Backend/DB | Supabase (Postgres + Auth) | Phase 2 |
| ORM | Prisma | Phase 2 |
| AI | Gemini (primary), OpenAI-compatible (fallback) | Phase 3 |
| Caching | None yet — add only if BD10 proves necessary | Deferred |

## Rule going forward
One numbered step per prompt to your CLI. If a step feels too big to explain in one sentence, it's actually two steps — split it before you run it.
