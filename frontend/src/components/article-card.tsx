"use client"

import Link from "next/link"

import type { Article } from "@/lib/types"
import { BookmarkButton } from "@/components/bookmark-button"
import { LikeButton } from "@/components/like-button"
import { StoryImage } from "./story-image"

interface ArticleCardProps {
  article: Article
  variant?: "lead" | "card" | "row"
  className?: string
  sourceOnly?: boolean
  restrained?: boolean
}

export function ArticleCard({ article, variant = "card", className = "", sourceOnly = false, restrained = false }: ArticleCardProps) {
  const href = sourceOnly ? article.url : `/article/${article.slug}`
  const linkProps = { href, target: sourceOnly ? "_blank" : undefined, rel: sourceOnly ? "noopener noreferrer" : undefined }
  const showImage = !restrained && variant !== "row"
  return <article data-variant={variant} data-category={article.category} data-article-id={article.id} className={`news-story news-story-${variant} ${restrained ? "news-story-abstract" : ""} ${className}`}>
    <div className="story-meta"><span className="category-label">{article.category}</span><span>{article.source}</span><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}</time></div>
    <h3 className="story-title"><Link {...linkProps}>{article.title}</Link></h3>
    {showImage && <StoryImage key={article.imageUrl ?? article.slug} article={article} eager={variant === "lead"} href={href} sourceOnly={sourceOnly} />}
    {(variant !== "row" || restrained) && article.summary && <p className="story-summary">{article.summary}</p>}
    {sourceOnly && <p className="text-xs text-muted-foreground">Archived story · Opens the original source</p>}
    <div className="story-actions"><span className="text-xs text-muted-foreground">{restrained ? "Source abstract / excerpt" : article.readingTime ? `${article.readingTime} min read` : "Source excerpt"}</span><div className="flex items-center"><LikeButton articleId={article.id} article={article} /><BookmarkButton articleId={article.id} article={article} /></div></div>
  </article>
}

