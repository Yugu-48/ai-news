// src/app/api/news/route.js
// REST API: GET /api/news  ->  JSON array of articles.
// Optional query parameters: ?q=gpt (search text) and ?source=TechCrunch

import { getNews } from "@/lib/news";

// Always run on every request (never cache the news)
export const dynamic = "force-dynamic";

// Handle GET /api/news
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const q = (params.get("q") || "").trim().toLowerCase();
  const source = params.get("source") || "";

  let articles = await getNews();
  // keep only articles from the chosen source
  if (source) articles = articles.filter((a) => a.source === source);
  // keep only articles whose title or summary contains the search text
  if (q) articles = articles.filter((a) => (a.title + " " + a.summary).toLowerCase().includes(q));

  return Response.json(articles); // status 200 + JSON
}
