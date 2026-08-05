-- AI News — Post-migration SQL for features Prisma cannot manage
-- Run this AFTER `prisma migrate dev` completes the initial schema.
--
-- Extensions: uuid-ossp (Supabase default), pg_trgm, vector
-- Full-text search: tsvector generated column + GIN index
-- Deduplication: pg_trgm trigram index on article titles
-- Auth sync: trigger on auth.users → public.profiles

-- =============================================================================
-- 1. Enable PostgreSQL Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- Uncomment when ready for Phase 3 (AI embeddings):
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- =============================================================================
-- 2. Add Full-Text Search vector column (generated stored)
-- =============================================================================
-- Prisma's Unsupported type doesn't handle generated columns well,
-- so we add this via raw SQL.
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;

-- GIN index for full-text search queries
CREATE INDEX IF NOT EXISTS idx_articles_search_vector
ON articles USING GIN (search_vector);

-- =============================================================================
-- 3. Trigram index for fuzzy title deduplication
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm
ON articles USING GIN (title gin_trgm_ops);

-- =============================================================================
-- 4. Active source polling queue (partial index)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_sources_active_fetch
ON sources (last_fetched_at ASC)
WHERE is_active = true;

-- =============================================================================
-- 5. Supabase Auth → profiles sync trigger
-- =============================================================================
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

-- Drop existing trigger if present (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 6. Row Level Security (RLS)
-- =============================================================================

-- Articles: public read, service-role write
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON articles;
CREATE POLICY "Public read access" ON articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write" ON articles;
CREATE POLICY "Service role write" ON articles FOR ALL
  USING (auth.role() = 'service_role');

-- Sources: public read, service-role write
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON sources;
CREATE POLICY "Public read access" ON sources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write" ON sources;
CREATE POLICY "Service role write" ON sources FOR ALL
  USING (auth.role() = 'service_role');

-- Tags: public read, service-role write
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON tags;
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write" ON tags;
CREATE POLICY "Service role write" ON tags FOR ALL
  USING (auth.role() = 'service_role');

-- Article tags: public read, service-role write
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON article_tags;
CREATE POLICY "Public read access" ON article_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write" ON article_tags;
CREATE POLICY "Service role write" ON article_tags FOR ALL
  USING (auth.role() = 'service_role');

-- Profiles: users read/update own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT
  USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Bookmarks: users manage own bookmarks
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own bookmarks" ON user_bookmarks;
CREATE POLICY "Users manage own bookmarks" ON user_bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reading history: users manage own history
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own history" ON reading_history;
CREATE POLICY "Users manage own history" ON reading_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
