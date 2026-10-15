import test from "node:test"
import assert from "node:assert/strict"
import { parseSelectionIds, toggleSelection, parseStoredArticles, mergeLibraryArticles, selectLibraryArticles } from "../src/lib/article-selection.ts"

const article = (id, title = `AI story ${id}`) => ({ id, slug: id, title, source: "Actual feed", summary: "Source excerpt", category: "Research", url: `https://example.org/${id}`, publishedAt: "2026-10-12T10:00:00Z", tags: [] })

test("legacy selection arrays count unique valid IDs and tolerate corrupt storage", () => {
  assert.deepEqual(parseSelectionIds('["a","a",null,42,"","b"]'), ["a", "b"])
  for (const raw of [null, "broken", '{}', '"a"']) assert.deepEqual(parseSelectionIds(raw), [])
})
test("rapid selection changes preserve distinct stories and remove all duplicate IDs", () => {
  let ids = []
  ids = toggleSelection(ids, "a")
  ids = toggleSelection(ids, "b")
  assert.deepEqual(ids, ["a", "b"])
  assert.deepEqual(toggleSelection(["a", "a", "b"], "a"), ["b"])
})
test("stored genuine metadata keeps a selected story after feed rotation", () => {
  const archive = parseStoredArticles(JSON.stringify([article("old")]))
  const library = mergeLibraryArticles([article("new")], archive)
  assert.deepEqual(selectLibraryArticles(library, ["old"]).map(row => row.id), ["old"])
})
test("current metadata wins without duplicate cards or inflated counts", () => {
  const library = mergeLibraryArticles([article("a", "Updated headline")], [article("a", "Old headline")])
  const result = selectLibraryArticles(library, ["a", "a", "missing"])
  assert.equal(result.length, 1)
  assert.equal(result[0].title, "Updated headline")
})
test("unselecting while a collection is open removes that card from derived results", () => {
  const library = [article("a"), article("b")]
  const ids = toggleSelection(["a", "b"], "a")
  assert.deepEqual(selectLibraryArticles(library, ids).map(row => row.id), ["b"])
})
test("invalid stored article shapes never become cards", () => {
  const invalid = [null, {}, { ...article("a"), category: "unknown" }, { ...article("b"), url: "javascript:alert(1)" }, { ...article("c"), publishedAt: "invalid" }, { ...article("d"), tags: [1] }]
  assert.deepEqual(parseStoredArticles(JSON.stringify(invalid)), [])
})
