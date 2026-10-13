import type { Article } from "./types"

interface PollerOptions {
  load: (signal: AbortSignal) => Promise<Article[]>
  onData: (articles: Article[]) => void
  onError: () => void
  isVisible: () => boolean
}

/** A single cancelable request at a time; never clears displayed news on failure. */
export function createFeedPoller({ load, onData, onError, isVisible }: PollerOptions) {
  let controller: AbortController | null = null
  let stopped = false
  return {
    async tick() {
      if (stopped || controller || !isVisible()) return
      const request = new AbortController()
      controller = request
      const timeout = setTimeout(() => request.abort(), 15_000)
      try {
        const articles = await load(request.signal)
        if (!stopped) onData(articles)
      } catch {
        if (!stopped) onError()
      } finally {
        clearTimeout(timeout)
        if (controller === request) controller = null
      }
    },
    stop() { stopped = true; controller?.abort() },
  }
}
