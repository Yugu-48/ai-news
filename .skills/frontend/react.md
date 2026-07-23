# react.md - React Patterns Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for building React components with modern patterns, hooks, and composition.

## Problem Solved

Inconsistent component patterns, poor hook usage, and anti-patterns.

## When to Load

- Building React components
- Using hooks
- Managing state
- Implementing component patterns

## When NOT to Load

- Next.js routing (use nextjs.md)
- Styling with Tailwind (use tailwind.md)
- Form handling (use forms.md)

## Prerequisites

- general/coding-style.md
- typescript.md (recommended)

## Rules

1. **Function components only** - No class components
2. **Custom hooks for logic extraction** - Extract reusable logic
3. **Composition over configuration** - Prefer children/props
4. **Keep components small** - Under 200 lines
5. **One responsibility** - Each component does one thing

## Best Practices

### Component Structure
```typescript
// Good: Simple, focused component
interface ArticleCardProps {
  title: string
  excerpt: string
  publishedAt: Date
}

export function ArticleCard({ title, excerpt, publishedAt }: ArticleCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <time>{publishedAt.toLocaleDateString()}</time>
    </article>
  )
}
```

### Custom Hooks
```typescript
// Good: Extract reusable logic
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}
```

### Composition
```typescript
// Good: Composition pattern
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## Project Conventions

- PascalCase for component files: `ArticleCard.tsx`
- Props interface named `{Component}Props`
- Export components as named exports
- Co-locate related files in feature folders

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Large components (>300 lines) | Hard to maintain | Split into smaller components |
| Inline styles | Inconsistent, hard to maintain | Use Tailwind classes |
| Prop drilling | Tight coupling | Use context or composition |
| Mutating props | Unexpected side effects | Always create copies |

## Checklist

- [ ] Function component (not class)
- [ ] TypeScript interface for props
- [ ] Small, focused component
- [ ] One responsibility
- [ ] No inline styles
- [ ] Proper key props in lists

## Related Skills

- nextjs.md
- typescript.md
- tailwind.md
- forms.md
- animations.md

## Related Documentation

- React Docs: https://react.dev

## Related MCPs

- context7 - For React documentation lookup
- chrome-devtools - For debugging

## Future Improvements

- Add Suspense patterns
- Add concurrent features
- Add React Server Components patterns

---

*Last Updated: 2026-07-23*
