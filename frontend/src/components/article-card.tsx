"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Article } from "@/lib/types"

interface ArticleCardProps {
  article: Article
  isHero?: boolean
}

export function ArticleCard({ article, isHero = false }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)

  // Fallback gradient based on article category
  const getGradient = (category: string) => {
    switch (category) {
      case "Research":
        return "from-indigo-600 to-purple-600"
      case "Industry":
        return "from-blue-600 to-cyan-600"
      case "Policy":
        return "from-amber-500 to-orange-600"
      case "Hardware":
        return "from-pink-600 to-rose-600"
      default:
        return "from-slate-600 to-slate-800"
    }
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className={`group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-2xl transition-all duration-300 ${
        isHero ? "col-span-full" : "h-full"
      }`}
    >
      <Card className={`overflow-hidden border border-border/40 bg-card h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 group-focus-visible:shadow-xl rounded-2xl flex flex-col ${
        isHero ? "md:flex-row md:min-h-[380px]" : ""
      }`}>
        {/* Cover Image/Gradient Section */}
        <div className={`relative overflow-hidden bg-muted ${
          isHero 
            ? "w-full md:w-1/2 aspect-video md:aspect-auto min-h-[220px] md:min-h-full" 
            : "w-full aspect-video"
        }`}>
          {article.imageUrl && !imgError ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${getGradient(article.category)} flex items-center justify-center text-white/10`}>
              <span className="font-extrabold text-7xl tracking-tighter select-none">AI</span>
            </div>
          )}
          {/* Category Badge overlay */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase rounded-full bg-background/90 backdrop-blur text-foreground border border-border/30">
              {article.category}
            </span>
          </div>
        </div>

        {/* Article Details Section */}
        <div className={`flex flex-col flex-1 p-6 ${isHero ? "md:w-1/2 justify-center" : ""}`}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span className="font-semibold text-foreground/80">{article.source}</span>
            <span aria-hidden="true" className="text-border">•</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>

          <CardTitle className={`font-bold tracking-tight mb-3 text-foreground group-hover:text-indigo-600 transition-colors leading-tight ${
            isHero ? "text-2xl md:text-3xl" : "text-lg line-clamp-2"
          }`}>
            {article.title}
          </CardTitle>

          <CardDescription className={`text-muted-foreground/90 leading-relaxed mb-6 ${
            isHero ? "text-base line-clamp-4" : "text-sm line-clamp-3"
          }`}>
            {article.summary}
          </CardDescription>

          <div className="mt-auto pt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted/65 hover:bg-muted text-[10px] py-0 px-2 rounded-full font-medium">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}
