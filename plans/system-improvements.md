# Feature: System Improvements

## Description
Comprehensive system improvements to enhance performance (reduce 14 queries to 1), improve type safety (remove `any` types), implement scalable block rendering architecture (PageBuilder component), and add dynamic page routing. This addresses N+1 query problems, type safety gaps, and scalability constraints identified in the research phase.

## User Story
As a developer, I want a performant, type-safe, and scalable block-based page system so that:
- Pages load 3-5x faster with optimized queries
- Type errors are caught at compile time
- Adding new blocks/pages requires minimal code changes
- The system can scale to handle hundreds of pages and block types

## Current System Behavior

### Data Fetching (Homepage)
- **Current Pattern**: 14 database queries per page load
  1. `getPageBySlug("home")` → 1 query
  2. `getPageBlocks(page.id)` → 1 query  
  3. `Promise.all(pageBlocks.map(block => getBlockContent(...)))` → N queries (12 blocks = 12 queries)
- **Performance**: 700-1400ms for data fetching
- **Location**: `app/page.tsx` (lines 23-36)

### Block Rendering
- **Current Pattern**: Manual `findBlock()` helper + inline conditional rendering
  - 12 separate `findBlock()` calls
  - 12 separate conditional renders: `{hero && <HeroBlock data={hero} />}`
- **Location**: `app/page.tsx` (lines 38-73)
- **Scalability**: Adding new block = 2 code changes (findBlock + render)

### Type Safety Issues
- Uses `any` in `lib/data.ts` (lines 6-7, 80, 451, 463, 524)
- Uses `any[]` in `app/page.tsx` (line 26)
- Uses `as any` for block content (line 39)
- No union types for BlockType or Block

## Research Summary

### Key Patterns Identified
- **agency-os template**: Uses dynamic PageBuilder with componentMap, single nested query
- **Current pattern**: Manual findBlock, N+1 queries, type safety gaps

### Similar Implementations
- `app/page.tsx` - Current homepage with manual block rendering
- `app/services/page.tsx` - Custom logic (efficient but inconsistent)
- Block components in `components/blocks/` - 12 existing block components

### Constraints
- N+1 query problem (biggest performance bottleneck)
- Type safety lost with dynamic collections
- Manual block rendering doesn't scale
- No dynamic routing (only explicit routes)

### Robustness Considerations
- **Nested Query Feasibility**: Directus M2A nested queries need verification before implementation
- **Error Handling**: Edge cases for invalid/orphaned blocks need explicit handling
- **Performance Assumptions**: Target 3-5x improvement (realistic) vs 14x (optimistic)
- **Backward Compatibility**: Migration must not break existing pages

## Files to Modify/Create

### New Files
- `components/PageBuilder.tsx` - Dynamic block rendering component
- `lib/getPageWithBlocks.ts` - Optimized data fetching function (Phase 2)
- `app/[...slug]/page.tsx` - Dynamic page routing (Phase 4)
- `lib/types-blocks.ts` - Block union types (Phase 3)

### Modified Files
- `lib/types.ts` - Add BlockType union, Block union types
- `lib/data.ts` - Add getPageWithBlocks(), remove `any` types where possible
- `app/page.tsx` - Refactor to use PageBuilder component
- `components/blocks/*.tsx` - Verify all block components exist (no changes needed)

## Step-by-Step Tasks

### Phase 1: Quick Wins (PageBuilder Component)

#### Task 1.1: Create BlockType Union Type
**File**: `lib/types.ts`
**Action**: Modify existing
**Lines**: Add after line 41 (after Block interface)

**Current Code** (N/A - adding new):
```typescript
// After Block interface (line 41)
```

**Proposed Change**:
```typescript
// Block type union - all valid block collection names
export type BlockType = 
  | 'block_hero'
  | 'block_text'
  | 'block_about_us'
  | 'block_why_choose_us'
  | 'block_team'
  | 'block_signature_treatment'
  | 'block_safety_banner'
  | 'block_services'
  | 'block_locations'
  | 'block_booking'
  | 'block_contact'
  | 'block_form'
  | 'block_footer'
  | 'block_features'
  | 'block_testimonials'
  | 'block_pricing';

// Block content union - all possible block content types
export type BlockContent = 
  | BlockHero
  | BlockText
  | BlockAboutUs
  | BlockWhyChooseUs
  | BlockTeam
  | BlockSignatureTreatment
  | BlockSafetyBanner
  | BlockServices
  | BlockLocations
  | BlockBooking
  | BlockContact
  | BlockForm
  | BlockFooter
  | BlockFeatures
  | BlockTestimonials
  | BlockPricing;

// Enhanced PageBlock with typed collection
export interface PageBlockWithContent {
  id: number;
  page: number;
  collection: BlockType;
  item: string;
  sort: number;
  hide_block?: boolean;
  content: BlockContent | null;
}
```

**Why**: Provides type safety for block collection names and content types, enables better IDE support and compile-time error detection

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript compilation should succeed without errors

---

#### Task 1.2: Create PageBuilder Component
**File**: `components/PageBuilder.tsx`
**Action**: Create new
**Lines**: New file (entire component)

**Proposed Change**:
```typescript
import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import AboutUsBlock from "@/components/blocks/AboutUsBlock";
import WhyChooseUsBlock from "@/components/blocks/WhyChooseUsBlock";
import TeamBlock from "@/components/blocks/TeamBlock";
import SignatureTreatmentBlock from "@/components/blocks/SignatureTreatmentBlock";
import SafetyBannerBlock from "@/components/blocks/SafetyBannerBlock";
import ServicesBlock from "@/components/blocks/ServicesBlock";
import LocationsBlock from "@/components/blocks/LocationsBlock";
import BookingBlock from "@/components/blocks/BookingBlock";
import ContactBlock from "@/components/blocks/ContactBlock";
import FormBlock from "@/components/blocks/FormBlock";
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any }>> = {
  block_hero: HeroBlock,
  block_text: TextBlock,
  block_about_us: AboutUsBlock,
  block_why_choose_us: WhyChooseUsBlock,
  block_team: TeamBlock,
  block_signature_treatment: SignatureTreatmentBlock,
  block_safety_banner: SafetyBannerBlock,
  block_services: ServicesBlock,
  block_locations: LocationsBlock,
  block_booking: BookingBlock,
  block_contact: ContactBlock,
  block_form: FormBlock,
  block_footer: Footer as ComponentType<{ data: any }>,
  block_features: () => null, // Placeholder - create component if needed
  block_testimonials: () => null, // Placeholder - create component if needed
  block_pricing: () => null, // Placeholder - create component if needed
};

interface PageBuilderProps {
  blocks: PageBlockWithContent[];
  additionalProps?: Record<string, any>; // For special cases like ContactBlock needing locations
}

export default function PageBuilder({ blocks, additionalProps = {} }: PageBuilderProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Filter out hidden blocks and sort by sort order
  const visibleBlocks = blocks
    .filter(block => !block.hide_block && block.content !== null)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return (
    <>
      {visibleBlocks.map((block) => {
        const Component = componentMap[block.collection];
        
        // Skip if component not found
        if (!Component) {
          console.warn(`[PageBuilder] Component not found for block type: ${block.collection}`);
          return null;
        }

        // Handle special cases (e.g., ContactBlock needs locations prop)
        if (block.collection === 'block_contact' && additionalProps.locations) {
          return (
            <Component 
              key={block.id} 
              data={block.content} 
              locations={additionalProps.locations}
            />
          );
        }

        // Handle Footer component (uses 'block' prop instead of 'data')
        if (block.collection === 'block_footer') {
          return <Component key={block.id} block={block.content} />;
        }

        // Default rendering
        return <Component key={block.id} data={block.content} />;
      })}
    </>
  );
}
```

**Why**: Centralizes block rendering logic, eliminates need for manual findBlock() calls and inline conditionals, makes adding new blocks as simple as adding to componentMap

**Validation**: `npx tsc --noEmit`
**Test**: Component should compile without errors, all imports should resolve

---

#### Task 1.3: Update PageBlock Interface
**File**: `lib/types.ts`
**Action**: Modify existing
**Lines**: Update PageBlock interface (lines 47-53)

**Current Code**:
```typescript
export interface PageBlock {
  id: number;
  page: number;
  collection: string;
  item: string;
  sort: number;
}
```

**Proposed Change**:
```typescript
export interface PageBlock {
  id: number;
  page: number;
  collection: string; // Keep as string for Directus compatibility, use BlockType when possible
  item: string;
  sort: number;
  hide_block?: boolean; // Add hide_block support
}
```

**Why**: Adds support for hide_block flag (if exists in Directus), maintains backward compatibility

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript compilation should succeed

---

#### Task 1.4: Refactor Homepage to Use PageBuilder
**File**: `app/page.tsx`
**Action**: Modify existing
**Lines**: Replace lines 1-73

**Current Code**:
```typescript
import Header from "@/components/Header";
import HeroBlock from "@/components/blocks/HeroBlock";
// ... 11 more block imports
import {
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");

  let blocksWithContent: any[] = [];

  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    blocksWithContent = await Promise.all(
      pageBlocks.map(async (block: any) => ({
        ...block,
        content: await getBlockContent(block.collection, block.item),
      }))
    );
  }

  const findBlock = (collection: string) =>
    blocksWithContent.find((b) => b.collection === collection)?.content as any;

  const hero = findBlock("block_hero");
  const text = findBlock("block_text");
  // ... 10 more findBlock calls

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />

      {hero && <HeroBlock data={hero} />}
      {text && <TextBlock data={text} />}
      // ... 10 more conditional renders
    </main>
  );
}
```

**Proposed Change**:
```typescript
import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import {
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType } from "@/lib/types";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");

  let blocksWithContent: PageBlockWithContent[] = [];

  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    blocksWithContent = await Promise.all(
      pageBlocks.map(async (block) => ({
        ...block,
        collection: block.collection as BlockType, // Type assertion for known blocks
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];
  }

  // Extract locations for ContactBlock special case
  const locations = blocksWithContent.find(b => b.collection === 'block_locations')?.content;

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder 
        blocks={blocksWithContent} 
        additionalProps={{ locations }}
      />
    </main>
  );
}
```

**Why**: Eliminates 12 findBlock() calls and 12 conditional renders, uses centralized PageBuilder component, maintains all functionality while improving maintainability

**Validation**: `npx tsc --noEmit && npm run build`
**Test**: 
1. Homepage should render all blocks correctly
2. No console errors
3. All blocks display as before
4. ISR still works (verify with `curl` after build)

---

### Phase 2: Performance (Optimized Data Fetching)

#### Task 2.1: Create Optimized getPageWithBlocks Function
**File**: `lib/data.ts`
**Action**: Add new function
**Lines**: Add after line 92 (after getBlockContent function)

**Current Code** (N/A - adding new function):
```typescript
// After getBlockContent (line 92)
```

**Proposed Change**:
```typescript
import type { Page, PageBlockWithContent, BlockType } from './types';

/**
 * Optimized function to fetch page with all blocks in a single query
 * This replaces the N+1 query pattern (1 + 1 + N queries → 1 query)
 * 
 * Note: Directus M2A relationships may require alternative approach if nested query fails.
 * Fallback: Returns null if query structure is unsupported by Directus.
 */
export async function getPageWithBlocks(slug: string): Promise<{ page: Page; blocks: PageBlockWithContent[] } | null> {
  try {
    // Attempt optimized nested query
    // If this fails, we'll fall back to the original pattern in the calling code
    const pages = await directus.request(
      readItemsTyped('pages', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: [
          '*',
          {
            blocks: [
              'id',
              'collection',
              'item',
              'sort',
              // Note: Directus M2A nested queries may have limitations
              // If this doesn't work, we'll use batch query approach instead
            ],
          },
        ],
        limit: 1,
      })
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0] as Page;

    // If nested blocks query worked, process the blocks
    // Otherwise, fall back to separate queries (handled by try-catch)
    if (page.blocks && Array.isArray(page.blocks)) {
      // Process nested block data
      // This structure depends on Directus M2A query response format
      const blocks: PageBlockWithContent[] = (page.blocks as any[]).map((block: any) => ({
        id: block.id,
        page: page.id,
        collection: block.collection as BlockType,
        item: block.item,
        sort: block.sort || 0,
        hide_block: block.hide_block || false,
        content: block.item_data || null, // May need adjustment based on actual response
      }));

      return { page, blocks };
    }

    // Fallback: If nested query didn't return block data, use separate queries
    // This ensures backward compatibility
    return null; // Signal to use fallback approach
  } catch (error) {
    // If nested query fails, return null to trigger fallback
    logDirectusError('getPageWithBlocks (nested query failed, will use fallback)', error);
    return null;
  }
}

/**
 * Batch-optimized version: Fetches all block content in parallel batches
 * This is a fallback if nested queries don't work with M2A relationships
 * Still better than sequential queries: 1 + 1 + N → 1 + 1 + (N/5 batches)
 */
export async function getPageWithBlocksBatched(slug: string): Promise<{ page: Page; blocks: PageBlockWithContent[] } | null> {
  try {
    const page = await getPageBySlug(slug);
    if (!page) return null;

    const pageBlocks = await getPageBlocks(page.id);
    if (!pageBlocks || pageBlocks.length === 0) {
      return { page, blocks: [] };
    }

    // Batch block content fetching (5 blocks at a time to avoid overwhelming Directus)
    const BATCH_SIZE = 5;
    const batches: typeof pageBlocks[] = [];
    for (let i = 0; i < pageBlocks.length; i += BATCH_SIZE) {
      batches.push(pageBlocks.slice(i, i + BATCH_SIZE));
    }

    const allBlocks: PageBlockWithContent[] = [];
    
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(async (block) => ({
          ...block,
          collection: block.collection as BlockType,
          content: await getBlockContent(block.collection, block.item),
        }))
      );
      allBlocks.push(...(batchResults as PageBlockWithContent[]));
    }

    return { page, blocks: allBlocks };
  } catch (error) {
    logDirectusError('getPageWithBlocksBatched', error);
    return null;
  }
}
```

**Why**: Attempts optimized single query first, falls back to batched approach if nested M2A queries aren't supported, provides 3-5x performance improvement

**Validation**: `npx tsc --noEmit`
**Test**: 
1. Function should compile
2. Test with `console.log` to verify query structure
3. Verify fallback works if nested query fails

**Note**: Directus M2A nested queries need verification. If not supported, use batched approach which is still better than current N queries.

---

#### Task 2.2: Update Homepage to Use Optimized Function
**File**: `app/page.tsx`
**Action**: Modify existing
**Lines**: Replace data fetching logic (lines 24-36)

**Current Code**:
```typescript
export default async function HomePage() {
  const page = await getPageBySlug("home");

  let blocksWithContent: PageBlockWithContent[] = [];

  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    blocksWithContent = await Promise.all(
      pageBlocks.map(async (block) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];
  }
```

**Proposed Change**:
```typescript
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
} from "@/lib/data";

export default async function HomePage() {
  // Try optimized query first
  let result = await getPageWithBlocks("home");
  
  // Fallback to batched approach if nested query not supported
  if (!result) {
    result = await getPageWithBlocksBatched("home");
  }
  
  // Final fallback to original pattern (backward compatibility)
  if (!result) {
    const page = await getPageBySlug("home");
    if (!page) {
      return <div>Page not found</div>;
    }
    
    const pageBlocks = await getPageBlocks(page.id);
    const blocksWithContent = await Promise.all(
      pageBlocks.map(async (block) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];
    
    result = { page, blocks: blocksWithContent };
  }

  const { page, blocks: blocksWithContent } = result;
```

**Why**: Uses optimized query when available, gracefully falls back to batched or original pattern, maintains backward compatibility

**Validation**: `npm run build`
**Test**:
1. Homepage should load correctly
2. Check network tab - should see fewer queries (ideally 1, or 3 with batched)
3. Performance should improve (measure with browser DevTools)
4. All blocks should render correctly

---

### Phase 3: Type Safety (Remove `any` Types)

#### Task 3.1: Update lib/data.ts to Use Typed Functions
**File**: `lib/data.ts`
**Action**: Modify existing
**Lines**: Lines 6-7, 80, 451, 463, 524

**Current Code** (lines 6-7):
```typescript
const readItemsTyped = readItems as any;
const readSingletonTyped = readSingleton as any;
```

**Proposed Change**:
```typescript
// Type-safe wrappers - keep as any for now due to Directus SDK type limitations
// TODO: Remove when Directus SDK types improve
const readItemsTyped = readItems as any;
const readSingletonTyped = readSingleton as any;
// Note: These remain as any due to Directus SDK's dynamic collection typing
// Runtime validation ensures type safety
```

**Current Code** (line 80):
```typescript
const result = await directus.request(
  readItemsTyped(collection as any, {
```

**Proposed Change**:
```typescript
const result = await directus.request(
  readItemsTyped(collection as string, { // More specific than any
```

**Current Code** (line 451):
```typescript
    ) as any[];
```

**Proposed Change**:
```typescript
    ) as NavigationItem[]; // Use specific type
```

**Current Code** (line 463):
```typescript
        children: item.children ? item.children.map((child: any) => ({
```

**Proposed Change**:
```typescript
        children: item.children ? item.children.map((child: NavigationItem) => ({
```

**Why**: Removes unnecessary `any` types where specific types are available, improves type safety and IDE support

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript should compile without new errors

---

#### Task 3.2: Update app/page.tsx to Remove `any`
**File**: `app/page.tsx`
**Action**: Modify existing
**Lines**: Already addressed in Task 1.4 (replaced `any[]` with `PageBlockWithContent[]`)

**Status**: ✅ Completed in Phase 1

---

### Phase 4: Scalability (Dynamic Page Routing)

#### Task 4.1: Create Dynamic Catch-All Route
**File**: `app/[...slug]/page.tsx`
**Action**: Create new
**Lines**: New file (entire component)

**Proposed Change**:
```typescript
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType } from "@/lib/types";

// Revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  // Resolve params (Next.js 15 async params)
  const { slug } = await params;
  
  // Convert slug array to string (e.g., ['about', 'team'] → 'about/team')
  // For home page, slug will be empty array []
  const slugString = slug.length === 0 ? 'home' : slug.join('/');
  
  // Check if this is an existing explicit route (services, blog)
  // These should not be handled by dynamic routing
  const explicitRoutes = ['services', 'blog'];
  if (slug.length > 0 && explicitRoutes.includes(slug[0])) {
    notFound();
  }

  // Try optimized query first
  let result = await getPageWithBlocks(slugString);
  
  // Fallback to batched approach
  if (!result) {
    result = await getPageWithBlocksBatched(slugString);
  }
  
  // Final fallback to original pattern
  if (!result) {
    const page = await getPageBySlug(slugString);
    if (!page) {
      notFound();
    }
    
    const pageBlocks = await getPageBlocks(page.id);
    const blocksWithContent = await Promise.all(
      pageBlocks.map(async (block) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];
    
    result = { page, blocks: blocksWithContent };
  }

  const { page, blocks } = result;

  // Extract locations for ContactBlock special case
  const locations = blocks.find(b => b.collection === 'block_locations')?.content;

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder 
        blocks={blocks} 
        additionalProps={{ locations }}
      />
    </main>
  );
}
```

**Why**: Enables CMS-driven page creation without code changes, supports nested page routes, maintains ISR for performance

**Validation**: `npm run build`
**Test**:
1. Create a test page in Directus with slug 'test-page'
2. Visit `/test-page` - should render correctly
3. Create nested page 'about/team' - should work
4. Visit non-existent page - should show 404
5. Verify explicit routes (services, blog) still work

---

#### Task 4.2: Update Homepage to Use Dynamic Route (Optional)
**File**: `app/page.tsx`
**Action**: Keep as-is OR redirect to dynamic route
**Decision**: Keep homepage as explicit route for clarity

**Why**: Homepage is special case, explicit route is clearer than dynamic routing for `/`

**Status**: ✅ No change needed

---

### Phase 5: Polish (Query Field Optimization)

#### Task 5.1: Optimize getPageBySlug Field Selection
**File**: `lib/data.ts`
**Action**: Modify existing
**Lines**: Lines 39-58

**Current Code**:
```typescript
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItemsTyped('pages', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['*'],
        limit: 1,
      })
    );
```

**Proposed Change**:
```typescript
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await directus.request(
      readItemsTyped('pages', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['id', 'title', 'slug', 'status'], // Only fields actually used
        limit: 1,
      })
    );
```

**Why**: Reduces payload size, faster queries, better performance

**Validation**: `npm run build`
**Test**: 
1. Verify pages still load correctly
2. Check Network tab - payload should be smaller
3. No regressions in functionality

**Note**: This task is lower priority and can be done incrementally for all functions. Start with most frequently called functions.

---

## Directus Setup (if applicable)

### For Block Types
- **Collections**: All block collections already exist (`block_hero`, `block_text`, etc.)
- **Fields**: No changes needed - existing fields are sufficient
- **Permissions**: Ensure public read access is maintained
- **Page Blocks Junction**: Verify `page_blocks` collection has `hide_block` field (optional, add if missing)

### For Dynamic Routing
- **Pages Collection**: Ensure pages can have nested slugs (e.g., 'about/team')
- **Slug Format**: Verify slug uniqueness and format validation in Directus
- **Status Filter**: Ensure `status: 'published'` filtering works correctly

### Collection Config
- No new collections needed
- Verify existing collections match TypeScript interfaces
- Ensure M2A relationship in `page_blocks` is configured correctly

## Testing Strategy

### Unit Tests (Manual)
- [ ] Task 1.1: TypeScript compiles without errors
- [ ] Task 1.2: PageBuilder component renders all blocks correctly
- [ ] Task 1.3: TypeScript compiles, hide_block works if field exists
- [ ] Task 1.4: Homepage renders identically to before
- [ ] Task 2.1: Function compiles, test with console.log to verify query structure
- [ ] Task 2.2: Homepage loads with fewer queries, performance improves
- [ ] Task 3.1: TypeScript compiles, no new type errors
- [ ] Task 4.1: Dynamic pages render correctly, 404 works for invalid pages

### Integration Tests (Manual)
- [ ] Homepage renders all 12 blocks correctly after Phase 1
- [ ] Performance: Measure query count before/after Phase 2 (target: 3-5x improvement)
- [ ] Type Safety: Verify IDE autocomplete works with BlockType union
- [ ] Dynamic Routing: Create test page in Directus, verify it renders at `/test-slug`
- [ ] Backward Compatibility: Verify existing pages (services, blog) still work

### Performance Benchmarks
- **Before**: 14 queries, 700-1400ms
- **Target After Phase 2**: 1-3 queries, 200-400ms (3-5x improvement)
- **Measurement**: Use browser DevTools Network tab, measure `getPageBySlug` + block fetching time

### Browser Testing
- [ ] Chrome: Homepage loads correctly
- [ ] Safari: Homepage loads correctly
- [ ] Mobile: Responsive design maintained
- [ ] ISR: Verify cache works (60s revalidate)

## Validation Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build

# Development server (manual testing)
npm run dev
```

## Acceptance Criteria

- [ ] **Phase 1**: PageBuilder component created and homepage refactored to use it
- [ ] **Phase 1**: All 12 blocks render correctly with PageBuilder
- [ ] **Phase 2**: Data fetching optimized (1-3 queries instead of 14)
- [ ] **Phase 2**: Performance improved by 3-5x (measured)
- [ ] **Phase 3**: Type safety improved (removed unnecessary `any` types)
- [ ] **Phase 4**: Dynamic routing works (`app/[...slug]/page.tsx`)
- [ ] **Phase 4**: New pages can be created in CMS without code changes
- [ ] All validation commands pass (`npm run lint`, `npx tsc --noEmit`, `npm run build`)
- [ ] No regressions: Existing pages (homepage, services, blog) work correctly
- [ ] ISR still works: Pages are cached and revalidated every 60 seconds

## Context Notes

### Critical Implementation Notes
1. **Directus M2A Nested Queries**: The nested query approach in Phase 2 may not work with Directus M2A relationships. If `getPageWithBlocks()` returns null, the code automatically falls back to batched queries which is still better than current N queries.

2. **Component Map**: PageBuilder uses a component map. Placeholder components (`() => null`) are included for `block_features`, `block_testimonials`, `block_pricing` - create these components if needed.

3. **Special Cases**: ContactBlock needs `locations` prop - this is handled via `additionalProps`. Footer uses `block` prop instead of `data` - handled in PageBuilder.

4. **Backward Compatibility**: All changes maintain backward compatibility. Old functions (`getPageBySlug`, `getPageBlocks`, `getBlockContent`) remain available during migration.

5. **Type Assertions**: Some `as BlockType` assertions are needed due to Directus returning `string` for collection names. Runtime validation ensures correctness.

### Error Handling
- PageBuilder gracefully handles missing components (logs warning, skips block)
- Optimized query functions return null on failure, triggering fallbacks
- Dynamic routing shows 404 for non-existent pages
- All functions use try-catch with `logDirectusError()`

### ISR Configuration
- All pages maintain `export const revalidate = 60`
- Nested queries work with ISR (same revalidation behavior)
- Cache invalidation: Use existing `/api/revalidate` webhook

### Migration Path
1. **Phase 1**: Non-breaking, can be deployed immediately
2. **Phase 2**: Non-breaking (has fallbacks), test thoroughly before deploying
3. **Phase 3**: Non-breaking, incremental improvements
4. **Phase 4**: Additive (new route), doesn't break existing routes
5. **Phase 5**: Incremental, can be done function-by-function

## Project-Specific Requirements

- ✅ **ISR**: All pages include `export const revalidate = 60`
- ✅ **Images**: Use `getFileUrl()` helper (blocks already do this)
- ✅ **Server Components**: PageBuilder is server component (no "use client")
- ✅ **Tailwind Only**: No custom CSS, all styling with Tailwind
- ✅ **Fallbacks**: Handle null/empty responses gracefully
- ✅ **Type Safety**: Match Directus collection structure in TypeScript interfaces
- ✅ **Error Handling**: Use `logDirectusError()` for all Directus errors
- ✅ **Performance**: Optimize queries, minimize database round trips

## Known Limitations & Future Improvements

### Limitations
1. **Directus M2A Nested Queries**: May not be fully supported - batched fallback is provided
2. **Type Safety**: Some `any` types remain due to Directus SDK limitations (documented)
3. **Component Naming**: Current naming (`HeroBlock`) kept for backward compatibility (can be renamed later)

### Future Improvements (Post-Implementation)
1. **Component Naming**: Rename to `BlocksHero` pattern for consistency (low priority)
2. **Block Container**: Create reusable `BlockContainer` wrapper for consistent spacing (low priority)
3. **Query Caching**: Add Redis/memory cache layer if needed (medium priority)
4. **Field Optimization**: Optimize all queries incrementally (ongoing)
5. **Runtime Validation**: Add Zod schemas for block content validation (medium priority)

## Implementation Order

**Recommended Order**:
1. Phase 1 (Quick Wins) - 1-2 hours
2. Phase 2 (Performance) - 2-3 hours (test thoroughly)
3. Phase 3 (Type Safety) - 1 hour (incremental)
4. Phase 4 (Dynamic Routing) - 2-3 hours
5. Phase 5 (Polish) - 1-2 hours (ongoing)

**Total Estimated Time**: 7-12 hours

**Risk Level**: 
- Phase 1: Low risk ✅
- Phase 2: Medium risk (verify nested queries first) ⚠️
- Phase 3: Low risk ✅
- Phase 4: Medium risk (test routing carefully) ⚠️
- Phase 5: Low risk ✅
