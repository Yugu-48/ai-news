# architecture.md - Backend Architecture Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for designing scalable backend architecture with Node.js.

## Problem Solved

Inconsistent architecture, poor separation of concerns, and scalability issues.

## When to Load

- Designing backend structure
- Setting up API architecture
- Planning database integration

## When NOT to Load

- Frontend development (use frontend skills)
- Specific API implementation (use rest-api.md)

## Prerequisites

- general/architecture.md
- typescript.md

## Rules

1. **Layered architecture** - Controllers → Services → Repositories
2. **Separation of concerns** - Each layer has single responsibility
3. **Dependency injection** - loose coupling between layers
4. **Error boundaries** - Catch errors at layer boundaries
5. **Type safety** - TypeScript throughout

## Best Practices

### Directory Structure
```
backend/
├── src/
│   ├── api/           # Route handlers
│   ├── services/      # Business logic
│   ├── repositories/  # Data access
│   ├── middleware/     # Express/Fastify middleware
│   ├── config/        # Configuration
│   ├── types/         # TypeScript types
│   └── utils/         # Utilities
├── prisma/            # Database schema
└── tests/
```

### Layer Pattern
```typescript
// Controller (API Layer)
export async function getArticle(req: Request, res: Response) {
  const article = await articleService.findById(req.params.id)
  if (!article) return res.status(404).json({ error: 'Not found' })
  res.json(article)
}

// Service (Business Logic)
export class ArticleService {
  async findById(id: string): Promise<Article | null> {
    return this.articleRepository.findById(id)
  }
}

// Repository (Data Access)
export class ArticleRepository {
  async findById(id: string): Promise<Article | null> {
    return prisma.article.findUnique({ where: { id } })
  }
}
```

## Project Conventions

- Node.js runtime
- TypeScript strict mode
- Prisma for ORM
- Layered architecture

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Business logic in controllers | Hard to test/reuse | Use services |
| Direct DB in routes | Tight coupling | Use repositories |
| No error handling | Unhandled crashes | Add error boundaries |

## Checklist

- [ ] Layered architecture
- [ ] Separation of concerns
- [ ] Error handling at boundaries
- [ ] TypeScript throughout

## Related Skills

- rest-api.md
- database.md
- prisma.md

## Related MCPs

- context7 - For Node.js docs

---

*Last Updated: 2026-07-23*
