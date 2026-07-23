# typescript.md - TypeScript Best Practices Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for writing type-safe TypeScript code with strict mode.

## Problem Solved

Type errors, `any` usage, and inconsistent type patterns.

## When to Load

- Writing any TypeScript code
- Defining types or interfaces
- Fixing type errors

## When NOT to Load

- Building components (use react.md)
- Styling (use tailwind.md)

## Prerequisites

- general/coding-style.md

## Rules

1. **Strict mode always** - No `any` types
2. **Interface over type** - For object shapes
3. **Explicit return types** - For functions
4. **Discriminated unions** - For complex state
5. **Path aliases** - Use `@/` prefix

## Best Practices

### Interfaces
```typescript
// Good: Interface for object shapes
interface Article {
  id: string
  title: string
  slug: string
  publishedAt: Date
}

// Good: Type for unions/unions
type ArticleStatus = 'draft' | 'published' | 'archived'
```

### Function Types
```typescript
// Good: Explicit return type
function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// Good: Generic with constraints
function first<T extends unknown[]>(arr: T): T[0] | undefined {
  return arr[0]
}
```

### Discriminated Unions
```typescript
// Good: Discriminated union for state
type ArticleState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; article: Article }
```

## Project Conventions

- Path alias: `@/*` maps to `./src/*`
- Types in `types.ts` files
- Component props as `{Component}Props`
- Export types with `export type`

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Using `any` | Loses type safety | Use proper types |
| Inline types | Hard to reuse | Extract to interfaces |
| Missing return types | Unclear API | Always specify returns |

## Checklist

- [ ] No `any` types
- [ ] Interfaces for objects
- [ ] Explicit return types
- [ ] Path aliases configured

## Related Skills

- coding-style.md
- react.md
- nextjs.md

## Related MCPs

- context7 - For TypeScript documentation

---

*Last Updated: 2026-07-23*
