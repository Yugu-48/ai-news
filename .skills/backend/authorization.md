# authorization.md - Backend Authorization Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for implementing authorization and access control.

## Problem Solved

Missing authorization, privilege escalation, and inconsistent access control.

## When to Load

- Implementing access control
- Restricting API endpoints
- Setting up permissions

## When NOT to Load

- Authentication (use authentication.md)
- RBAC specifically (use rbac.md)
- Frontend (use frontend skills)

## Prerequisites

- authentication.md
- security/authorization.md

## Rules

1. **Deny by default** - Require explicit permissions
2. **Check at service layer** - Not just routes
3. **Resource-level access** - Check ownership
4. **Audit logging** - Track access attempts
5. **Least privilege** - Minimum required permissions

## Best Practices

### Middleware Pattern
```typescript
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

### Resource Ownership
```typescript
async function updateArticle(req: Request, res: Response) {
  const article = await articleService.findById(req.params.id)
  
  if (article.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Not your article' })
  }
  
  // Update article
}
```

## Project Conventions

- Middleware for route protection
- Service-level checks for business logic
- Ownership checks for resources

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No authorization | Anyone can access | Always check |
| Client-side only | Easily bypassed | Server-side checks |
| Checking in routes only | Business logic exposed | Check in services |

## Checklist

- [ ] Deny by default
- [ ] Server-side checks
- [ ] Resource ownership verified
- [ ] Audit logging planned

## Related Skills

- authentication.md
- rbac.md
- security/authorization.md

---

*Last Updated: 2026-07-23*
