import assert from "node:assert/strict"
import { performance } from "node:perf_hooks"
import { XMLValidator } from "fast-xml-parser"

const base = process.argv[2] ?? "http://localhost:3000"
const routes = [
  ["/news", "All News"], ["/news/breaking", "Breaking"],
  ["/news/ai-models", "AI Models"], ["/news/research", "Research"],
  ["/news/companies", "Companies"], ["/news/open-source", "Open Source"],
  ["/news/ai-policy", "AI Policy"], ["/news/ai-hardware", "AI Hardware"],
  ["/saved", "Saved"], ["/liked", "Liked"],
]
for (const [path, title] of routes) {
  const start = performance.now()
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) })
  const html = await response.text()
  assert.equal(response.status, 200, path)
  assert.ok(html.includes(`<title>${title} | AI News</title>`), `${path}: title`)
  console.log(`${path}: HTTP 200, ${Math.round(performance.now() - start)} ms`)
}
const feedResponse = await fetch(new URL("/api/articles", base))
assert.equal(feedResponse.status, 200)
const feed = await feedResponse.json()
assert.ok(Array.isArray(feed.data))
console.log(`Feed: ${feed.data.length} genuine source articles, mode ${feed.mode ?? "database"}`)
if (feed.data.length) {
  const response = await fetch(new URL(`/article/${feed.data[0].slug}`, base))
  assert.equal(response.status, 200, "article preview")
  console.log("Article preview: HTTP 200")
}
const missing = await fetch(new URL("/news/not-a-category", base))
const missingHtml = await missing.text()
// Next.js can send HTTP 200 after a loading boundary has started streaming.
assert.ok([200, 404].includes(missing.status), "unknown category status")
assert.ok(missingHtml.includes("Page Not Found"), "unknown category UI")
assert.ok(/name="robots" content="noindex"/.test(missingHtml), "unknown category noindex")
console.log(`Unknown category: missing-page UI + noindex, HTTP ${missing.status}`)

const rss = await fetch(new URL("/rss", base))
assert.equal(rss.status, 200)
assert.ok(rss.headers.get("content-type").includes("application/rss+xml"))
assert.equal(XMLValidator.validate(await rss.text()), true)
console.log("RSS: HTTP 200, valid RSS XML")
for (const query of ["limit=0", "offset=-1"]) {
  const response = await fetch(new URL(`/api/articles?${query}`, base))
  assert.equal(response.status, 400, query)
}
const search = await fetch(new URL("/api/articles?search=zzzz-no-matching-ai-news-qa", base)).then(response => response.json())
assert.deepEqual(search.data, [])
const research = await fetch(new URL("/api/articles?category=Research", base)).then(response => response.json())
assert.ok(research.data.every(article => article.category === "Research"))
const single = await fetch(new URL("/api/articles?limit=1", base)).then(response => response.json())
assert.ok(single.data.length <= 1)
const unauthorized = await fetch(new URL("/api/ingest", base), { method: "POST" })
assert.equal(unauthorized.status, 401)
const status = await fetch(new URL("/api/status", base)).then(response => response.json())
assert.ok(typeof status.databaseStatus === "string")
console.log(`API search, category, pagination and unauthorized ingestion checks passed. Database: ${status.databaseStatus}`)
