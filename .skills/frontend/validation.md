# validation.md - Validation Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for data validation with Zod schemas.

## Problem Solved

Inconsistent validation, type-unsafe data, and runtime errors.

## When to Load

- Defining validation schemas
- Type inference from schemas
- API response validation

## When NOT to Load

- Form handling (use forms.md)
- Component creation (use react.md)

## Prerequisites

- typescript.md

## Rules

1. **Zod for all validation** - No manual validation
2. **Co-locate schemas** - Near usage
3. **Infer types from schemas** - Single source of truth
4. **Server-side validation** - Always validate on server too

## Best Practices

### Basic Schema
```typescript
import { z } from 'zod'

// Good: Clear validation schema
export const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.string().min(100),
  publishedAt: z.date(),
  categories: z.array(z.string()).min(1),
})

export type Article = z.infer<typeof articleSchema>
```

### Complex Validation
```typescript
// Good: Conditional validation
const userSchema = z.object({
  role: z.enum(['admin', 'user']),
  adminCode: z.string().optional(),
}).refine(
  (data) => data.role !== 'admin' || data.adminCode,
  { message: 'Admin code required for admin role' }
)
```

## Project Conventions

- Schemas in `lib/validations/`
- Export both schema and type
- Use `.refine()` for complex rules

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Manual validation | Error-prone | Use Zod |
| Separate type definitions | Drift risk | Infer from schema |
| Client-only validation | Security risk | Server validation too |

## Checklist

- [ ] Zod schema defined
- [ ] Type inferred from schema
- [ ] Error messages clear
- [ ] Server validation planned

## Related Skills

- typescript.md
- forms.md
- rest-api.md

## Related MCPs

- context7 - For Zod documentation

---

*Last Updated: 2026-07-23*
