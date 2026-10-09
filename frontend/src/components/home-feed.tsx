"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArticleCard } from "@/components/article-card"
import { SearchFilter } from "@/components/search-filter"
import type { Article } from "@/lib/types"
import { matchesCategory, type FeedCategory } from "@/lib/categories"
import { BookOpen, Globe, Zap } from "lucide-react"

const STAGGER_CLASSES = [
  "stagger-1","stagger-2","stagger-3","stagger-4","stagger-5","stagger-6",
  "stagger-7","stagger-8","stagger-9","stagger-10","stagger-11","stagger-12",
]

interface HomeFeedProps {
  initialArticles: Article[]
  initialCategory: FeedCategory
}

export function HomeFeed({ initialArticles, initialCategory }: HomeFeedProps) {
  const router = useRouter()
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles.filter((article) => matchesCategory(article, initialCategory)))

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 60_000)
    return () => window.clearInterval(timer)
  }, [router])

  useEffect(() => setFilteredArticles(initialArticles.filter((article) => matchesCategory(article, initialCategory))), [initialArticles, initialCategory])

  const hasArticles = filteredArticles.length > 0
  const featuredArticle = hasArticles ? filteredArticles[0] : null
  const remainingArticles = hasArticles ? filteredArticles.slice(1) : []

  const sourcesCount = useMemo(
    () => new Set(initialArticles.map((a) => a.source)).size,
    [initialArticles]
  )

  const latestDate = useMemo(() => {
    if (initialArticles.length === 0) return "—"
    return new Date(initialArticles[0].publishedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }, [initialArticles])

  const isEmptyDatabase = initialArticles.length === 0

  return (
    <div className="container max-w-[1536px] mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-10 space-y-10 w-full">

      {/* Header and Brand */}
      <div className="flex flex-col space-y-4 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            AI News Feed
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent leading-tight">
          Latest AI<br className="hidden sm:block" /> Developments
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Stay updated with high-quality digests, insights, and breakthroughs in artificial intelligence — compiled from trusted sources worldwide.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-4 border-y border-border/40 animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            <strong className="text-foreground font-bold">{initialArticles.length}</strong> articles
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>
            <strong className="text-foreground font-bold">{sourcesCount}</strong> sources
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Latest publication <strong className="text-foreground font-bold">{latestDate}</strong></span>
        </div>
      </div>

      {isEmptyDatabase ? (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl space-y-4 animate-fade-in bg-card/30">
          <div className="h-12 w-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6 opacity-60" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">No articles available yet</p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Check back soon — the feed will populate as new AI news is published.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-muted/30 p-2 rounded-3xl border border-border/40 backdrop-blur-sm animate-fade-in-up stagger-3">
            <SearchFilter articles={initialArticles} onFilter={setFilteredArticles} initialCategory={initialCategory} />
          </div>

          {/* Articles Stream */}
          {!hasArticles ? (
            <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl space-y-4 animate-fade-in bg-card/30">
              <div className="h-12 w-12 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 opacity-60" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-foreground">No articles match your criteria</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Try clearing your search query, selecting another category, or saving some articles to your bookmarks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.assign("/")}
                className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                Show All Articles
              </button>
            </div>
          ) : (
            <div className="space-y-10">

              {/* Featured Hero Article */}
              {featuredArticle && (
                <div className="space-y-3 animate-fade-in-up stagger-4">
                  <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                    ✦ Featured Cover
                  </span>
                  <ArticleCard article={featuredArticle} isHero={true} />
                </div>
              )}

              {/* Grid for remaining articles */}
              {remainingArticles.length > 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
                      Latest Updates
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {remainingArticles.length} stories
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {remainingArticles.map((article, index) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        className={`animate-fade-in-up ${STAGGER_CLASSES[index] ?? ""}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
