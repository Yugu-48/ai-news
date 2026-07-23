# authentication.md - Backend Authentication Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for implementing secure authentication.

## Problem Solved

Insecure auth implementation, session management issues, and token vulnerabilities.

## When to Load

- Implementing login/registration
- Setting up session management
- Integrating auth providers

## When NOT to Load

- Frontend auth UI (use frontend skills)
- Authorization/RBAC (use authorization.md)
- JWT implementation (use security/jwt.md)

## Prerequisites

- backend/architecture.md
- security/authentication.md

## Rules

1. **Hash passwords** - bcrypt/argon2, never store plain text
2. **Secure sessions** - HttpOnly, Secure, SameSite cookies
3. **Rate limiting** - Prevent brute force attacks
4. **Logout invalidation** - Destroy sessions on logout
5. **MFA support** - Plan for multi-factor auth

## Best Practices

### Password Hashing
```typescript
import bcrypt from 'bcrypt'

// Hash password
const hashedPassword = await bcrypt.hash(password, 12)

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword)
```

### Session Management
```typescript
// Cookie-based session
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
})
```

## Project Conventions

- Supabase for auth (planned)
- JWT for API tokens
- HttpOnly cookies for web sessions

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Plain text passwords | Catastrophic if leaked | Hash with bcrypt |
| Storing secrets in code | Exposure risk | Use environment variables |
| No rate limiting | Brute force attacks | Implement rate limiting |

## Checklist

- [ ] Passwords hashed
- [ ] Secure cookie settings
- [ ] Rate limiting implemented
- [ ] Logout invalidation
- [ ] MFA planned

## Related Skills

- security/authentication.md
- security/jwt.md
- security/cookies.md
- authorization.md

## Related MCPs

- context7 - For auth library docs

---

*Last Updated: 2026-07-23*
