---
description: Workflow commands index and usage guide
---

# Slash Command Workflows

AI-assisted development workflows for Next.js 14 + Directus CMS dental clinic website framework.

## 🔗 End-to-End Integrated Approach

All workflows follow the **complete data chain** principle:

```
TypeScript Interface → Schema Registration → Fetch Function → Component/Page → Directus Collection → Validate
```

This ensures no fragmentation - every layer of the stack stays in sync.

## Framework Overview

- **Tech Stack**: Next.js 14 (App Router) + Directus CMS + TypeScript + Tailwind CSS
- **Architecture**: Block-based page builder with M2A (Many-to-Any) relationships
- **Pattern**: Server Components by default, Client Components only for interactivity
- **Data Layer**: `lib/directus.ts` (client), `lib/data.ts` (fetch functions), `lib/types.ts` (interfaces)

---

## Quick Reference

| Command | Purpose | Complete Chain |
|---------|---------|----------------|
| `/prime` | Load project context | Start of session |
| `/research feature` | Generate compressed research | `/prime` → `/planning` |
| `/planning feature` | Create implementation plan | `/prime` or `/research` |
| `/review type artifact` | Human review checkpoint | After research/plan/code |
| `/execute feature` | Implement from plan | `/planning` |
| `/commit` | Git commit | `/execute` |
| `/rca issue-id` | Investigate bug | `/prime` |
| `/implement-fix issue-id` | Fix from RCA | `/rca` |
| `/add-block name` | Create CMS block | TS → Schema → Fetch → Component → Directus |
| `/add-page type route` | Create new page | TS → Schema → Fetch → Page → Directus |
| `/convert-aurabuild name` | HTML → React | `/prime` |
| `/convert-html-flow` | Interactive HTML → Next.js + Directus | Conversational workflow |

---

## The Complete Chain Philosophy

### Why End-to-End Integration Matters

❌ **Fragmented approach (old)**:
- Edit TypeScript... somewhere
- Create component... separately
- Hope Directus matches... maybe

✅ **Integrated approach (new)**:
- Every workflow covers the FULL chain
- Schema validation at each step
- Directus setup checklist aligned to TypeScript
- Build validation before completion

### The Chain for Blocks
```
1. TypeScript Interface (lib/types.ts)
   - Add Block{Name} interface
   - Register in Schema interface
2. Fetch Function (lib/data.ts)
   - Create get{Name}Block(blockId) function
3. React Component (components/blocks/ or inline in page)
   - Accept data prop with block type
   - Handle null/empty states gracefully
4. Page Wiring (app/page.tsx or dynamic page)
   - Fetch page blocks via getPageBlocks()
   - Render blocks using getBlockContent() or specific fetchers
5. Directus Collection (admin setup)
   - Create block_{name} collection
   - Add fields matching TypeScript interface
6. Validation (build + runtime)
   - npm run lint && npx tsc --noEmit && npm run build
```

### The Chain for Pages
```
1. Data Source Definition
2. TypeScript Interface (lib/types.ts)
3. Schema Registration
4. Fetch Functions (lib/data.ts)
5. Page Component(s) (app/route/)
6. Metadata & SEO
7. Directus Setup
8. Validation (build + runtime)
```

---

## Development Workflows (RPI Framework)

### Simple Tasks (Button color, small fixes)
```
┌─────────────────────────────────────────────────────────┐
│              SIMPLE TASK CYCLE                          │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /planning simple-feature
   │ Creates: plans/simple-feature.md (with code snippets)
   ↓

3. /execute simple-feature
   │ Implements: All tasks from plan
   ↓

4. /commit
   │ Commits: feat: add simple feature
   ↓

   READY FOR NEXT CYCLE
```

### Medium Tasks (New block, single feature)
```
┌─────────────────────────────────────────────────────────┐
│              MEDIUM TASK CYCLE (RPI)                    │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /research feature-name
   │ Creates: docs/research/feature-name.md
   │ Compressed: System behavior, patterns, constraints
   ↓

3. /review research feature-name
   │ Human: Verify research accuracy
   ↓

4. /planning feature-name
   │ Creates: plans/feature-name.md
   │ Includes: Code snippets, BEFORE/AFTER examples
   ↓

5. /review plan feature-name
   │ Human: Verify plan correctness
   ↓

6. /execute feature-name
   │ Implements: Low-context execution from detailed plan
   ↓

7. /commit
   │ Commits: feat: add feature-name
   ↓

   READY FOR NEXT CYCLE
```

### Complex Tasks (Multi-repo, major refactor)
```
┌─────────────────────────────────────────────────────────┐
│              COMPLEX TASK CYCLE (Full RPI)              │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /research feature-name [deep-scope]
   │ Creates: docs/research/feature-name.md
   │ Deep: Vertical slices, all dependencies
   ↓

3. /review research feature-name
   │ Human: Critical review - catch wrong direction
   ↓

4. /planning feature-name
   │ Creates: plans/feature-name.md
   │ Detailed: Exact code snippets, line numbers, tests
   ↓

5. /review plan feature-name
   │ Human: Critical review - prevent wasted effort
   ↓

6. /execute feature-name
   │ Implements: Minimal context, maximum precision
   ↓

7. /review code feature-name
   │ Human: Quality check
   ↓

8. /commit
   │ Commits: feat: add feature-name
   ↓

   READY FOR NEXT CYCLE
```

---

## Bug Fix Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    BUG FIX CYCLE                        │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Understands: Project context
   ↓

2. /rca 123
   │ Creates: docs/rca/issue-123.md
   ↓

3. /implement-fix 123
   │ Fixes: Bug per RCA document
   ↓

4. /commit
   │ Commits: fix: description (Fixes #123)
   ↓

   ISSUE RESOLVED
```

---

## Framework-Specific Workflows

### New Block (End-to-End)
```
/prime → /add-block faq → /commit

Chain executed:
  ✓ lib/types.ts (BlockFaq interface)
  ✓ lib/types.ts (Schema registration)
  ✓ lib/data.ts (getFaqBlock function)
  ✓ components/blocks/Faq.tsx
  ✓ app/page.tsx (wired)
  ✓ Directus checklist provided
  ✓ npm run build (validated)
```

### New Page - List (End-to-End)
```
/prime → /add-page list promotions → /commit

Chain executed:
  ✓ lib/types.ts (Promotion interface)
  ✓ lib/types.ts (Schema registration)
  ✓ lib/data.ts (getPromotions function)
  ✓ app/promotions/page.tsx
  ✓ Directus checklist provided
  ✓ npm run build (validated)
```

### New Page - Detail (End-to-End)
```
/prime → /add-page detail promotions → /commit

Chain executed:
  ✓ lib/types.ts (Promotion interface)
  ✓ lib/data.ts (getPromotionBySlug function)
  ✓ app/promotions/[slug]/page.tsx
  ✓ generateStaticParams included
  ✓ Dynamic metadata
  ✓ npm run build (validated)
```

### AuraBuild Conversion
```
/prime → /convert-aurabuild gallery → /commit
```

### HTML to Next.js Conversion Flow ⭐ NEW
Interactive conversational workflow for converting HTML files to Next.js pages with automatic Directus collection analysis:

```
1. Upload HTML files
2. Configure sitemap (filename → route mapping)
3. Convert HTML → Next.js component
4. Analyze data structure → Propose Directus collections
5. Modify schema (add fields, relations)
6. Create collections in Directus
7. Connect page to Directus API
```

**Example Flow:**
```
USER: [uploads products.html, product-detail.html]
USER: products is /products, product-detail is /products/[slug]
USER: convert products.html to nextjs
USER: what collections does this need?
USER: add category relation and stock_count
USER: yes create it
USER: update the nextjs page
```

**Features:**
- Automatic collection schema inference from HTML patterns
- Interactive schema modification before creation
- Directus MCP integration for collection creation
- Full TypeScript type generation
- Complete data fetching setup

---

## Command Details

### /prime
Loads comprehensive project context:
- Reads `CLAUDE.md` and rule sections from `.claude/rules/sections/`
- Understands `lib/types.ts` patterns and Schema interface
- Reviews `lib/data.ts` data fetching patterns
- Checks `lib/directus.ts` client setup
- Lists available components and pages
- Summarizes current block types and collections
- Checks git state (if repository exists)

**Use this at the start of every session** to establish context.

### /research [feature-name] [scope] ⭐ NEW
Generates compressed research document (RPI Framework):
- Creates vertical slices through codebase
- Documents current system behavior
- Identifies key patterns and constraints
- Finds similar implementations
- Outputs: `docs/research/[feature-name].md`
- **When to use**: Medium to complex features
- **When to skip**: Simple UI changes, single-file fixes

**Output**: Compressed "truth" based on actual code, preventing AI from "making stuff up"

### /planning [feature-name] [research-doc] ⭐ ENHANCED
Creates detailed, executable implementation plan:
- **NEW**: Checks for research document and uses it
- **NEW**: Includes code snippets showing BEFORE/AFTER
- **NEW**: Documents current system behavior
- **NEW**: Includes exact line numbers for modifications
- Loads relevant reference guides
- Studies existing patterns
- Outputs: `plans/[feature-name].md`
- Ready for `/review plan` or `/execute`

**Quality**: Plans are now "dumb-proof" with actual code examples

### /review [type] [artifact-name] ⭐ NEW
Human review checkpoints at high-leverage points:
- `research`: Review research document (highest leverage)
- `plan`: Review implementation plan (high leverage)
- `code`: Review code changes (lower leverage, still important)

**Impact**: Reviewing research/plans prevents catastrophic errors before implementation

### /execute [feature-name]
Implements features from plans:
- Reads plan file
- Executes tasks in order
- Validates after each step
- Reports completion

### /commit [files...]
Creates conventional commits:
- Reviews changes
- Determines commit type
- Creates formatted message
- Commits and confirms

### /rca [issue-id]
Documents root cause analysis:
- Fetches issue from GitHub
- Investigates code
- Documents root cause
- Proposes fix approach

### /implement-fix [issue-id]
Fixes bugs from RCA:
- Reads RCA document
- Implements fix steps
- Validates all changes
- Ready for commit

### /add-block [name] ⭐ End-to-End
Creates new Directus block with **complete chain**:
1. Adds TypeScript interface to `lib/types.ts` (Block{Name})
2. Registers in `Schema` interface
3. Creates fetch function in `lib/data.ts` (get{Name}Block)
4. Builds React component (components/blocks/{Name}.tsx or inline pattern)
5. Wires to page renderer (app/page.tsx or dynamic page)
6. Provides Directus collection setup checklist
7. Validates build

**Output includes schema alignment table** matching TypeScript to Directus.

**Note**: Current homepage pattern renders blocks inline. New blocks can follow either:
- Separate component pattern: `components/blocks/{Name}.tsx`
- Inline pattern: Direct rendering in page component (current homepage approach)

### /add-page [type] [route] ⭐ End-to-End
Creates new pages with **complete chain**:
- Types: `list`, `detail`, `cms`
1. Defines/verifies TypeScript interface in `lib/types.ts`
2. Registers in `Schema` interface  
3. Creates fetch function(s) in `lib/data.ts`
4. Creates page file(s) in `app/{route}/page.tsx` or `app/{route}/[slug]/page.tsx`
5. Adds proper metadata & SEO (static or `generateMetadata()`)
6. Handles empty states with graceful fallbacks
7. Includes `export const revalidate = 60` for ISR
8. Provides Directus setup checklist
9. Validates build

**Output includes schema alignment table** matching TypeScript to Directus.

**Page Types**:
- `list`: Collection listing page (e.g., `/services`)
- `detail`: Dynamic detail page with `[slug]` route (e.g., `/services/[slug]`)
- `cms`: Block-based page using Directus page builder (e.g., `/about`)

### /convert-aurabuild [name]
Converts HTML to React:
- Analyzes HTML structure
- Maps CMS fields
- Applies conversion rules
- Matches color palette

### /convert-html-flow ⭐ NEW
Interactive conversational workflow for converting HTML files to Next.js pages with Directus integration.

**Session State Management:**
Tracks conversation state across commands:
- Uploaded HTML files
- Sitemap configuration (filename → route)
- Conversion status per page
- Proposed Directus collections
- Created collections

**Command Recognition Patterns:**

1. **File Upload Detection**
   - User uploads HTML files → Initialize session state

2. **Sitemap Configuration**
   - Pattern: `{filename} is {route}` or `{filename} → {route}`
   - Examples: `"homepage is root"`, `"products is /products"`, `"product-detail is /products/[slug]"`

3. **Conversion Requests**
   - Pattern: `convert|make|turn` + `{filename}` + `nextjs|component|page`
   - Examples: `"convert products.html to nextjs"`, `"make products page into a component"`

4. **Collection Analysis**
   - Pattern: `collections|data structure|database tables|schema`
   - Examples: `"what collections needed?"`, `"analyze the data structure"`

5. **Schema Modifications**
   - Pattern: `add` + `{field}` + `{type|relation}`
   - Examples: `"add category relation and stock_count"`, `"add field X as type Y"`

6. **Execution**
   - Pattern: `yes|create|make|proceed` + `it`
   - Examples: `"yes create it"`, `"create it"`, `"make it"`

7. **Page Updates**
   - Pattern: `update|connect` + `nextjs|directus|page`
   - Examples: `"update the nextjs page"`, `"connect to directus"`

**Workflow Steps:**

1. **Initialize Session** - Track uploaded files and state
2. **Parse Sitemap** - Map filenames to Next.js routes
3. **Convert HTML to Next.js** - Generate React components from HTML
4. **Analyze Collections** - Detect repeating patterns and propose Directus schema
5. **Update Proposed Collection** - Modify schema based on user input
6. **Execute Proposed Action** - Create collections in Directus via MCP
7. **Connect Page to Directus** - Add data fetching and TypeScript types

**Implementation Details:**

- **HTML Parsing**: Identifies sections, extracts Tailwind classes, detects repeating patterns
- **Component Generation**: Follows project patterns, uses Server Components, converts `class` to `className`
- **Schema Inference**: Detects repeating HTML structures, infers field types, auto-generates slugs
- **Directus Integration**: Uses MCP tools to create collections, fields, and relations
- **Type Generation**: Updates `lib/types.ts` with new interfaces

**Example Conversation:**
```
USER: [uploads products.html]
USER: products is /products
USER: convert products.html to nextjs
SYSTEM: ✓ Created app/products/page.tsx

USER: what collections does this need?
SYSTEM: Proposed Collection: "products" [shows schema table]

USER: add category relation and stock_count
SYSTEM: ✓ Updated schema

USER: yes create it
SYSTEM: ✓ Created collections in Directus

USER: update the nextjs page
SYSTEM: ✓ Connected to Directus API
```

---

## Schema Validation

Every integrated workflow validates schema alignment:

```
✓ TypeScript Interface (lib/types.ts)
  - All fields defined with correct types
  - Optional fields marked with ?
  - Image fields typed as string | null | undefined
  - Arrays use inline object types or proper interfaces
  - Collection registered in Schema interface

✓ Schema Registration
  - Collection added to Schema interface: `collection_name: Type[]`
  - Correct naming convention (snake_case for collections)

✓ Fetch Function (lib/data.ts)
  - Type import present from './types'
  - Collection name matches TypeScript
  - Image relations expanded with `'image.*'` in fields
  - Error handling with try-catch and logDirectusError()
  - Returns null on error, not throws

✓ Directus Collection
  - Field names match TypeScript exactly
  - Types align (Input→string, JSON→array, etc.)
  - Permissions set correctly (public read for content)
  - M2A junction (page_blocks) configured for block relationships
```

---

## Validation Commands

All workflows use these validation steps:

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build

# Combined validation (used by workflows)
npm run lint && npx tsc --noEmit && npm run build
```

**Always run validation** after:
- Adding new blocks or pages
- Modifying TypeScript interfaces
- Creating new data fetching functions
- Before committing changes

---

## RPI Framework: Research-Plan-Implement

This workflow system implements the **RPI Framework** for high-leverage AI coding:

### Core Principles

1. **Research Phase**: Compress truth about the system
   - Generate "on-demand compressed context"
   - Document actual code behavior, not assumptions
   - Create reusable knowledge artifacts

2. **Plan Phase**: Compress intent with code snippets
   - Include BEFORE/AFTER code examples
   - Specify exact file paths and line numbers
   - Create "dumb-proof" plans

3. **Implement Phase**: Low-context execution
   - Use detailed plans to minimize context window
   - Stay in "smart zone" (<40% context usage)
   - Validate after each step

### Complexity-Based Routing

**Simple Tasks** (skip research):
- Button color changes
- Text updates
- Single-file modifications
- Workflow: `/prime` → `/planning` → `/execute` → `/commit`

**Medium Tasks** (use research):
- New blocks or pages
- Multi-file features
- Features requiring pattern understanding
- Workflow: `/prime` → `/research` → `/planning` → `/review plan` → `/execute` → `/commit`

**Complex Tasks** (deep research):
- Major refactors
- Multi-repo changes
- System-wide modifications
- Workflow: Full RPI with all review gates

### Context Window Management

- **Research documents** compress knowledge (reusable)
- **Plans with code snippets** are self-contained
- **Implementation** uses minimal context
- **Review gates** prevent trajectory contamination

### Human Review Strategy

Review at high-leverage points:
1. **Research review** (highest leverage) - Catch wrong direction early
2. **Plan review** (high leverage) - Prevent wasted implementation
3. **Code review** (lower leverage) - Quality assurance

Shift focus "up the pipeline" from code review toward research/plan review.

## Framework-Specific Tips

1. **Always start with /prime** for new sessions
2. **Use /research for complex features** - prevents "making stuff up"
3. **Review plans before executing** - catch issues early (high leverage)
4. **Include code snippets in plans** - makes plans 10x more effective
5. **Use /add-block for CMS content** - ensures full chain integration
6. **Check schema tables** - the output shows TypeScript ↔ Directus mapping
7. **Complete Directus checklist** - it's aligned to exactly what TypeScript expects
8. **Chain commands** - they're designed to work together
9. **Review research for complex tasks** - highest leverage intervention point
10. **Follow reference guides** - Load from `reference/` folder for specific patterns
11. **Server Components first** - Default to RSC, only use `"use client"` for interactivity
12. **ISR revalidation** - Always include `export const revalidate = 60` in data-fetching pages
13. **Graceful fallbacks** - Handle null/empty CMS responses with sensible defaults
14. **Use getFileUrl()** - Always use helper from `lib/directus.ts` for image URLs
15. **Customize over time** - Add project-specific steps as patterns emerge

## Reference Guides

Load these task-specific guides from `reference/` when working on specific tasks:

- `reference/01_creating_directus_blocks.md` - Adding new CMS-driven content blocks
- `reference/02_adding_new_pages.md` - Creating list pages, detail pages
- `reference/03_data_fetching_functions.md` - Writing Directus query functions
- `reference/04_analytics_event_tracking.md` - Adding GTM/GA4 event tracking
- `reference/05_aurabuild_conversion.md` - Converting HTML designs to React
- `reference/06_seo_metadata.md` - Meta tags, structured data, sitemap
- `reference/07_server_client_components.md` - Server vs client components
- `reference/08_typescript_interfaces.md` - Adding Directus collection types
- `reference/09_image_handling.md` - Working with Directus file assets
- `reference/10_dynamic_routes.md` - Creating [slug] pages
- `reference/11_navigation_items.md` - Adding/modifying site navigation
- `reference/12_error_loading_states.md` - Error boundaries, loading UI

---

## Quick Start Checklist

**New Session:**
1. `/prime` - Load project context
2. Review current tasks or start new feature
3. Choose workflow based on complexity (Simple/Medium/Complex)

**Adding New Block:**
1. `/prime` → `/add-block {name}` → `/commit`
2. Complete Directus collection setup from checklist
3. Test with sample data

**Adding New Page:**
1. `/prime` → `/add-page {type} {route}` → `/commit`
2. Complete Directus collection setup from checklist
3. Test page rendering and data flow

**Complex Feature:**
1. `/prime` → `/research {feature}` → `/review research {feature}`
2. `/planning {feature}` → `/review plan {feature}`
3. `/execute {feature}` → `/commit`

---

## Framework Architecture Summary

**Data Flow:**
```
Directus CMS → lib/directus.ts (client) → lib/data.ts (fetch) → lib/types.ts (types) → Components/Pages
```

**Block System:**
- Pages use M2A (Many-to-Any) via `page_blocks` junction
- Blocks fetched via `getPageBlocks()` and `getBlockContent()`
- Current homepage renders blocks inline (can be refactored to components/blocks/)

**Key Files:**
- `lib/types.ts` - All TypeScript interfaces and Schema
- `lib/data.ts` - All data fetching functions
- `lib/directus.ts` - Directus client and helpers
- `app/` - Next.js App Router pages
- `components/` - React components (blocks can go in `components/blocks/`)
- `reference/` - Task-specific development guides

**Patterns:**
- Server Components by default (`export default async function`)
- ISR with `export const revalidate = 60`
- Graceful fallbacks for missing CMS data
- Type-safe Directus queries with Schema interface
