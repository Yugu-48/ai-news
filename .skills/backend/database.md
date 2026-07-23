# database.md - Database Design Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for database schema design and modeling.

## Problem Solved

Poor schema design, missing indexes, and data integrity issues.

## When to Load

- Designing database schema
- Creating migrations
- Optimizing queries

## When NOT to Load

- ORM specifics (use prisma.md)
- Caching (use caching.md)

## Prerequisites

- backend/architecture.md

## Rules

1. **Normalize appropriately** - 3NF unless performance requires denormalization
2. **Primary keys** - UUID for distributed systems
3. **Foreign keys** - Enforce referential integrity
4. **Indexes** - On frequently queried columns
5. **Timestamps** - createdAt, updatedAt on all tables

## Best Practices

### Schema Design
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published ON articles(published_at);
```

## Project Conventions

- PostgreSQL database
- Prisma ORM
- UUID primary keys
- Timestamps on all tables

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No indexes | Slow queries | Add indexes |
| No foreign keys | Data integrity issues | Enforce relationships |
| VARCHAR without limits | Storage waste | Set appropriate limits |

## Checklist

- [ ] Primary keys defined
- [ ] Foreign keys enforced
- [ ] Indexes added
- [ ] Timestamps included

## Related Skills

- prisma.md
- architecture.md
- caching.md

## Related MCPs

- context7 - For PostgreSQL docs

---

*Last Updated: 2026-07-23*
