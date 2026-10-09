-- =============================================================================
-- Migration: 0_init
-- Description: Initial schema for AI News platform (7 tables, FTS, RLS, Auth Sync)
-- Matching BD2 design in docs/database/schema.md
-- =============================================================================

-- 1. Enable PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Create Table: sources
CREATE TABLE "sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "website_url" TEXT NOT NULL,
    "feed_url" TEXT NOT NULL,
    "feed_type" VARCHAR(50) NOT NULL DEFAULT 'rss',
    "category" VARCHAR(100) NOT NULL DEFAULT 'General AI',
    "description" TEXT,
    "icon_url" TEXT,
    "last_fetched_at" TIMESTAMPTZ,
    "fetch_interval_minutes" INTEGER NOT NULL DEFAULT 30,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- Create Unique Indexes on sources
CREATE UNIQUE INDEX "sources_slug_key" ON "sources"("slug");
CREATE UNIQUE INDEX "sources_feed_url_key" ON "sources"("feed_url");

-- 3. Create Table: articles
CREATE TABLE "articles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" VARCHAR(512) NOT NULL,
    "url" TEXT NOT NULL,
    "author" VARCHAR(255),
    "summary" TEXT,
    "ai_summary" TEXT,
    "content" TEXT,
    "image_url" TEXT,
    "category" VARCHAR(50) NOT NULL,
    "reading_time" INTEGER,
    "word_count" INTEGER,
    "published_at" TIMESTAMPTZ NOT NULL,
    "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- Create Unique Indexes on articles
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE UNIQUE INDEX "articles_url_key" ON "articles"("url");

-- Create Indexes on articles
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at" DESC);
CREATE INDEX "articles_source_id_published_at_idx" ON "articles"("source_id", "published_at" DESC);
CREATE INDEX "articles_category_published_at_idx" ON "articles"("category", "published_at" DESC);

-- 4. Create Table: tags
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- Create Unique Indexes on tags
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- 5. Create Table: article_tags
CREATE TABLE "article_tags" (
    "article_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("article_id", "tag_id")
);

-- 6. Create Table: profiles
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "preferences" JSONB DEFAULT '{"theme":"system","digest_frequency":"daily","preferred_categories":[]}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- 7. Create Table: user_bookmarks
CREATE TABLE "user_bookmarks" (
    "user_id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("user_id", "article_id")
);

CREATE INDEX "user_bookmarks_user_id_created_at_idx" ON "user_bookmarks"("user_id", "created_at" DESC);

-- 8. Create Table: reading_history
CREATE TABLE "reading_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "article_id" UUID NOT NULL,
    "read_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progress_percentage" INTEGER DEFAULT 100,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "reading_history_user_id_read_at_idx" ON "reading_history"("user_id", "read_at" DESC);

-- Foreign Key Constraints
ALTER TABLE "articles" ADD CONSTRAINT "articles_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =============================================================================
-- Advanced PostgreSQL Features (FTS, Trigram, RLS, Auth Trigger)
-- =============================================================================

-- Full-Text Search vector column (generated stored)
ALTER TABLE "articles"
ADD COLUMN IF NOT EXISTS "search_vector" tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;

CREATE INDEX IF NOT EXISTS "idx_articles_search_vector" ON "articles" USING GIN ("search_vector");

-- Trigram Index for title deduplication
CREATE INDEX IF NOT EXISTS "idx_articles_title_trgm" ON "articles" USING GIN ("title" gin_trgm_ops);

-- Partial index for active feed fetching
CREATE INDEX IF NOT EXISTS "idx_sources_active_fetch" ON "sources" ("last_fetched_at" ASC) WHERE "is_active" = true;

-- Supabase Auth sync trigger
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS)
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access on articles" ON "articles" FOR SELECT USING (true);
CREATE POLICY "Service role write on articles" ON "articles" FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE "sources" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access on sources" ON "sources" FOR SELECT USING (true);
CREATE POLICY "Service role write on sources" ON "sources" FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access on tags" ON "tags" FOR SELECT USING (true);
CREATE POLICY "Service role write on tags" ON "tags" FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE "article_tags" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access on article_tags" ON "article_tags" FOR SELECT USING (true);
CREATE POLICY "Service role write on article_tags" ON "article_tags" FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON "profiles" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON "profiles" FOR UPDATE USING (auth.uid() = id);

ALTER TABLE "user_bookmarks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON "user_bookmarks" FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE "reading_history" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own history" ON "reading_history" FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
