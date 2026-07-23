# caching.md - Caching Strategies Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for implementing caching strategies.

## Problem Solved

Repeated expensive operations, poor performance, and cache invalidation issues.

## When to Load

- Implementing caching
- Optimizing query performance
- Reducing API response times

## When NOT to Load

- Redis implementation (use redis.md)
- Database optimization (use database.md)

## Prerequisites

- backend/architecture.md

## Rules

1. **Cache expensive operations** - Database queries, API calls
2. **Set TTL** - Prevent stale data
3. **Cache invalidation** - Update cache on data changes
4. **Graceful degradation** - Work without cache
5. **Monitor hit rates** - Optimize cache strategy

## Best Practices

### In-Memory Cache
```typescript
const cache = new Map<string, { data: any; expires: number }>()

function getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number): Promise<T> {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  
  return fetcher().then(data => {
    cache.set(key, { data, expires: Date.now() + ttl })
    return data
  })
}
```

## Project Conventions

- Redis for distributed caching (planned)
- In-memory for single instance
- Cache keys: `resource:id:field`

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No TTL | Stale data forever | Set expiration |
| Caching everything | Memory waste | Cache expensive ops |
| No invalidation | Inconsistent data | Invalidate on update |

## Checklist

- [ ] TTL set
- [ ] Invalidation strategy
- [ ] Graceful degradation
- [ ] Hit rate monitoring

## Related Skills

- redis.md
- database.md
- performance.md

---

*Last Updated: 2026-07-23*
