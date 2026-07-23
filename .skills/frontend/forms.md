# forms.md - Form Handling Skill

> **Size**: Small | **Version**: 1.0.0 | **Owner**: Frontend Lead

## Purpose

Guide for building forms with React Hook Form and Zod validation.

## Problem Solved

Form state management, validation, and submission patterns.

## When to Load

- Building any form
- Form validation
- Form submission handling

## When NOT to Load

- Component creation (use react.md)
- UI components (use shadcn.md)

## Prerequisites

- react.md
- validation.md

## Rules

1. **React Hook Form** - For form state management
2. **Zod schemas** - For validation
3. **Controlled components** - For complex inputs
4. **Server actions** - For form submission (Next.js)

## Best Practices

### Basic Form
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

export function ArticleForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Project Conventions

- Schemas in `lib/validations/`
- Forms in feature folders
- Error messages below inputs

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| No validation | Bad UX, data issues | Use Zod schemas |
| Uncontrolled inputs | Hard to validate | Use React Hook Form |
| Inline validation logic | Hard to maintain | Extract to schemas |

## Checklist

- [ ] React Hook Form used
- [ ] Zod schema defined
- [ ] Validation messages shown
- [ ] Loading states handled

## Related Skills

- validation.md
- react.md
- shadcn.md
- accessibility.md

## Related MCPs

- context7 - For React Hook Form docs

---

*Last Updated: 2026-07-23*
