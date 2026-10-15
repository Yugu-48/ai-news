import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { cache } from "react"

import { prisma } from "@/lib/prisma"
import type { Article } from "@/lib/types"
import { ArticlePreview } from "@/components/article-preview"
import { fetchArticles, isDatabaseConfigured } from "@/lib/articles"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

/**
 * Cached article fetcher for Server Component and metadata generation.
 * Queries PostgreSQL via Prisma when configured.
 */
const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  if (isDatabaseConfigured()) {
    try {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          source: {
            select: { name: true, slug: true, websiteUrl: true },
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true },
              },
            },
          },
        },
      })

      if (article && !article.url.includes("/example/")) {
        return {
          id: article.id,
          title: article.title,
          source: article.source.name,
          summary: article.summary || "",
          publishedAt: article.publishedAt.toISOString(),
          url: article.url,
          tags: article.tags.map((t) => t.tag.name),
          slug: article.slug,
          category: article.category as Article["category"],
          imageUrl: article.imageUrl || undefined,
          readingTime: article.readingTime || undefined,
        }
      }
    } catch (error) {
      console.error(`Database query failed for slug "${slug}":`, error)
    }
  }

  const live = await fetchArticles(100)
  return live.find((article) => article.slug === slug) ?? null
})

/**
 * Fetch related articles in the same category from the database.
 */
async function getRelatedArticles(category: string, currentSlug: string): Promise<Article[]> {
  if (isDatabaseConfigured()) {
    try {
      const related = await prisma.article.findMany({
        where: {
          category,
          slug: { not: currentSlug },
          NOT: { url: { contains: "/example/" } },
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: {
          source: {
            select: { name: true, slug: true, websiteUrl: true },
          },
          tags: {
            include: {
              tag: {
                select: { name: true, slug: true },
              },
            },
          },
        },
      })

      if (related.length > 0) {
        return related.map((article) => ({
          id: article.id,
          title: article.title,
          source: article.source.name,
          summary: article.summary || "",
          publishedAt: article.publishedAt.toISOString(),
          url: article.url,
          tags: article.tags.map((t) => t.tag.name),
          slug: article.slug,
          category: article.category as Article["category"],
          imageUrl: article.imageUrl || undefined,
          readingTime: article.readingTime || undefined,
        }))
      }
    } catch (error) {
      console.error("Error fetching related articles from DB:", error)
    }
  }

  const live = await fetchArticles(100)
  return live.filter((article) => article.category === category && article.slug !== currentSlug).slice(0, 3)
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found | AI News",
      description: "The requested article could not be found.",
    }
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
      url: `https://ai-news.vercel.app/article/${article.slug}`,
      siteName: "AI News",
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Related articles: same category, different slug, up to 3
  const relatedArticles = await getRelatedArticles(article.category, article.slug)

  return <ArticlePreview article={article} related={relatedArticles} />
}

