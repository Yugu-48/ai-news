# redis.md - Redis Usage Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for using Redis for caching, sessions, and queues.

## Problem Solved

Poor caching implementation, session management issues, and queue reliability.

## When to Load

- Implementing Redis caching
- Setting up session store
- Building job queues

## When NOT to Load

- Simple caching (use caching.md)
- General backend (use architecture.md)

## Prerequisites

- caching.md

## Rules

1. **Connection pooling** - Reuse connections
2. **Serialization** - JSON for complex objects
3. **TTL always** - Prevent memory leaks
4. **Error handling** - Graceful degradation
5. **Key naming** - Consistent pattern

## Best Practices

### Cache Pattern
```typescript
import Redis from 'ioredis'

const redis = new Redis()

async function getCachedArticle(id: string): Promise<Article | null> {
  const cached = await redis.get(`article:${id}`)
  if (cached) return JSON.parse(cached)
  
  const article = await prisma.article.findUnique({ where: { id } })
  if (article) {
    await redis.set(`article:${id}`, JSON.stringify(article), 'EX', 3600)
  }
  return article
}
```

### Key Naming
```
article:{id}           # Article cache
user:{id}:sessions     # User sessions
feed:homepage          # Homepage feed
rate:{ip}              # Rate limiting
```

## Project Conventions

- Redis for distributed caching
- JSON serialization
- Prefix-based key naming

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No TTL | Memory leaks | Always set expiration |
| Large values | Slow transfers | Keep under 100KB |
| No error handling | App crashes | Graceful degradation |

## Checklist

- [ ] Connection pooling
- [ ] TTL on all keys
- [ ] Error handling
- [ ] Key naming convention

## Related Skills

- caching.md
- architecture.md
- workers.md

## Related MCPs

- context7 - For Redis docs

---

*Last Updated: 2026-07-23*
