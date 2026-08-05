"use client"

import { useState, useEffect, useCallback } from "react"

const LIKES_KEY = "ai_news_liked"

export function useLikes() {
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const loadLikes = useCallback(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY)
      if (stored) {
        setLikedIds(JSON.parse(stored))
      } else {
        setLikedIds([])
      }
    } catch (e) {
      console.error("Failed to parse liked articles", e)
    }
  }, [])

  useEffect(() => {
    loadLikes()
    setMounted(true)

    // Listen for changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LIKES_KEY) {
        loadLikes()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadLikes])

  const toggleLike = useCallback((articleId: string) => {
    setLikedIds((prev) => {
      const isLiked = prev.includes(articleId)
      const updated = isLiked
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]

      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify(updated))
        // Dispatch custom event for same-tab updates across decoupled hooks
        window.dispatchEvent(new Event("local-storage-likes"))
      } catch (e) {
        console.error("Failed to save liked articles", e)
      }

      return updated
    })
  }, [])

  // Listen for same-tab custom event
  useEffect(() => {
    const handleCustomEvent = () => loadLikes()
    window.addEventListener("local-storage-likes", handleCustomEvent)
    return () => window.removeEventListener("local-storage-likes", handleCustomEvent)
  }, [loadLikes])

  const isLiked = useCallback(
    (articleId: string) => likedIds.includes(articleId),
    [likedIds]
  )

  return {
    likedIds,
    toggleLike,
    isLiked,
    mounted,
  }
}
