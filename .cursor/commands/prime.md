---
description: Load project context and build codebase understanding
---

# /prime - Context Loading

Load comprehensive context about this Next.js + Directus CMS project.

## Steps

### 1. Read Core Configuration
// turbo
```bash
cat package.json && cat tsconfig.json
```

### 2. Read Project Rules
Read the following files to understand project conventions:
- `CLAUDE.md` - Main project rules index
- `.claude/rules/sections/03_architecture.md` - Folder structure
- `.claude/rules/sections/04_code_style.md` - Code style guide
- `.claude/rules/sections/11_ai_instructions.md` - AI coding guidelines

### 3. Understand Data Layer
Read these files to understand the Directus integration:
- `lib/types.ts` - All TypeScript interfaces
- `lib/data.ts` (first 100 lines) - Data fetching patterns
- `lib/directus.ts` - Directus client setup

### 4. Check Current State
// turbo
```bash
git status && git log -3 --oneline
```

### 5. List Components and Blocks
// turbo
```bash
ls -la components/blocks/ && ls -la app/
```

### 6. Summarize Understanding
After reading all files, provide a summary that includes:

**Project Overview:**
- Framework: Next.js 14 + Directus CMS
- Styling: Tailwind CSS
- Key patterns: Block-based page builder

**Current Block Types:**
- List all interfaces from `lib/types.ts` that start with `Block*`

**Available Pages:**
- List directories in `app/`

**Recent Changes:**
- Summarize last 3 git commits

**Ready to Work On:**
- Confirm context is loaded and ready for next commands

## Return Condition
Return when you have read all core files and can summarize the project structure, conventions, and current state.
