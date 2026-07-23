"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Article } from "@/lib/types"
import { Search, SlidersHorizontal } from "lucide-react"

interface SearchFilterProps {
  articles: Article[]
  onFilter: (filtered: Article[]) => void
}

export function SearchFilter({ articles, onFilter }: SearchFilterProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [selectedTag, setSelectedTag] = useState<string>("All")

  const categories = ["All", "Research", "Industry", "Policy", "Hardware"]
  
  // Get all unique tags and sort them
  const allTags = ["All", ...Array.from(new Set(articles.flatMap((a) => a.tags))).sort()]

  const applyFilters = (searchQuery: string, category: string, tag: string) => {
    let filtered = articles

    // 1. Search Query filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.summary.toLowerCase().includes(lower) ||
          a.source.toLowerCase().includes(lower)
      )
    }

    // 2. Category filter
    if (category !== "All") {
      filtered = filtered.filter((a) => a.category === category)
    }

    // 3. Tag filter
    if (tag !== "All") {
      filtered = filtered.filter((a) => a.tags.includes(tag))
    }

    onFilter(filtered)
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    applyFilters(value, activeCategory, selectedTag)
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    applyFilters(query, category, selectedTag)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    applyFilters(query, activeCategory, tag)
  }

  return (
    <div className="space-y-6">
      {/* Search Input and Tag Select row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search AI articles, research, and analysis..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-background border-border/60 rounded-full focus-visible:ring-indigo-500"
            aria-label="Search articles"
          />
        </div>
        <div className="relative min-w-[160px] flex items-center">
          <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={selectedTag}
            onChange={(e) => handleTagChange(e.target.value)}
            className="w-full h-11 pl-10 pr-8 rounded-full border border-border/60 bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
            aria-label="Filter by specific tag"
          >
            <option value="All">Filter by Tag</option>
            {allTags.filter(t => t !== "All").map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3.5 pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Tabs row */}
      <div className="border-b border-border/40 pb-px">
        <div className="flex space-x-8 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`pb-3 text-sm font-semibold relative transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
