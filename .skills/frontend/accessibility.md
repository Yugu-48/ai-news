# accessibility.md - Accessibility Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for building accessible UIs following WCAG 2.1 AA standards.

## Problem Solved

Inaccessible components, missing ARIA attributes, and poor keyboard navigation.

## When to Load

- Building any UI component
- Reviewing existing components
- Fixing accessibility issues

## When NOT to Load

- Styling (use tailwind.md)
- Animations (use animations.md)

## Prerequisites

- react.md

## Rules

1. **Semantic HTML** - Use proper elements (button, nav, main)
2. **Keyboard navigation** - All interactive elements focusable
3. **ARIA labels** - For non-text elements
4. **Color contrast** - 4.5:1 minimum
5. **Focus visible** - Clear focus indicators

## Best Practices

### Semantic HTML
```tsx
// Good: Semantic elements
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/articles">Articles</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content</p>
  </article>
</main>

<footer>
  <p>© 2026 AI News</p>
</footer>
```

### Keyboard Navigation
```tsx
// Good: Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  Click me
</button>
```

### ARIA Labels
```tsx
// Good: ARIA for icons
<button aria-label="Close dialog">
  <CloseIcon />
</button>

// Good: ARIA for loading
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? 'Loading...' : content}
</div>
```

## Project Conventions

- Test with keyboard only
- Use Lighthouse for auditing
- Document accessibility decisions

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Div as button | Not keyboard accessible | Use `<button>` |
| Missing alt text | Screen readers can't describe | Add meaningful alt |
| No focus styles | Keyboard users lost | Add focus-visible |
| Low contrast | Hard to read | Use sufficient contrast |

## Checklist

- [ ] Semantic HTML used
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Screen reader tested

## Related Skills

- react.md
- tailwind.md
- seo.md

## Related MCPs

- playwright - For accessibility testing

---

*Last Updated: 2026-07-23*
