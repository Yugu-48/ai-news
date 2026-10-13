"use client"

import { useSyncExternalStore } from "react"
import { resolveFeedLayout, type FeedLayout, type FeedView } from "./feed-model"

const KEY = "ai_news_feed_layout"
const EVENT = "ai-news-layout-change"
let sessionValue = ""
let sessionOnly = false
function snapshot() {
  if (sessionOnly) return sessionValue
  try { return localStorage.getItem(KEY) ?? "" } catch { return sessionValue }
}
function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) { sessionOnly = false; listener() }
  }
  window.addEventListener(EVENT, listener)
  window.addEventListener("storage", storage)
  return () => { window.removeEventListener(EVENT, listener); window.removeEventListener("storage", storage) }
}
export function useFeedLayout(view: FeedView) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "")
  const layout = resolveFeedLayout(raw, view)
  function setLayout(value: FeedLayout) {
    sessionValue = value
    try { localStorage.setItem(KEY, value); sessionOnly = false } catch { sessionOnly = true }
    window.dispatchEvent(new Event(EVENT))
  }
  return { layout, setLayout }
}
