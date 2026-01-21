# Plan 11: Update Homepage

> **Status**: Ready for Implementation  
> **Part of**: Phase 3 - Create/Update Pages  
> **Estimated Time**: 1 hour  
> **Dependencies**: Plans 1-5 (styling updates should be done first, but not required)

---

## Description

Verify and update the homepage (`app/page.tsx`) to ensure all blocks are rendered in the correct order matching the HTML design. The homepage already uses `PageBuilder` component which dynamically renders blocks based on their sort order from Directus. This plan focuses on verifying the block order configuration in Directus and ensuring the page structure matches the HTML design.

---

## User Story

As a website visitor, I want to see homepage content in the correct order (Hero → About → Why Choose Us → Team → Services → Contact → Footer) so that the page flow makes sense and matches the design.

---

## Current System Behavior

The homepage (`app/page.tsx`) currently:
- Uses `getPageWithBlocks("home")` to fetch page with all blocks in optimized query
- Falls back to `getPageWithBlocksBatched("home")` if optimized query fails
- Falls back to original pattern (`getPageBySlug` → `getPageBlocks` → `getBlockContent`) for backward compatibility
- Passes blocks to `PageBuilder` component which:
  - Filters out hidden blocks (`hide_block === true`)
  - Filters out blocks with null content
  - Sorts blocks by `sort` field (ascending order)
  - Maps block collection names to React components
  - Handles special props (locations for ContactBlock, formData for FormBlock)

**Current Block Rendering Pattern:**
```16:72:app/page.tsx
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
      pageBlocks.map(async (block: { id: number; page: number; collection: string; item: string; sort: number; hide_block?: boolean }) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];
    
    result = { page, blocks: blocksWithContent };
  }

  const { page, blocks: blocksWithContent } = result;

  // Extract locations for ContactBlock special case
  const locations = blocksWithContent.find(b => b.collection === 'block_locations')?.content as BlockLocations | null;

  // Fetch form data for any block_form blocks
  const formDataMap: Record<number, Form | null> = {};
  const formBlocks = blocksWithContent.filter(b => b.collection === 'block_form');
  await Promise.all(
    formBlocks.map(async (block) => {
      if (block.content && 'form' in block.content && block.content.form) {
        const formData = await getFormById(block.content.form as number);
        formDataMap[block.id] = formData;
      }
    })
  );

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder 
        blocks={blocksWithContent} 
        additionalProps={{ 
          locations,
          formDataMap
        }}
      />
    </main>
  );
}
```

**PageBuilder Sorting Logic:**
```50:54:components/PageBuilder.tsx
  // Filter out hidden blocks and sort by sort order
  const visibleBlocks = blocks
    .filter(block => !block.hide_block && block.content !== null)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));
```

---

## Research Summary

From `docs/research/html-to-directus-conversion.md` and HTML file analysis:

**Expected Block Order (from index.html):**
1. Hero section (line 45-107) → `block_hero`
2. About Us section (line 109-141) → `block_about_us`
3. Why Choose Us section (line 143-205) → `block_why_choose_us`
4. Dentist Team section (line 206+) → `block_team`
5. Signature Treatment section (line 500+) → `block_signature_treatment` (if exists)
6. Safety Protocols Banner (line 614+) → `block_safety_banner`
7. Services Grid section (line 649+) → `block_services`
8. Locations section (line 860+) → `block_locations` (may be needed for ContactBlock)
9. Booking Form section (line 933+) → `block_booking`
10. Map & Contact section (line 1050+) → `block_contact`
11. Footer (line 1111+) → `block_footer`

**Key Findings:**
- Homepage already uses correct architecture (`PageBuilder` component)
- Block order is controlled by `sort` field in `page_blocks` collection
- No code changes needed - only Directus data verification/update required
- Page structure (Header + PageBuilder) is correct

---

## Files to Modify/Create

### Modified Files
- None - Code is already correct!

### Directus Configuration
- Verify/Update `page_blocks` collection entries for homepage (page_id: 2)
- Ensure `sort` values are sequential and match expected order

---

## Step-by-Step Tasks

### Task 1: Verify Current Block Order in Directus
**File**: Directus CMS (not code)  
**Action**: Check existing data

**Steps to Verify:**
1. Log into Directus admin panel
2. Navigate to `page_blocks` collection
3. Filter by `page: 2` (homepage)
4. Check current `sort` values for each block
5. Document current order vs expected order

**Expected Order (with sort values):**
| Block Collection | Expected Sort | Notes |
|-----------------|---------------|-------|
| `block_hero` | 1 | Hero section |
| `block_about_us` | 2 | About Us section |
| `block_why_choose_us` | 3 | Why Choose Us section |
| `block_team` | 4 | Dentist Team section |
| `block_signature_treatment` | 5 | Signature Treatment (optional) |
| `block_safety_banner` | 6 | Safety Protocols Banner |
| `block_services` | 7 | Services Grid section |
| `block_locations` | 8 | Locations (needed for ContactBlock) |
| `block_booking` | 9 | Booking Form section |
| `block_contact` | 10 | Map & Contact section |
| `block_footer` | 11 | Footer |

**Validation**: `npm run dev` - Navigate to homepage, visually verify block order  
**Test**: Compare rendered page with HTML design structure

---

### Task 2: Update Block Sort Order in Directus (if needed)
**File**: Directus CMS (not code)  
**Action**: Update sort values in `page_blocks` collection

**Steps to Update:**
1. If current sort values don't match expected order:
   - Open each `page_blocks` entry for homepage (page_id: 2)
   - Update `sort` field to match expected order from Task 1
   - Save changes

2. If any blocks are missing:
   - Verify block item exists in respective collection
   - Create `page_blocks` junction entry linking block to homepage
   - Set appropriate `sort` value
   - Ensure `hide_block` is `false`

3. If any blocks should be hidden:
   - Set `hide_block: true` for blocks not needed on homepage
   - Keep sort value for reference (won't affect rendering)

**Validation**: `npm run dev` - Navigate to homepage, verify blocks render in correct order  
**Test**: Scroll through homepage, verify each section appears in expected sequence

---

### Task 3: Verify Block Components Are Registered
**File**: `components/PageBuilder.tsx`  
**Action**: Verify (no changes needed)

**Current Code**:
```17:35:components/PageBuilder.tsx
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
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
  block_footer: Footer as ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>,
  block_features: () => null, // Placeholder - create component if needed
  block_testimonials: () => null, // Placeholder - create component if needed
  block_pricing: () => null, // Placeholder - create component if needed
};
```

**Verification Checklist:**
- ✅ All required blocks are registered in `componentMap`
- ✅ No missing components for homepage blocks
- ✅ Special props handling exists for `ContactBlock` (locations) and `FormBlock` (formData)

**Why**: All homepage blocks are already registered. No changes needed.

**Validation**: `npx tsc --noEmit` - Should pass (no TypeScript errors)  
**Test**: Verify no console warnings about missing components

---

### Task 4: Verify Page Structure Matches HTML Design
**File**: `app/page.tsx`  
**Action**: Verify (no changes needed)

**Current Structure**:
```61:72:app/page.tsx
  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder 
        blocks={blocksWithContent} 
        additionalProps={{ 
          locations,
          formDataMap
        }}
      />
    </main>
  );
```

**Verification Checklist:**
- ✅ `Header` component renders before blocks (matches HTML)
- ✅ `PageBuilder` renders all blocks in sort order
- ✅ Main wrapper has correct classes (matches HTML body classes)
- ✅ ISR configured: `export const revalidate = 60`

**Why**: Page structure already matches HTML design (Header + Blocks). No changes needed.

**Validation**: `npm run build` - Should pass without errors  
**Test**: Visual comparison - homepage structure should match HTML file

---

## Directus Setup

### Collections Involved
- `pages` - Homepage entry (slug: "home", id: 2)
- `page_blocks` - Junction table connecting blocks to homepage
- All block collections (`block_hero`, `block_about_us`, etc.) - Block content

### Data Verification Checklist
- [ ] Homepage page entry exists (slug: "home", status: "published")
- [ ] All required `page_blocks` entries exist for homepage
- [ ] Block sort values are sequential (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
- [ ] No duplicate sort values for homepage blocks
- [ ] All block items exist in respective collections
- [ ] `hide_block` is `false` for all homepage blocks (unless intentionally hidden)
- [ ] `block_locations` exists (required for ContactBlock props)

### Sample Query to Verify
```javascript
// In Directus, verify homepage blocks are in correct order:
// Filter: { page: { _eq: 2 } }
// Sort: sort
// Expected result: blocks ordered 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
```

---

## Testing Strategy

### Task 1-2: Directus Data Verification
- [ ] Log into Directus admin
- [ ] Query `page_blocks` filtered by `page: 2`
- [ ] Verify sort values match expected order
- [ ] Document any discrepancies

### Task 3-4: Code Verification
- [ ] Verify all blocks registered in `PageBuilder.tsx`
- [ ] Check page structure matches HTML
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run build: `npm run build`

### Integration Testing
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to homepage (`/`)
- [ ] Scroll through page, verify sections appear in order:
  1. Hero section
  2. About Us section
  3. Why Choose Us section
  4. Team section
  5. Signature Treatment section (if exists)
  6. Safety Banner section
  7. Services section
  8. Booking section (if exists)
  9. Contact section
  10. Footer
- [ ] Check browser console for errors/warnings
- [ ] Verify no missing components warnings
- [ ] Compare visual layout with HTML design file

### Visual Comparison
- [ ] Open HTML file: `/Downloads/site-files (2)/index.html`
- [ ] Open rendered homepage in browser
- [ ] Compare section order side-by-side
- [ ] Verify all sections are present
- [ ] Note any missing sections

---

## Validation Commands

```bash
# TypeScript check
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Dev server (for visual testing)
npm run dev
```

---

## Acceptance Criteria

- [ ] All homepage blocks render in correct order (matching HTML design)
- [ ] No console errors or warnings about missing components
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] Build passes (`npm run build`)
- [ ] Homepage structure matches HTML file (Header + Blocks + Footer)
- [ ] All sections from HTML design are present on rendered page
- [ ] Block sort order in Directus matches expected order (1-11)
- [ ] No duplicate sort values for homepage blocks
- [ ] Special props (locations, formData) are passed correctly to blocks

---

## Context Notes

### Important Notes for Implementer

1. **No Code Changes Required**: The homepage code (`app/page.tsx`) is already correct. This plan focuses on Directus data configuration.

2. **Sort Order Controls Rendering**: The `PageBuilder` component automatically sorts blocks by the `sort` field from the `page_blocks` collection. Changing sort values in Directus will immediately affect the rendered order.

3. **Block Registration**: All required blocks are already registered in `PageBuilder.tsx`. No new component registrations needed.

4. **Optional Blocks**: Some blocks may be optional:
   - `block_signature_treatment` - May not exist in HTML design
   - `block_booking` - May be combined with contact section
   - Verify against HTML design to confirm which blocks are needed

5. **Special Props**: 
   - `ContactBlock` requires `locations` prop (extracted from `block_locations` block)
   - `FormBlock` requires `formData` prop (fetched via `getFormById`)
   - These are already handled correctly in `app/page.tsx`

6. **ISR Configuration**: Page already has `export const revalidate = 60` configured correctly.

7. **Fallback Handling**: The page uses a three-tier fallback pattern for data fetching. This is already implemented correctly and provides good error resilience.

### Directus Navigation Path
1. Login to Directus admin panel
2. Navigate to: `Content` → `page_blocks` collection
3. Filter: `page` equals `2` (homepage)
4. Sort by: `sort` (ascending)
5. Review/update `sort` field for each block

### Common Issues to Watch For
- **Missing blocks**: If a block doesn't render, check:
  - Block item exists in collection
  - `page_blocks` junction entry exists
  - `hide_block` is `false`
  - Block is registered in `PageBuilder.tsx`
  
- **Wrong order**: Check `sort` values in `page_blocks` collection
- **Duplicate sort values**: May cause unpredictable ordering
- **Hidden blocks**: Check `hide_block` field is `false` for homepage blocks

---

## Project-Specific Requirements

- ✅ ISR: `export const revalidate = 60` (already configured)
- ✅ Images: Uses `getFileUrl()` helper (handled in block components)
- ✅ Server Components: Page is Server Component (correct)
- ✅ Tailwind Only: All styling via Tailwind (handled in block components)
- ✅ Fallbacks: Graceful handling of missing blocks (filtered out by PageBuilder)
- ✅ Type Safety: Uses TypeScript interfaces from `lib/types.ts` (already configured)

---

## Next Steps After Completion

After verifying/updating homepage block order:

1. **Visual Testing**: Compare rendered page with HTML design file
2. **Complete Phase 1 Plans**: Ensure Plans 1-5 (styling updates) are completed for visual accuracy
3. **Move to Next Plan**: Proceed to Plan 12 (Services Pages) or continue with other Phase 3 plans

---

## References

- Master Plan: `plans/html-conversion-master-plan.md`
- Research Document: `docs/research/html-to-directus-conversion.md`
- PageBuilder Component: `components/PageBuilder.tsx`
- Homepage Implementation: `app/page.tsx`
- Reference Guide: `reference/02_adding_new_pages.md`
- Architecture: `docs/ARCHITECTURE.md`

---

## ✅ Completion Status

**Completed**: 2024-12-28

### Code Verification Tasks (Completed)

- [x] **Task 3**: Verify Block Components Are Registered
  - ✅ All 11 required homepage blocks are registered in `PageBuilder.tsx`
  - ✅ All blocks verified: `block_hero`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`, `block_contact`, `block_footer`
  - ✅ Special props handling verified for `ContactBlock` (locations) and `FormBlock` (formData)
  - ✅ TypeScript check passed: `npx tsc --noEmit`

- [x] **Task 4**: Verify Page Structure Matches HTML Design
  - ✅ Page structure verified: `<Header />` + `<PageBuilder />` (matches HTML)
  - ✅ Main wrapper classes verified: `antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900`
  - ✅ ISR configuration verified: `export const revalidate = 60`
  - ✅ Build check passed: `npm run build`

### Directus Data Verification Tasks (Requires Manual Action)

- [ ] **Task 1**: Verify Current Block Order in Directus
  - ⚠️ **Action Required**: Manual verification in Directus admin panel
  - 📝 **Steps**: See "Directus Manual Steps" section below

- [ ] **Task 2**: Update Block Sort Order in Directus (if needed)
  - ⚠️ **Action Required**: Update `sort` values in Directus if current order doesn't match expected order
  - 📝 **Expected Order**: See "Directus Manual Steps" section below

### Validation Results

- ✅ TypeScript compilation: PASSED (`npx tsc --noEmit`)
- ✅ Build check: PASSED (`npm run build`)
- ⚠️ ESLint: Not configured (skipped)
- ✅ No linter errors found in `app/page.tsx` and `components/PageBuilder.tsx`

### Directus Manual Steps

**To complete this plan, verify/update the following in Directus:**

1. **Login to Directus Admin Panel**
   - Navigate to: `Content` → `page_blocks` collection

2. **Filter Homepage Blocks**
   - Filter: `page` equals page with slug "home" (or page ID 2)
   - Sort by: `sort` (ascending)

3. **Verify/Update Sort Values**
   - Expected block order with sort values:
     | Block Collection | Expected Sort | Status |
     |-----------------|---------------|--------|
     | `block_hero` | 1 | [ ] Verify |
     | `block_about_us` | 2 | [ ] Verify |
     | `block_why_choose_us` | 3 | [ ] Verify |
     | `block_team` | 4 | [ ] Verify |
     | `block_signature_treatment` | 5 | [ ] Verify (optional) |
     | `block_safety_banner` | 6 | [ ] Verify |
     | `block_services` | 7 | [ ] Verify |
     | `block_locations` | 8 | [ ] Verify |
     | `block_booking` | 9 | [ ] Verify |
     | `block_contact` | 10 | [ ] Verify |
     | `block_footer` | 11 | [ ] Verify |

4. **Check Configuration**
   - Ensure `hide_block` is `false` for all homepage blocks
   - Verify no duplicate sort values
   - Verify all block items exist in their respective collections

5. **Test After Updates**
   - Run `npm run dev`
   - Navigate to homepage (`/`)
   - Verify blocks render in correct order
   - Compare with HTML design file

### Notes

- All code is correct - no changes needed
- The homepage already uses the correct architecture
- Block order is controlled by Directus `sort` values, not code
- PageBuilder automatically sorts blocks by `sort` field
