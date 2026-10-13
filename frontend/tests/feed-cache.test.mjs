import test from "node:test"
import assert from "node:assert/strict"
import { createFeedCache } from "../src/lib/news/feed-cache.ts"

test("simultaneous cold page requests share one source fetch", async () => {
  let calls = 0
  let complete
  const cache = createFeedCache(() => { calls++; return new Promise(resolve => { complete = resolve }) })
  const first = cache.read()
  const second = cache.read()
  await Promise.resolve()
  assert.equal(calls, 1)
  complete(["genuine headline"])
  assert.deepEqual(await first, ["genuine headline"])
  assert.deepEqual(await second, ["genuine headline"])
})

test("expired feed returns immediately while a shared refresh is pending", async () => {
  let time = 0
  let complete
  let calls = 0
  const cache = createFeedCache(() => ++calls === 1 ? Promise.resolve(["old"]) : new Promise(resolve => { complete = resolve }), 60, () => time)
  await cache.read()
  time = 61
  assert.deepEqual(await cache.read(), ["old"])
  assert.deepEqual(await cache.read(), ["old"])
  assert.equal(calls, 2)
  complete(["new"])
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(await cache.read(), ["new"])
})

test("empty and rejected refreshes preserve stories and success timestamp", async () => {
  let time = 1
  let calls = 0
  const cache = createFeedCache(async () => {
    calls++
    if (calls === 1) return ["old"]
    if (calls === 2) return []
    throw new Error("source offline")
  }, 60, () => time)
  await cache.read()
  const success = cache.status().lastFetchedAt
  for (time of [62, 123]) {
    assert.deepEqual(await cache.read(), ["old"])
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(cache.status().lastFetchedAt, success)
  }
})

test("cold failures back off before retrying without claiming success", async () => {
  let time = 0
  let calls = 0
  const cache = createFeedCache(async () => { calls++; return [] }, 60, () => time)
  assert.deepEqual(await cache.read(), [])
  await cache.read()
  assert.equal(calls, 1)
  assert.equal(cache.status().lastFetchedAt, null)
  time = 61
  await cache.read()
  assert.equal(calls, 2)
})
