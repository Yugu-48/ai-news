import { prisma } from "./prisma"
import type { Article } from "./types"
import { articles as mockArticles } from "./mock-data"

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

      if (rows.length > 0) {
        return rows.map(toArticle)
      }
    } catch (error) {
      console.warn("Database query failed, falling back to mock articles:", error)
    }
  }

  // Gracefully fallback to mock articles for development / preview when DB is not seeded or configured
  return mockArticles.slice(0, limit)
}

