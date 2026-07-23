# TASK_SKILL_MAPPING.md

> **Type**: Reference | **Update**: When tasks added | **Owner**: Architecture Lead

## Purpose

Map common tasks to required skills. This is one of the most important files in the skill system.

## Frontend Tasks

### Build a Page
| Load | Do NOT Load |
|------|-------------|
| frontend/nextjs.md | backend/* |
| frontend/react.md | security/* |
| frontend/tailwind.md | deployment/* |

### Build a Component
| Load | Do NOT Load |
|------|-------------|
| frontend/react.md | backend/* |
| frontend/tailwind.md | security/* |
| frontend/shadcn.md | deployment/* |

### Build a Form
| Load | Do NOT Load |
|------|-------------|
| frontend/forms.md | backend/* |
| frontend/validation.md | security/* |
| frontend/react.md | deployment/* |

### Add Animations
| Load | Do NOT Load |
|------|-------------|
| frontend/animations.md | backend/* |
| frontend/react.md | security/* |
| | deployment/* |

### Optimize Performance
| Load | Do NOT Load |
|------|-------------|
| frontend/performance.md | backend/* |
| frontend/nextjs.md | security/* |
| | deployment/* |

### Add SEO
| Load | Do NOT Load |
|------|-------------|
| frontend/seo.md | backend/* |
| frontend/nextjs.md | security/* |
| | deployment/* |

### Ensure Accessibility
| Load | Do NOT Load |
|------|-------------|
| frontend/accessibility.md | backend/* |
| frontend/react.md | security/* |
| | deployment/* |

## Backend Tasks

### Build REST API
| Load | Do NOT Load |
|------|-------------|
| backend/rest-api.md | frontend/* |
| backend/validation.md | security/* |
| backend/architecture.md | deployment/* |

### Add Authentication
| Load | Do NOT Load |
|------|-------------|
| backend/authentication.md | frontend/* |
| security/authentication.md | ai/* |
| security/jwt.md | deployment/* |

### Add Authorization
| Load | Do NOT Load |
|------|-------------|
| backend/authorization.md | frontend/* |
| security/authorization.md | ai/* |
| backend/rbac.md | deployment/* |

### Design Database
| Load | Do NOT Load |
|------|-------------|
| backend/database.md | frontend/* |
| backend/prisma.md | security/* |
| | deployment/* |

### Add Caching
| Load | Do NOT Load |
|------|-------------|
| backend/caching.md | frontend/* |
| backend/redis.md | security/* |
| | deployment/* |

### Background Jobs
| Load | Do NOT Load |
|------|-------------|
| backend/workers.md | frontend/* |
| backend/architecture.md | security/* |
| | deployment/* |

## AI Tasks

### Summarize Content
| Load | Do NOT Load |
|------|-------------|
| ai/summarization.md | frontend/* |
| ai/prompt-engineering.md | backend/* |
| | security/* |

### Build Search
| Load | Do NOT Load |
|------|-------------|
| ai/semantic-search.md | frontend/* |
| ai/embeddings.md | security/* |
| | deployment/* |

### Build Recommendations
| Load | Do NOT Load |
|------|-------------|
| ai/recommendation.md | frontend/* |
| ai/ranking.md | security/* |
| | deployment/* |

## Security Tasks

### Security Audit
| Load | Do NOT Load |
|------|-------------|
| security/owasp.md | frontend/* |
| security/threat-modeling.md | ai/* |
| security/authentication.md | deployment/* |

### Implement JWT
| Load | Do NOT Load |
|------|-------------|
| security/jwt.md | frontend/* |
| security/cookies.md | ai/* |
| | deployment/* |

### Configure Headers
| Load | Do NOT Load |
|------|-------------|
| security/security-headers.md | frontend/* |
| | backend/* |
| | ai/* |

## Deployment Tasks

### Deploy Frontend
| Load | Do NOT Load |
|------|-------------|
| deployment/vercel.md | frontend/* |
| deployment/environment-variables.md | backend/* |
| | security/* |

### Deploy Backend
| Load | Do NOT Load |
|------|-------------|
| deployment/docker.md | frontend/* |
| deployment/cicd.md | ai/* |
| | security/* |

### Setup CI/CD
| Load | Do NOT Load |
|------|-------------|
| deployment/cicd.md | frontend/* |
| deployment/github-actions.md | backend/* |
| | ai/* |

## Quality Tasks

### Write Tests
| Load | Do NOT Load |
|------|-------------|
| quality/testing.md | frontend/* |
| | backend/* |
| | security/* |

### Fix Bugs
| Load | Do NOT Load |
|------|-------------|
| quality/debugging.md | frontend/* |
| | backend/* |
| | security/* |

### Review Code
| Load | Do NOT Load |
|------|-------------|
| quality/code-review.md | frontend/* |
| | backend/* |
| | security/* |

## Git Tasks

### Make Commits
| Load | Do NOT Load |
|------|-------------|
| git/commit-strategy.md | frontend/* |
| git/branching.md | backend/* |
| | security/* |

### Create PR
| Load | Do NOT Load |
|------|-------------|
| git/pull-requests.md | frontend/* |
| git/commit-strategy.md | backend/* |
| | security/* |

## General Tasks

### Start New Feature
| Load | Do NOT Load |
|------|-------------|
| general/architecture.md | |
| general/coding-style.md | |
| general/naming.md | |

### Write Documentation
| Load | Do NOT Load |
|------|-------------|
| general/documentation.md | |
| general/coding-style.md | |

---

*Last Updated: 2026-07-23*
*Version: 1.0.0*
*Related: [SKILLS_INDEX.md](SKILLS_INDEX.md) | [SKILL_LOADING_POLICY.md](SKILL_LOADING_POLICY.md)*
