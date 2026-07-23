# workers.md - Background Workers Skill

> **Size**: Medium | **Version**: 1.0.0 | **Owner**: Backend Lead

## Purpose

Guide for implementing background job processing.

## Problem Solved

Synchronous processing blocking requests, job failures, and retry logic.

## When to Load

- Implementing background jobs
- Processing async tasks
- Building job queues

## When NOT to Load

- Real-time features (use websockets)
- Simple async (use Promise.all)

## Prerequisites

- backend/architecture.md

## Rules

1. **Idempotent jobs** - Safe to retry
2. **Dead letter queue** - Capture failed jobs
3. **Retry logic** - Exponential backoff
4. **Monitoring** - Track job status
5. **Timeout** - Prevent hanging jobs

## Best Practices

### Job Definition
```typescript
interface Job {
  id: string
  type: string
  payload: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  maxAttempts: number
  createdAt: Date
  processedAt?: Date
  completedAt?: Date
}
```

### Worker Pattern
```typescript
async function processArticle(job: Job) {
  const { articleId } = job.payload
  
  // Idempotent check
  const existing = await prisma.summary.findUnique({ where: { articleId } })
  if (existing) return { skipped: true }
  
  // Process
  const summary = await aiService.summarize(articleId)
  await prisma.summary.create({ data: { articleId, content: summary } })
  
  return { success: true }
}
```

## Project Conventions

- Bull/BullMQ for job queues (planned)
- Redis as queue backend
- Max 3 retry attempts

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Not idempotent | Duplicate processing | Check before processing |
| No retry logic | Lost jobs | Implement retries |
| No monitoring | Blind to failures | Track job status |

## Checklist

- [ ] Idempotent jobs
- [ ] Retry logic
- [ ] Dead letter queue
- [ ] Monitoring
- [ ] Timeout configured

## Related Skills

- architecture.md
- redis.md
- caching.md

---

*Last Updated: 2026-07-23*
