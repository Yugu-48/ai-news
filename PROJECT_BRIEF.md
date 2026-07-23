# PROJECT_BRIEF.md

> **Purpose**: This is the single source of truth for the AI News project. Every AI assistant must read this file before making any changes. This document explains everything necessary to understand the project without requiring chat history.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | AI News |
| **Type** | Production-grade AI Technology News Platform |
| **Mission** | Build one of the fastest, smartest, and highest-quality AI technology news platforms |
| **Repository** | `https://github.com/Yugu-48/ai-news` |

### What This Project Is
An intelligent AI news platform that goes beyond simple RSS aggregation. It discovers, organizes, summarizes, and ranks AI news from trusted sources using AI-powered analysis.

### What This Project Is NOT
- A simple RSS reader
- A blog or personal site
- A news aggregator without intelligence
- A prototype or hackathon project

---

## 2. Current Development Phase

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1: Frontend** | **ACTIVE** | Build polished, production-quality frontend with mock data |
| Phase 2: Backend | PLANNED | Authentication, APIs, database, caching |
| Phase 3: AI Pipeline | PLANNED | Summarization, embeddings, recommendations |
| Phase 4: Deployment | PLANNED | Production infrastructure, monitoring, scaling |

### Current Phase Rules
- **DO**: Implement frontend UI components with mock data
- **DO**: Create responsive, accessible interfaces
- **DO**: Follow Next.js App Router patterns
- **DON'T**: Implement backend APIs
- **DON'T**: Add authentication logic
- **DON'T**: Create database schemas
- **DON'T**: Build AI summarization
- **DON'T**: Set up RSS ingestion
- **DON'T**: Configure deployment
- **DON'T**: Add payment systems
- **DON'T**: Build admin dashboard

---

## 3. Long-Term Vision

### Planned Features (All Phases)

| Category | Features |
|----------|----------|
| **Content** | AI News Aggregation, RSS Feed Collection, Website Crawling |
| **Intelligence** | AI Summarization, Duplicate Detection, Semantic Search |
| **Personalization** | AI Chat over Articles, Personalized Feed, Trending Topics |
| **Quality** | Source Credibility Ranking, AI-powered Recommendations |
| **Growth** | SEO Optimization, Newsletter Generation |
| **Operations** | Admin Dashboard, Analytics, Production Deployment |

---

## 4. Technology Stack

### Frontend (Current Phase)
| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety (strict mode) |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn/UI** | Component library |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Framer Motion** | Animations (only when needed) |

### Backend (Future)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Database access |
| **Redis** | Caching layer |
| **Supabase** | Auth/storage (if appropriate) |

### AI Services (Future)
| Technology | Purpose |
|------------|---------|
| **Gemini** | Primary AI provider |
| **OpenAI-compatible APIs** | Fallback/alternative |
| **Embeddings** | Semantic search |
| **Vector Database** | To be selected |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| **Git** | Version control |
| **GitHub** | Code hosting |
| **Docker** | Containerization |
| **Vercel** | Frontend deployment |
| **Cloud** | Backend deployment (TBD) |

---

## 5. Development Environment

### System
| Component | Value |
|-----------|-------|
| **OS** | Windows |
| **Terminal** | PowerShell |
| **Package Manager** | pnpm |
| **Node** | >=18.0.0 |
| **Python** | Installed |
| **uv** | Installed |
| **Docker** | Installed |

### AI Coding Agents
| Agent | Status |
|-------|--------|
| **Cursor CLI** | Supported |
| **MiMo CLI** | Supported |
| **ChatGPT** | Supported |
| **Claude** | Supported |
| **Gemini** | Supported |
| **Future Agents** | Must be supported |

### Available MCP Servers
| MCP | Purpose |
|-----|---------|
| Context7 | Documentation lookup |
| GitHub | GitHub API access |
| Fetch | HTTP requests |
| Firecrawl | Web scraping |
| Chrome DevTools | Browser debugging |
| Playwright | Browser testing |
| Sequential Thinking | Complex reasoning |
| Brave Search | Web search (if configured) |

---

## 6. Repository Structure

```
ai-news/
├── .context/          # AI agent context files (session state)
├── .skills/           # Reusable AI workflows
│   ├── frontend/
│   ├── backend/
│   ├── ai/
│   ├── deployment/
│   ├── quality/
│   └── general/
├── .templates/        # Document templates
├── assets/            # Design assets (images, icons)
├── backend/           # Server-side code (future)
│   ├── api/
│   ├── services/
│   ├── middleware/
│   ├── config/
│   └── src/
├── docs/              # Project documentation
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── development/
│   ├── ui/
│   └── decisions/
├── frontend/          # Client-side code (current phase)
│   ├── src/
│   └── public/
├── public/            # Root-level static files
├── scripts/           # Build/utility scripts
└── tests/             # Test files
```

### Directory Responsibilities

| Directory | Responsibility |
|-----------|----------------|
| `.context/` | Stores AI agent session state, decisions, learnings |
| `.skills/` | Reusable AI workflows for common tasks |
| `.templates/` | Standardized document templates |
| `assets/` | Design files, images, icons |
| `backend/` | Server-side code, APIs, services |
| `docs/` | Project documentation, architecture decisions |
| `frontend/` | Client-side code, components, pages |
| `public/` | Static files served at root |
| `scripts/` | Build, deploy, and utility scripts |
| `tests/` | Unit, integration, and E2E tests |

---

## 7. Development Philosophy

### Prioritize
- Maintainability over cleverness
- Readability over brevity
- Scalability over quick wins
- Performance over features
- Accessibility over aesthetics
- SEO over convenience
- Type Safety over flexibility
- Reusable Components over one-offs
- Production Quality over prototypes

### Avoid
- Premature optimization
- Overengineering
- Large components (>300 lines)
- Magic code (unexplained logic)
- Duplicated logic
- Unnecessary dependencies
- Architecture drift
- Inconsistent patterns

---

## 8. AI Development Principles

### Before Implementing Anything
1. **Read PROJECT_BRIEF.md** - Understand the project
2. **Inspect existing files** - See what's already built
3. **Read relevant documentation** - Check docs/ directory
4. **Load relevant skills** - Check .skills/ directory
5. **Avoid unrelated files** - Stay focused on the task

### While Working
- Never rewrite working code without reason
- Never regenerate documentation that already exists
- Always preserve repository consistency
- Follow established patterns and conventions
- Update context files when making decisions

### After Completing Work
- Update relevant documentation
- Add learnings to .context/LEARNINGS.md
- Document decisions in .context/DECISIONS.md
- Update NEXT_HANDOFF.md for next agent

---

## 9. Multi-Agent Collaboration

### Communication Protocol
- **Documentation is the communication medium** between AI assistants
- Every AI must preserve context by updating shared files
- Every AI must avoid conflicting changes
- Every AI must read context before starting work

### Context Files
| File | Purpose |
|------|---------|
| `PROJECT_BRIEF.md` | Permanent project truth |
| `.context/CURRENT_PHASE.md` | Active development phase |
| `.context/SPRINT.md` | Current sprint goals |
| `.context/NEXT_HANDOFF.md` | Context for next session |
| `.context/DECISIONS.md` | Architecture decisions |
| `.context/KNOWN_ISSUES.md` | Current blockers |

---

## 10. Token Optimization

### Principles
- Design documentation for minimal token usage
- Prefer modular documentation over monolithic files
- Load only required skills
- Avoid duplicated explanations
- Avoid giant markdown files
- Use repository search before reading multiple files

### File Size Guidelines
| File Type | Maximum Size |
|-----------|--------------|
| Context files | 200 lines |
| Skill files | 300 lines |
| Documentation | 500 lines |
| Templates | 50 lines |

---

## 11. Success Criteria

### For New AI Assistants
A new AI assistant should understand the project in under five minutes by reading:
1. `PROJECT_BRIEF.md` - This file
2. `.context/CURRENT_PHASE.md` - What's being worked on
3. `.context/NEXT_HANDOFF.md` - What to do next
4. `SKILLS_INDEX.md` - Available workflows

### For the Project
- Repository remains understandable after months of development
- No documentation drift
- Consistent code patterns
- Minimal onboarding time for new contributors

---

## 12. Quick Reference

### Key Commands
```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
```

### Key Files
| File | Purpose |
|------|---------|
| `PROJECT_BRIEF.md` | This file - project truth |
| `CLAUDE.md` | AI assistant context |
| `AGENTS.md` | Multi-agent instructions |
| `SKILLS_INDEX.md` | Available skills |
| `.context/CURRENT_PHASE.md` | Current work |
| `.context/NEXT_HANDOFF.md` | Next steps |

### Key Decisions
- Using pnpm for package management
- TypeScript strict mode enabled
- Next.js App Router architecture
- Feature-based folder structure
- Mock data for frontend development

---

*Last Updated: 2026-07-23*
*Version: 1.0.0*
