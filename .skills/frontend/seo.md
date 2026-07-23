# seo.md - SEO Optimization Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for implementing SEO best practices in Next.js.

## Problem Solved

Missing meta tags, poor structured data, and unoptimized URLs.

## When to Load

- Implementing page metadata
- Adding structured data
- Optimizing URLs
- Creating sitemaps

## When NOT to Load

- Component creation (use react.md)
- Styling (use tailwind.md)

## Prerequisites

- nextjs.md
- accessibility.md (recommended)

## Rules

1. **Metadata API** - Use Next.js generateMetadata
2. **Structured data** - JSON-LD for articles
3. **Clean URLs** - SEO-friendly slugs
4. **Open Graph** - Social media previews
5. **Canonical URLs** - Prevent duplicate content

## Best Practices

### Page Metadata
```typescript
// app/articles/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: [article.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      images: [article.ogImage],
    },
    alternates: {
      canonical: `https://yoursite.com/articles/${article.slug}`,
    },
  }
}
```

### Structured Data
```tsx
// Good: JSON-LD structured data
export default function ArticlePage({ article }) {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          datePublished: article.publishedAt,
          author: { '@type': 'Person', name: article.author },
          image: article.ogImage,
        })}
      </script>
      <article>
        <h1>{article.title}</h1>
        {content}
      </article>
    </>
  )
}
```

## Project Conventions

- Every page has metadata
- Articles have JSON-LD
- Sitemap generated dynamically

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Missing title | Poor SEO | Always add title |
| No Open Graph | Bad social sharing | Add OG metadata |
| Duplicate content | SEO penalty | Use canonical URLs |

## Checklist

- [ ] Title tag set
- [ ] Meta description set
- [ ] Open Graph tags
- [ ] Structured data
- [ ] Canonical URL
- [ ] Clean URL structure

## Related Skills

- nextjs.md
- accessibility.md
- performance.md

## Related MCPs

- context7 - For Next.js metadata docs

---

*Last Updated: 2026-07-23*
