# animations.md - Animations Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for adding animations with Framer Motion.

## Problem Solved

Performance issues, janky animations, and inconsistent motion.

## When to Load

- Adding page transitions
- Creating hover effects
- Building loading states
- Implementing scroll animations

## When NOT to Load

- Basic styling (use tailwind.md)
- Component logic (use react.md)

## Prerequisites

- react.md
- tailwind.md (recommended)

## Rules

1. **Performance first** - Use `transform` and `opacity`
2. **Reduce motion** - Respect `prefers-reduced-motion`
3. **Purposeful** - Animations should have meaning
4. **Subtle** - Keep animations understated

## Best Practices

### Basic Animation
```tsx
'use client'

import { motion } from 'framer-motion'

// Good: Simple fade in
export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Hover Effect
```tsx
// Good: Subtle hover
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Page Transition
```tsx
// Good: Page transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Reduced Motion
```tsx
// Good: Respect user preferences
import { useReducedMotion } from 'framer-motion'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { opacity: 1 }}
    >
      Content
    </motion.div>
  )
}
```

## Project Conventions

- Use Framer Motion only when needed
- Keep animations under 300ms
- Document animation decisions

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Animating layout | Performance hit | Use transform only |
| No reduced motion | Accessibility issue | Check preferences |
| Over-animating | Distracting | Keep subtle |

## Checklist

- [ ] Purposeful animation
- [ ] Performance optimized
- [ ] Reduced motion respected
- [ ] Subtle and tasteful

## Related Skills

- react.md
- tailwind.md
- accessibility.md

## Related MCPs

- chrome-devtools - For performance profiling

---

*Last Updated: 2026-07-23*
