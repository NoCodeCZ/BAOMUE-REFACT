# Research: Migration Phase 3 - Template Adoption

**Generated**: 2024-12-19
**Scope**: Complete template adoption by creating reusable block components, finalizing schema alignment, and establishing component patterns
**Complexity**: Medium

## System Overview

Phase 2 completed the schema alignment by adding `BlockText` interface and `getTextBlock()` function. Phase 3 focuses on **template adoption** - creating reusable React components for blocks, establishing component patterns, and ensuring the system follows Directus Simple CMS template best practices. Currently, blocks are rendered inline in `app/page.tsx` with direct JSX. Phase 3 will extract these into reusable components following the template's component-based architecture.

The current homepage (`app/page.tsx`) is 1,802 lines with all block rendering done inline. While functional, this approach doesn't scale well and doesn't match the template's component-based pattern. Phase 3 will create dedicated block components (similar to existing `Hero.tsx`, `Features.tsx`, etc.) and establish a reusable block rendering system.

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` (lines 1-373) - Contains Schema interface with 15 block types: `block_hero`, `block_features`, `block_testimonials`, `block_pricing`, `block_footer`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`, `block_contact`, `block_text`. All blocks registered in Schema interface.
- `lib/data.ts` (lines 37-392) - Core block fetching: `getPageBySlug()`, `getPageBlocks()`, `getBlockContent()`. Individual block fetch functions for all 15 block types including newly added `getTextBlock()` (line 378) and `getContactBlock()` (line 361).

### Component Layer
- `components/Hero.tsx` - Existing hero block component (reference implementation)
- `components/Features.tsx` - Existing features component
- `components/Testimonials.tsx` - Existing testimonials component
- `components/Pricing.tsx` - Existing pricing component
- `components/Footer.tsx` - Existing footer component
- `components/Header.tsx` - Server component for header
- `components/HeaderClient.tsx` - Client component for interactive header
- **Missing**: No components for `block_text`, `block_contact`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`

### Page Layer
- `app/page.tsx` (lines 1-1802) - Homepage with **inline block rendering** (1,802 lines!). Uses `findBlock()` pattern to locate blocks, then renders directly in JSX. ISR configured: `export const revalidate = 60`.
- Block rendering pattern (lines 28-40): `findBlock(collection)` helper extracts blocks, then inline JSX renders each block with fallback values.

### Block Architecture
- Block collections: 15 block types in TypeScript (matches Directus structure)
- Junction table: `page_blocks` M2A relationship connects pages to blocks
- Block rendering: Currently inline in pages, needs component-based approach
- Block registration: All blocks in Schema interface ✅

### Integration Points
- Directus collections: All block collections exist (verified in Phase 2)
- Template alignment: Core blocks (`block_hero`, `block_text`, `block_gallery`, `block_form`, `block_contact`) now exist
- Component patterns: Need to establish reusable component patterns for all blocks

## Current Data Flow

**Current Block Rendering (Homepage):**
1. Page fetched via `getPageBySlug("home")` → Returns Page object
2. Page blocks fetched via `getPageBlocks(page.id)` → Returns PageBlock[] 
3. Block content fetched via `Promise.all(pageBlocks.map(block => getBlockContent(block.collection, block.item)))` → Returns blocks with content
4. Blocks stored in `blocksWithContent` array
5. Blocks extracted using `findBlock(collection)` helper
6. **Blocks rendered inline** in JSX (1,802 lines in app/page.tsx)
7. Each block has inline fallback values and Tailwind styling

**Target Block Rendering (After Phase 3):**
1. Same data fetching (steps 1-5)
2. **Blocks rendered via components** - `<HeroBlock data={hero} />`, `<TextBlock data={text} />`, etc.
3. Components handle fallbacks and styling internally
4. Page file becomes much cleaner and maintainable

## Key Patterns & Conventions

### Current Component Patterns
- **Existing Components**: `Hero.tsx`, `Features.tsx`, `Testimonials.tsx`, `Pricing.tsx`, `Footer.tsx` exist but aren't used in homepage
- **Server Components**: Default pattern (no "use client" unless interactivity needed)
- **ISR**: `export const revalidate = 60` in pages
- **Images**: `getFileUrl()` helper used for all images
- **Fallbacks**: Nullish coalescing (`??`) for CMS content defaults
- **Tailwind Only**: No custom CSS, pure Tailwind classes

### Data Fetching Patterns
- Page fetching: `getPageBySlug(slug)` → Single page
- Block fetching: `getPageBlocks(pageId)` → Array of PageBlock junction records
- Content fetching: `getBlockContent(collection, itemId)` → Generic function
- Type-specific fetching: `get[BlockName]Block(blockId)` → Typed functions
- Error handling: Try/catch with null returns, `logDirectusError()` for logging

### Block Architecture Patterns
- Block collections: `block_[name]` naming convention
- Junction table: `page_blocks` M2A relationship
- Block rendering: Currently `findBlock()` + inline JSX
- Block registration: All in Schema interface ✅
- Component naming: Should follow `[BlockName]Block.tsx` pattern (e.g., `TextBlock.tsx`, `ContactBlock.tsx`)

## Current Block Inventory & Component Status

### Blocks with Components ✅
1. `block_hero` - `components/Hero.tsx` exists (not used in homepage)
2. `block_features` - `components/Features.tsx` exists (not used in homepage)
3. `block_testimonials` - `components/Testimonials.tsx` exists (not used in homepage)
4. `block_pricing` - `components/Pricing.tsx` exists (not used in homepage)
5. `block_footer` - `components/Footer.tsx` exists (used in layout, not page)

### Blocks without Components ❌ (Rendered Inline)
1. `block_text` - **NEW from Phase 2** - No component, needs creation
2. `block_contact` - No component, rendered inline (lines 40, ~1400-1600 in app/page.tsx)
3. `block_about_us` - No component, rendered inline (line 32, ~200-400 in app/page.tsx)
4. `block_why_choose_us` - No component, rendered inline (line 33, ~400-700 in app/page.tsx)
5. `block_team` - No component, rendered inline (line 34, ~700-900 in app/page.tsx)
6. `block_signature_treatment` - No component, rendered inline (line 35, ~900-1100 in app/page.tsx)
7. `block_safety_banner` - No component, rendered inline (line 36, ~1100-1200 in app/page.tsx)
8. `block_services` - No component, rendered inline (line 37, ~1200-1300 in app/page.tsx)
9. `block_locations` - No component, rendered inline (line 38, ~1300-1400 in app/page.tsx)
10. `block_booking` - No component, rendered inline (line 39, ~1400+ in app/page.tsx)

### Template Core Blocks Status
- ✅ `block_hero` - Interface ✅, Fetch function ✅, Component exists ✅ (but inline rendering used)
- ✅ `block_text` - Interface ✅ (Phase 2), Fetch function ✅ (Phase 2), Component needed ❌
- ✅ `block_gallery` - Exists in Directus, needs verification
- ✅ `block_form` - Exists in Directus, needs verification
- ✅ `block_contact` - Interface ✅, Fetch function ✅, Component needed ❌

## Dependencies & Integration Points

### Directus Collections
- All 15 block collections exist and are typed
- `page_blocks` junction table functional
- Core template blocks verified

### Existing Components Reference
- `components/Hero.tsx` - Reference for component structure
- `components/Features.tsx` - Reference for list/feature patterns
- `components/Testimonials.tsx` - Reference for card/list patterns
- `components/Pricing.tsx` - Reference for grid layouts

### Documentation
- `reference/01_creating_directus_blocks.md` - Block creation guide
- `docs/migration-guide.md` - Migration status
- `docs/ARCHITECTURE.md` - System architecture

## Known Constraints

- **ISR**: Must include `export const revalidate = 60` in pages
- **Images**: Always use `getFileUrl(item.image)` helper
- **Server Components**: Default to RSC; only use `"use client"` for interactivity
- **Tailwind Only**: No custom CSS; use Tailwind classes exclusively
- **Fallbacks**: Always handle null/empty CMS responses with sensible defaults
- **Block Registration**: All blocks must be in Schema interface ✅
- **Component Props**: Components should accept block data as props with optional typing
- **Backward Compatibility**: Must not break existing inline rendering during migration

## Similar Implementations

### Example 1: Hero Component (Reference)
- File: `components/Hero.tsx`
- Pattern: Server component, accepts props, uses Tailwind, handles fallbacks
- Reusable patterns: Props interface, fallback values, Tailwind styling

### Example 2: Features Component (Reference)
- File: `components/Features.tsx`
- Pattern: List rendering, grid layouts, optional images
- Reusable patterns: Mapping over data, conditional rendering, image handling

### Example 3: Inline Block Rendering (Current Pattern)
- File: `app/page.tsx` (lines 28-1802)
- Pattern: `findBlock()` + inline JSX with fallbacks
- Migration target: Extract to components while maintaining same output

## Code Snippets (Key Patterns)

### Pattern: Existing Component Structure
```typescript
// From components/Hero.tsx (example reference)
import { getFileUrl } from "@/lib/directus";
import type { BlockHero } from "@/lib/types";

interface HeroProps {
  data?: BlockHero | null;
}

export default function Hero({ data }: HeroProps) {
  const badge = data?.badge_text ?? "Default Badge";
  const headline1 = data?.headline_line1 ?? "Default";
  // ... more fallbacks
  
  return (
    <section className="...">
      {/* Tailwind styling */}
    </section>
  );
}
```

### Pattern: Block Data Fetching (Already Complete)
```typescript
// From lib/data.ts (lines 378-392)
export async function getTextBlock(blockId: number): Promise<BlockText | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_text', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockText || null;
  } catch (error) {
    logDirectusError('getTextBlock', error);
    return null;
  }
}
```

### Pattern: Current Inline Rendering (To Replace)
```typescript
// From app/page.tsx (lines 28-100)
const findBlock = (collection: string) =>
  blocksWithContent.find((b) => b.collection === collection)?.content as any;

const hero = findBlock("block_hero");
const text = findBlock("block_text");
const contact = findBlock("block_contact");

// Inline JSX (100+ lines per block)
<section className="...">
  <h1>{hero?.headline_line1 ?? "Default"}</h1>
  {/* ... more inline JSX ... */}
</section>
```

### Pattern: Target Component-Based Rendering
```typescript
// Target pattern for app/page.tsx
import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import ContactBlock from "@/components/blocks/ContactBlock";

const findBlock = (collection: string) =>
  blocksWithContent.find((b) => b.collection === collection)?.content as any;

const hero = findBlock("block_hero");
const text = findBlock("block_text");
const contact = findBlock("block_contact");

return (
  <main>
    {hero && <HeroBlock data={hero} />}
    {text && <TextBlock data={text} />}
    {contact && <ContactBlock data={contact} />}
    {/* Clean, maintainable */}
  </main>
);
```

### Pattern: Server Component with ISR
```typescript
// From app/page.tsx (line 11)
export const revalidate = 60;

export default async function HomePage() {
  // ... data fetching ...
  return <main>...</main>;
}
```

### Pattern: Image Handling in Components
```typescript
// From existing components
import { getFileUrl } from "@/lib/directus";

const imageUrl = getFileUrl(item.image);
<img src={imageUrl ?? '/placeholder.jpg'} alt="..." />
```

## Questions to Resolve

- [ ] Should we create a `components/blocks/` directory for all block components?
- [ ] Should existing components (`Hero.tsx`, `Features.tsx`) be moved to `components/blocks/`?
- [ ] What naming convention for block components? `TextBlock.tsx` vs `BlockText.tsx`?
- [ ] Should components handle their own data fetching or receive data as props?
- [ ] How to handle blocks with O2M relationships (features, testimonials, pricing plans)?
- [ ] Should we create a generic `BlockRenderer` component that maps collection names to components?
- [ ] How to handle blocks that aren't found (null/undefined) - skip rendering or show placeholder?
- [ ] Should component prop interfaces match block interfaces exactly or be simplified?
- [ ] How to maintain backward compatibility during migration?
- [ ] Should we update existing components (`Hero.tsx`, etc.) to match new patterns or keep as-is?

## Research Notes

### Component Organization
- **Current**: Components in root `components/` directory
- **Option 1**: Create `components/blocks/` subdirectory for block components
- **Option 2**: Keep all components in root but prefix with `Block` (e.g., `BlockText.tsx`)
- **Recommendation**: Create `components/blocks/` for better organization

### Component Patterns to Establish
1. **Props Interface**: Should match block interface but with optional/nullable data
2. **Fallback Values**: Components should provide sensible defaults
3. **Styling**: Pure Tailwind, no custom CSS
4. **Image Handling**: Always use `getFileUrl()` helper
5. **Server Components**: Default unless interactivity needed

### Migration Strategy
1. **Create components** for missing blocks (`block_text`, `block_contact`, etc.)
2. **Extract inline rendering** from `app/page.tsx` to components
3. **Test each component** independently before full migration
4. **Update homepage** to use components gradually (block by block)
5. **Verify output** matches current inline rendering exactly

### Template Alignment Status
- ✅ **Schema**: All template blocks exist in TypeScript types
- ✅ **Fetching**: All template blocks have fetch functions
- ❌ **Components**: Missing components for `block_text` and `block_contact`
- ❌ **Patterns**: Need to establish reusable component patterns
- ❌ **Documentation**: Need to document component patterns

### Priority Blocks for Phase 3
1. **`block_text`** - Core template block, newly added in Phase 2, needs component
2. **`block_contact`** - Core template block, exists in types but no component
3. **Domain blocks** - Extract inline rendering to components for maintainability

## Files to Reference for Migration

**Component References:**
- `components/Hero.tsx` - Reference for component structure
- `components/Features.tsx` - Reference for list patterns
- `components/Testimonials.tsx` - Reference for card patterns

**Type Definitions:**
- `lib/types.ts` - All block interfaces (`BlockText`, `BlockContact`, etc.)
- `lib/data.ts` - All block fetch functions

**Current Implementation:**
- `app/page.tsx` - Inline block rendering (extract to components)

**Documentation:**
- `reference/01_creating_directus_blocks.md` - Block creation patterns
- `docs/ARCHITECTURE.md` - System architecture
- `docs/migration-guide.md` - Migration progress

