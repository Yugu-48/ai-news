# shadcn.md - Shadcn/UI Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for using Shadcn/UI components effectively.

## Problem Solved

Component selection, customization, and integration confusion.

## When to Load

- Using UI components (buttons, cards, dialogs)
- Building forms with UI components
- Creating consistent UI patterns

## When NOT to Load

- Custom component creation (use react.md)
- Styling (use tailwind.md)
- Form logic (use forms.md)

## Prerequisites

- tailwind.md
- react.md

## Rules

1. **Copy-paste components** - Don't install via npm
2. **Customize via props** - Use component variants
3. **Follow patterns** - Use established component patterns
4. **Extend, don't modify** - Create wrappers if needed

## Best Practices

### Adding Components
```bash
# Add specific components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

### Using Components
```tsx
// Good: Using Shadcn components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ArticleCard({ article }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{article.excerpt}</p>
        <Button>Read More</Button>
      </CardContent>
    </Card>
  )
}
```

### Custom Variants
```tsx
// Good: Extending with variants
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
    },
  }
)
```

## Project Conventions

- Components in `@/components/ui/`
- Keep original component structure
- Wrap if customization needed

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Installing via npm | Can't customize | Copy-paste |
| Modifying original | Hard to update | Create wrapper |
| Over-customizing | Breaks patterns | Use props |

## Checklist

- [ ] Component added via CLI
- [ ] Using component props
- [ ] Not modifying original files
- [ ] Consistent with design system

## Related Skills

- tailwind.md
- react.md
- forms.md
- accessibility.md

## Related MCPs

- context7 - For Shadcn documentation

---

*Last Updated: 2026-07-23*
