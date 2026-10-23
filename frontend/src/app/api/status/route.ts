import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getDatabaseConfiguration } from "@/lib/database-config"
import { getLiveCacheStatus } from "@/lib/news/ingest"
import { summarizeDatabaseHealth } from "@/lib/status-core"

export const dynamic = "force-dynamic"

export async function GET() {
  const configuration = getDatabaseConfiguration()
  if (!configuration.configured) {
    const cache = getLiveCacheStatus()
    return NextResponse.json({ status: "live_read_through", databaseStatus: "not_configured", configurationReason: configuration.reason, persistence: "not_configured", lastSuccessfulIngestion: null, lastLiveFetch: cache.lastFetchedAt, articleCount: cache.articleCount, sources: cache.sources })
  }
  try {
    const [sources, counts] = await Promise.all([
      prisma.source.findMany({ select: { id: true, name: true, lastFetchedAt: true, errorCount: true, isActive: true } }),
      prisma.article.groupBy({ by: ["sourceId"], where: { NOT: { url: { contains: "/example/" } } }, _count: { _all: true } }),
    ])
    const countBySource = new Map(counts.map((row) => [row.sourceId, row._count._all]))
    const articleCount = counts.reduce((total, row) => total + row._count._all, 0)
    return NextResponse.json(summarizeDatabaseHealth(
      sources.map((source) => ({ ...source, articleCount: countBySource.get(source.id) ?? 0 })),
      articleCount,
    ))
  } catch {
    const cache = getLiveCacheStatus()
    return NextResponse.json({ status: "database_unavailable", databaseStatus: "unavailable", persistence: "unavailable", lastSuccessfulIngestion: null, lastLiveFetch: cache.lastFetchedAt, articleCount: cache.articleCount, sources: cache.sources, error: "Database unavailable" }, { status: 503 })
  }
}
