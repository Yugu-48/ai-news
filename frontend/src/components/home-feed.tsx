"use client"

import Link from "next/link"
import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import { ArticleCard } from "@/components/article-card"
import { SearchFilter } from "@/components/search-filter"
import { TopicOverview } from "@/components/topic-overview"
import type { Article } from "@/lib/types"
import { categoryPages, collectionPages, isCollection, initialFilters, filterFeed, createFeedState, feedReducer, countNewStories, type FeedView } from "@/lib/feed-model"
import { useFeedLayout } from "@/lib/use-feed-layout"
import { createFeedPoller } from "@/lib/feed-poller"
import { useBookmarks } from "@/lib/use-bookmarks"
import { useLikes } from "@/lib/use-likes"
import { rememberSelectedArticles, useStoredArticles } from "@/lib/use-article-selection"
import { mergeLibraryArticles, selectLibraryArticles, parseStoredArticles } from "@/lib/article-selection"

interface HomeFeedProps { initialArticles: Article[]; initialView: FeedView }

export function HomeFeed({ initialArticles, initialView }: HomeFeedProps) {
  const [state, dispatch] = useReducer(feedReducer, initialArticles, createFeedState)
  const [filters, setFilters] = useState(() => initialFilters(initialView))
  const { layout, setLayout } = useFeedLayout(initialView)
  const { bookmarkedIds } = useBookmarks()
  const { likedIds } = useLikes()
  const archived = useStoredArticles()
  const resultsHeading = useRef<HTMLHeadingElement>(null)
  const library = useMemo(() => mergeLibraryArticles(state.visible, archived), [state.visible, archived])
  const saved = useMemo(() => selectLibraryArticles(library, bookmarkedIds), [library, bookmarkedIds])
  const liked = useMemo(() => selectLibraryArticles(library, likedIds), [library, likedIds])
  const collection = isCollection(initialView)
  const total = initialView === "Saved" ? saved.length : initialView === "Liked" ? liked.length : 0
  const missing = collection ? (initialView === "Saved" ? bookmarkedIds.length : likedIds.length) - total : 0
  const base = collection ? library : state.visible
  const filtered = useMemo(() => filterFeed(base, filters, bookmarkedIds, likedIds), [base, filters, bookmarkedIds, likedIds])
  const options = useMemo(() => filterFeed(base, initialFilters(initialView), bookmarkedIds, likedIds), [base, initialView, bookmarkedIds, likedIds])
  const currentIds = useMemo(() => new Set(state.visible.map(article => article.id)), [state.visible])
  const newCount = state.pending ? countNewStories(collection ? library : state.visible, state.pending, filters, bookmarkedIds, likedIds) : 0
  const sources = new Set(filtered.map(article => article.source)).size
  const research = initialView === "Research"
  const description = collection ? collectionPages[initialView].description : categoryPages[initialView].description
  const editorial = layout === "editorial"
  const card = (article: Article, variant: "lead" | "row" | "card") => <ArticleCard key={article.id} article={article} variant={variant} restrained={research} sourceOnly={!currentIds.has(article.id)} />

  useEffect(() => { rememberSelectedArticles(state.visible) }, [state.visible])
  useEffect(() => {
    const reset = () => { setFilters(initialFilters(initialView)); dispatch({ type: "discard" }) }
    window.addEventListener("ai-news-reset-feed", reset)
    return () => window.removeEventListener("ai-news-reset-feed", reset)
  }, [initialView])
  useEffect(() => {
    const poller = createFeedPoller({
      isVisible: () => document.visibilityState === "visible",
      load: async signal => {
        const response = await fetch("/api/articles?limit=50", { signal, cache: "no-store" })
        if (!response.ok) throw new Error("Feed refresh failed")
        const body: unknown = await response.json()
        if (!body || typeof body !== "object" || !("data" in body) || !Array.isArray(body.data)) throw new Error("Invalid feed")
        const articles = parseStoredArticles(JSON.stringify(body.data))
        if (articles.length !== body.data.length) throw new Error("Invalid article metadata")
        return articles
      },
      onData: articles => dispatch({ type: "receive", articles }),
      onError: () => dispatch({ type: "error" }),
    })
    const timer = window.setInterval(() => { void poller.tick() }, 60_000)
    return () => { window.clearInterval(timer); poller.stop() }
  }, [initialView])

  return <div data-section={initialView} data-layout={layout} className="desk-shell">
    <div className="desk-intro">
      <div><p className="desk-label">{collection ? "Your collection" : "The daily briefing"}</p><h1 className="editorial-heading">{initialView}</h1><p className="desk-description">{description}</p></div>
      <div className="collection-links" aria-label="Your collections"><Link href="/saved" prefetch={true} aria-current={initialView === "Saved" ? "page" : undefined}>Saved <span>{saved.length}</span></Link><Link href="/liked" prefetch={true} aria-current={initialView === "Liked" ? "page" : undefined}>Liked <span>{liked.length}</span></Link></div>
    </div>
    <SearchFilter articles={options} filters={filters} onChange={setFilters} layout={layout} onLayoutChange={setLayout} />
    <div className="feed-status">
      <p role="status">{collection ? `Showing ${filtered.length} of ${total} ${initialView.toLowerCase()} articles` : `${filtered.length} articles shown`} <span aria-hidden="true">/</span> {sources} sources</p>
      <div className="flex flex-wrap items-center gap-3" aria-live="polite">
        {state.error && <span className="text-xs text-muted-foreground">Updates unavailable. Your stories are still here.</span>}
        {state.pending && <button type="button" className="update-button" onClick={() => { dispatch({ type: "apply" }); resultsHeading.current?.focus({ preventScroll: true }) }}>{newCount > 0 ? `${newCount} new ${newCount === 1 ? "story" : "stories"}` : "Feed updated"} <span aria-hidden="true">↻</span></button>}
      </div>
    </div>
    {missing > 0 && <p className="legacy-notice">{missing} older {initialView.toLowerCase()} reference{missing === 1 ? " has" : "s have"} no stored story details. The references are kept; available stories are counted above.</p>}
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" ref={resultsHeading} tabIndex={-1} className="sr-only">{collection ? `Your ${initialView.toLowerCase()} stories` : "Latest stories"}</h2>
      {filtered.length === 0 ? <div className="desk-empty"><h3 className="editorial-heading">{collection && total === 0 ? `No ${initialView.toLowerCase()} stories yet` : "No stories match this view"}</h3><p>{collection && total === 0 ? "Use the bookmark or heart on a story to add it to your collection." : "Try another source or clear your search and filters."}</p><button type="button" className="reader-clear" onClick={() => setFilters(initialFilters(initialView))}>Clear filters</button><Link href="/news" className="ml-4 underline">Browse all news</Link></div> : editorial ? <>
        <div className="news-desk-grid">
          <section className="desk-lead" aria-label="Lead story"><p className="desk-label mb-3">{research ? "Research focus" : "In focus"}</p>{card(filtered[0], "lead")}</section>
          {filtered.length > 1 && <section className="desk-latest" aria-labelledby="latest-heading"><h2 id="latest-heading" className="desk-label mb-3">Latest headlines</h2>{filtered.slice(1, 6).map(article => card(article, "row"))}</section>}
          <div className="desk-topics"><TopicOverview articles={state.visible} active={initialView} /></div>
        </div>
        {filtered.length > 6 && <section className="desk-more" aria-labelledby="more-heading"><div className="flex items-center justify-between border-t border-border pt-5 mb-5"><h2 id="more-heading" className="desk-label">More to explore</h2><span className="text-xs text-muted-foreground">{filtered.length - 6} stories</span></div><div className="news-card-grid">{filtered.slice(6).map(article => card(article, "card"))}</div></section>}
      </> : <div className="compact-desk"><div className="compact-stories">{filtered.map(article => card(article, "row"))}</div><TopicOverview articles={state.visible} active={initialView} /></div>}
    </section>
  </div>
}
