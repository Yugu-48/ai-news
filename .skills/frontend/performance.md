# performance.md - Performance Optimization Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for optimizing Next.js application performance.

## Problem Solved

Slow page loads, large bundles, and poor Core Web Vitals.

## When to Load

- Optimizing page load speed
- Reducing bundle size
- Improving Core Web Vitals
- Fixing performance issues

## When NOT to Load

- Building features (use relevant skill)
- Styling (use tailwind.md)

## Prerequisites

- nextjs.md
- react.md

## Rules

1. **Server Components** - Reduce client JavaScript
2. **Code splitting** - Lazy load non-critical code
3. **Image optimization** - Use next/image
4. **Font optimization** - Use next/font
5. **Streaming** - Progressive page rendering

## Best Practices

### Image Optimization
```tsx
// Good: Optimized images
import Image from 'next/image'

<Image
  src="/article-image.jpg"
  alt="Article description"
  width={800}
  height={400}
  priority={isAboveFold}
/>
```

### Font Optimization
```tsx
// Good: Optimized fonts
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

<body className={inter.className}>
```

### Code Splitting
```tsx
// Good: Dynamic imports
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Streaming
```tsx
// Good: Streaming with Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<ArticleSkeleton />}>
        <ArticleList />
      </Suspense>
    </>
  )
}
```

## Project Conventions

- Lighthouse score > 90
- Bundle size < 200KB
- First Contentful Paint < 1.5s

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Large images | Slow loading | Use next/image |
| Client components everywhere | Too much JS | Server Components |
| No code splitting | Large bundles | Dynamic imports |

## Checklist

- [ ] Images optimized
- [ ] Fonts optimized
- [ ] Code splitting implemented
- [ ] Server Components used
- [ ] Lighthouse > 90

## Related Skills

- nextjs.md
- react.md
- seo.md

## Related MCPs

- chrome-devtools - For performance profiling
- playwright - For performance testing

---

*Last Updated: 2026-07-23*
