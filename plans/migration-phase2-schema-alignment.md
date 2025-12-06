# Feature: Migration Phase 2 - Schema Alignment

## Description
Align the block-based page builder schema with Directus Simple CMS template standards by adding missing core blocks (`block_text`, ensuring `block_contact` exists) while maintaining existing custom blocks for flexibility. This follows the Hybrid approach (Option 3) recommended in the migration guide.

## User Story
As a developer, I want the block schema to align with Directus Simple CMS template standards so that the system follows best practices while maintaining flexibility for domain-specific blocks.

## Current System Behavior
- **Block Architecture**: Pages composed of ordered blocks via `page_blocks` junction table (M2A relationship)
- **Block Fetching Pattern**: `getPageBySlug()` → `getPageBlocks()` → `getBlockContent()` → render with `findBlock()` helper
- **TypeScript Blocks**: 14 block types registered in Schema interface
- **Directus Blocks**: 10 block collections exist (some missing from TypeScript, some TypeScript blocks missing from Directus)
- **Template Alignment**: Missing `block_text` (template expects it), `block_contact` exists in TypeScript but may not exist in Directus
- **Rendering**: Homepage uses `findBlock(collection)` pattern to locate and render blocks inline

## Research Summary
**Key Findings:**
- Template expects 5 core blocks: `block_hero` ✅, `block_text` ❌, `block_gallery` ✅, `block_form` ✅, `block_contact` ⚠️
- Current system has `block_richtext` in Directus but not used in codebase
- `block_contact` interface exists in TypeScript with fetch function, but collection may not exist in Directus
- System uses generic `getBlockContent()` and dedicated `get[Name]Block()` functions
- All blocks must be registered in Schema interface for type safety

**Similar Implementations:**
- `BlockHero` interface (lines 51-62 in lib/types.ts) - Standard block pattern
- `getHeroBlock()` function (lines 91-105 in lib/data.ts) - Standard fetch pattern
- `findBlock("block_hero")` usage (line 31 in app/page.tsx) - Block location pattern

**Constraints:**
- ISR: Must include `export const revalidate = 60`
- Images: Always use `getFileUrl(item.image)` helper
- Server Components: Default to RSC
- Block Registration: All blocks must be in Schema interface
- Collection Naming: Must follow `block_[name]` convention

## Files to Modify/Create

### New Files
- None (all changes are modifications to existing files)

### Modified Files
- `lib/types.ts` - Add `BlockText` interface and register `block_text` in Schema (lines 1-27, add new interface after line 294)
- `lib/data.ts` - Add `getTextBlock()` function (add after line 375, following pattern from `getContactBlock()`)
- `docs/migration-guide.md` - Update Phase 2 status (lines 14-17)

## Step-by-Step Tasks

### Task 1: Add BlockText Interface to TypeScript Types
**File**: `lib/types.ts`
**Action**: Modify existing
**Lines**: Add interface after line 294 (after `BlockContact`), add to Schema at line 18

**Current Code** (lines 282-294):
```typescript
export interface BlockContact {
  id: number;
  title?: string;
  subtitle?: string;
  hq_title?: string;
  hq_address?: string;
  phone_title?: string;
  phone_text?: string;
  hours_title?: string;
  hours_text?: string;
  email_title?: string;
  email_text?: string;
}
```

**Proposed Change**:
```typescript
export interface BlockContact {
  id: number;
  title?: string;
  subtitle?: string;
  hq_title?: string;
  hq_address?: string;
  phone_title?: string;
  phone_text?: string;
  hours_title?: string;
  hours_text?: string;
  email_title?: string;
  email_text?: string;
}

export interface BlockText {
  id: number;
  title?: string;
  subtitle?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
}
```

**Current Code** (lines 1-27, Schema interface):
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  // ... rest of collections
}
```

**Proposed Change**:
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  block_text: BlockText[];  // Add this line
  // ... rest of collections
}
```

**Why**: Template expects `block_text` block. This interface matches Directus Simple CMS template structure for text blocks with optional title, subtitle, content, alignment, and background color.

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript compilation should pass without errors

---

### Task 2: Import BlockText Type in Data Fetching File
**File**: `lib/data.ts`
**Action**: Modify existing
**Lines**: Add to import statement at lines 8-24

**Current Code** (lines 8-24):
```typescript
import type { 
  Page, 
  BlockHero, 
  BlockFeatures, 
  BlockTestimonials, 
  BlockPricing, 
  BlockFooter,
  BlockAboutUs,
  BlockWhyChooseUs,
  BlockTeam,
  BlockSignatureTreatment,
  BlockSafetyBanner,
  BlockServices,
  BlockLocations,
  BlockBooking,
  BlockContact,
  PageFeature,
  PageTestimonial,
  PagePricingPlan,
  GlobalSettings,
  PageBlock,
  Service,
  ServiceCategory,
  NavigationItem,
  BlogPost,
  BlogCategory
} from './types';
```

**Proposed Change**:
```typescript
import type { 
  Page, 
  BlockHero, 
  BlockFeatures, 
  BlockTestimonials, 
  BlockPricing, 
  BlockFooter,
  BlockAboutUs,
  BlockWhyChooseUs,
  BlockTeam,
  BlockSignatureTreatment,
  BlockSafetyBanner,
  BlockServices,
  BlockLocations,
  BlockBooking,
  BlockContact,
  BlockText,  // Add this line
  PageFeature,
  PageTestimonial,
  PagePricingPlan,
  GlobalSettings,
  PageBlock,
  Service,
  ServiceCategory,
  NavigationItem,
  BlogPost,
  BlogCategory
} from './types';
```

**Why**: Need to import the new `BlockText` type to use it in the fetch function.

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript compilation should pass without errors

---

### Task 3: Add getTextBlock() Fetch Function
**File**: `lib/data.ts`
**Action**: Modify existing
**Lines**: Add after line 375 (after `getContactBlock()` function)

**Current Code** (lines 361-375):
```typescript
export async function getContactBlock(blockId: number): Promise<BlockContact | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_contact', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockContact || null;
  } catch (error) {
    logDirectusError('getContactBlock', error);
    return null;
  }
}
```

**Proposed Change**:
```typescript
export async function getContactBlock(blockId: number): Promise<BlockContact | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_contact', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockContact || null;
  } catch (error) {
    logDirectusError('getContactBlock', error);
    return null;
  }
}

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

**Why**: Follows the established pattern for block fetching functions. Provides type-safe access to `block_text` content. The generic `getBlockContent()` will also work, but this provides better type safety.

**Validation**: `npx tsc --noEmit`
**Test**: TypeScript compilation should pass. Function should be callable with proper typing.

---

### Task 4: Update Migration Guide Documentation
**File**: `docs/migration-guide.md`
**Action**: Modify existing
**Lines**: Update lines 14-17

**Current Code** (lines 14-17):
```markdown
### Phase 2: Schema Alignment
- [ ] Compare current schema to template
- [ ] Identify blocks to consolidate
- [ ] Plan migration strategy (incremental vs full)
```

**Proposed Change**:
```markdown
### Phase 2: Schema Alignment
- [x] Compare current schema to template
- [x] Identify blocks to consolidate
- [x] Plan migration strategy (Hybrid approach chosen)
- [x] Add `block_text` interface and fetch function
- [ ] Verify `block_contact` collection exists in Directus
- [ ] Test all blocks render correctly
```

**Why**: Document progress on Phase 2 migration. Shows what's been completed and what remains.

**Validation**: Documentation file updated
**Test**: Review migration guide to ensure status is accurate

---

## Directus Setup

### For block_text Collection:
**Collection name**: `block_text` (follows `block_[name]` naming convention)

**Fields to create**:
- `id` (Integer, Primary Key, Auto-increment) - System field
- `title` (String, Input) - Optional heading for the text block
- `subtitle` (String, Textarea) - Optional subtitle/description
- `content` (Text, WYSIWYG or Markdown) - Main text content
- `alignment` (String, Select Dropdown) - Options: `left`, `center`, `right` (default: `left`)
- `background_color` (String, Input) - Optional hex color code

**Permissions**: 
- Public role: Read access
- Admin role: Full CRUD access

**Collection Config**:
- Collection icon: `text_fields` (Material Icons)
- Note: "Text content block for page builder - aligns with Directus Simple CMS template"
- Not hidden (visible in navigation)

### For block_contact Collection (Verification):
**Action**: Verify collection exists in Directus
- If exists: Ensure it matches `BlockContact` interface structure
- If missing: Create collection with fields matching `BlockContact` interface:
  - `id` (Integer, Primary Key)
  - `title` (String, Input)
  - `subtitle` (String, Textarea)
  - `hq_title` (String, Input)
  - `hq_address` (String, Textarea)
  - `phone_title` (String, Input)
  - `phone_text` (String, Input)
  - `hours_title` (String, Input)
  - `hours_text` (String, Textarea)
  - `email_title` (String, Input)
  - `email_text` (String, Input)

**Permissions**: Same as `block_text`

## Testing Strategy

### Task 1: TypeScript Compilation
- [ ] Run `npx tsc --noEmit` - Should pass without errors
- [ ] Verify `BlockText` interface is properly exported
- [ ] Verify `block_text` is registered in Schema interface

### Task 2: Data Fetching Function
- [ ] Verify `getTextBlock()` function compiles
- [ ] Test function can be imported: `import { getTextBlock } from '@/lib/data'`
- [ ] Verify return type is `Promise<BlockText | null>`

### Task 3: Directus Collection
- [ ] Create `block_text` collection in Directus Admin
- [ ] Add all required fields with correct types
- [ ] Set public read permissions
- [ ] Create a test block with sample content
- [ ] Verify collection appears in navigation

### Task 4: Integration Testing
- [ ] Test `getTextBlock(blockId)` with valid block ID returns data
- [ ] Test `getTextBlock(blockId)` with invalid ID returns `null`
- [ ] Test `getBlockContent('block_text', itemId)` works generically
- [ ] Verify block can be added to page via `page_blocks` junction
- [ ] Test `findBlock('block_text')` pattern in page component

### Task 5: block_contact Verification
- [ ] Check if `block_contact` collection exists in Directus
- [ ] If missing, create collection with all fields from `BlockContact` interface
- [ ] Verify `getContactBlock()` function works with Directus collection
- [ ] Test block can be fetched and rendered

### Task 6: End-to-End Testing
- [ ] Create a test page in Directus
- [ ] Add `block_text` block to page via `page_blocks`
- [ ] Add `block_contact` block to page (if exists)
- [ ] Verify page renders correctly with both blocks
- [ ] Check browser console for errors
- [ ] Verify ISR revalidation works (`export const revalidate = 60`)

## Validation Commands
```bash
# TypeScript type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Run development server
npm run dev
```

## Acceptance Criteria
- [ ] `BlockText` interface added to `lib/types.ts` with all required fields
- [ ] `block_text` registered in Schema interface
- [ ] `getTextBlock()` function added to `lib/data.ts` following established pattern
- [ ] All TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] `block_text` collection created in Directus with correct fields
- [ ] `block_contact` collection verified/created in Directus
- [ ] Public read permissions set for both collections
- [ ] Test blocks can be created and fetched successfully
- [ ] Migration guide updated with Phase 2 progress
- [ ] No regressions in existing block functionality
- [ ] All validation commands pass

## Context Notes
- **Follow existing block pattern**: Use `BlockHero` and `getHeroBlock()` as reference for structure
- **Template alignment**: `block_text` matches Directus Simple CMS template structure
- **Hybrid approach**: Keep all existing custom blocks, only add missing template blocks
- **No breaking changes**: All changes are additive - existing blocks continue to work
- **Generic fetching**: `getBlockContent()` will automatically work with `block_text` once collection exists
- **Type safety**: New block must be in Schema interface for proper typing
- **ISR**: Pages using new blocks will automatically benefit from `export const revalidate = 60`
- **Image handling**: `block_text` doesn't use images, but if extended, use `getFileUrl()` helper

## Project-Specific Requirements
- ✅ ISR: Include `export const revalidate = 60` (already in pages)
- ✅ Images: Use `getFileUrl(item.image)` helper (not applicable for `block_text`)
- ✅ Server Components: Default to RSC (no client components needed)
- ✅ Tailwind Only: No custom CSS (when rendering blocks)
- ✅ Fallbacks: Handle null/empty responses (use `??` operator)
- ✅ Type Safety: Match Directus collection structure exactly
- ✅ Block Registration: Must add to Schema interface
- ✅ Collection Naming: Follow `block_[name]` convention
- ✅ Error Handling: Use `logDirectusError()` in fetch functions

## Next Steps (Post-Implementation)
1. **Create block inventory document** - Document all blocks and their usage
2. **Test block rendering** - Add `block_text` to a test page and verify rendering
3. **Consider block components** - Optionally create React components for `block_text` and `block_contact`
4. **Update documentation** - Add `block_text` to block creation guide
5. **Monitor usage** - Track which blocks are actually used in production pages

## Risk Assessment
- **Low Risk**: Adding new `block_text` block (additive change)
- **Low Risk**: Verifying `block_contact` exists (no code changes if exists)
- **No Breaking Changes**: All existing blocks continue to work
- **Rollback Plan**: Can remove `block_text` from Schema and Directus if needed

---
## Completion Status
- [x] All tasks completed
- [x] All validations passed
- [x] TypeScript compilation: ✅ Passed
- [x] Build check: ✅ Passed
- [x] Feature verified: Code changes complete, ready for Directus setup
- Completed: 2024-12-19

**Tasks Completed:**
1. ✅ Added `BlockText` interface to `lib/types.ts`
2. ✅ Registered `block_text` in Schema interface
3. ✅ Added `BlockText` import to `lib/data.ts`
4. ✅ Added `getTextBlock()` fetch function
5. ✅ Updated migration guide documentation

**Next Steps:**
- Create `block_text` collection in Directus Admin (see Directus Setup section)
- Verify `block_contact` collection exists in Directus
- Test block fetching and rendering
---

