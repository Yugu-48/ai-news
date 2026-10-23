import type { NewsCategory } from "./ingest-core.ts"

/**
 * Curated high-resolution AI/tech photography for editorial fallbacks.
 * Each category has diverse, topic-accurate imagery.
 */
const CATEGORY_FALLBACKS: Record<NewsCategory, string[]> = {
  Research: [
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80", // Neural network / deep learning
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", // Abstract generative AI
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80", // Scientific laboratory / AI research
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", // Algorithmic art / tensors
  ],
  Industry: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", // Tech circuits / enterprise
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", // Global digital cloud network
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80", // Modern computing / code
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80", // Technology workspace / innovation
  ],
  Policy: [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80", // Law / governance / ethics
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80", // Cybersecurity / global security
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1200&q=80", // Policy / legal compliance
  ],
  Hardware: [
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", // Semiconductor processor / wafer
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80", // High performance GPU cluster
    "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=1200&q=80", // Robotics / automation hardware
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80", // Data center / AI infrastructure
  ],
}

export function isCategoryFallbackImage(url: string | undefined): boolean {
  return !!url && Object.values(CATEGORY_FALLBACKS).some(images => images.includes(url))
}

/** In-memory cache for resolved Open Graph images */
const ogCache = new Map<string, string | null>()

/**
 * Generate a deterministic hash for stable image selection
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Returns a deterministic, beautiful fallback image based on category and seed.
 */
export function getCategoryFallbackImage(category: string, seed: string): string {
  const cat = (category in CATEGORY_FALLBACKS ? category : "Industry") as NewsCategory
  const pool = CATEGORY_FALLBACKS[cat] ?? CATEGORY_FALLBACKS.Industry
  const index = hashString(seed || "ai-news") % pool.length
  return pool[index]
}

/**
 * Extracts image URL from XML RSS feed item tags (enclosure, media:content, media:thumbnail, img in desc).
 */
export function extractFeedImage(item: Record<string, unknown>): string | undefined {
  // Check enclosure
  if (item.enclosure && typeof item.enclosure === "object") {
    const enc = item.enclosure as Record<string, unknown>
    const url = String(enc["@_url"] || enc.url || "")
    if (isValidImageUrl(url)) return url
  }

  // Check media:content (array or single object)
  const mediaContent = item["media:content"]
  if (mediaContent) {
    const list = Array.isArray(mediaContent) ? mediaContent : [mediaContent]
    for (const m of list) {
      if (typeof m === "object" && m !== null) {
        const url = String((m as Record<string, unknown>)["@_url"] || (m as Record<string, unknown>).url || "")
        if (isValidImageUrl(url)) return url
      }
    }
  }

  // Check media:thumbnail (array or single object)
  const mediaThumb = item["media:thumbnail"]
  if (mediaThumb) {
    const list = Array.isArray(mediaThumb) ? mediaThumb : [mediaThumb]
    for (const m of list) {
      if (typeof m === "object" && m !== null) {
        const url = String((m as Record<string, unknown>)["@_url"] || (m as Record<string, unknown>).url || "")
        if (isValidImageUrl(url)) return url
      }
    }
  }

  // Check <img> tag inside description
  const desc = String(item.description || "")
  const imgDescMatch = desc.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i)
  if (imgDescMatch && isValidImageUrl(imgDescMatch[1])) return imgDescMatch[1]

  // Check <img> tag inside content:encoded
  const encoded = String(item["content:encoded"] || "")
  const imgEncMatch = encoded.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i)
  if (imgEncMatch && isValidImageUrl(imgEncMatch[1])) return imgEncMatch[1]

  return undefined
}

/**
 * Fetches Open Graph / Twitter image from article webpage with timeout and caching.
 */
export async function fetchOgImage(url: string, timeoutMs = 2500): Promise<string | undefined> {
  if (!url || !url.startsWith("http")) return undefined

  if (ogCache.has(url)) {
    const cached = ogCache.get(url)
    return cached ?? undefined
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AI-News/1.0 (news aggregation prototype; +https://github.com/Yugu-48/ai-news)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    })

    if (!response.ok) {
      ogCache.set(url, null)
      return undefined
    }

    const html = await response.text()

    // Match og:image or twitter:image tags
    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)

    if (ogMatch && ogMatch[1]) {
      let imageUrl = ogMatch[1].trim()
      // Resolve relative URLs
      if (imageUrl.startsWith("/")) {
        try {
          imageUrl = new URL(imageUrl, url).href
        } catch {
          // Keep original if parsing fails
        }
      }

      if (isValidImageUrl(imageUrl)) {
        ogCache.set(url, imageUrl)
        return imageUrl
      }
    }

    ogCache.set(url, null)
    return undefined
  } catch {
    ogCache.set(url, null)
    return undefined
  }
}

/**
 * Validates that an image URL is a real web URL and not a generic icon/favicon.
 */
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false
  // Filter out tiny favicons, spacer gifs, or known generic brand logos
  if (/\b(favicon|pixel|spacer|arxiv-logo-fb|1x1)\b/i.test(url)) return false
  return true
}

/**
 * Resolves the best image for an article candidate:
 * 1. Feed media tag (if present)
 * 2. Scraped Open Graph image (if accessible)
 * 3. Topic-appropriate category fallback image
 */
export async function resolveArticleImage(item: {
  title: string
  url: string
  category: NewsCategory | string
  feedImage?: string
}): Promise<string> {
  if (item.feedImage && isValidImageUrl(item.feedImage)) {
    return item.feedImage
  }

  // Try Open Graph scrape
  const og = await fetchOgImage(item.url)
  if (og) return og

  // Fallback to high-resolution topic editorial image
  return getCategoryFallbackImage(item.category, item.url || item.title)
}
