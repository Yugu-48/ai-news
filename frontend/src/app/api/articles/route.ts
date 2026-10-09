import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isDatabaseConfigured } from "@/lib/articles"
import { articles as mockArticles } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100)
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0)

  if (isDatabaseConfigured()) {
    try {
      // Build Prisma query filter
      const where: any = {}

      if (category && category !== "All") {
        where.category = category
      }

      if (tag) {
        where.tags = {
          some: {
            tag: {
              name: {
                equals: tag,
                mode: "insensitive",
              },
            },
          },
        }
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { summary: { contains: search, mode: "insensitive" } },
        ]
      }

      const [articles, totalCount] = await Promise.all([
        prisma.article.findMany({
          where,
          take: limit,
          skip: offset,
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
        }),
        prisma.article.count({ where }),
      ])

      if (articles.length > 0 || totalCount > 0) {
        // Format response to match frontend Article type
        const formattedArticles = articles.map((article) => ({
          id: article.id,
          title: article.title,
          source: article.source.name,
          summary: article.summary || "",
          publishedAt: article.publishedAt.toISOString(),
          url: article.url,
          tags: article.tags.map((t) => t.tag.name),
          slug: article.slug,
          category: article.category,
          imageUrl: article.imageUrl || undefined,
          readingTime: article.readingTime || undefined,
        }))

        return NextResponse.json({
          success: true,
          data: formattedArticles,
          pagination: {
            total: totalCount,
            limit,
            offset,
            hasMore: offset + limit < totalCount,
          },
        })
      }
    } catch (error) {
      console.warn("GET /api/articles database query failed, using fallback data:", error)
    }
  }

  // Graceful fallback for local development / preview when DB is not seeded or configured
  let result = [...mockArticles]

  if (category && category !== "All") {
    result = result.filter((a) => a.category === category)
  }

  if (tag) {
    result = result.filter((a) =>
      a.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    )
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    )
  }

  const paginated = result.slice(offset, offset + limit)

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: {
      total: result.length,
      limit,
      offset,
      hasMore: offset + limit < result.length,
    },
  })
}

