// src/lib/news.js
// All news fetching lives in this ONE file (runs on the server only).
// Two sources: Hacker News (a JSON API) and TechCrunch AI (an RSS/XML feed).
// Every source is turned into the same shape:
//   { id, title, source, summary, publishedAt, url, imageUrl }

import { XMLParser } from "fast-xml-parser";
import sampleNews from "./sample-news.json";

const HN_URL = "https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=30";
const TC_URL = "https://techcrunch.com/category/artificial-intelligence/feed/";
const TIMEOUT_MS = 8000; // give up on a slow site after 8 seconds
const IMAGE_TIMEOUT_MS = 3000; // thumbnails are optional, so wait less for them

// Fetch one URL and return its text. Throws an error if the site fails.
async function getText(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.text();
}

// Remove HTML tags from a string and shorten it to a short excerpt.
function toExcerpt(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

// Image URLs come from other sites, so only allow normal web links (http/https).
// Anything else (javascript:, data:, empty) becomes "" and the card shows the placeholder.
function safeImageUrl(url) {
  return typeof url === "string" && /^https?:\/\//i.test(url) ? url : "";
}

// Find a picture inside one RSS item: <media:content>, <media:thumbnail>,
// <enclosure>, or the first <img src="..."> in the item's HTML text.
function rssImage(item) {
  const html = String(item["content:encoded"] || item.description || "");
  return safeImageUrl(
    item["media:content"]?.["@_url"] ||
    item["media:thumbnail"]?.["@_url"] ||
    item.enclosure?.["@_url"] ||
    html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
  );
}

// Hacker News has no pictures, so open the story's page and read its og:image tag.
// Returns "" on any problem: a missing picture must never break the news list.
async function getOgImage(url) {
  try {
    const { protocol, hostname } = new URL(url);
    // Cheap guard: don't let the server fetch internal addresses
    if (!/^https?:$/.test(protocol)) return "";
    if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|\[?::1\]?$)/i.test(hostname)) return "";

    const response = await fetch(url, { signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS), cache: "no-store" });
    if (!response.ok) return "";
    const html = await response.text();

    // Find a <meta> tag naming an image property; content can come before or after it
    for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
      if (!/(property|name)=["'](og:image(:url)?|twitter:image)["']/i.test(tag)) continue;
      // HTML escapes "&" as "&amp;" inside attributes, so turn it back into a real "&"
      const image = safeImageUrl(tag.match(/content=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g, "&"));
      if (image) return image;
    }
    return "";
  } catch {
    return "";
  }
}

// Source 1: Hacker News Algolia API. The answer is JSON, so we use JSON.parse().
async function getHackerNews() {
  const json = JSON.parse(await getText(HN_URL));
  const stories = json.hits
    // keep only stories whose title looks AI-related (the search also matches random words)
    .filter((hit) => hit.title && /\bAI\b|GPT|LLM|OpenAI|Anthropic|Claude|Gemini|neural|machine learning/i.test(hit.title))
    .map((hit) => ({
      id: "hn-" + hit.objectID,
      title: hit.title,
      source: "Hacker News",
      summary: toExcerpt(hit.story_text),
      publishedAt: hit.created_at,
      // If the story has no link, link to its Hacker News discussion page
      url: hit.url || "https://news.ycombinator.com/item?id=" + hit.objectID,
      imageUrl: "", // filled in below from the linked page
    }));

  // Look up thumbnails in parallel, only for stories with a real external link
  await Promise.all(stories.map(async (story) => {
    if (story.url.startsWith("https://news.ycombinator.com/item?id=")) return; // discussion link, no page image
    story.imageUrl = await getOgImage(story.url);
  }));
  return stories;
}

// Source 2: TechCrunch AI. RSS is XML, so we parse it with fast-xml-parser.
async function getTechCrunch() {
  // htmlEntities: turn codes like &#8217; into real characters (’) in titles
  const xml = new XMLParser({ ignoreAttributes: false, htmlEntities: true }).parse(await getText(TC_URL));
  let items = xml.rss.channel.item || [];
  if (!Array.isArray(items)) items = [items]; // one item comes back as an object, not a list
  return items.map((item) => ({
    id: "tc-" + item.link,
    title: item.title,
    source: "TechCrunch",
    summary: toExcerpt(item.description),
    publishedAt: new Date(item.pubDate).toISOString(),
    url: item.link,
    imageUrl: rssImage(item), // "" when the feed has no picture for this item
  }));
}

// Main function: get both sources, merge them, newest first.
// If BOTH fail (for example no internet), return the saved sample articles.
export async function getNews() {
  const results = await Promise.allSettled([
    // NEWS_OFFLINE=1 is only for testing the fallback
    process.env.NEWS_OFFLINE ? Promise.reject(new Error("offline")) : getHackerNews(),
    process.env.NEWS_OFFLINE ? Promise.reject(new Error("offline")) : getTechCrunch(),
  ]);
  // keep only the sources that worked, then flatten into one list
  const articles = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
  if (articles.length === 0) return sampleNews;
  return articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}
