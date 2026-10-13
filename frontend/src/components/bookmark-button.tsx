"use client"

import { Bookmark } from "lucide-react"
import { useBookmarks } from "@/lib/use-bookmarks"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"

interface BookmarkButtonProps {
  articleId: string
  article?: Article
  variant?: "icon" | "button"
  className?: string
}

export function BookmarkButton({ articleId, article, variant = "icon", className = "" }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks()
  const active = mounted && isBookmarked(articleId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark(articleId, article)
  }

  if (variant === "button") {
    return (
      <Button
        variant={active ? "default" : "outline"}
        className={`min-h-11 rounded-md font-semibold gap-2 transition-all ${className}`}
        onClick={handleClick}
        aria-label={active ? "Remove bookmark" : "Save article"}
        aria-pressed={active}
      >
        <Bookmark className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
        {active ? "Saved" : "Save Article"}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Remove bookmark" : "Save article"}
      aria-pressed={active}
      title={active ? "Saved to bookmarks" : "Save to bookmarks"}
      className={`min-h-11 min-w-11 p-2 flex items-center justify-center rounded-md backdrop-blur-md transition-all duration-200 ${
        active
          ? "bg-primary text-primary-foreground shadow-md scale-105"
          : "bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background border border-border/40"
      } ${className}`}
    >
      <Bookmark className={`h-3.5 w-3.5 ${active ? "fill-current" : ""}`} />
    </button>
  )
}

