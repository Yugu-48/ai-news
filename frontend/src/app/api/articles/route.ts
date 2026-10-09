import { NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { isDatabaseConfigured } from "@/lib/articles"
import { fetchLiveArticles } from "@/lib/news/ingest"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")
  const search = searchParams.get("search")
  const limit = Number(searchParams.get("limit") ?? 20)
  const offset = Number(searchParams.get("offset") ?? 0)
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
    return NextResponse.json({ error: "Invalid pagination" }, { status: 400 })
  }

  if (isDatabaseConfigured()) {
    try {
      // Build Prisma query filter
      const where: Prisma.ArticleWhereInput = { NOT: { url: { contains: "/example/" } } }

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

      {
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

  try {
    let data = await fetchLiveArticles(100)
    if (category && category !== "All") data = data.filter((article) => article.category === category)
    if (tag) data = data.filter((article) => article.tags.some((value) => value.toLowerCase() === tag.toLowerCase()))
    if (search) {
      const query = search.toLowerCase()
      data = data.filter((article) => `${article.title} ${article.summary} ${article.source}`.toLowerCase().includes(query))
    }
    return NextResponse.json({ success: true, data: data.slice(offset, offset + limit), pagination: { total: data.length, limit, offset, hasMore: offset + limit < data.length }, mode: "live-read-through" })
  } catch (error) {
    console.error("Live article fetch failed:", error)
    return NextResponse.json({ error: "Live articles unavailable", data: [] }, { status: 503 })
  }
}

