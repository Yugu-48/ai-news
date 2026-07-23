# validation.md - Backend Validation Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for server-side input validation with Zod.

## Problem Solved

Missing validation, inconsistent error messages, and security vulnerabilities.

## When to Load

- Validating API inputs
- Creating validation schemas
- Handling validation errors

## When NOT to Load

- Frontend validation (use frontend/validation.md)
- Database validation (use prisma.md)

## Prerequisites

- typescript.md

## Rules

1. **Validate all inputs** - Never trust client data
2. **Zod schemas** - Consistent validation
3. **Sanitize inputs** - Clean data before processing
4. **Return meaningful errors** - Help developers fix issues
5. **Validate on server** - Client validation is UX, server is security

## Best Practices

### Request Validation
```typescript
import { z } from 'zod'

const createArticleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(100),
  categories: z.array(z.string()).min(1),
})

export async function createArticle(req: Request, res: Response) {
  const result = createArticleSchema.safeParse(req.body)
  
  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        details: result.error.errors
      }
    })
  }
  
  // Use result.data (validated and typed)
}
```

## Project Conventions

- Schemas in `lib/validations/`
- Return 400 for validation errors
- Include field-level errors

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No server validation | Security risk | Always validate |
| Generic error messages | Poor DX | Include field errors |
| Trusting client data | Vulnerable | Validate everything |

## Checklist

- [ ] All inputs validated
- [ ] Meaningful error messages
- [ ] Server-side validation
- [ ] Sanitization applied

## Related Skills

- typescript.md
- rest-api.md
- prisma.md

---

*Last Updated: 2026-07-23*
