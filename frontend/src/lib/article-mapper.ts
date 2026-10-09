import type { Article } from "./types"

export interface ArticleRow {
  id: string
  title: string
  summary: string | null
  publishedAt: Date
  url: string
  slug: string
  category: string
  imageUrl: string | null
  readingTime: number | null
  source: { name: string }
  tags: Array<{ tag: { name: string } }>
}

export function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    source: row.source.name,
    summary: row.summary ?? "",
    publishedAt: row.publishedAt.toISOString(),
    url: row.url,
    tags: row.tags.map(({ tag }) => tag.name),
    slug: row.slug,
    category: row.category as Article["category"],
    imageUrl: row.imageUrl ?? undefined,
    readingTime: row.readingTime ?? undefined,
  }
}
