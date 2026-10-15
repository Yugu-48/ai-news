"use client"
import { useArticleSelection } from "./use-article-selection"

export function useBookmarks() {
  const { ids, toggle, has, mounted } = useArticleSelection("saved")
  return { bookmarkedIds: ids, toggleBookmark: toggle, isBookmarked: has, mounted }
}
