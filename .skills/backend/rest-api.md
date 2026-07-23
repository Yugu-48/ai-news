# rest-api.md - REST API Design Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for designing and implementing RESTful APIs.

## Problem Solved

Inconsistent API design, poor error handling, and documentation gaps.

## When to Load

- Building REST APIs
- Designing endpoints
- Implementing CRUD operations

## When NOT to Load

- Frontend (use frontend skills)
- Authentication (use authentication.md)
- Database (use database.md)

## Prerequisites

- backend/architecture.md
- validation.md

## Rules

1. **RESTful conventions** - Proper HTTP methods and status codes
2. **Consistent naming** - Plural nouns, kebab-case
3. **Input validation** - Validate all inputs
4. **Error responses** - Consistent error format
5. **Pagination** - For list endpoints

## Best Practices

### Endpoint Design
```
GET    /api/articles           # List articles
GET    /api/articles/:id       # Get article
POST   /api/articles           # Create article
PUT    /api/articles/:id       # Update article
DELETE /api/articles/:id       # Delete article
```

### Response Format
```typescript
// Success
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{ "field": "title", "message": "Required" }]
  }
}
```

### Status Codes
```
200 - OK
201 - Created
204 - No Content
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
422 - Unprocessable Entity
500 - Internal Server Error
```

## Project Conventions

- `/api/` prefix for all endpoints
- JSON responses
- Bearer token authentication (when implemented)

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Using POST for reads | Breaks REST | Use GET |
| 200 for errors | Confusing | Use proper status codes |
| No validation | Security risk | Validate inputs |

## Checklist

- [ ] RESTful conventions followed
- [ ] Proper status codes
- [ ] Input validation
- [ ] Error responses consistent
- [ ] Pagination implemented

## Related Skills

- architecture.md
- validation.md
- authentication.md
- database.md

## Related MCPs

- context7 - For Express/Fastify docs

---

*Last Updated: 2026-07-23*
