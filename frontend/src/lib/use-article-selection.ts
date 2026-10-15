"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import type { Article } from "./types"
import { mergeLibraryArticles, parseSelectionIds, parseStoredArticles, selectLibraryArticles, toggleSelection } from "./article-selection"

const BOOKMARKS_KEY = "ai_news_bookmarks"
const LIKES_KEY = "ai_news_liked"
const ARTICLES_KEY = "ai_news_library_articles"
const CHANGE_EVENT = "ai-news-library-change"
const memory = new Map<string, string>()
const sessionOnly = new Set<string>()
const emptySnapshot = () => ""
const subscribeToHydration = () => () => {}

function read(key: string): string {
  if (sessionOnly.has(key)) return memory.get(key) ?? ""
  try { return localStorage.getItem(key) ?? "" } catch { return memory.get(key) ?? "" }
}

function write(key: string, value: string) {
  memory.set(key, value)
  try { localStorage.setItem(key, value); sessionOnly.delete(key) } catch { sessionOnly.add(key) }
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null) sessionOnly.clear()
    else sessionOnly.delete(event.key)
    if (event.key === null || [BOOKMARKS_KEY, LIKES_KEY, ARTICLES_KEY].includes(event.key)) listener()
  }
  window.addEventListener("storage", onStorage)
  window.addEventListener(CHANGE_EVENT, listener)
  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener(CHANGE_EVENT, listener)
  }
}

function remember(articles: Article[]) {
  const ids = [...parseSelectionIds(read(BOOKMARKS_KEY)), ...parseSelectionIds(read(LIKES_KEY))]
  const snapshot = JSON.stringify(selectLibraryArticles(mergeLibraryArticles(articles, parseStoredArticles(read(ARTICLES_KEY))), ids))
  if (snapshot !== read(ARTICLES_KEY)) write(ARTICLES_KEY, snapshot)
}

export function rememberSelectedArticles(articles: Article[]) {
  const previous = read(ARTICLES_KEY)
  remember(articles)
  if (previous !== read(ARTICLES_KEY)) window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function useStoredArticles() {
  const raw = useSyncExternalStore(subscribe, () => read(ARTICLES_KEY), emptySnapshot)
  return useMemo(() => parseStoredArticles(raw), [raw])
}

export function useArticleSelection(kind: "saved" | "liked") {
  const key = kind === "saved" ? BOOKMARKS_KEY : LIKES_KEY
  const raw = useSyncExternalStore(subscribe, () => read(key), emptySnapshot)
  const ids = useMemo(() => parseSelectionIds(raw), [raw])
  const mounted = useSyncExternalStore(subscribeToHydration, () => true, () => false)
  const toggle = useCallback((id: string, article?: Article) => {
    // Read current shared storage; do not write/dispatch inside a React state updater.
    write(key, JSON.stringify(toggleSelection(parseSelectionIds(read(key)), id)))
    remember(article ? [article] : [])
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [key])
  const has = useCallback((id: string) => ids.includes(id), [ids])
  return { ids, toggle, has, mounted, persistent: !sessionOnly.has(key) && !sessionOnly.has(ARTICLES_KEY) }
}
