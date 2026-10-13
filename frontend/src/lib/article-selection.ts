import type { Article } from "./types"

export function parseSelectionIds(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]")
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && id.trim().length > 0))] : []
  } catch { return [] }
}

export function toggleSelection(ids: string[], id: string): string[] {
  const unique = [...new Set(ids)]
  return unique.includes(id) ? unique.filter(value => value !== id) : [...unique, id]
}

export function parseStoredArticles(raw: string | null): Article[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]")
    if (!Array.isArray(value)) return []
    return value.flatMap((item: unknown): Article[] => {
      if (!item || typeof item !== "object") return []
      const row = item as Record<string, unknown>
      if (!["id", "slug", "title", "source", "url", "publishedAt"].every(key => typeof row[key] === "string" && row[key] !== "") || typeof row.summary !== "string") return []
      if (!["Research", "Industry", "Policy", "Hardware"].includes(String(row.category)) || !Array.isArray(row.tags) || !row.tags.every(tag => typeof tag === "string")) return []
      if (!Number.isFinite(Date.parse(String(row.publishedAt))) || !/^https?:\/\//.test(String(row.url))) return []
      return [{
        id: String(row.id), slug: String(row.slug), title: String(row.title), source: String(row.source),
        summary: row.summary, url: String(row.url), publishedAt: String(row.publishedAt),
        category: row.category as Article["category"], tags: row.tags as string[],
        imageUrl: typeof row.imageUrl === "string" && /^https?:\/\//.test(row.imageUrl) ? row.imageUrl : undefined,
        readingTime: typeof row.readingTime === "number" ? row.readingTime : undefined,
      }]
    })
  } catch { return [] }
}

export function mergeLibraryArticles(current: Article[], archived: Article[]): Article[] {
  return [...new Map([...archived, ...current].map(article => [article.id, article])).values()]
}

export function selectLibraryArticles(articles: Article[], ids: string[]): Article[] {
  const byId = new Map(articles.map(article => [article.id, article]))
  return [...new Set(ids)].flatMap(id => { const article = byId.get(id); return article ? [article] : [] })
}
