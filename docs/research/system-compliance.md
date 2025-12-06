# Research: System Compliance & Missing Features

**Generated**: 2024-12-19
**Scope**: Complete system compliance check - missing analytics, SEO, revalidation, and hardcoded content
**Complexity**: Medium

## System Overview

The project is a Next.js 14 + Directus CMS dental clinic website with a block-based page builder architecture. The system follows most core principles (type safety, server components, ISR, graceful degradation) but is missing critical implementations for analytics, SEO, on-demand revalidation, and has hardcoded footer content violating the "No Hardcoded Content" principle.

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` - Contains `BlockFooter` interface and `Schema` interface with all block types registered
- `lib/data.ts` - Contains `getFooterBlock(blockId)` function for fetching footer from CMS
- `lib/directus.ts` - Directus client setup with `getFileUrl()` helper

### Component Layer
- `components/Footer.tsx` - Existing Footer component that accepts `BlockFooter` and renders CMS-driven content (uses neutral colors, different styling)
- `components/blocks/*.tsx` - All block components follow Server Component pattern with ISR
- Similar components: `components/blocks/HeroBlock.tsx`, `components/blocks/ContactBlock.tsx` - Follow block rendering pattern

### Page Layer
- `app/page.tsx` (lines 69-257) - Homepage has hardcoded footer HTML instead of using `Footer` component
- `app/layout.tsx` - Root layout with metadata generation, but no GTM scripts
- `app/services/[slug]/page.tsx` - Dynamic metadata pattern exists for service pages

### Missing Implementations
- `lib/analytics/` - Directory doesn't exist (should contain `gtm.tsx` and `events.ts`)
- `config/analytics.config.ts` - File doesn't exist
- `app/api/revalidate/route.ts` - File doesn't exist (on-demand ISR webhook)
- `next-sitemap.config.js` - File doesn't exist
- `components/seo/` - Directory doesn't exist (should contain structured data components)

## Current Data Flow

**For Block-Based Features:**
1. Page fetched via `getPageBySlug(slug)` ✅
2. Page blocks fetched via `getPageBlocks(pageId)` ✅
3. Block content fetched via `getBlockContent(collection, itemId)` ✅
4. Blocks rendered in page using `findBlock(collection)` pattern ✅
5. Components receive block data and render with Tailwind ✅

**For Footer (Current - Incorrect):**
1. Homepage has hardcoded footer HTML (lines 69-257 in `app/page.tsx`) ❌
2. Footer component exists but not used ❌
3. `getFooterBlock()` function exists but not called ❌

**For Footer (Should Be):**
1. Fetch footer block via `getFooterBlock(blockId)` or `getBlockContent('block_footer', itemId)`
2. Render using existing `Footer` component
3. Footer content comes from Directus CMS

## Key Patterns & Conventions

### TypeScript Patterns
- Block interfaces: `Block[Name]` in `lib/types.ts` ✅
- Schema registration: All blocks registered in `Schema` interface ✅
- Optional fields: Use `?` for optional properties ✅
- Image fields: Typed as `string` (file ID) ✅

### Component Patterns
- Server Components by default (no "use client") ✅
- Client Components only for interactivity (HeaderClient, FormBlock, etc.) ✅
- ISR: `export const revalidate = 60` in pages/components ✅
- Fallbacks: Handle null/empty with sensible defaults ✅
- Images: Always use `getFileUrl(item.image)` ✅

### Data Fetching Patterns
- Page fetching: `getPageBySlug(slug)` → `getPageBlocks(pageId)` → `getBlockContent(collection, itemId)` ✅
- Block fetching: `get[BlockName]Block(blockId)` functions in `lib/data.ts` ✅
- Error handling: Try/catch with null returns ✅
- Directus queries: Use `readItems` with filters and fields ✅

### Block Architecture Patterns
- Block collections: `block_[name]` in Directus ✅
- Junction table: `page_blocks` connects pages to blocks ✅
- Block rendering: `findBlock(collection)` pattern in pages ✅
- Block interfaces: Match Directus collection structure ✅

## Dependencies & Integration Points

### Directus Collections
- `block_footer` - Footer content collection (exists, has `getFooterBlock()` function)
- `pages` - Page collection with blocks via `page_blocks` junction
- `page_blocks` - Junction table connecting pages to blocks

### External Integrations (Missing)
- **Google Tag Manager**: Not implemented (should be in `app/layout.tsx`)
- **Google Analytics 4**: Not implemented (should be via GTM)
- **next-sitemap**: Not installed/configured
- **Structured Data**: Not implemented (should be JSON-LD components)

## Known Constraints

- **ISR**: Must include `export const revalidate = 60` in pages/components fetching data ✅
- **Images**: Always use `getFileUrl(item.image)` helper, never direct URLs ✅
- **Server Components**: Default to RSC; only use `"use client"` for interactivity ✅
- **Tailwind Only**: No custom CSS; use Tailwind classes exclusively ✅
- **Fallbacks**: Always handle null/empty CMS responses with sensible defaults ✅
- **Block Registration**: New blocks must be added to Schema interface in `lib/types.ts` ✅
- **No Hardcoded Content**: All user-facing text must come from Directus CMS ❌ (footer violates this)

## Similar Implementations

### Example 1: Block Rendering Pattern
- Files: `app/page.tsx` (lines 22-66)
- Pattern: Fetch page → fetch blocks → findBlock() → render components
- Reusable patterns: 
  - `findBlock(collection)` helper function
  - Conditional rendering: `{hero && <HeroBlock data={hero} />}`
  - Block fetching: `getBlockContent(block.collection, block.item)`

### Example 2: Footer Component
- Files: `components/Footer.tsx`
- Pattern: Accepts `BlockFooter`, renders CMS content with fallbacks
- Reusable patterns:
  - Conditional rendering for optional content sections
  - Social links mapping
  - Link arrays rendering

### Example 3: Metadata Generation
- Files: `app/layout.tsx` (lines 8-17), `app/services/[slug]/page.tsx`
- Pattern: `generateMetadata()` function for dynamic metadata
- Reusable patterns:
  - Fetch data first, then generate metadata
  - Fallback to default values
  - OpenGraph tags

## Code Snippets (Key Patterns)

### Pattern: Block Data Fetching
```typescript
// From lib/data.ts (lines 158-172)
export async function getFooterBlock(blockId: number): Promise<BlockFooter | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_footer', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockFooter || null;
  } catch (error) {
    logDirectusError('getFooterBlock', error);
    return null;
  }
}
```

### Pattern: Block Rendering in Pages
```typescript
// From app/page.tsx (lines 37-50)
const findBlock = (collection: string) =>
  blocksWithContent.find((b) => b.collection === collection)?.content as any;

const hero = findBlock("block_hero");
const contact = findBlock("block_contact");
// Use block data in components
```

### Pattern: Server Component with ISR
```typescript
// From app/page.tsx (line 20)
export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");
  // ... fetch blocks and render
}
```

### Pattern: Footer Component Usage (Should Be)
```typescript
// Should be in app/page.tsx
import Footer from "@/components/Footer";

const footer = findBlock("block_footer");
{footer && <Footer block={footer} />}
```

## Missing Implementations Analysis

### 1. Analytics (GTM) - Completely Missing
**Required Files:**
- `lib/analytics/gtm.tsx` - GTM script components
- `lib/analytics/events.ts` - Event tracking helper
- `config/analytics.config.ts` - Analytics configuration
- Integration in `app/layout.tsx`

**Reference Pattern:** `.claude/rules/sections/05_analytics.md` and `reference/04_analytics_event_tracking.md`

### 2. SEO - Partial Implementation
**Existing:**
- Dynamic metadata generation in pages ✅
- `generateMetadata()` pattern ✅

**Missing:**
- `next-sitemap.config.js` configuration
- `next-sitemap` package installation
- JSON-LD structured data components
- `components/seo/LocalBusinessSchema.tsx`

**Reference Pattern:** `.claude/rules/sections/07_seo.md` and `reference/06_seo_metadata.md`

### 3. On-Demand Revalidation - Missing
**Required File:**
- `app/api/revalidate/route.ts` - Webhook endpoint for Directus to trigger ISR

**Reference Pattern:** `.claude/rules/sections/06_directus_integration.md` (lines 34-65)

### 4. Hardcoded Footer Content - Rule Violation
**Current State:**
- `app/page.tsx` lines 69-257: Hardcoded footer HTML
- `components/Footer.tsx` exists but not used
- `getFooterBlock()` function exists but not called

**Should Be:**
- Fetch footer block via `findBlock("block_footer")`
- Render using `Footer` component
- Note: Footer component uses different styling (neutral colors) vs homepage footer (slate colors) - may need styling alignment

## Questions to Resolve

- [ ] Should Footer component styling be updated to match homepage design (slate colors) or vice versa?
- [ ] What GTM container ID should be used? (needs environment variable)
- [ ] What site URL should be used for sitemap? (needs environment variable)
- [ ] Should structured data pull from `global_settings` or hardcode clinic info?
- [ ] What revalidation secret should be used? (needs environment variable)

## Research Notes

1. **Footer Component Mismatch**: The existing `Footer` component uses a different design system (neutral colors, different layout) than the hardcoded footer in homepage (slate colors, different structure). Need to decide which design to use or create a new footer block component that matches homepage design.

2. **Analytics Priority**: Analytics is marked as "Required for all projects" in rules, so this should be Priority 1.

3. **SEO Priority**: SEO is marked as "Always" required, so this should be Priority 2.

4. **Revalidation Webhook**: This is important for content updates but not blocking for initial launch.

5. **Footer Content**: This violates core principle but existing Footer component may need redesign to match homepage aesthetic.

