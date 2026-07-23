# prisma.md - Prisma ORM Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for using Prisma ORM effectively.

## Problem Solved

N+1 queries, inefficient data fetching, and migration issues.

## When to Load

- Writing database queries
- Creating migrations
- Optimizing Prisma queries

## When NOT to Load

- Schema design (use database.md)
- General backend (use architecture.md)

## Prerequisites

- database.md

## Rules

1. **Use includes/select** - Avoid N+1 queries
2. **Transactions** - For multi-step operations
3. **Migrations** - Version control schema
4. **Seeding** - Consistent test data
5. **Connection pooling** - Prevent connection exhaustion

## Best Practices

### Query Optimization
```typescript
// Bad: N+1 queries
const articles = await prisma.article.findMany()
for (const article of articles) {
  article.author = await prisma.user.findUnique({ where: { id: article.authorId } })
}

// Good: Single query with include
const articles = await prisma.article.findMany({
  include: { author: true }
})
```

### Transactions
```typescript
await prisma.$transaction([
  prisma.article.delete({ where: { id } }),
  prisma.comment.deleteMany({ where: { articleId: id } }),
])
```

## Project Conventions

- Prisma schema in `prisma/`
- Migrations version controlled
- Seed script for test data

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| N+1 queries | Performance hit | Use include/select |
| No transactions | Data inconsistency | Use $transaction |
| Raw SQL when avoidable | Type unsafe | Use Prisma client |

## Checklist

- [ ] No N+1 queries
- [ ] Transactions for multi-step
- [ ] Migrations versioned
- [ ] Connection pooling configured

## Related Skills

- database.md
- architecture.md
- caching.md

## Related MCPs

- context7 - For Prisma docs

---

*Last Updated: 2026-07-23*
