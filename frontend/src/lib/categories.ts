import type { Article } from "./types"

export const feedCategories = ["All News", "Breaking", "AI Models", "Research", "Companies", "Open Source", "AI Policy", "AI Hardware"] as const
export type FeedCategory = (typeof feedCategories)[number]

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
