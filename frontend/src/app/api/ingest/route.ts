import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { ingestNews } from "@/lib/news/ingest"
import { isDatabaseConfigured } from "@/lib/articles"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function authorized(request: Request): boolean {
  const secret = process.env.INGEST_SECRET
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (!secret || !provided) return false
  const expected = Buffer.from(secret)
  const actual = Buffer.from(provided)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured" }, { status: 503 })

  try {
    const sources = await ingestNews()
    return NextResponse.json({
      success: sources.some((source) => !source.error),
      sources,
      inserted: sources.reduce((sum, source) => sum + source.inserted, 0),
    })
  } catch (error) {
    console.error("Ingestion failed:", error)
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 })
  }
}
