# rbac.md - Role-Based Access Control Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for implementing role-based access control.

## Problem Solved

Inconsistent role management, privilege escalation, and permission sprawl.

## When to Load

- Implementing role system
- Managing permissions
- Setting up admin features

## When NOT to Load

- Basic authentication (use authentication.md)
- Basic authorization (use authorization.md)

## Prerequisites

- authorization.md
- security/rbac.md

## Rules

1. **Roles as groups** - Permissions assigned to roles
2. **User has roles** - Not direct permissions
3. **Hierarchical roles** - Admin > Editor > User
4. **Permission checks** - At service layer
5. **Audit trail** - Track role changes

## Best Practices

### Role Definition
```typescript
type Role = 'admin' | 'editor' | 'user'

const permissions = {
  admin: ['read', 'write', 'delete', 'manage_users'],
  editor: ['read', 'write'],
  user: ['read'],
}
```

### Permission Check
```typescript
function hasPermission(user: User, permission: string): boolean {
  const rolePermissions = permissions[user.role]
  return rolePermissions.includes(permission)
}
```

## Project Conventions

- Three default roles: admin, editor, user
- Permissions checked at service layer
- Role changes logged

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Direct user permissions | Hard to manage | Use roles |
| No hierarchy | Complex checks | Hierarchical roles |
| Static roles only | Inflexible | Plan for dynamic |

## Checklist

- [ ] Roles defined
- [ ] Permissions mapped
- [ ] Checks at service layer
- [ ] Audit logging

## Related Skills

- authorization.md
- security/rbac.md
- authentication.md

---

*Last Updated: 2026-07-23*
