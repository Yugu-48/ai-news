export interface SourceHealthRow {
  name: string
  lastFetchedAt: Date | null
  errorCount: number
  isActive: boolean
  articleCount: number
}

export function summarizeDatabaseHealth(sources: SourceHealthRow[], articleCount: number, now = new Date()) {
  const lastSuccessfulIngestion = sources.reduce<Date | null>(
    (latest, source) => source.lastFetchedAt && (!latest || source.lastFetchedAt > latest) ? source.lastFetchedAt : latest,
    null,
  )
  const ageMinutes = lastSuccessfulIngestion ? Math.max(0, Math.floor((now.getTime() - lastSuccessfulIngestion.getTime()) / 60_000)) : null
  return {
    status: ageMinutes === null ? "awaiting_ingestion" : ageMinutes > 60 ? "stale" : "fresh",
    databaseStatus: ageMinutes === null && articleCount === 0 ? "awaiting_first_ingestion" : "operational",
    persistence: "operational",
    lastSuccessfulIngestion: lastSuccessfulIngestion?.toISOString() ?? null,
    ageMinutes,
    articleCount,
    sources: sources.map((source) => ({
      name: source.name,
      lastFetchedAt: source.lastFetchedAt?.toISOString() ?? null,
      errorCount: source.errorCount,
      isActive: source.isActive,
      articleCount: source.articleCount,
    })),
  }
}
