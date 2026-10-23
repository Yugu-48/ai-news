#!/usr/bin/env node

/**
 * AI News — Manual RSS & Ingestion CLI
 * Run by hand or in CI/CD pipelines to ingest live news feeds.
 *
 * Usage:
 *   node --experimental-strip-types scripts/run-ingest.mjs [--dry-run] [--source=<slug>]
 */

import { sources, ingestNews } from "../src/lib/news/ingest.ts"
import { getDatabaseConfiguration } from "../src/lib/database-config.ts"
import { prepareArticles } from "../src/lib/news/ingest-core.ts"

const args = process.argv.slice(2)
const isDryRun = args.includes("--dry-run")
const sourceArg = args.find((a) => a.startsWith("--source="))?.slice(9)

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
AI News Ingestion CLI (BD7)

Options:
  --dry-run         Fetch and parse feeds without writing to database
  --source=<slug>   Filter to a single source (e.g. techcrunch-ai, arxiv-ai, arxiv-ml, hacker-news, hugging-face)
  --help, -h        Show this help message

Available sources:
${sources.map((s) => `  - ${s.slug.padEnd(20)} (${s.name} [${s.feedType}])`).join("\n")}
`)
  process.exit(0)
}

const activeSources = sourceArg
  ? sources.filter((s) => s.slug === sourceArg)
  : sources

if (activeSources.length === 0) {
  console.error(`Error: Source "${sourceArg}" not found. Available sources: ${sources.map((s) => s.slug).join(", ")}`)
  process.exit(1)
}

console.log(`\n======================================================`)
console.log(`AI News Ingestion Runner`)
console.log(`Active sources: ${activeSources.map((s) => s.name).join(", ")}`)
console.log(`Mode: ${isDryRun ? "Dry-run (no DB writes)" : "Standard"}`)
console.log(`======================================================\n`)

const dbConfig = getDatabaseConfiguration()

if (!isDryRun && dbConfig.configured) {
  console.log(`Database is configured. Initiating database ingestion...`)
  const startTime = Date.now()
  try {
    const results = await ingestNews()
    const elapsedMs = Date.now() - startTime
    console.log(`\nIngestion Results (${elapsedMs}ms):`)
    console.log(`------------------------------------------------------`)
    let totalInserted = 0
    let totalFetched = 0
    for (const r of results) {
      const status = r.error ? `FAILED (${r.error})` : `SUCCESS`
      console.log(`  ${r.source.padEnd(25)} | ${status.padEnd(12)} | Fetched: ${String(r.fetched).padStart(2)} | Inserted: ${String(r.inserted).padStart(2)}`)
      totalFetched += r.fetched
      totalInserted += r.inserted
    }
    console.log(`------------------------------------------------------`)
    console.log(`Summary: ${totalInserted} new articles inserted out of ${totalFetched} fetched.`)
    process.exit(0)
  } catch (error) {
    console.error(`Ingestion failed with database error:`, error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Dry run or database unconfigured
if (!isDryRun) {
  console.log(`Note: Database is not configured (${dbConfig.reason}). Running in dry-run mode.\n`)
}

console.log(`Fetching and parsing live source feeds...\n`)
const startTime = Date.now()
let grandTotalFetched = 0
let grandTotalPrepared = 0
const categoryCounts = {}
let imagesWithFeedEnclosure = 0
let totalWordCount = 0

for (const source of activeSources) {
  process.stdout.write(`Fetching ${source.name} (${source.feedUrl})... `)
  try {
    const candidates = await source.load()
    grandTotalFetched += candidates.length
    const prepared = prepareArticles(candidates, source.slug)
    grandTotalPrepared += prepared.length
    console.log(`OK: ${candidates.length} candidates, ${prepared.length} relevant`)

    for (const item of prepared) {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
      if (item.imageUrl) imagesWithFeedEnclosure++
      if (item.wordCount) totalWordCount += item.wordCount
    }

    if (prepared.length > 0) {
      console.log(`   Sample stories:`)
      for (const item of prepared.slice(0, 2)) {
        console.log(`     • ${item.title.slice(0, 75)}... (${item.readingTime || 1} min read, ${item.category})`)
      }
    }
    console.log()
  } catch (err) {
    console.log(`FAILED: ${err instanceof Error ? err.message : err}\n`)
  }
}

const elapsedMs = Date.now() - startTime
console.log(`------------------------------------------------------`)
console.log(`Dry-run parsing completed in ${elapsedMs}ms`)
console.log(`Total candidates fetched:      ${grandTotalFetched}`)
console.log(`AI-relevant & prepared:        ${grandTotalPrepared}`)
console.log(`Feed media enclosures found:   ${imagesWithFeedEnclosure}`)
if (grandTotalPrepared > 0) {
  const avgWords = Math.round(totalWordCount / grandTotalPrepared)
  console.log(`Average word count per story:  ${avgWords} words (~${Math.max(1, Math.ceil(avgWords / 200))} min read)`)
}
console.log(`Category breakdown:`)
for (const [cat, count] of Object.entries(categoryCounts)) {
  console.log(`  - ${cat.padEnd(15)}: ${count}`)
}
console.log(`------------------------------------------------------\n`)
