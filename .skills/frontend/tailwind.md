# tailwind.md - Tailwind CSS Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for styling with Tailwind CSS utility classes.

## Problem Solved

Inconsistent styling, custom CSS proliferation, and utility class confusion.

## When to Load

- Styling components
- Creating layouts
- Responsive design
- Dark mode implementation

## When NOT to Load

- Component logic (use react.md)
- Animations (use animations.md)

## Prerequisites

- general/coding-style.md

## Rules

1. **Utility classes only** - No custom CSS unless absolutely necessary
2. **Responsive prefixes** - `sm:`, `md:`, `lg:`, `xl:`
3. **Dark mode** - Use `dark:` prefix
4. **Consistent spacing** - Use Tailwind scale
5. **Component variants** - Use `clsx` or `cn()` for conditional classes

## Best Practices

### Basic Styling
```tsx
// Good: Utility classes
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click me
</button>
```

### Responsive Design
```tsx
// Good: Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Dark Mode
```tsx
// Good: Dark mode support
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

### Conditional Classes
```tsx
// Good: Using cn() utility
import { cn } from '@/lib/utils'

<button className={cn(
  "px-4 py-2 rounded",
  isActive ? "bg-blue-500" : "bg-gray-200"
)}>
  Button
</button>
```

## Project Conventions

- Use `cn()` utility from `@/lib/utils`
- Consistent color palette
- Custom theme in `tailwind.config.ts`

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Custom CSS | Bypasses Tailwind | Use utility classes |
| Inline styles | Hard to maintain | Use Tailwind |
| Not responsive | Poor mobile experience | Use responsive prefixes |

## Checklist

- [ ] Utility classes only
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Using `cn()` for conditionals

## Related Skills

- react.md
- shadcn.md
- animations.md
- accessibility.md

## Related MCPs

- context7 - For Tailwind documentation

---

*Last Updated: 2026-07-23*
