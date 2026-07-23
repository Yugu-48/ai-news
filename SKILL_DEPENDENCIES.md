# SKILL_DEPENDENCIES.md

> **Type**: Reference | **Update**: When dependencies change | **Owner**: Architecture Lead

## Purpose

Map skill relationships, prerequisites, and dependencies. Prevent circular dependencies.

## Skill Dependency Graph

```
GENERAL SKILLS (Foundation)
├── coding-style.md
├── naming.md
├── architecture.md
└── documentation.md

FRONTEND SKILLS
├── nextjs.md
│   ├── Depends on: general/architecture.md
│   └── Enables: performance.md, seo.md
├── react.md
│   ├── Depends on: general/coding-style.md
│   └── Enables: forms.md, animations.md
├── typescript.md
│   └── Depends on: general/coding-style.md
├── tailwind.md
│   └── Depends on: general/coding-style.md
├── shadcn.md
│   ├── Depends on: tailwind.md, react.md
│   └── Enables: forms.md
├── forms.md
│   ├── Depends on: react.md, validation.md
│   └── Enables: shadcn.md
├── validation.md
│   └── Depends on: typescript.md
├── accessibility.md
│   ├── Depends on: react.md
│   └── Enables: seo.md
├── animations.md
│   └── Depends on: react.md
├── performance.md
│   ├── Depends on: nextjs.md, react.md
│   └── Enables: seo.md
└── seo.md
    ├── Depends on: nextjs.md, accessibility.md
    └── Enables: performance.md

BACKEND SKILLS
├── architecture.md
│   ├── Depends on: general/architecture.md
│   └── Enables: rest-api.md, database.md
├── rest-api.md
│   ├── Depends on: backend/architecture.md, validation.md
│   └── Enables: authentication.md
├── validation.md
│   └── Depends on: typescript.md
├── authentication.md
│   ├── Depends on: rest-api.md
│   └── Enables: authorization.md
├── authorization.md
│   ├── Depends on: authentication.md
│   └── Enables: rbac.md
├── rbac.md
│   └── Depends on: authorization.md
├── database.md
│   ├── Depends on: backend/architecture.md
│   └── Enables: prisma.md
├── prisma.md
│   └── Depends on: database.md
├── caching.md
│   └── Depends on: backend/architecture.md
├── redis.md
│   └── Depends on: caching.md
└── workers.md
    └── Depends on: backend/architecture.md

AI SKILLS
├── summarization.md
│   └── Depends on: ai/prompt-engineering.md
├── embeddings.md
│   └── Depends on: ai/semantic-search.md
├── recommendation.md
│   ├── Depends on: ai/ranking.md
│   └── Enables: ai/semantic-search.md
├── ranking.md
│   └── Depends on: ai/embeddings.md
├── semantic-search.md
│   └── Depends on: ai/embeddings.md
└── prompt-engineering.md
    └── Depends on: general/coding-style.md

SECURITY SKILLS
├── authentication.md
│   └── Depends on: security/jwt.md
├── authorization.md
│   └── Depends on: security/authentication.md
├── rbac.md
│   └── Depends on: security/authorization.md
├── owasp.md
│   └── Depends on: general/architecture.md
├── secret-management.md
│   └── Depends on: general/coding-style.md
├── jwt.md
│   └── Depends on: general/coding-style.md
├── cookies.md
│   └── Depends on: security/jwt.md
├── security-headers.md
│   └── Depends on: general/coding-style.md
└── threat-modeling.md
    └── Depends on: security/owasp.md

DEPLOYMENT SKILLS
├── docker.md
│   └── Depends on: general/architecture.md
├── vercel.md
│   └── Depends on: general/coding-style.md
├── cicd.md
│   ├── Depends on: deployment/docker.md
│   └── Enables: deployment/github-actions.md
├── environment-variables.md
│   └── Depends on: general/coding-style.md
└── github-actions.md
    └── Depends on: deployment/cicd.md

QUALITY SKILLS
├── testing.md
│   └── Depends on: general/coding-style.md
├── debugging.md
│   └── Depends on: general/coding-style.md
├── code-review.md
│   └── Depends on: general/coding-style.md
├── logging.md
│   └── Depends on: general/coding-style.md
└── monitoring.md
    └── Depends on: deployment/cicd.md

GIT SKILLS
├── commit-strategy.md
│   └── Depends on: general/coding-style.md
├── branching.md
│   └── Depends on: git/commit-strategy.md
└── pull-requests.md
    └── Depends on: git/branching.md
```

## Prerequisite Chains

### Authentication Chain
```
general/coding-style.md
    ↓
security/jwt.md
    ↓
security/authentication.md
    ↓
security/authorization.md
    ↓
security/rbac.md
```

### Database Chain
```
general/coding-style.md
    ↓
backend/architecture.md
    ↓
backend/database.md
    ↓
backend/prisma.md
```

### Search Chain
```
general/coding-style.md
    ↓
ai/prompt-engineering.md
    ↓
ai/embeddings.md
    ↓
ai/semantic-search.md
    ↓
ai/recommendation.md
```

## Circular Dependency Check

| Skill A | Skill B | Status |
|---------|---------|--------|
| None | None | ✅ No circular dependencies |

## Rules

1. **Never create circular dependencies**
2. **Always check prerequisites before loading**
3. **If a dependency is missing, load it first**
4. **Document new dependencies in this file**

---

*Last Updated: 2026-07-23*
*Version: 1.0.0*
*Related: [SKILLS_INDEX.md](SKILLS_INDEX.md) | [TASK_SKILL_MAPPING.md](TASK_SKILL_MAPPING.md)*
