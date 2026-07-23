# SKILLS_INDEX.md

> **Type**: Entry Point | **Update**: When skills added/removed | **Owner**: Architecture Lead

## Purpose

This is the entry point for the AI Skill System. Every AI should read this before loading any skill.

## Skill Categories

### Frontend Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [nextjs.md](.skills/frontend/nextjs.md) | Next.js App Router patterns | Medium | Building pages, routes, layouts |
| [react.md](.skills/frontend/react.md) | React patterns and hooks | Medium | Building components |
| [typescript.md](.skills/frontend/typescript.md) | TypeScript best practices | Small | Writing any TypeScript |
| [tailwind.md](.skills/frontend/tailwind.md) | Tailwind CSS patterns | Small | Styling components |
| [shadcn.md](.skills/frontend/shadcn.md) | Shadcn/UI components | Medium | Using UI components |
| [forms.md](.skills/frontend/forms.md) | Form handling patterns | Small | Building forms |
| [validation.md](.skills/frontend/validation.md) | Zod validation schemas | Small | Validating data |
| [accessibility.md](.skills/frontend/accessibility.md) | WCAG compliance | Medium | Ensuring accessibility |
| [animations.md](.skills/frontend/animations.md) | Framer Motion patterns | Small | Adding animations |
| [performance.md](.skills/frontend/performance.md) | Performance optimization | Medium | Optimizing rendering |
| [seo.md](.skills/frontend/seo.md) | SEO metadata and structure | Small | SEO implementation |

### Backend Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [architecture.md](.skills/backend/architecture.md) | Backend architecture patterns | Medium | Designing backend |
| [rest-api.md](.skills/backend/rest-api.md) | REST API design | Medium | Building APIs |
| [validation.md](.skills/backend/validation.md) | Input validation | Small | Validating requests |
| [authentication.md](.skills/backend/authentication.md) | Auth implementation | Medium | Building auth |
| [authorization.md](.skills/backend/authorization.md) | Authorization patterns | Medium | Access control |
| [rbac.md](.skills/backend/rbac.md) | Role-based access control | Medium | Role management |
| [database.md](.skills/backend/database.md) | Database design | Medium | Schema design |
| [prisma.md](.skills/backend/prisma.md) | Prisma ORM patterns | Medium | Database operations |
| [caching.md](.skills/backend/caching.md) | Caching strategies | Small | Performance optimization |
| [redis.md](.skills/backend/redis.md) | Redis usage patterns | Medium | Caching implementation |
| [workers.md](.skills/backend/workers.md) | Background job patterns | Medium | Async processing |

### AI Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [summarization.md](.skills/ai/summarization.md) | AI summarization patterns | Medium | Summarizing content |
| [embeddings.md](.skills/ai/embeddings.md) | Vector embeddings | Medium | Semantic search |
| [recommendation.md](.skills/ai/recommendation.md) | Recommendation systems | Medium | Building recommendations |
| [ranking.md](.skills/ai/ranking.md) | Content ranking algorithms | Medium | Ranking content |
| [semantic-search.md](.skills/ai/semantic-search.md) | Semantic search implementation | Medium | Search features |
| [prompt-engineering.md](.skills/ai/prompt-engineering.md) | Prompt design patterns | Medium | AI integrations |

### Security Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [authentication.md](.skills/security/authentication.md) | Auth security patterns | Medium | Security implementation |
| [authorization.md](.skills/security/authorization.md) | Authorization security | Medium | Access control security |
| [rbac.md](.skills/security/rbac.md) | RBAC security patterns | Medium | Role security |
| [owasp.md](.skills/security/owasp.md) | OWASP top 10 mitigation | Medium | Security auditing |
| [secret-management.md](.skills/security/secret-management.md) | Secret handling | Small | Managing secrets |
| [jwt.md](.skills/security/jwt.md) | JWT best practices | Small | Token implementation |
| [cookies.md](.skills/security/cookies.md) | Cookie security | Small | Cookie handling |
| [security-headers.md](.skills/security/security-headers.md) | HTTP security headers | Small | Header configuration |
| [threat-modeling.md](.skills/security/threat-modeling.md) | Threat assessment | Medium | Security planning |

### Deployment Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [docker.md](.skills/deployment/docker.md) | Docker patterns | Medium | Containerization |
| [vercel.md](.skills/deployment/vercel.md) | Vercel deployment | Small | Frontend deployment |
| [cicd.md](.skills/deployment/cicd.md) | CI/CD pipelines | Medium | Pipeline setup |
| [environment-variables.md](.skills/deployment/environment-variables.md) | Env var management | Small | Configuration |
| [github-actions.md](.skills/deployment/github-actions.md) | GitHub Actions patterns | Medium | Workflow automation |

### Quality Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [testing.md](.skills/quality/testing.md) | Testing patterns | Medium | Writing tests |
| [debugging.md](.skills/quality/debugging.md) | Debugging techniques | Small | Fixing bugs |
| [code-review.md](.skills/quality/code-review.md) | Code review checklist | Small | Reviewing code |
| [logging.md](.skills/quality/logging.md) | Logging patterns | Small | Adding logging |
| [monitoring.md](.skills/quality/monitoring.md) | Monitoring setup | Medium | Observability |

### Git Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [commit-strategy.md](.skills/git/commit-strategy.md) | Commit message conventions | Small | Making commits |
| [branching.md](.skills/git/branching.md) | Branch strategies | Small | Branch management |
| [pull-requests.md](.skills/git/pull-requests.md) | PR best practices | Small | Creating PRs |
| [branching.md](.skills/git/branching.md) | Branch naming and multi-agent workflow | Small | Starting any new task |

### General Skills
| Skill | Purpose | Size | When to Load |
|-------|---------|------|--------------|
| [coding-style.md](.skills/general/coding-style.md) | Coding conventions | Small | Writing any code |
| [naming.md](.skills/general/naming.md) | Naming conventions | Small | Naming anything |
| [architecture.md](.skills/general/architecture.md) | Architecture patterns | Medium | System design |
| [documentation.md](.skills/general/documentation.md) | Documentation patterns | Small | Writing docs |
| [verification.md](.skills/general/verification.md) | Verify work runs before marking complete | Small | Before PROGRESS.md entries |

## Quick Reference

### By Task

| Task | Load These Skills |
|------|-------------------|
| Build a page | nextjs, react, tailwind |
| Build a component | react, tailwind, shadcn |
| Build a form | forms, validation, react |
| Add animations | animations, react |
| Optimize performance | performance, nextjs |
| Add SEO | seo, nextjs |
| Build an API | rest-api, validation |
| Add authentication | authentication, jwt, cookies |
| Add authorization | authorization, rbac |
| Use database | database, prisma |
| Add caching | caching, redis |
| Deploy frontend | vercel, environment-variables |
| Deploy backend | docker, cicd |
| Write tests | testing |
| Fix bugs | debugging |
| Review code | code-review |
| Start new task | branching, verification |
| Make commits | commit-strategy, branching |

### By Size

| Size | Skills |
|------|--------|
| **Small** (<50 lines) | typescript, tailwind, forms, validation, animations, caching, vercel, environment-variables, debugging, code-review, logging, commit-strategy, branching, pull-requests, naming, documentation |
| **Medium** (50-100 lines) | nextjs, react, shadcn, accessibility, performance, seo, architecture, rest-api, authentication, authorization, rbac, database, prisma, redis, workers, summarization, embeddings, recommendation, ranking, semantic-search, prompt-engineering, owasp, secret-management, jwt, cookies, security-headers, threat-modeling, docker, cicd, github-actions, testing, monitoring, architecture |

---

*Last Updated: 2026-07-23*
*Version: 1.0.0*
*Related: [SKILL_LOADING_POLICY.md](SKILL_LOADING_POLICY.md) | [TASK_SKILL_MAPPING.md](TASK_SKILL_MAPPING.md)*
