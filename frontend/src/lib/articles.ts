import { prisma } from "./prisma"
import type { Article } from "./types"
import { fetchLiveArticles } from "./news/ingest"
import { getDatabaseConfiguration } from "./database-config"
import { toArticle } from "./article-mapper"

const HOME_ARTICLES_LIMIT = 50

export function isDatabaseConfigured(): boolean {
  return getDatabaseConfiguration().configured
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
    } catch {
      console.error("Database query failed")
    }
  }
  return fetchLiveArticles(limit)
}

