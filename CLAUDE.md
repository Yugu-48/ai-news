# AI News - AI Assistant Context

## Project Identity
- **Name**: AI News
- **Goal**: Become one of the best AI news websites
- **Phase**: Frontend only (backend and AI pipeline will come later)

## Tech Stack (Current)
- **Package Manager**: pnpm
- **Language**: TypeScript (strict mode)
- **Node**: >=18.0.0

## Tech Stack (Planned)
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Node.js or Python
- **Database**: PostgreSQL
- **AI**: OpenAI / Anthropic APIs
- **Vector DB**: Pinecone or pgvector

## Folder Structure
```
├── src/                 # Source code (when framework added)
│   ├── app/             # Next.js App Router routes
│   ├── features/        # Feature modules
│   ├── shared/          # Shared components/utils
│   └── lib/             # Core libraries
├── public/              # Static assets
├── docs/                # Documentation
├── scripts/             # Build/utility scripts
└── .github/             # CI/CD, templates
```

## Conventions

### File Naming
- **Components**: `PascalCase.tsx` (ArticleCard.tsx)
- **Utilities**: `camelCase.ts` (formatDate.ts)
- **Types**: `PascalCase` with `Type` suffix
- **Routes**: `kebab-case` folders

### Import Order
1. External packages (react, next)
2. Internal aliases (@/features, @/shared)
3. Relative imports (./components)

### Code Style
- Use Server Components by default
- Add `'use client'` only when hooks/state needed
- Prefer composition over configuration
- Keep components small and focused

## Anti-patterns to Avoid
- Don't use `useEffect` for initial data fetching
- Don't store secrets in frontend code
- Don't skip TypeScript types
- Don't create deeply nested folder structures
- Don't mix client and server code in same file

## Commands (When Framework Added)
```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Run Prettier
pnpm test         # Run tests
```

## Current State
- [x] Repository initialized
- [x] .gitignore created
- [x] package.json created
- [x] tsconfig.json created
- [ ] Framework initialized (Next.js)
- [ ] Styling configured (Tailwind)
- [ ] First component created

## Key Decisions
- Using pnpm for package management
- TypeScript strict mode enabled
- Path aliases configured (@/*)
- Feature-based folder structure planned
