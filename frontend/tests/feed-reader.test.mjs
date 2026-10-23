import test from "node:test"
import assert from "node:assert/strict"
import { filterFeed, initialFilters, countNewStories, feedFingerprint, createFeedState, feedReducer, resolveFeedLayout, calculateTrendingScore } from "../src/lib/feed-model.ts"
import { createFeedPoller } from "../src/lib/feed-poller.ts"

const article = (id, fields = {}) => ({ id, slug: id, title: "AI model research", summary: "An abstract", source: "arXiv AI", category: "Research", tags: ["models"], url: `https://example.org/${id}`, publishedAt: "2026-10-12T08:00:00Z", ...fields })

test("query, topic, source and tag filters combine without changing input", () => {
  const data = [article("a"), article("b", { source: "Other source" }), article("c", { category: "Industry" }), article("d", { tags: [] })]
  const filters = { ...initialFilters("Research"), query: "  ABSTRACT ", source: "arXiv AI", tag: "models" }
  assert.deepEqual(filterFeed(data, filters).map(row => row.id), ["a"])
  assert.equal(data.length, 4)
  assert.equal(filterFeed(data, { ...filters, source: "missing" }).length, 0)
})
test("collection totals remain independent of the filtered visible list", () => {
  const data = [article("a"), article("b", { source: "Other source" })]
  const ids = ["a", "b", "b"]
  assert.equal(filterFeed(data, initialFilters("Saved"), ids).length, 2)
  assert.equal(filterFeed(data, { ...initialFilters("Saved"), source: "Other source" }, ids).length, 1)
  assert.equal(filterFeed(data, initialFilters("Liked"), [], ["a"]).length, 1)
})
test("new story count respects the active reader filters", () => {
  const current = [article("a")]
  const incoming = [...current, article("b"), article("c", { category: "Industry" }), article("d", { source: "Other source" })]
  assert.equal(countNewStories(current, incoming, { ...initialFilters("Research"), source: "arXiv AI" }), 1)
  assert.equal(countNewStories(current, incoming, initialFilters("Saved"), ["a"]), 0)
  assert.equal(countNewStories([article("archived")], [article("archived")], initialFilters("Saved"), ["archived"]), 0)
})
test("incoming updates leave the visible feed stable until applied", () => {
  const original = [article("a")]
  const incoming = [...original, article("b")]
  let state = createFeedState(original)
  state = feedReducer(state, { type: "receive", articles: incoming })
  assert.equal(state.visible, original)
  assert.equal(state.pending, incoming)
  state = feedReducer(state, { type: "apply" })
  assert.equal(state.visible, incoming)
  assert.equal(state.pending, null)
  assert.equal(feedReducer(state, { type: "apply" }), state)
})
test("metadata changes/removals notify, reorder alone does not", () => {
  const current = [article("a"), article("b")]
  assert.equal(feedFingerprint(current), feedFingerprint([...current].reverse()))
  assert.equal(feedReducer(createFeedState(current), { type: "receive", articles: [...current].reverse() }).pending, null)
  assert.ok(feedReducer(createFeedState(current), { type: "receive", articles: [article("a", { summary: "Updated abstract" })] }).pending)
})
test("failed polling retains both displayed stories and an offered update", () => {
  const state = feedReducer(createFeedState([article("a")]), { type: "receive", articles: [article("b")] })
  const failed = feedReducer(state, { type: "error" })
  assert.equal(failed.visible, state.visible)
  assert.equal(failed.pending, state.pending)
  assert.equal(failed.error, true)
  assert.equal(feedReducer(failed, { type: "discard" }).pending, null)
})
test("layout preference is separate from filters and collections default to compact", () => {
  assert.equal(resolveFeedLayout(null, "All News"), "editorial")
  assert.equal(resolveFeedLayout(null, "Saved"), "compact")
  assert.equal(resolveFeedLayout(null, "Liked"), "compact")
  assert.equal(resolveFeedLayout("editorial", "Saved"), "editorial")
  assert.equal(resolveFeedLayout("compact", "Research"), "compact")
  assert.equal(resolveFeedLayout("invalid", "Saved"), "compact")
})
test("poller skips hidden documents and overlapping requests", async () => {
  let visible = false, calls = 0, done, delivered = 0
  const poller = createFeedPoller({ isVisible: () => visible, load: () => { calls++; return new Promise(resolve => { done = resolve }) }, onData: () => delivered++, onError: () => assert.fail("unexpected error") })
  await poller.tick()
  assert.equal(calls, 0)
  visible = true
  const active = poller.tick()
  await poller.tick()
  assert.equal(calls, 1)
  done([article("a")])
  await active
  assert.equal(delivered, 1)
  poller.stop()
  await poller.tick()
  assert.equal(calls, 1)
})
test("poller reports failures and recovers without overlapping", async () => {
  let calls = 0, errors = 0, delivered = 0
  const poller = createFeedPoller({ isVisible: () => true, load: async () => { if (++calls === 1) throw new Error("offline"); return [article("a")] }, onData: () => delivered++, onError: () => errors++ })
  await poller.tick()
  await poller.tick()
  assert.equal(errors, 1)
  assert.equal(delivered, 1)
  poller.stop()
})
test("stopping a request aborts it and suppresses callbacks after navigation", async () => {
  let signal, done, callbacks = 0
  const poller = createFeedPoller({ isVisible: () => true, load: value => { signal = value; return new Promise(resolve => { done = resolve }) }, onData: () => callbacks++, onError: () => callbacks++ })
  const work = poller.tick()
  poller.stop()
  assert.equal(signal.aborted, true)
  done([article("a")])
  await work
  assert.equal(callbacks, 0)
})
test("trending sort ranks engaged, recent and high-impact stories above older quiet stories", () => {
  const quietOld = article("quiet_old", { publishedAt: "2026-10-01T00:00:00Z", title: "Standard archive item" })
  const trendingTopic = article("trending_topic", { publishedAt: new Date(Date.now() - 3600000).toISOString(), title: "Major breakthrough in reasoning model" })
  const likedStory = article("liked_story", { publishedAt: new Date(Date.now() - 7200000).toISOString(), title: "Standard article" })
  const data = [quietOld, likedStory, trendingTopic]

  const sorted = filterFeed(data, { ...initialFilters("All News"), sort: "trending" }, [], ["liked_story"])
  assert.equal(sorted[0].id, "liked_story") // Engagement boost (+50) plus recent recency
  assert.equal(sorted[1].id, "trending_topic") // Breakthrough + reasoning keywords + recent velocity
  assert.equal(sorted[2].id, "quiet_old") // Old quiet story has lowest trending score
  assert.ok(calculateTrendingScore(likedStory, [], ["liked_story"]) > calculateTrendingScore(quietOld))
})
test("oldest sort orders stories by earliest publication date first", () => {
  const old = article("old", { publishedAt: "2026-10-01T00:00:00Z" })
  const mid = article("mid", { publishedAt: "2026-10-10T00:00:00Z" })
  const recent = article("recent", { publishedAt: "2026-10-20T00:00:00Z" })
  const sorted = filterFeed([mid, recent, old], { ...initialFilters("All News"), sort: "oldest" })
  assert.deepEqual(sorted.map(a => a.id), ["old", "mid", "recent"])
})
test("initialFilters defaults to latest sort and latest sort orders newest first", () => {
  const filters = initialFilters("All News")
  assert.equal(filters.sort, "latest")
  const old = article("old", { publishedAt: "2026-10-01T00:00:00Z" })
  const recent = article("recent", { publishedAt: "2026-10-20T00:00:00Z" })
  const sorted = filterFeed([old, recent], filters)
  assert.deepEqual(sorted.map(a => a.id), ["recent", "old"])
})
