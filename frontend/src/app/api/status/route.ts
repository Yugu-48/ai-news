import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isDatabaseConfigured } from "@/lib/articles"
import { getLiveCacheStatus } from "@/lib/news/ingest"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isDatabaseConfigured()) {
    const cache = getLiveCacheStatus()
    return NextResponse.json({ status: "live_read_through", persistence: "unconfigured", lastSuccessfulIngestion: null, lastLiveFetch: cache.lastFetchedAt, articleCount: cache.articleCount, sources: cache.sources })
  }
  try {
    const [sources, articleCount] = await Promise.all([
      prisma.source.findMany({ select: { name: true, lastFetchedAt: true, errorCount: true, isActive: true, _count: { select: { articles: true } } } }),
      prisma.article.count(),
    ])
    const lastSuccessfulIngestion = sources.reduce<Date | null>(
      (latest, source) => source.lastFetchedAt && (!latest || source.lastFetchedAt > latest) ? source.lastFetchedAt : latest,
      null,
    )
    const ageMinutes = lastSuccessfulIngestion ? Math.floor((Date.now() - lastSuccessfulIngestion.getTime()) / 60_000) : null
    return NextResponse.json({
      status: ageMinutes === null ? "awaiting_ingestion" : ageMinutes > 60 ? "stale" : "fresh",
      lastSuccessfulIngestion: lastSuccessfulIngestion?.toISOString() ?? null,
      ageMinutes,
      articleCount,
      sources: sources.map((source) => ({ name: source.name, lastFetchedAt: source.lastFetchedAt?.toISOString() ?? null, errorCount: source.errorCount, isActive: source.isActive, articleCount: source._count.articles })),
    })
  } catch (error) {
    console.error("Status query failed:", error)
    return NextResponse.json({ status: "unavailable", error: "Database unavailable" }, { status: 503 })
  }
}
