"use client"

import { useSyncExternalStore } from "react"
import { Input } from "@/components/ui/input"
import { Search, X, Rows3, LayoutGrid } from "lucide-react"
import type { Article } from "@/lib/types"
import type { FeedFilters, FeedLayout, FeedSort } from "@/lib/feed-model"

const subscribeToHydration = () => () => {}
const clientReady = () => true
const serverReady = () => false

interface SearchFilterProps {
  articles: Article[]
  filters: FeedFilters
  onChange: (filters: FeedFilters) => void
  layout: FeedLayout
  onLayoutChange: (layout: FeedLayout) => void
}

export function SearchFilter({ articles, filters, onChange, layout, onLayoutChange }: SearchFilterProps) {
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady)
  const sources = [...new Set(articles.map(article => article.source))].sort()
  const tags = [...new Set(articles.flatMap(article => article.tags))].sort()
  const active = filters.query !== "" || filters.source !== "All" || filters.tag !== "All" || (filters.sort !== undefined && filters.sort !== "latest")
  return <div className="reader-toolbar" aria-label="Reader tools">
    <div className="relative min-w-0 flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input disabled={!ready} aria-label="Search articles" placeholder="Search this section…" value={filters.query} onChange={event => onChange({ ...filters, query: event.target.value })} className="h-11 pl-9 pr-11 bg-card rounded-md" />
      {filters.query && <button type="button" aria-label="Clear search text" onClick={() => onChange({ ...filters, query: "" })} className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground"><X className="h-4 w-4" /></button>}
    </div>
    <select disabled={!ready} aria-label="Filter by source" value={filters.source} onChange={event => onChange({ ...filters, source: event.target.value })} className="reader-select">
      <option value="All">All sources</option>
      {sources.map(source => <option key={source} value={source}>{source}</option>)}
      {filters.source !== "All" && !sources.includes(filters.source) && <option value={filters.source}>{filters.source} (unavailable)</option>}
    </select>
    {(tags.length > 0 || filters.tag !== "All") && <select disabled={!ready} aria-label="Filter by specific tag" value={filters.tag} onChange={event => onChange({ ...filters, tag: event.target.value })} className="reader-select">
      <option value="All">All tags</option>{tags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
      {filters.tag !== "All" && !tags.includes(filters.tag) && <option value={filters.tag}>{filters.tag} (unavailable)</option>}
    </select>}
    <select disabled={!ready} aria-label="Sort articles" value={filters.sort ?? "latest"} onChange={event => onChange({ ...filters, sort: event.target.value as FeedSort })} className="reader-select">
      <option value="latest">Sort: Latest</option>
      <option value="trending">Sort: Trending</option>
      <option value="oldest">Sort: Oldest</option>
    </select>
    {active && <button type="button" className="reader-clear" onClick={() => onChange({ ...filters, query: "", source: "All", tag: "All", sort: "latest" })}>Clear filters</button>}
    <div className="layout-switch" role="group" aria-label="Feed layout">
      <button disabled={!ready} type="button" aria-label="Editorial view" aria-pressed={layout === "editorial"} onClick={() => onLayoutChange("editorial")}><LayoutGrid className="h-4 w-4" /><span>Editorial</span></button>
      <button disabled={!ready} type="button" aria-label="Compact view" aria-pressed={layout === "compact"} onClick={() => onLayoutChange("compact")}><Rows3 className="h-4 w-4" /><span>Compact</span></button>
    </div>
  </div>
}
