import { createHash } from "node:crypto"

export type NewsCategory = "Research" | "Industry" | "Policy" | "Hardware"

export interface Candidate {
  title: string
  url: string
  summary: string
  publishedAt: Date
  category: NewsCategory
  author?: string
}

export interface NewsSource {
  name: string
  slug: string
  websiteUrl: string
  feedUrl: string
  feedType: "rss" | "api"
  category: NewsCategory
  load: () => Promise<Candidate[]>
}

export interface ArticleInsert extends Candidate {
  slug: string
  sourceId: string
}

export interface SourceResult {
  source: string
  fetched: number
  inserted: number
  error?: string
}

export interface IngestionStore {
  upsertSource(source: NewsSource): Promise<{ id: string }>
  insertArticles(articles: ArticleInsert[]): Promise<number>
  markSourceSuccess(sourceId: string, at: Date): Promise<void>
  markSourceFailure(sourceId: string): Promise<void>
}

export function canonicalUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key)
    }
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "")
    url.hash = ""
    return url.toString()
  } catch {
    return null
  }
}

export function aiRelevant(title: string, summary: string): boolean {
  return /\b(ai|artificial intelligence|machine learning|llm|language model|neural|deep learning|chatgpt|openai|anthropic|gemini|deepmind|hugging face|nvidia|inference|transformer|robotics|agentic)\b/i.test(
    `${title} ${summary}`
  )
}

export function articleSlug(title: string, url: string): string {
  return `${title.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90)}-${createHash("sha256").update(url).digest("hex").slice(0, 10)}`
}

function prepareArticles(candidates: Candidate[], sourceId: string): ArticleInsert[] {
  const seen = new Set<string>()
  const prepared: ArticleInsert[] = []
  for (const item of candidates.slice(0, 50)) {
    const url = canonicalUrl(item.url)
    if (!url || !item.title.trim() || !Number.isFinite(item.publishedAt.getTime())) continue
    if (seen.has(url) || (!aiRelevant(item.title, item.summary) && item.category !== "Research")) continue
    seen.add(url)
    prepared.push({ ...item, url, slug: articleSlug(item.title, url), sourceId })
  }
  return prepared
}

/** The store must implement insertArticles with one atomic createMany(skipDuplicates) call. */
export async function ingestSources(sources: NewsSource[], store: IngestionStore): Promise<SourceResult[]> {
  const results: SourceResult[] = []
  for (const source of sources) {
    let sourceId: string | undefined
    let fetched = 0
    let inserted = 0
    let failure = "source_registration_failed"
    try {
      sourceId = (await store.upsertSource(source)).id
      failure = "source_fetch_failed"
      const candidates = await source.load()
      fetched = candidates.length
      const prepared = prepareArticles(candidates, sourceId)
      failure = "article_insert_failed"
      inserted = prepared.length ? await store.insertArticles(prepared) : 0
      failure = "source_status_update_failed"
      await store.markSourceSuccess(sourceId, new Date())
      results.push({ source: source.name, fetched, inserted })
    } catch {
      if (sourceId) await store.markSourceFailure(sourceId).catch(() => undefined)
      results.push({ source: source.name, fetched, inserted, error: failure })
    }
  }
  return results
}
