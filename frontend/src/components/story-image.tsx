"use client"

import { useState } from "react"
import Link from "next/link"
import type { Article } from "@/lib/types"
import { getCategoryFallbackImage, isCategoryFallbackImage } from "@/lib/news/image-resolver"

export function StoryImage({ article, eager = false, href, sourceOnly = false }: { article: Article; eager?: boolean; href?: string; sourceOnly?: boolean }) {
  const fallback = getCategoryFallbackImage(article.category, article.slug || article.title)
  const original = article.imageUrl || fallback
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const [fallbackFailed, setFallbackFailed] = useState(false)
  const src = failedSrc === original ? fallback : original
  const illustrative = isCategoryFallbackImage(src)
  // eslint-disable-next-line @next/next/no-img-element
  const cover = !fallbackFailed ? <img src={src} alt={illustrative ? `${article.category} illustration` : article.title} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} width={960} height={540} className="h-full w-full object-cover" onError={() => { if (src === fallback) setFallbackFailed(true); else setFailedSrc(original) }} /> : <span className="flex h-full items-center justify-center text-muted-foreground text-sm">Image unavailable</span>
  const className = "block w-full aspect-video overflow-hidden bg-muted rounded-sm"
  return <figure className="story-figure">
    {href ? <Link href={href} target={sourceOnly ? "_blank" : undefined} rel={sourceOnly ? "noopener noreferrer" : undefined} aria-label={`Read ${article.title}`} className={className}>{cover}</Link> : <div className={className}>{cover}</div>}
    {illustrative && <figcaption>Illustrative photograph</figcaption>}
  </figure>
}
