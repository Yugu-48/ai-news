"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Article } from "@/lib/types"
import { Clock } from "lucide-react"
import { BookmarkButton } from "@/components/bookmark-button"
import { LikeButton } from "@/components/like-button"

interface ArticleCardProps {
  article: Article
  isHero?: boolean
  className?: string
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  Research: "from-indigo-600 to-purple-600",
  Industry: "from-blue-600 to-cyan-600",
  Policy: "from-amber-500 to-orange-600",
  Hardware: "from-pink-600 to-rose-600",
}

const CATEGORY_ACCENT: Record<string, string> = {
  Research: "text-indigo-600 dark:text-indigo-400",
  Industry: "text-blue-600 dark:text-blue-400",
  Policy: "text-amber-600 dark:text-amber-400",
  Hardware: "text-pink-600 dark:text-pink-400",
}

export function ArticleCard({ article, isHero = false, className = "" }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)
  const gradient = CATEGORY_GRADIENTS[article.category] ?? "from-slate-600 to-slate-800"
  const accentColor = CATEGORY_ACCENT[article.category] ?? "text-muted-foreground"

  return (
    <article
      className={`group block rounded-2xl transition-all duration-300 ${
        isHero ? "col-span-full" : "h-full"
      } ${className}`}
    >
      <Card className={`overflow-hidden border border-border/40 bg-card h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 glow-hover group-focus-visible:shadow-xl rounded-2xl flex flex-col ${
        isHero ? "md:flex-row md:min-h-[400px]" : ""
      }`}>

        {/* Cover Image/Gradient Section */}
        <div className={`relative overflow-hidden bg-muted ${
          isHero
            ? "w-full md:w-1/2 aspect-video md:aspect-auto min-h-[240px] md:min-h-full"
            : "w-full aspect-video"
        }`}>
          <Link href={`/article/${article.slug}`} aria-label={`Read ${article.title}`} className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
          {article.imageUrl && !imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white/10`}>
              <span className="font-extrabold text-7xl tracking-tighter select-none">AI</span>
            </div>
          )}
          </Link>

          {/* Subtle gradient overlay on image for text legibility */}
          {article.imageUrl && !imgError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          )}

          {/* Category Badge overlay */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 text-[10px] font-extrabold tracking-widest uppercase rounded-full bg-background/90 backdrop-blur border border-border/30 ${accentColor}`}>
              {article.category}
            </span>
          </div>

          {/* Like & Bookmark Overlay */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <LikeButton articleId={article.id} />
            <BookmarkButton articleId={article.id} />
          </div>

          {/* Reading time overlay for hero */}
          {isHero && article.readingTime && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-background/90 backdrop-blur border border-border/30 text-muted-foreground">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {article.readingTime} min read
              </span>
            </div>
          )}
        </div>

        {/* Article Details Section */}
        <div className={`flex flex-col flex-1 p-5 gap-2 ${isHero ? "md:w-1/2 md:p-8 justify-center" : ""}`}>

          {/* Source + Date + Reading time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="font-semibold text-foreground/80">{article.source}</span>
            <span aria-hidden="true" className="text-border">·</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {!isHero && article.readingTime && (
              <>
                <span aria-hidden="true" className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {article.readingTime} min
                </span>
              </>
            )}
          </div>

          <CardTitle className={`font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight ${
            isHero ? "text-2xl md:text-3xl" : "text-lg line-clamp-2"
          }`}>
            <Link href={`/article/${article.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm">{article.title}</Link>
          </CardTitle>

          <CardDescription className={`text-muted-foreground/90 leading-relaxed ${
            isHero ? "text-base line-clamp-4" : "text-sm line-clamp-3"
          }`}>
            {article.summary}
          </CardDescription>

          {/* Tags & Save for later footer row */}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border/20">
            <div className="flex flex-wrap gap-1.5" aria-label="Tags">
              {article.tags.slice(0, isHero ? 5 : 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-muted/65 hover:bg-muted text-[10px] py-0 px-2 rounded-full font-medium">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            {/* Bottom Bookmark Tag */}
            <div className="shrink-0">
              <BookmarkButton articleId={article.id} variant="icon" className="scale-90 opacity-90 hover:opacity-100" />
            </div>
          </div>
        </div>
      </Card>
    </article>
  )
}
