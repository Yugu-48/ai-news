"use client"

import Link from "next/link"
import { Flame } from "lucide-react"
import { articles } from "@/lib/mock-data"

export function TrendingTicker() {
  const trendingArticles = articles.slice(0, 5)

  return (
    <div className="w-full bg-muted/40 border-b border-border/30 overflow-hidden py-2 text-xs">
      <div className="container max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-3 w-full">
        {/* Flame Badge */}
        <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          <Flame className="h-3 w-3 fill-amber-500 text-amber-500 animate-bounce" />
          <span>Trending</span>
        </div>

        {/* Ticker Items */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 whitespace-nowrap animate-none sm:animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
            {trendingArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <span className="text-[10px] text-primary font-bold">[{article.category}]</span>
                <span className="truncate max-w-xs sm:max-w-md">{article.title}</span>
                <span className="text-border">/</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
