"use client"

import { useState, useEffect, useCallback } from "react"

const BOOKMARKS_KEY = "ai_news_bookmarks"

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const loadBookmarks = useCallback(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY)
      if (stored) {
        setBookmarkedIds(JSON.parse(stored))
      } else {
        setBookmarkedIds([])
      }
    } catch (e) {
      console.error("Failed to parse bookmarks", e)
    }
  }, [])

  useEffect(() => {
    loadBookmarks()
    setMounted(true)

    // Listen for changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === BOOKMARKS_KEY) {
        loadBookmarks()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadBookmarks])

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarkedIds((prev) => {
      const isBookmarked = prev.includes(articleId)
      const updated = isBookmarked
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]

      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
        // Dispatch custom event for same-tab updates across decoupled hooks
        window.dispatchEvent(new Event("local-storage-bookmarks"))
      } catch (e) {
        console.error("Failed to save bookmarks", e)
      }

      return updated
    })
  }, [])

  // Listen for same-tab custom event
  useEffect(() => {
    const handleCustomEvent = () => loadBookmarks()
    window.addEventListener("local-storage-bookmarks", handleCustomEvent)
    return () => window.removeEventListener("local-storage-bookmarks", handleCustomEvent)
  }, [loadBookmarks])

  const isBookmarked = useCallback(
    (articleId: string) => bookmarkedIds.includes(articleId),
    [bookmarkedIds]
  )

  return {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked,
    mounted,
  }
}
