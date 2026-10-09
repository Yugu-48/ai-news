import { prisma } from "./prisma"
import type { Article } from "./types"
import { fetchLiveArticles } from "./news/ingest"

const HOME_ARTICLES_LIMIT = 50

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL
  if (!url) return false
  if (url.includes("your-project-ref") || url.includes("your-password")) return false
  return true
}

interface ArticleRow {
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

export async function fetchArticles(limit = HOME_ARTICLES_LIMIT): Promise<Article[]> {
  if (isDatabaseConfigured()) {
    try {
      const rows = await prisma.article.findMany({
        where: { NOT: { url: { contains: "/example/" } } },
        take: limit,
        orderBy: { publishedAt: "desc" },
        include: {
          source: {
            select: { name: true },
          },
          tags: {
            include: {
              tag: {
                select: { name: true },
              },
            },
          },
        },
      })

      return rows.map(toArticle)
    } catch (error) {
      console.error("Database query failed:", error)
    }
  }
  return fetchLiveArticles(limit)
}

