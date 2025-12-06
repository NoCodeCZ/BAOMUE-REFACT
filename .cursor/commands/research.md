---
description: Generate compressed research document for complex features
---

# /research [feature-name] [scope]

Generate "on-demand compressed context" - a snapshot of truth based on actual code. This creates a research document that compresses knowledge about how the system currently works, preventing the AI from "making stuff up" when implementing features.

## Arguments
- `feature-name`: Name of the feature (used for research filename)
- `scope`: Optional. Specific area to research (e.g., "authentication", "blog-pagination", "image-handling"). If omitted, researches the entire feature area.

## When to Use

**Use `/research` for:**
- Medium to complex features (multi-file changes)
- Features spanning multiple layers (data → component → page)
- Features requiring understanding of existing patterns
- Refactoring or modifying existing systems

**Skip `/research` for:**
- Simple UI changes (button color, text updates)
- Single-file modifications
- Trivial fixes

## Steps

### 1. Create Research Directory
// turbo
```bash
mkdir -p docs/research
```

### 2. Check if Research Already Exists
// turbo
```bash
ls -la docs/research/[feature-name].md 2>/dev/null || echo "Research document does not exist"
```

If research exists and is recent (< 7 days), ask user if they want to regenerate or use existing.

### 3. Identify Vertical Slices
Based on the feature scope, identify which "vertical slices" through the codebase need exploration:

**Data Layer Slice:**
- `lib/types.ts` - TypeScript interfaces (Schema, Block interfaces, etc.)
- `lib/data.ts` - Data fetching functions (getPageBySlug, getBlockContent, etc.)
- `lib/directus.ts` - Directus client setup and getFileUrl() helper

**Component Layer Slice:**
- `components/` - React components (Header, Hero, Features, etc.)
- Look for similar block components if adding new blocks

**Page Layer Slice:**
- `app/page.tsx` - Homepage block rendering pattern
- `app/[route]/page.tsx` - Other page routes
- Block rendering logic (findBlock pattern)

**Block Architecture:**
- `page_blocks` junction table pattern
- Block collection structure (block_hero, block_features, etc.)
- Block interface in Schema (lib/types.ts)

**Integration Points:**
- Directus collections (pages, page_blocks, block_*, services, etc.)
- ISR patterns (`export const revalidate = 60`)
- Analytics tracking (if applicable)
- SEO/metadata patterns (if applicable)

### 4. Explore Each Vertical Slice

For each slice, read relevant files and document:

#### 4a. Data Layer Research
Read and analyze:
- `lib/types.ts` - Find related interfaces (Block*, Page, Service, etc.)
- `lib/data.ts` - Find related fetch functions (getPageBySlug, getBlockContent, etc.)
- `lib/directus.ts` - Understand getFileUrl() helper and client setup
- Document: 
  - What Block interfaces exist in Schema?
  - How are blocks fetched (getPageBlocks → getBlockContent pattern)?
  - What data fetching patterns are used?

#### 4b. Component Layer Research
Read and analyze:
- Similar existing components in `components/` (Hero, Features, Testimonials, etc.)
- Component patterns (Server Components by default, Client Components for interactivity)
- Document: 
  - How are block components structured?
  - What Tailwind patterns are used?
  - How are images handled (getFileUrl())?
  - What fallback patterns exist?

#### 4c. Page Layer Research
Read and analyze:
- `app/page.tsx` - Homepage block rendering pattern
- `app/services/page.tsx` - List page pattern
- `app/services/[slug]/page.tsx` - Detail page pattern
- Document: 
  - How are blocks rendered (findBlock pattern)?
  - How is ISR configured (`export const revalidate = 60`)?
  - What page structure patterns exist?

#### 4d. Block Architecture Research
If adding/modifying blocks, research:
- `page_blocks` junction table pattern
- How blocks are registered in Schema interface
- Block collection naming (block_hero, block_features, etc.)
- Document: How are new blocks integrated into the system?

#### 4e. Integration Research
If applicable, research:
- Directus collection structure (check `config/COLLECTIONS_*.json`)
- Analytics implementation (GTM events)
- SEO patterns (metadata, structured data)
- Document: How are these integrated?

### 5. Find Similar Implementations
Search for similar features to understand patterns:
// turbo
```bash
# Search for similar block patterns
grep -r "block_" --include="*.tsx" --include="*.ts" app/ components/ lib/ | head -20

# Search for similar data fetching patterns
grep -r "getBlock\|getPage" --include="*.ts" lib/data.ts

# Search for similar component patterns
ls -la components/ | grep -i "[similar-feature]"
```

Read 2-3 similar implementations to understand:
- How blocks are structured (if adding new block)
- How data fetching works (getPageBlocks → getBlockContent pattern)
- How components are organized (Server vs Client)
- What Tailwind patterns are used
- How ISR is configured

### 6. Document Current System Behavior
Create `docs/research/[feature-name].md` with this structure:

```markdown
# Research: [Feature Name]

**Generated**: [date]
**Scope**: [scope description]
**Complexity**: [Simple/Medium/Complex]

## System Overview

[2-3 paragraph summary of how the relevant part of the system currently works]

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` (lines X-Y) - [Block interfaces, Schema interface, key types]
- `lib/data.ts` (lines X-Y) - [Data fetching functions: getPageBySlug, getPageBlocks, getBlockContent, etc.]
- `lib/directus.ts` - [Directus client setup, getFileUrl() helper]

### Component Layer
- `components/[component].tsx` - [Purpose, Server/Client pattern, Tailwind usage]
- Similar components: `components/[similar].tsx` - [Patterns to follow]

### Page Layer
- `app/page.tsx` - [Homepage block rendering pattern, findBlock usage]
- `app/[route]/page.tsx` - [Route-specific patterns, ISR configuration]

### Block Architecture (if applicable)
- Block interface in `lib/types.ts` - [Block[Name] interface]
- Block collection: `block_[name]` - [Directus collection]
- Block registration in Schema interface
- `page_blocks` junction table usage

## Current Data Flow

[Describe how data flows through the system for this feature area]

**For Block-Based Features:**
1. Page fetched via `getPageBySlug(slug)`
2. Page blocks fetched via `getPageBlocks(pageId)`
3. Block content fetched via `getBlockContent(collection, itemId)`
4. Blocks rendered in page using `findBlock(collection)` pattern
5. Components receive block data and render with Tailwind

**For List/Detail Pages:**
1. Data fetched via `getServices()`, `getServiceBySlug()`, etc.
2. ISR configured with `export const revalidate = 60`
3. Components render with fallback handling
4. Images use `getFileUrl()` helper

## Key Patterns & Conventions

### TypeScript Patterns
- Block interfaces: `Block[Name]` in `lib/types.ts`
- Schema registration: Add to `Schema` interface
- Optional fields: Use `?` for optional properties
- Image fields: Typed as `string` (file ID)

### Component Patterns
- Server Components by default (no "use client")
- Client Components only for interactivity (HeaderClient, etc.)
- ISR: `export const revalidate = 60` in pages/components
- Fallbacks: Handle null/empty with sensible defaults
- Images: Always use `getFileUrl(item.image)`

### Data Fetching Patterns
- Page fetching: `getPageBySlug(slug)` → `getPageBlocks(pageId)` → `getBlockContent(collection, itemId)`
- Block fetching: `get[BlockName]Block(blockId)` functions in `lib/data.ts`
- Error handling: Try/catch with null returns
- Directus queries: Use `readItems` with filters and fields

### Block Architecture Patterns
- Block collections: `block_[name]` in Directus
- Junction table: `page_blocks` connects pages to blocks
- Block rendering: `findBlock(collection)` pattern in pages
- Block interfaces: Match Directus collection structure

## Dependencies & Integration Points

### Directus Collections
- `[collection-name]` - [purpose, fields, relationships]

### External Integrations
- [Analytics, SEO, etc.]

## Known Constraints

- **ISR**: Must include `export const revalidate = 60` in pages/components fetching data
- **Images**: Always use `getFileUrl(item.image)` helper, never direct URLs
- **Server Components**: Default to RSC; only use `"use client"` for interactivity
- **Tailwind Only**: No custom CSS; use Tailwind classes exclusively
- **Fallbacks**: Always handle null/empty CMS responses with sensible defaults
- **Block Registration**: New blocks must be added to Schema interface in `lib/types.ts`
- **Block Collections**: Must follow `block_[name]` naming convention
- **Type Safety**: All Directus collections must have TypeScript interfaces

## Similar Implementations

### Example 1: [Similar Feature]
- Files: `[file1]`, `[file2]`
- Pattern: [description]
- Reusable patterns: [what can be reused]

### Example 2: [Similar Feature]
- Files: `[file1]`, `[file2]`
- Pattern: [description]
- Reusable patterns: [what can be reused]

## Code Snippets (Key Patterns)

### Pattern: Block Data Fetching
```typescript
// From lib/data.ts
export async function getPageBlocks(pageId: number) {
  const blocks = await directus.request(
    readItems('page_blocks', {
      filter: { page: { _eq: pageId } },
      fields: ['*'],
      sort: ['sort'],
    })
  );
  return blocks || [];
}

export async function getBlockContent(collection: string, itemId: string) {
  const result = await directus.request(
    readItems(collection as any, {
      filter: { id: { _eq: parseInt(itemId) } },
      fields: ['*'],
      limit: 1,
    })
  );
  return result?.[0] || null;
}
```

### Pattern: Block Rendering in Pages
```typescript
// From app/page.tsx
const findBlock = (collection: string) =>
  blocksWithContent.find((b) => b.collection === collection)?.content as any;

const hero = findBlock("block_hero");
// Use hero data in component
```

### Pattern: Server Component with ISR
```typescript
// From app/page.tsx or components
export const revalidate = 60;

export default async function Component() {
  const data = await getData();
  if (!data) return <Fallback />;
  return <Component data={data} />;
}
```

### Pattern: Image Handling
```typescript
// From components
import { getFileUrl } from "@/lib/directus";

const imageUrl = getFileUrl(item.image);
<img src={imageUrl || '/placeholder.jpg'} alt="..." />
```

## Questions to Resolve

- [ ] [Question 1 about the system]
- [ ] [Question 2 about constraints]
- [ ] [Question 3 about patterns]

## Research Notes

[Any additional findings, edge cases, or important considerations]
```

### 7. Compress Knowledge
The research document should be:
- **Accurate**: Based on actual code, not assumptions
- **Compressed**: Key information only, not full file dumps
- **Actionable**: Clear enough to inform planning
- **Complete**: Covers all relevant vertical slices

### 8. Confirm Research Created
// turbo
```bash
cat docs/research/[feature-name].md
```

## Return Condition
Return when research document is created at `docs/research/[feature-name].md` with:
- Clear system overview
- Relevant files documented
- Key patterns identified
- Dependencies mapped
- Similar implementations found
- Ready for `/planning [feature-name]` or `/review research [feature-name]`

## Output Format
```
📚 Research Complete: docs/research/[feature-name].md
🔍 System Overview: [brief summary]
📁 Files Analyzed: [count]
🎯 Key Patterns: [list]
📝 Ready for: /planning [feature-name] or /review research [feature-name]
```

## Tips
1. **Focus on truth**: Base everything on actual code, not documentation
2. **Compress, don't dump**: Include key patterns, not entire files
3. **Find similarities**: Similar implementations are goldmines
4. **Document constraints**: Known limitations are critical
5. **Vertical slices**: Cover data → component → page layers

