import { createHash } from "node:crypto"
import { XMLParser } from "fast-xml-parser"
import { prisma } from "@/lib/prisma"
import type { Article } from "@/lib/types"

type Category = "Research" | "Industry" | "Policy" | "Hardware"

interface Candidate {
  title: string
  url: string
  summary: string
  publishedAt: Date
  category: Category
  author?: string
}

interface NewsSource {
  name: string
  slug: string
  websiteUrl: string
  feedUrl: string
  feedType: "rss" | "api"
  category: Category
  load: () => Promise<Candidate[]>
}

const parser = new XMLParser({ ignoreAttributes: false, processEntities: true })
const timeoutMs = 12_000

function list<T>(value: T | T[] | undefined): T[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value]
}

function text(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).replace(/&#(x[0-9a-f]+|\d+);|&(amp|quot|apos|lt|gt|nbsp);/gi, (match, numeric: string | undefined, named: string | undefined) => {
      if (numeric) {
        const code = numeric.startsWith("x") ? Number.parseInt(numeric.slice(1), 16) : Number.parseInt(numeric, 10)
        return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
      }
      return ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " } as Record<string, string>)[named?.toLowerCase() ?? ""] ?? match
    }).trim()
  }
  if (value && typeof value === "object" && "#text" in value) {
    return text((value as Record<string, unknown>)["#text"])
  }
  return ""
}

function excerpt(value: unknown): string {
  return text(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500)
}

function validDate(value: unknown): Date | null {
  const date = new Date(text(value))
  return Number.isFinite(date.getTime()) && date.getTime() <= Date.now() + 86_400_000
    ? date
    : null
}

function canonicalUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key)
    }
    url.hash = ""
    return url.toString()
  } catch {
    return null
  }
}

function aiRelevant(title: string, summary: string): boolean {
  return /\b(ai|artificial intelligence|machine learning|llm|language model|neural|deep learning|chatgpt|openai|anthropic|gemini|deepmind|hugging face|nvidia|inference|transformer|robotics|agentic)\b/i.test(
    `${title} ${summary}`
  )
}

function classify(title: string, fallback: Category): Category {
  if (/\b(regulat|law|policy|safety|governance|copyright|ban)\b/i.test(title)) return "Policy"
  if (/\b(chip|gpu|hardware|data cent|semiconductor|robot)\b/i.test(title)) return "Hardware"
  if (/\b(paper|research|study|benchmark|model architecture)\b/i.test(title)) return "Research"
  return fallback
}

function articleSlug(title: string, url: string): string {
  return `${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90)}-${createHash("sha256").update(url).digest("hex").slice(0, 10)}`
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": "AI-News/1.0 (news aggregation prototype)" },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

async function fetchXml(url: string): Promise<Record<string, unknown>> {
  const response = await fetch(url, {
    headers: { "User-Agent": "AI-News/1.0 (news aggregation prototype)" },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const body = await response.text()
  if (body.length > 3_000_000) throw new Error("Feed exceeded size limit")
  const parsed: unknown = parser.parse(body)
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid XML feed")
  return parsed as Record<string, unknown>
}

async function rss(url: string, category: Category): Promise<Candidate[]> {
  const document = await fetchXml(url)
  const rssRoot = document.rss as Record<string, unknown> | undefined
  const channel = rssRoot?.channel as Record<string, unknown> | undefined
  if (!channel) throw new Error("Missing RSS channel")
  return list(channel.item as Record<string, unknown> | Record<string, unknown>[] | undefined)
    .map((item): Candidate | null => {
      const title = text(item.title)
      const link = canonicalUrl(text(item.link))
      const publishedAt = validDate(item.pubDate ?? item["dc:date"])
      if (!title || !link || !publishedAt) return null
      return {
        title,
        url: link,
        summary: excerpt(item.description),
        publishedAt,
        category: classify(title, category),
        author: text(item["dc:creator"]) || undefined,
      }
    })
    .filter((item): item is Candidate => item !== null)
}

async function hackerNews(): Promise<Candidate[]> {
  const json = await fetchJson("https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=50")
  if (!json || typeof json !== "object" || !('hits' in json) || !Array.isArray(json.hits)) {
    throw new Error("Invalid Hacker News response")
  }
  return json.hits.flatMap((hit: unknown): Candidate[] => {
    if (!hit || typeof hit !== "object") return []
    const row = hit as Record<string, unknown>
    const title = text(row.title)
    const summary = excerpt(row.story_text)
    const url = canonicalUrl(text(row.url) || `https://news.ycombinator.com/item?id=${text(row.objectID)}`)
    const publishedAt = validDate(row.created_at)
    if (!title || !url || !publishedAt || !aiRelevant(title, summary)) return []
    return [{ title, url, summary, publishedAt, category: classify(title, "Industry"), author: text(row.author) || undefined }]
  })
}

async function huggingFace(): Promise<Candidate[]> {
  const json = await fetchJson("https://huggingface.co/api/daily_papers?limit=30")
  if (!Array.isArray(json)) throw new Error("Invalid Hugging Face response")
  return json.flatMap((entry: unknown): Candidate[] => {
    if (!entry || typeof entry !== "object") return []
    const row = entry as Record<string, unknown>
    const paper = row.paper as Record<string, unknown> | undefined
    if (!paper) return []
    const id = text(paper.id)
    const title = text(paper.title)
    const publishedAt = validDate(paper.publishedAt ?? row.publishedAt)
    const url = canonicalUrl(`https://arxiv.org/abs/${id}`)
    if (!id || !title || !publishedAt || !url) return []
    return [{ title, url, summary: excerpt(paper.summary), publishedAt, category: "Research" }]
  })
}

const sources: NewsSource[] = [
  { name: "TechCrunch AI", slug: "techcrunch-ai", websiteUrl: "https://techcrunch.com", feedUrl: "https://techcrunch.com/category/artificial-intelligence/feed/", feedType: "rss", category: "Industry", load: () => rss("https://techcrunch.com/category/artificial-intelligence/feed/", "Industry") },
  { name: "arXiv AI", slug: "arxiv-ai", websiteUrl: "https://arxiv.org", feedUrl: "https://rss.arxiv.org/rss/cs.AI", feedType: "rss", category: "Research", load: () => rss("https://rss.arxiv.org/rss/cs.AI", "Research") },
  { name: "arXiv Machine Learning", slug: "arxiv-ml", websiteUrl: "https://arxiv.org", feedUrl: "https://rss.arxiv.org/rss/cs.LG", feedType: "rss", category: "Research", load: () => rss("https://rss.arxiv.org/rss/cs.LG", "Research") },
  { name: "Hacker News", slug: "hacker-news", websiteUrl: "https://news.ycombinator.com", feedUrl: "https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=50", feedType: "api", category: "Industry", load: hackerNews },
  { name: "Hugging Face Papers", slug: "hugging-face", websiteUrl: "https://huggingface.co/papers", feedUrl: "https://huggingface.co/api/daily_papers?limit=30", feedType: "api", category: "Research", load: huggingFace },
]

let liveCache: { articles: Article[]; fetchedAt: number } | null = null
let liveSourceHealth: Array<{ name: string; fetched: number; error: string | null }> = []

export function getLiveCacheStatus(): { articleCount: number; lastFetchedAt: string | null; sources: typeof liveSourceHealth } {
  return { articleCount: liveCache?.articles.length ?? 0, lastFetchedAt: liveCache ? new Date(liveCache.fetchedAt).toISOString() : null, sources: liveSourceHealth }
}

/** Read-through live mode for installations without a database. Nothing is fabricated or persisted. */
export async function fetchLiveArticles(limit = 50): Promise<Article[]> {
  if (liveCache && Date.now() - liveCache.fetchedAt < 60_000) return liveCache.articles.slice(0, limit)
  const batches = await Promise.allSettled(sources.map(async (source) => ({ source, items: await source.load() })))
  liveSourceHealth = batches.map((batch, index) => ({
    name: sources[index].name,
    fetched: batch.status === "fulfilled" ? batch.value.items.length : 0,
    error: batch.status === "rejected" ? (batch.reason instanceof Error ? batch.reason.message : "Unknown error") : null,
  }))
  const seen = new Set<string>()
  const articles: Article[] = []
  for (const batch of batches) {
    if (batch.status === "rejected") continue
    const { source, items } = batch.value
    for (const item of items.slice(0, 10)) {
      if (seen.has(item.url) || (!aiRelevant(item.title, item.summary) && item.category !== "Research")) continue
      seen.add(item.url)
      const slug = articleSlug(item.title, item.url)
      articles.push({ id: slug, slug, title: item.title, source: source.name, summary: item.summary, publishedAt: item.publishedAt.toISOString(), url: item.url, tags: [], category: item.category })
    }
  }
  if (articles.length > 0) liveCache = { articles: articles.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)), fetchedAt: Date.now() }
  return (liveCache?.articles ?? []).slice(0, limit)
}

export interface SourceResult {
  source: string
  fetched: number
  inserted: number
  error?: string
}

export async function ingestNews(): Promise<SourceResult[]> {
  const results: SourceResult[] = []
  for (const source of sources) {
    let dbSource: { id: string } | undefined
    try {
      dbSource = await prisma.source.upsert({
        where: { slug: source.slug },
        update: { feedUrl: source.feedUrl, feedType: source.feedType, isActive: true },
        create: { name: source.name, slug: source.slug, websiteUrl: source.websiteUrl, feedUrl: source.feedUrl, feedType: source.feedType, category: source.category },
      })
      const candidates = await source.load()
      let inserted = 0
      const seen = new Set<string>()
      for (const item of candidates.slice(0, 50)) {
        if (seen.has(item.url) || !aiRelevant(item.title, item.summary) && item.category !== "Research") continue
        seen.add(item.url)
        const exists = await prisma.article.findUnique({ where: { url: item.url }, select: { id: true } })
        if (exists) continue
        const slug = articleSlug(item.title, item.url)
        await prisma.article.create({ data: { sourceId: dbSource.id, title: item.title, slug, url: item.url, summary: item.summary, author: item.author, category: item.category, publishedAt: item.publishedAt } })
        inserted++
      }
      await prisma.source.update({ where: { id: dbSource.id }, data: { lastFetchedAt: new Date(), errorCount: 0 } })
      results.push({ source: source.name, fetched: candidates.length, inserted })
    } catch (error) {
      if (dbSource) await prisma.source.update({ where: { id: dbSource.id }, data: { errorCount: { increment: 1 } } }).catch(() => undefined)
      results.push({ source: source.name, fetched: 0, inserted: 0, error: error instanceof Error ? error.message : "Unknown error" })
    }
  }
  return results
}
