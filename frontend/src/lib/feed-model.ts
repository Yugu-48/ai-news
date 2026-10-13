import type { Article } from "./types"

export const feedCategories = ["All News", "Breaking", "AI Models", "Research", "Companies", "Open Source", "AI Policy", "AI Hardware"] as const
export type FeedCategory = (typeof feedCategories)[number]

export const categoryPages: Record<FeedCategory, { href: string; description: string }> = {
  "All News": { href: "/news", description: "The latest AI news, research, and developments from trusted sources worldwide." },
  "Breaking": { href: "/news/breaking", description: "AI stories published in the past 24 hours, with the latest updates first." },
  "AI Models": { href: "/news/ai-models", description: "Updates on language models, generative AI, and the technology behind them." },
  "Research": { href: "/news/research", description: "New AI papers, scientific findings, and research breakthroughs." },
  "Companies": { href: "/news/companies", description: "AI company news, industry developments, and business updates." },
  "Open Source": { href: "/news/open-source", description: "Open models, community projects, and tools for building with AI." },
  "AI Policy": { href: "/news/ai-policy", description: "AI regulation, governance, and policy developments." },
  "AI Hardware": { href: "/news/ai-hardware", description: "Chips, computing infrastructure, and hardware powering AI." },
}

export function categoryFromSlug(slug: string): FeedCategory | undefined {
  return feedCategories.find((category) => categoryPages[category].href === `/news/${slug}`)
}

export function isFeedCategory(value: string | undefined): value is FeedCategory {
  return feedCategories.includes(value as FeedCategory)
}

export function matchesCategory(article: Article, category: FeedCategory): boolean {
  const subject = `${article.title} ${article.summary}`
  switch (category) {
    case "All News": return true
    case "Breaking": return Date.now() - Date.parse(article.publishedAt) < 24 * 60 * 60 * 1000
    case "AI Models": return /\b(model|llm|language model|gpt|gemini|claude|transformer|diffusion)\b/i.test(subject)
    case "Research": return article.category === "Research"
    case "Companies": return article.category === "Industry"
    case "Open Source": return /\b(open.source|open.weight|open model|github)\b/i.test(subject)
    case "AI Policy": return article.category === "Policy"
    case "AI Hardware": return article.category === "Hardware"
  }
}

export type FeedView = FeedCategory | "Saved" | "Liked"
export type FeedLayout = "editorial" | "compact"
export interface FeedFilters {
  query: string
  category: FeedView
  tag: string
  source: string
}
export const collectionPages = {
  Saved: { href: "/saved", description: "Your reading list, kept in this browser." },
  Liked: { href: "/liked", description: "Stories you liked, kept in this browser." },
} as const
export function isCollection(view: FeedView): view is "Saved" | "Liked" {
  return view === "Saved" || view === "Liked"
}
export function initialFilters(view: FeedView): FeedFilters {
  return { query: "", category: view, tag: "All", source: "All" }
}
export function filterFeed(articles: Article[], filters: FeedFilters, savedIds: string[] = [], likedIds: string[] = []): Article[] {
  const query = filters.query.trim().toLowerCase()
  const ids = new Set(filters.category === "Saved" ? savedIds : likedIds)
  return articles.filter(article =>
    (isCollection(filters.category) ? ids.has(article.id) : matchesCategory(article, filters.category)) &&
    (filters.source === "All" || article.source === filters.source) &&
    (filters.tag === "All" || article.tags.includes(filters.tag)) &&
    (!query || `${article.title} ${article.summary} ${article.source}`.toLowerCase().includes(query))
  ).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
}
export function feedFingerprint(articles: Article[]): string {
  return JSON.stringify(articles.map(a => [a.id, a.slug, a.title, a.summary, a.source, a.publishedAt, a.url, a.category, a.imageUrl ?? "", a.readingTime ?? 0, [...a.tags].sort()]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))))
}
export function countNewStories(current: Article[], pending: Article[], filters: FeedFilters, savedIds: string[] = [], likedIds: string[] = []): number {
  const ids = new Set(current.map(article => article.id))
  return filterFeed(pending, filters, savedIds, likedIds).filter(article => !ids.has(article.id)).length
}
export function resolveFeedLayout(raw: string | null, view: FeedView): FeedLayout {
  return raw === "editorial" || raw === "compact" ? raw : isCollection(view) ? "compact" : "editorial"
}

export interface FeedState { visible: Article[]; pending: Article[] | null; error: boolean }
export type FeedAction = { type: "receive"; articles: Article[] } | { type: "apply" } | { type: "error" } | { type: "discard" }
export function createFeedState(articles: Article[]): FeedState { return { visible: articles, pending: null, error: false } }
export function feedReducer(state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case "receive": return { ...state, pending: feedFingerprint(state.visible) === feedFingerprint(action.articles) ? null : action.articles, error: false }
    case "apply": return state.pending ? { visible: state.pending, pending: null, error: false } : state
    case "error": return { ...state, error: true }
    case "discard": return { ...state, pending: null, error: false }
  }
}
