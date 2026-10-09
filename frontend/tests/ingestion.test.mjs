import test from "node:test"
import assert from "node:assert/strict"
import { aiRelevant, articleSlug, canonicalUrl, ingestSources } from "../src/lib/news/ingest-core.ts"
import { getDatabaseConfiguration } from "../src/lib/database-config.ts"
import { isIngestAuthorized } from "../src/lib/ingest-auth.ts"
import { summarizeDatabaseHealth } from "../src/lib/status-core.ts"
import { toArticle } from "../src/lib/article-mapper.ts"

const publishedAt = new Date("2026-10-09T08:00:00Z")

function candidate(url = "https://example.org/ai-story") {
  return { title: "New AI model released", url, summary: "A model update", publishedAt, category: "Industry" }
}

function source(name, load) {
  return { name, slug: name.toLowerCase(), websiteUrl: "https://example.org", feedUrl: `https://example.org/${name}`, feedType: "rss", category: "Industry", load }
}

function memoryStore() {
  const articles = new Map()
  const health = new Map()
  let insertCalls = 0
  return {
    articles,
    health,
    get insertCalls() { return insertCalls },
    async upsertSource(item) { return { id: item.slug } },
    async insertArticles(batch) {
      insertCalls++
      let count = 0
      for (const article of batch) {
        if (!articles.has(article.url)) { articles.set(article.url, article); count++ }
      }
      return count
    },
    async markSourceSuccess(id, at) { health.set(id, { lastFetchedAt: at, errorCount: 0 }) },
    async markSourceFailure(id) { health.set(id, { lastFetchedAt: null, errorCount: 1 }) },
  }
}

test("canonical URLs remove tracking and fragments; slugs remain stable", () => {
  const first = canonicalUrl("https://Example.org/ai-story/?utm_source=feed&x=1#section")
  const second = canonicalUrl("https://example.org/ai-story?x=1")
  assert.equal(first, second)
  assert.equal(articleSlug("New AI model released", first), articleSlug("New AI model released", second))
  assert.equal(canonicalUrl("javascript:alert(1)"), null)
  assert.equal(aiRelevant("New AI model released", ""), true)
})

test("one atomic insert batch deduplicates canonical URLs and reports actual inserts", async () => {
  const store = memoryStore()
  const news = source("Publisher", async () => [candidate("https://example.org/ai-story?utm_source=rss"), candidate("https://example.org/ai-story")])
  const first = await ingestSources([news], store)
  const second = await ingestSources([news], store)
  assert.equal(first[0].fetched, 2)
  assert.equal(first[0].inserted, 1)
  assert.equal(second[0].inserted, 0)
  assert.equal(store.articles.size, 1)
  assert.equal(store.insertCalls, 2)
  assert.equal(store.articles.values().next().value.sourceId, "publisher")
})

test("simultaneous ingestion uses duplicate-safe batch result for each inserted count", async () => {
  const store = memoryStore()
  const news = source("Publisher", async () => [candidate()])
  const [first, second] = await Promise.all([ingestSources([news], store), ingestSources([news], store)])
  assert.deepEqual([first[0].inserted, second[0].inserted].sort(), [0, 1])
  assert.equal(store.articles.size, 1)
  assert.equal(store.insertCalls, 2)
})

test("one failed source does not prevent the next source from inserting", async () => {
  const store = memoryStore()
  const broken = source("Broken", async () => { throw new Error("private connection detail") })
  const healthy = source("Healthy", async () => [candidate()])
  const results = await ingestSources([broken, healthy], store)
  assert.equal(results[0].error, "source_fetch_failed")
  assert.equal(JSON.stringify(results).includes("private connection detail"), false)
  assert.equal(results[1].inserted, 1)
  assert.equal(store.health.get("broken").errorCount, 1)
  assert.equal(store.health.get("healthy").errorCount, 0)
})

test("configured, missing, placeholder and invalid database URLs are distinct", () => {
  assert.deepEqual(getDatabaseConfiguration(""), { configured: false, reason: "missing" })
  assert.deepEqual(getDatabaseConfiguration("postgresql://user:your-password@db.example.org/app"), { configured: false, reason: "placeholder" })
  assert.deepEqual(getDatabaseConfiguration("https://db.example.org/app"), { configured: false, reason: "invalid" })
  assert.deepEqual(getDatabaseConfiguration("postgresql://user:pass@db.example.org/app"), { configured: true })
})

test("empty database reports awaiting first ingestion; health reports counts and freshness", () => {
  const empty = summarizeDatabaseHealth([], 0, new Date("2026-10-09T09:00:00Z"))
  assert.equal(empty.databaseStatus, "awaiting_first_ingestion")
  assert.equal(empty.articleCount, 0)
  const health = summarizeDatabaseHealth([{ name: "Publisher", lastFetchedAt: publishedAt, errorCount: 2, isActive: true, articleCount: 3 }], 3, new Date("2026-10-09T09:30:00Z"))
  assert.equal(health.status, "stale")
  assert.equal(health.sources[0].articleCount, 3)
  assert.equal(health.sources[0].errorCount, 2)
})

test("article row mapping preserves persisted source and publication metadata", () => {
  const article = toArticle({ id: "id-1", title: "New AI model released", summary: null, publishedAt, url: "https://example.org/ai-story", slug: "new-ai-model", category: "Industry", imageUrl: null, readingTime: null, source: { name: "Publisher" }, tags: [{ tag: { name: "AI" } }] })
  assert.equal(article.source, "Publisher")
  assert.equal(article.publishedAt, "2026-10-09T08:00:00.000Z")
  assert.deepEqual(article.tags, ["AI"])
})

test("ingestion authentication rejects missing or wrong tokens", () => {
  const request = (authorization) => new Request("http://localhost/api/ingest", { method: "POST", headers: authorization ? { authorization } : {} })
  assert.equal(isIngestAuthorized(request(null), "correct"), false)
  assert.equal(isIngestAuthorized(request("Bearer wrong"), "correct"), false)
  assert.equal(isIngestAuthorized(request("Bearer correct"), "correct"), true)
  assert.equal(isIngestAuthorized(request("Bearer correct"), ""), false)
})
