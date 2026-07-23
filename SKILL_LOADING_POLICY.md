# SKILL_LOADING_POLICY.md

> **Type**: Policy | **Update**: Rarely | **Owner**: Architecture Lead

## Purpose

Defines how AI assistants should load and use skills from the .skills/ directory.

## Core Rules

### Rule 1: Never Load Unrelated Skills
```
✅ CORRECT: Building a page → load nextjs.md, react.md, tailwind.md
❌ WRONG: Building a page → load nextjs.md, authentication.md, docker.md
```

### Rule 2: Never Load an Entire Category
```
✅ CORRECT: Load specific skills as needed
❌ WRONG: Load all frontend/ skills at once
```

### Rule 3: Prefer 2-5 Skills Maximum
```
✅ CORRECT: Load 2-3 relevant skills
❌ WRONG: Load 10+ skills "just in case"
```

### Rule 4: Always Search Before Loading
```
1. Search SKILLS_INDEX.md for relevant skills
2. Check TASK_SKILL_MAPPING.md for task recommendations
3. Load only identified skills
```

### Rule 5: Load Only What is Required
```
✅ CORRECT: Building a form → load forms.md, validation.md
❌ WRONG: Building a form → load forms.md, validation.md, react.md, nextjs.md, tailwind.md
```

### Rule 6: Avoid Duplicate Context
```
✅ CORRECT: Reference other skills when needed
❌ WRONG: Copy content from other skills
```

## Loading Sequence

### Step 1: Identify Task
```markdown
What am I building?
- A page? → Frontend skills
- An API? → Backend skills
- Security? → Security skills
- Deployment? → Deployment skills
```

### Step 2: Check Mapping
```markdown
Read TASK_SKILL_MAPPING.md
Find the task
Note the recommended skills
```

### Step 3: Load Skills
```markdown
Load only the recommended skills
Maximum 5 skills
```

### Step 4: Execute
```markdown
Apply skill knowledge
Reference documentation if needed
```

## Size Guidelines

| Context Budget | Max Skills | Strategy |
|----------------|------------|----------|
| Small task | 1-2 | Minimal loading |
| Medium task | 2-3 | Standard loading |
| Large task | 3-5 | Comprehensive loading |
| Unknown task | 1-2 | Start small, add as needed |

## Common Mistakes

| Mistake | Why It's Bad | Instead Do |
|---------|--------------|------------|
| Loading all skills | Wastes tokens, slows response | Load only needed |
| Not checking TASK_SKILL_MAPPING | Misses optimal skill combo | Always check first |
| Loading same skill twice | Duplicate context | Track loaded skills |
| Loading deprecated skills | Outdated information | Check SKILL_CHANGELOG |

## MCP Integration

When loading skills, also consider:
- Which MCPs does the skill recommend?
- Load MCPs only if the skill requires them
- Don't load MCPs "just in case"

---

*Last Updated: 2026-07-23*
*Version: 1.0.0*
*Related: [SKILLS_INDEX.md](SKILLS_INDEX.md) | [TASK_SKILL_MAPPING.md](TASK_SKILL_MAPPING.md)*
