"use client"

import { Heart } from "lucide-react"
import { useLikes } from "@/lib/use-likes"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/types"

interface LikeButtonProps {
  articleId: string
  article?: Article
  variant?: "icon" | "button"
  className?: string
}

export function LikeButton({ articleId, article, variant = "icon", className = "" }: LikeButtonProps) {
  const { isLiked, toggleLike, mounted } = useLikes()
  const active = mounted && isLiked(articleId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike(articleId, article)
  }

  if (variant === "button") {
    return (
      <Button
        variant={active ? "default" : "outline"}
        className={`min-h-11 rounded-md font-semibold gap-2 transition-all ${
          active
            ? "bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
            : "hover:text-rose-600 hover:border-rose-300"
        } ${className}`}
        onClick={handleClick}
        aria-label={active ? "Unlike article" : "Like article"}
        aria-pressed={active}
      >
        <Heart className={`h-4 w-4 transition-transform active:scale-125 ${active ? "fill-current text-white" : ""}`} />
        {active ? "Liked" : "Like Article"}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Unlike article" : "Like article"}
      aria-pressed={active}
      title={active ? "Remove from liked" : "Like this article"}
      className={`min-h-11 min-w-11 p-2 flex items-center justify-center rounded-md backdrop-blur-md transition-all duration-200 ${
        active
          ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 scale-105"
          : "bg-background/80 text-muted-foreground hover:text-rose-500 hover:bg-background border border-border/40"
      } ${className}`}
    >
      <Heart className={`h-3.5 w-3.5 transition-transform active:scale-125 ${active ? "fill-rose-500 text-rose-500" : ""}`} />
    </button>
  )
}

