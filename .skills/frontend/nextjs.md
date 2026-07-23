# nextjs.md - Next.js App Router Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for building Next.js applications with App Router, Server Components, and modern patterns.

## Problem Solved

Confusion about App Router vs Pages Router, Server vs Client Components, and data fetching patterns.

## When to Load

- Building pages or routes
- Setting up layouts
- Implementing data fetching
- Configuring metadata
- Working with Server Components

## When NOT to Load

- Building standalone React components (use react.md)
- Styling with Tailwind (use tailwind.md)
- Backend API development

## Prerequisites

- general/coding-style.md
- typescript.md (recommended)

## Rules

1. **Server Components by default** - Add `'use client'` only when needed
2. **No `useEffect` for data fetching** - Use Server Components
3. **Parallel data fetching** - Use `Promise.all()` when possible
4. **Streaming with Suspense** - Break pages into chunks
5. **Metadata API** - Use `generateMetadata()` for dynamic SEO

## Best Practices

### Server Component (Default)
```typescript
// Good: Server Component with direct data fetching
export default async function Page() {
  const posts = await db.select().from(postsTable)
  return <PostList posts={posts} />
}
```

### Client Component (When Needed)
```typescript
'use client'

// Good: Client component for interactivity
export function SearchBar() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}
```

### Parallel Data Fetching
```typescript
// Good: Parallel fetching
const [artist, albums] = await Promise.all([
  getArtist(username),
  getAlbums(username)
])
```

### Streaming
```typescript
// Good: Streaming with Suspense
<Suspense fallback={<Skeleton />}>
  <BlogPosts />
</Suspense>
```

## Project Conventions

- App Router only (no Pages Router)
- Feature-based folder structure in `src/features/`
- Route groups for layout organization: `(marketing)`, `(dashboard)`
- Private folders with `_` prefix for non-routable code

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| `'use client'` in layout | Opts entire app into client | Keep in leaf components |
| `useEffect` for data fetching | Poor SEO, no streaming | Use Server Components |
| Sequential data fetching | Slower TTFB | Use `Promise.all()` |
| Route Handler from Server Component | Unnecessary round-trip | Direct database calls |

## Checklist

- [ ] Using App Router (not Pages Router)
- [ ] Server Components by default
- [ ] `'use client'` only when hooks/state needed
- [ ] Parallel data fetching where possible
- [ ] Metadata configured for SEO
- [ ] Streaming with Suspense for slow data

## Related Skills

- react.md
- typescript.md
- performance.md
- seo.md

## Related Documentation

- Next.js Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

## Related MCPs

- context7 - For Next.js documentation lookup

## Future Improvements

- Add Partial Prerendering (PPR) patterns
- Add Route Handler patterns
- Add middleware patterns

---

*Last Updated: 2026-07-23*
