"use client"
import { useArticleSelection } from "./use-article-selection"

export function useLikes() {
  const { ids, toggle, has, mounted } = useArticleSelection("liked")
  return { likedIds: ids, toggleLike: toggle, isLiked: has, mounted }
}
