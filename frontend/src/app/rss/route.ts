import { fetchArticles } from "@/lib/articles"

export const dynamic = "force-dynamic"

function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, character => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character] ?? character)
}

export async function GET(request: Request) {
  const articles = await fetchArticles()
  const origin = new URL(request.url).origin
  const items = articles.map(article => `<item><title>${escapeXml(article.title)}</title><link>${escapeXml(article.url)}</link><guid isPermaLink="true">${escapeXml(article.url)}</guid><description>${escapeXml(article.summary)}</description><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><category>${escapeXml(article.category)}</category><source url="${escapeXml(article.url)}">${escapeXml(article.source)}</source></item>`).join("")
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AI News</title><link>${escapeXml(origin)}/news</link><description>AI headlines and source excerpts</description><language>en</language>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "no-cache" } })
}
