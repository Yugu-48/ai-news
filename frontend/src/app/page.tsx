"use client"

import { useState } from "react"
import { ArticleCard } from "@/components/article-card"
import { SearchFilter } from "@/components/search-filter"
import { articles } from "@/lib/mock-data"
import { Article } from "@/lib/types"

export default function Home() {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)

  const hasArticles = filteredArticles.length > 0
  const featuredArticle = hasArticles ? filteredArticles[0] : null
  const remainingArticles = hasArticles ? filteredArticles.slice(1) : []

  return (
    <div className="container max-w-7xl py-10 px-4 md:px-8 space-y-10">
      {/* Header and Brand */}
      <div className="flex flex-col space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
          Latest AI Developments
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Stay updated with high-quality digests, insights, and breakthroughs in artificial intelligence compiled from trusted sources.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-muted/30 p-2 rounded-3xl border border-border/40 backdrop-blur-sm">
        <SearchFilter articles={articles} onFilter={setFilteredArticles} />
      </div>

      {/* Articles Stream */}
      {!hasArticles ? (
        <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl space-y-3">
          <p className="text-lg font-semibold text-muted-foreground">No articles matches found</p>
          <p className="text-sm text-muted-foreground/75">Try clearing filters or checking your spelling.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Hero Article */}
          {featuredArticle && (
            <div className="space-y-4">
              <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                Featured Cover
              </span>
              <ArticleCard article={featuredArticle} isHero={true} />
            </div>
          )}

          {/* Grid for remaining articles */}
          {remainingArticles.length > 0 && (
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                Latest Updates
              </span>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
