import { NextResponse } from "next/server"
import { ingestNews } from "@/lib/news/ingest"
import { getDatabaseConfiguration } from "@/lib/database-config"
import { isIngestAuthorized } from "@/lib/ingest-auth"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isIngestAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!getDatabaseConfiguration().configured) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })

  try {
    await prisma.source.count()
  } catch {
    return NextResponse.json({ error: "Database unavailable or schema not migrated" }, { status: 503 })
  }

  try {
    const sources = await ingestNews()
    const success = sources.some((source) => !source.error)
    return NextResponse.json({
      success,
      sources,
      inserted: sources.reduce((sum, source) => sum + source.inserted, 0),
    }, { status: success ? 200 : 502 })
  } catch {
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 })
  }
}
