# Database Schema — AI News Platform

> **Version**: 1.0 | **Phase**: 2 (Backend) | **Engine**: PostgreSQL via Supabase
> **ORM**: Prisma 6 | **Last Updated**: 2026-07-29

---

## Design Principles

1. **Frontend parity** — Schema maps 1:1 to the existing `Article` TypeScript interface
2. **Normalized taxonomy** — Tags use a proper many-to-many join table (not JSONB arrays)
3. **Future-proofed for AI** — Embedding column (`vector(768)`) and full-text search (`tsvector`) built in from day one
4. **Supabase Auth integration** — `profiles` table synced via database trigger on `auth.users`
5. **Snake_case DB, camelCase TypeScript** — Prisma `@map()` bridges the convention gap

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    sources ||--o{ articles : "has many"
    articles ||--o{ article_tags : "tagged with"
    tags ||--o{ article_tags : "applied to"
    profiles ||--o{ user_bookmarks : "bookmarks"
    articles ||--o{ user_bookmarks : "bookmarked by"
    profiles ||--o{ reading_history : "read by"
    articles ||--o{ reading_history : "read"

    sources {
        uuid id PK
        varchar name
        varchar slug UK
        text website_url
        text feed_url UK
        varchar feed_type
        varchar category
        text description
        text icon_url
        timestamptz last_fetched_at
        int fetch_interval_minutes
        int error_count
        boolean is_active
        decimal credibility_score
        timestamptz created_at
        timestamptz updated_at
    }

    articles {
        uuid id PK
        uuid source_id FK
        text title
        varchar slug UK
        text url UK
        varchar author
        text summary
        text ai_summary
        text content
        text image_url
        varchar category
        int reading_time
        int word_count
        timestamptz published_at
        timestamptz fetched_at
        timestamptz created_at
        timestamptz updated_at
        vector embedding
        tsvector search_vector
    }

    tags {
        uuid id PK
        varchar name UK
        varchar slug UK
        timestamptz created_at
    }

    article_tags {
        uuid article_id PK_FK
        uuid tag_id PK_FK
    }

    profiles {
        uuid id PK_FK
        text email
        text full_name
        text avatar_url
        jsonb preferences
        timestamptz created_at
        timestamptz updated_at
    }

    user_bookmarks {
        uuid user_id PK_FK
        uuid article_id PK_FK
        timestamptz created_at
    }

    reading_history {
        uuid id PK
        uuid user_id FK
        uuid article_id FK
        timestamptz read_at
        int progress_percentage
    }
```

---

## Table Definitions

### 1. `sources` — RSS Feed Sources

Tracks each news source/feed the platform ingests from.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | PK, `gen_random_uuid()` | Unique identifier |
| `name` | `VARCHAR(255)` | NOT NULL | Human-readable name (e.g. "TechCrunch AI") |
| `slug` | `VARCHAR(255)` | UNIQUE, NOT NULL | URL-safe identifier |
| `website_url` | `TEXT` | NOT NULL | Publisher's homepage |
| `feed_url` | `TEXT` | UNIQUE, NOT NULL | RSS/Atom/JSON feed URL |
| `feed_type` | `VARCHAR(50)` | DEFAULT `'rss'` | `rss`, `atom`, `json`, `scraper` |
| `category` | `VARCHAR(100)` | DEFAULT `'General AI'` | Source category |
| `description` | `TEXT` | nullable | Source description |
| `icon_url` | `TEXT` | nullable | Favicon/logo URL |
| `last_fetched_at` | `TIMESTAMPTZ` | nullable | When feed was last polled |
| `fetch_interval_minutes` | `INT` | DEFAULT `30` | Polling frequency |
| `error_count` | `INT` | DEFAULT `0` | Consecutive fetch failures |
| `is_active` | `BOOLEAN` | DEFAULT `true` | Whether feed is active |
| `credibility_score` | `DECIMAL(3,2)` | DEFAULT `1.00`, CHECK `0.00–1.00` | Trust score |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Row creation time |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Last update time |

---

### 2. `articles` — News Articles

Core content table. Maps directly to the frontend `Article` TypeScript interface.

| Column | Type | Constraints | Frontend Field | Description |
|--------|------|-------------|----------------|-------------|
| `id` | `UUID` | PK, `gen_random_uuid()` | `id` | Unique identifier |
| `source_id` | `UUID` | FK → `sources.id`, CASCADE | — | Which source this came from |
| `title` | `TEXT` | NOT NULL | `title` | Article headline |
| `slug` | `VARCHAR(512)` | UNIQUE, NOT NULL | `slug` | URL-safe identifier |
| `url` | `TEXT` | UNIQUE, NOT NULL | `url` | Original article URL |
| `author` | `VARCHAR(255)` | nullable | — | Article author |
| `summary` | `TEXT` | nullable | `summary` | Feed excerpt / description |
| `ai_summary` | `TEXT` | nullable | — | AI-generated summary (Phase 3) |
| `content` | `TEXT` | nullable | — | Full article text (extracted) |
| `image_url` | `TEXT` | nullable | `imageUrl` | Cover image URL |
| `category` | `VARCHAR(50)` | NOT NULL | `category` | `Research`, `Industry`, `Policy`, `Hardware` |
| `reading_time` | `INT` | nullable | `readingTime` | Estimated minutes to read |
| `word_count` | `INT` | nullable | — | Total word count |
| `published_at` | `TIMESTAMPTZ` | NOT NULL | `publishedAt` | Original publish date |
| `fetched_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | — | When we fetched it |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | — | Row creation time |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | — | Last update time |
| `embedding` | `vector(768)` | nullable | — | Gemini text-embedding-004 (Phase 3) |
| `search_vector` | `tsvector` | GENERATED STORED | — | Weighted FTS column |

**Frontend ↔ Schema Mapping for `Article` interface:**

```
Frontend (types.ts)    →  Database (articles table)
─────────────────────     ───────────────────────────
id: string             →  id (UUID)
title: string          →  title (TEXT)
source: string         →  source.name via JOIN
summary: string        →  summary (TEXT)
publishedAt: string    →  published_at (TIMESTAMPTZ)
url: string            →  url (TEXT)
tags: string[]         →  JOIN article_tags → tags
slug: string           →  slug (VARCHAR)
category: enum         →  category (VARCHAR)
imageUrl?: string      →  image_url (TEXT)
readingTime?: number   →  reading_time (INT)
```

---

### 3. `tags` — Taxonomy Tags

Normalized tag table for many-to-many relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | PK, `gen_random_uuid()` | Unique identifier |
| `name` | `VARCHAR(100)` | UNIQUE, NOT NULL | Display name (e.g. "GPT-5") |
| `slug` | `VARCHAR(100)` | UNIQUE, NOT NULL | URL-safe (e.g. "gpt-5") |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Row creation time |

---

### 4. `article_tags` — Join Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `article_id` | `UUID` | PK, FK → `articles.id`, CASCADE | Article reference |
| `tag_id` | `UUID` | PK, FK → `tags.id`, CASCADE | Tag reference |

---

### 5. `profiles` — User Profiles (Supabase Auth)

Extends `auth.users` with app-specific fields. Rows created automatically via database trigger.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | PK, FK → `auth.users.id`, CASCADE | Supabase Auth user ID |
| `email` | `TEXT` | nullable | User email |
| `full_name` | `TEXT` | nullable | Display name |
| `avatar_url` | `TEXT` | nullable | Profile picture URL |
| `preferences` | `JSONB` | DEFAULT (see below) | User settings |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Row creation time |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Last update time |

Default preferences:
```json
{
  "theme": "system",
  "digest_frequency": "daily",
  "preferred_categories": []
}
```

---

### 6. `user_bookmarks` — Saved Articles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `UUID` | PK, FK → `profiles.id`, CASCADE | User reference |
| `article_id` | `UUID` | PK, FK → `articles.id`, CASCADE | Article reference |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | When bookmarked |

> **Note**: The frontend currently stores bookmarks in LocalStorage (`useBookmarks` hook). This table enables server-side sync when auth is added (BD9).

---

### 7. `reading_history` — Article Read Tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | PK, `gen_random_uuid()` | Unique identifier |
| `user_id` | `UUID` | FK → `profiles.id`, CASCADE | User reference |
| `article_id` | `UUID` | FK → `articles.id`, CASCADE | Article reference |
| `read_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | When article was read |
| `progress_percentage` | `INT` | DEFAULT `100` | Read progress (0-100) |

---

## PostgreSQL Extensions Required

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- Fuzzy title matching / deduplication
CREATE EXTENSION IF NOT EXISTS "vector";       -- pgvector embeddings (Phase 3)
```

---

## Full-Text Search Configuration

The `search_vector` column is a **generated stored column** with weighted fields:

```sql
search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED
```

- **Weight A** (highest): Title — most relevant for search ranking
- **Weight B**: Summary — secondary relevance
- **Weight C** (lowest): Content — broad match

Query pattern:
```sql
SELECT id, title, ts_rank(search_vector, query) AS rank
FROM articles, websearch_to_tsquery('english', $1) AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

---

## Indexing Strategy

```sql
-- 1. Homepage feed: latest articles sorted by date
CREATE INDEX idx_articles_published_at ON articles (published_at DESC);

-- 2. Source-filtered feed
CREATE INDEX idx_articles_source_published ON articles (source_id, published_at DESC);

-- 3. Full-text search (GIN index on tsvector)
CREATE INDEX idx_articles_search_vector ON articles USING GIN (search_vector);

-- 4. Fuzzy title deduplication (pg_trgm trigram index)
CREATE INDEX idx_articles_title_trgm ON articles USING GIN (title gin_trgm_ops);

-- 5. Vector similarity search (HNSW — Phase 3)
-- CREATE INDEX idx_articles_embedding_hnsw ON articles
-- USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- 6. Active feed polling queue (partial index)
CREATE INDEX idx_sources_active_fetch ON sources (last_fetched_at ASC)
WHERE is_active = true;

-- 7. User interaction lookups
CREATE INDEX idx_bookmarks_user ON user_bookmarks (user_id, created_at DESC);
CREATE INDEX idx_reading_history_user ON reading_history (user_id, read_at DESC);

-- 8. Category filtering
CREATE INDEX idx_articles_category ON articles (category, published_at DESC);
```

---

## Supabase Auth Sync Trigger

Automatically creates a `profiles` row when a new user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Row Level Security (RLS) Policies

```sql
-- Articles: public read, service-role write
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON articles FOR SELECT USING (true);
CREATE POLICY "Service role write" ON articles FOR ALL
  USING (auth.role() = 'service_role');

-- Sources: public read, service-role write
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON sources FOR SELECT USING (true);
CREATE POLICY "Service role write" ON sources FOR ALL
  USING (auth.role() = 'service_role');

-- Tags: public read, service-role write
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Service role write" ON tags FOR ALL
  USING (auth.role() = 'service_role');

-- Article tags: public read, service-role write
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON article_tags FOR SELECT USING (true);
CREATE POLICY "Service role write" ON article_tags FOR ALL
  USING (auth.role() = 'service_role');

-- Profiles: users can read/update own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Bookmarks: users manage own bookmarks
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON user_bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reading history: users manage own history
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON reading_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## Prisma Schema (Reference)

This is the Prisma ORM representation. The actual `schema.prisma` file will be created in BD3.

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  directUrl  = env("DIRECT_URL")
  extensions = [pgvector(map: "vector"), pg_trgm, uuidOssp(map: "uuid-ossp")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

model Source {
  id                   String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name                 String    @db.VarChar(255)
  slug                 String    @unique @db.VarChar(255)
  websiteUrl           String    @map("website_url")
  feedUrl              String    @unique @map("feed_url")
  feedType             String    @default("rss") @map("feed_type") @db.VarChar(50)
  category             String    @default("General AI") @db.VarChar(100)
  description          String?
  iconUrl              String?   @map("icon_url")
  lastFetchedAt        DateTime? @map("last_fetched_at") @db.Timestamptz
  fetchIntervalMinutes Int       @default(30) @map("fetch_interval_minutes")
  errorCount           Int       @default(0) @map("error_count")
  isActive             Boolean   @default(true) @map("is_active")
  credibilityScore     Decimal   @default(1.00) @map("credibility_score") @db.Decimal(3, 2)
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  articles             Article[]
  @@map("sources")
}

model Article {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sourceId     String   @map("source_id") @db.Uuid
  source       Source   @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  title        String
  slug         String   @unique @db.VarChar(512)
  url          String   @unique
  author       String?  @db.VarChar(255)
  summary      String?
  aiSummary    String?  @map("ai_summary")
  content      String?
  imageUrl     String?  @map("image_url")
  category     String   @db.VarChar(50)
  readingTime  Int?     @map("reading_time")
  wordCount    Int?     @map("word_count")
  publishedAt  DateTime @map("published_at") @db.Timestamptz
  fetchedAt    DateTime @default(now()) @map("fetched_at") @db.Timestamptz
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz
  embedding    Unsupported("vector(768)")?
  searchVector Unsupported("tsvector")?     @map("search_vector")
  tags         ArticleTag[]
  bookmarks    UserBookmark[]
  history      ReadingHistory[]
  @@index([publishedAt(sort: Desc)])
  @@index([sourceId, publishedAt(sort: Desc)])
  @@index([category, publishedAt(sort: Desc)])
  @@map("articles")
}

model Tag {
  id        String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String       @unique @db.VarChar(100)
  slug      String       @unique @db.VarChar(100)
  createdAt DateTime     @default(now()) @map("created_at") @db.Timestamptz
  articles  ArticleTag[]
  @@map("tags")
}

model ArticleTag {
  articleId String  @map("article_id") @db.Uuid
  tagId     String  @map("tag_id") @db.Uuid
  article   Article @relation(fields: [articleId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([articleId, tagId])
  @@map("article_tags")
}

model Profile {
  id          String         @id @db.Uuid
  email       String?
  fullName    String?        @map("full_name")
  avatarUrl   String?        @map("avatar_url")
  preferences Json?          @default("{\"theme\":\"system\",\"digest_frequency\":\"daily\",\"preferred_categories\":[]}")
  createdAt   DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime       @updatedAt @map("updated_at") @db.Timestamptz
  bookmarks   UserBookmark[]
  history     ReadingHistory[]
  @@map("profiles")
}

model UserBookmark {
  userId    String   @map("user_id") @db.Uuid
  articleId String   @map("article_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  user      Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  @@id([userId, articleId])
  @@map("user_bookmarks")
}

model ReadingHistory {
  id                 String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId             String   @map("user_id") @db.Uuid
  articleId          String   @map("article_id") @db.Uuid
  readAt             DateTime @default(now()) @map("read_at") @db.Timestamptz
  progressPercentage Int?     @default(100) @map("progress_percentage")
  user               Profile  @relation(fields: [userId], references: [id], onDelete: Cascade)
  article            Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  @@map("reading_history")
}
```

---

## Deduplication Strategy

When ingesting from RSS feeds, articles are deduplicated using:

1. **URL unique constraint** — Primary check, rejects exact duplicate URLs
2. **Content hash** — `SHA-256(normalized_title + published_at)` stored for comparison
3. **Fuzzy title matching** — `pg_trgm` with `similarity() > 0.85` catches syndicated articles

```sql
-- Check for near-duplicate titles before insert
SELECT id, title, similarity(title, $1) AS sim
FROM articles
WHERE title % $1 AND similarity(title, $1) > 0.85;
```

---

## Migration Plan

| Step | Migration | Contents |
|------|-----------|----------|
| BD3-a | `init_extensions` | Enable `uuid-ossp`, `pg_trgm`, `vector` |
| BD3-b | `create_tables` | All 7 tables with constraints |
| BD3-c | `create_indexes` | All 8 indexes (vector index deferred to Phase 3) |
| BD3-d | `add_rls_policies` | RLS policies for all tables |
| BD3-e | `add_auth_trigger` | Auth sync function + trigger |
