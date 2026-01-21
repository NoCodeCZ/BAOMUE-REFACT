# Research: Migration Phase 2 - Schema Alignment

**Generated**: 2024-12-19
**Scope**: Schema alignment between current block structure and Directus Simple CMS template
**Complexity**: Medium

## System Overview

This Next.js 14 application uses Directus CMS with a block-based page builder architecture. Pages are composed of ordered blocks through a `page_blocks` junction table (M2A relationship). Currently, the system has 14 block types defined in TypeScript, but the actual Directus schema includes 10 block collections. The migration goal is to align the block structure with the Directus Simple CMS template, which uses 5 core blocks: `block_hero`, `block_text`, `block_gallery`, `block_form`, and `block_contact`.

The current implementation has extra blocks (like `block_button`, `block_button_group`, `block_gallery_items`, `block_pricing`, `block_pricing_cards`, `block_posts`, `block_richtext`) and is missing `block_text`. Block rendering follows a consistent pattern: pages fetch blocks via `getPageBlocks()`, then content via `getBlockContent()`, and render using a `findBlock()` helper pattern.

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` (lines 1-363) - Contains Schema interface with 14 block types registered: `block_hero`, `block_features`, `block_testimonials`, `block_pricing`, `block_footer`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`, `block_contact`. Also includes BlockHero, BlockFeatures, BlockTestimonials, BlockPricing, BlockFooter, and domain-specific block interfaces.
- `lib/data.ts` (lines 57-89) - Core block fetching functions: `getPageBySlug()`, `getPageBlocks()`, `getBlockContent()`. Individual block fetch functions for all 14 block types (lines 91-380). Each block has a dedicated function like `getHeroBlock()`, `getAboutUsBlock()`, etc.
- `lib/directus.ts` - Directus client setup with static token authentication, `getFileUrl()` helper for file assets.

### Component Layer
- `components/` - Various block components exist (Hero, Features, Testimonials, Pricing, Footer, etc.), but the homepage (`app/page.tsx`) renders blocks inline rather than using separate components for each block type.
- `app/page.tsx` (lines 13-1802) - Homepage implementation showing the block rendering pattern. Uses `findBlock(collection)` helper to locate blocks by collection name. Renders blocks directly in JSX with fallback values.

### Page Layer
- `app/page.tsx` (lines 28-40) - Demonstrates block finding pattern: `const findBlock = (collection: string) => blocksWithContent.find((b) => b.collection === collection)?.content as any;`. Then extracts each block: `const hero = findBlock("block_hero");`, `const about = findBlock("block_about_us");`, etc.
- `app/page.tsx` (line 11) - ISR configuration: `export const revalidate = 60;`

### Block Architecture
- Block collections in Directus (from snapshot.json): `block_button`, `block_button_group`, `block_form`, `block_gallery`, `block_gallery_items`, `block_hero`, `block_posts`, `block_pricing`, `block_pricing_cards`, `block_richtext`
- Block registration: All blocks must be added to Schema interface in `lib/types.ts` (lines 1-27)
- Junction table: `page_blocks` connects pages to blocks via M2A relationship
- Block rendering: `findBlock()` pattern in pages matches blocks by collection string

### Integration Points
- Directus collections structure: Documented in `docs/snapshot.json` (15,916 lines)
- Schema comparison script: `scripts/compare-schema-to-template.js` - Compares current blocks to template blocks
- Migration guide: `docs/migration-guide.md` - Documents Phase 1 completion and Phase 2 next steps

## Current Data Flow

**Block-Based Page Rendering:**
1. Page fetched via `getPageBySlug("home")` → Returns Page object with id
2. Page blocks fetched via `getPageBlocks(page.id)` → Returns array of PageBlock objects with `collection` and `item` fields
3. Block content fetched via `Promise.all(pageBlocks.map(block => getBlockContent(block.collection, block.item)))` → Returns full block data
4. Blocks stored in `blocksWithContent` array with structure: `{ collection, item, content }`
5. Blocks located using `findBlock(collection)` helper pattern
6. Blocks rendered directly in JSX with optional chaining and fallback values
7. Images handled via `getFileUrl()` helper

**Individual Block Fetching (Alternative Pattern):**
- Some blocks have dedicated fetch functions like `getHeroBlock(blockId)` that query directly
- These functions use `readItemsTyped(collection, { filter: { id: { _eq: blockId } } })`

## Key Patterns & Conventions

### TypeScript Patterns
- Block interfaces: Named `Block[Name]` in `lib/types.ts` (e.g., `BlockHero`, `BlockAboutUs`)
- Schema registration: All block collections must be in Schema interface as `block_[name]: Block[Name][]`
- Optional fields: Extensive use of `?` for optional properties (CMS content may be missing)
- Image fields: Typed as `string` (file ID), handled via `getFileUrl()` helper
- PageBlock interface: Contains `collection` (string), `item` (string ID), `sort` (number)

### Component Patterns
- Server Components by default (no "use client" in page.tsx)
- ISR: `export const revalidate = 60` in pages fetching data
- Fallbacks: Extensive use of nullish coalescing (`??`) for CMS content defaults
- Images: Always use `getFileUrl(item.image)` - never direct URLs
- Inline rendering: Homepage renders blocks directly in JSX rather than using separate components

### Data Fetching Patterns
- Page fetching: `getPageBySlug(slug)` → Returns single page
- Block fetching: `getPageBlocks(pageId)` → Returns array of PageBlock junction records
- Content fetching: `getBlockContent(collection, itemId)` → Generic function for any block type
- Dedicated functions: `get[BlockName]Block(blockId)` → Type-specific functions with proper typing
- Error handling: Try/catch with null returns, errors logged via `logDirectusError()`
- Directus queries: Use `readItemsTyped()` with filters and fields arrays

### Block Architecture Patterns
- Block collections: Named `block_[name]` in Directus
- Junction table: `page_blocks` uses M2A (many-to-any) to connect pages to any block type
- Block rendering: `findBlock(collection)` pattern matches blocks by collection string
- Block registration: Must add to Schema interface for type safety
- Collection naming: Lowercase with underscores (e.g., `block_hero`, `block_about_us`)

## Current Block Inventory

### Blocks in TypeScript (lib/types.ts)
1. `block_hero` - BlockHero interface (lines 51-62)
2. `block_features` - BlockFeatures interface (lines 64-68)
3. `block_testimonials` - BlockTestimonials interface (lines 70-74)
4. `block_pricing` - BlockPricing interface (lines 76-80)
5. `block_footer` - BlockFooter interface (lines 82-95)
6. `block_about_us` - BlockAboutUs interface (lines 181-189)
7. `block_why_choose_us` - BlockWhyChooseUs interface (lines 191-203)
8. `block_team` - BlockTeam interface (lines 205-216)
9. `block_signature_treatment` - BlockSignatureTreatment interface (lines 218-236)
10. `block_safety_banner` - BlockSafetyBanner interface (lines 238-245)
11. `block_services` - BlockServices interface (lines 247-255)
12. `block_locations` - BlockLocations interface (lines 257-268)
13. `block_booking` - BlockBooking interface (lines 270-280)
14. `block_contact` - BlockContact interface (lines 282-294)

### Blocks in Directus (from snapshot.json)
1. `block_button` - Hidden collection, grouped under `block_button_group`
2. `block_button_group` - Button groups
3. `block_form` - Form blocks
4. `block_gallery` - Gallery blocks
5. `block_gallery_items` - Gallery items (O2M relationship)
6. `block_hero` - Hero blocks ✅
7. `block_posts` - Blog post blocks
8. `block_pricing` - Pricing blocks ✅
9. `block_pricing_cards` - Pricing card items (O2M relationship)
10. `block_richtext` - Rich text blocks

### Template Blocks (from compare-schema-to-template.js)
1. `block_hero` ✅ (exists)
2. `block_text` ❌ (missing)
3. `block_gallery` ✅ (exists)
4. `block_form` ✅ (exists)
5. `block_contact` ✅ (exists in types, but not in snapshot.json as collection)

### Gap Analysis
- **Extra blocks (not in template)**: `block_button`, `block_button_group`, `block_gallery_items`, `block_posts`, `block_pricing_cards`, `block_richtext`, plus 9 domain-specific blocks (`block_features`, `block_testimonials`, `block_footer`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`)
- **Missing blocks (in template)**: `block_text`
- **Mismatch**: `block_contact` exists in TypeScript but not as Directus collection (or hidden in snapshot)

## Dependencies & Integration Points

### Directus Collections
- `pages` - Main page collection
- `page_blocks` - Junction table (M2A) connecting pages to blocks
- `block_*` - Individual block collections (10 in Directus, 14 in TypeScript)
- `services`, `service_categories` - Domain collections
- `blog_posts`, `blog_categories` - Blog collections
- `navigation` - Navigation items
- `global_settings` - Singleton settings

### Scripts & Tools
- `scripts/compare-schema-to-template.js` - Compares current schema to template
- `scripts/apply-collection-configs.js` - Applies collection configurations
- `docs/snapshot.json` - Full Directus schema snapshot (15,916 lines)

## Known Constraints

- **ISR**: Must include `export const revalidate = 60` in pages/components fetching data
- **Images**: Always use `getFileUrl(item.image)` helper, never direct URLs
- **Server Components**: Default to RSC; only use `"use client"` for interactivity
- **Tailwind Only**: No custom CSS; use Tailwind classes exclusively
- **Fallbacks**: Always handle null/empty CMS responses with sensible defaults
- **Block Registration**: New blocks must be added to Schema interface in `lib/types.ts`
- **Block Collections**: Must follow `block_[name]` naming convention
- **Type Safety**: All Directus collections must have TypeScript interfaces
- **Junction Table**: `page_blocks` uses M2A, so blocks can be from any collection
- **Block Fetching**: Two patterns exist - generic `getBlockContent()` and dedicated `get[Name]Block()` functions

## Similar Implementations

### Example 1: Block Rendering Pattern
- File: `app/page.tsx` (lines 28-40)
- Pattern: `findBlock()` helper to locate blocks by collection name
- Reusable patterns: Block extraction pattern, fallback value handling

### Example 2: Block Data Fetching
- Files: `lib/data.ts` (lines 57-89)
- Pattern: `getPageBlocks()` → `getBlockContent()` → render
- Reusable patterns: Generic block fetching, error handling with try/catch

### Example 3: Individual Block Function
- Files: `lib/data.ts` (lines 91-380)
- Pattern: Dedicated function per block type with typed return
- Reusable patterns: Type-specific fetching, consistent error handling

## Code Snippets (Key Patterns)

### Pattern: Block Data Fetching
```typescript
// From lib/data.ts (lines 57-89)
export async function getPageBlocks(pageId: number) {
  try {
    const blocks = await directus.request(
      readItemsTyped('page_blocks', {
        filter: { page: { _eq: pageId } },
        fields: ['*'],
        sort: ['sort'],
      })
    );
    return blocks || [];
  } catch (error) {
    logDirectusError('getPageBlocks', error);
    return [];
  }
}

export async function getBlockContent(collection: string, itemId: string) {
  try {
    const result = await directus.request(
      readItemsTyped(collection as any, {
        filter: { id: { _eq: parseInt(itemId) } },
        fields: ['*'],
        limit: 1,
      })
    );
    return result?.[0] || null;
  } catch (error) {
    logDirectusError(`getBlockContent(${collection})`, error);
    return null;
  }
}
```

### Pattern: Block Rendering in Pages
```typescript
// From app/page.tsx (lines 14-40)
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
const about = findBlock("block_about_us");
// ... more blocks
```

### Pattern: Server Component with ISR
```typescript
// From app/page.tsx (line 11)
export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");
  // ... render blocks
}
```

### Pattern: Image Handling
```typescript
// From app/page.tsx (lines 236, 1049)
import { getFileUrl } from "@/lib/directus";

const imageUrl = getFileUrl(about?.image_url as any);
<img src={imageUrl ?? '/placeholder.jpg'} alt="..." />
```

### Pattern: Block Interface Definition
```typescript
// From lib/types.ts (example: BlockHero, lines 51-62)
export interface BlockHero {
  id: number;
  badge_text?: string;
  headline_line1?: string;
  headline_line2?: string;
  description?: string;
  primary_cta_text?: string;
  primary_cta_link?: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  background_image?: string;
}
```

## Questions to Resolve

- [ ] Are all 14 TypeScript block interfaces actually used in the codebase?
- [ ] Which blocks from Directus snapshot are actively used in pages?
- [ ] Should `block_richtext` be renamed to `block_text` to match template?
- [ ] Should `block_contact` collection be created in Directus (it exists in types but not snapshot)?
- [ ] Can `block_button` and `block_button_group` be consolidated into parent blocks?
- [ ] Should `block_gallery_items` be merged into `block_gallery` as nested JSON?
- [ ] Should `block_pricing_cards` be merged into `block_pricing` as nested JSON?
- [ ] Is `block_posts` needed, or should blog posts be queried directly from `blog_posts`?
- [ ] Which blocks are domain-specific (dental clinic) vs generic (could be in template)?
- [ ] What's the migration strategy - incremental or full consolidation?

## Research Notes

### Block Naming Inconsistencies
- TypeScript has `block_contact` interface but Directus snapshot doesn't show `block_contact` collection
- Directus has `block_richtext` but template expects `block_text`
- Multiple button-related blocks (`block_button`, `block_button_group`) when template likely embeds buttons in hero/form blocks

### Current vs Template Differences
- **Current approach**: 14 block types, many domain-specific (dental clinic focused)
- **Template approach**: 5 generic blocks (hero, text, gallery, form, contact)
- **Gap**: Current system is more flexible but less aligned with template standards

### Migration Considerations
- **Low risk**: Adding `block_text` (if `block_richtext` renamed or new block created)
- **Medium risk**: Consolidating button blocks (requires data migration)
- **High risk**: Removing domain-specific blocks (may break existing pages)
- **Hybrid approach recommended**: Keep domain blocks, align core blocks with template

### Next Steps (From migration-phase2-next-steps.md)
1. Review current block usage in Directus `page_blocks` collection
2. Decide on alignment approach (Minimal/Hybrid/Full)
3. Create block inventory document
4. Plan data migration if consolidating blocks
5. Add missing `block_text` block
6. Update TypeScript types and data fetching functions

## Files to Reference for Migration

**Schema Files:**
- `lib/types.ts` - All block interfaces and Schema registration
- `docs/snapshot.json` - Full Directus schema (collections, fields, relationships)
- `scripts/compare-schema-to-template.js` - Schema comparison tool

**Migration Documentation:**
- `docs/migration-phase2-next-steps.md` - Migration options and recommendations
- `docs/migration-guide.md` - Overall migration guide

**Implementation Files:**
- `lib/data.ts` - Block fetching functions (add/modify as needed)
- `app/page.tsx` - Block rendering pattern (update if block names change)

