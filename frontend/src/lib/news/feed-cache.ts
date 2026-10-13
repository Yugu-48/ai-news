/** Share cold requests and serve the last successful feed while refreshing. */
export function createFeedCache<T>(load: () => Promise<T[]>, ttlMs = 60_000, now = Date.now) {
  let value: T[] = []
  let fetchedAt: number | null = null
  let attemptedAt: number | null = null
  let pending: Promise<T[]> | null = null

  function refresh(): Promise<T[]> {
    if (pending) return pending
    attemptedAt = now()
    pending = Promise.resolve().then(load).then((items) => {
      // A failed/empty refresh must not erase the last usable feed.
      if (items.length > 0) {
        value = items
        fetchedAt = now()
      }
      return value
    }).catch(() => value).finally(() => { pending = null })
    return pending
  }

  return {
    async read(): Promise<T[]> {
      if (attemptedAt === null || now() - attemptedAt >= ttlMs) {
        const work = refresh()
        if (value.length === 0) return work
      }
      return value.length > 0 ? value : pending ?? value
    },
    status: () => ({ articleCount: value.length, lastFetchedAt: fetchedAt === null ? null : new Date(fetchedAt).toISOString() }),
  }
}
