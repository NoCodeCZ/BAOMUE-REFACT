# Plan 15: Create Portfolio Page

> **Status**: ✅ Completed  
> **Part of**: Phase 3 - Create/Update Pages  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: Plan 7 (PortfolioBlock), Plan 10 (StatsBlock)
> **Completed**: 2025-01-27

---

## Description

Create the `/our-work` page that displays portfolio cases with:
- Hero section (using block_hero)
- Statistics bar (using StatsBlock from Plan 10)
- Portfolio cases grid with category filtering (using PortfolioBlock from Plan 7)
- Optional CTA section

This page uses the block-based CMS approach, fetching blocks from Directus via the `pages` collection.

---

## User Story

As a website visitor, I want to view the clinic's portfolio of completed cases so that I can see real results and build trust in the clinic's services.

---

## Current System Behavior

No `/our-work` page exists. This is a completely new page route.

**Existing Patterns:**
- Homepage (`app/page.tsx`) uses block-based CMS approach with `getPageWithBlocks()`
- Services page (`app/services/page.tsx`) uses direct data fetching approach
- Portfolio page should use block-based approach for consistency with homepage

---

## Research Summary

From `our-work.html` analysis:
- **Hero Section**: Title "Our Work", subtitle, description (lines 108-123)
- **Stats Bar**: 4 statistics (500+ cases, 4.9 rating, 98% satisfaction, 15+ years) (lines 125-152)
- **Filter Section**: Category pills (all, invisalign, braces, veneer, whitening, implant, crown) (lines 154-193)
- **Cases Grid**: Portfolio cases with before/after sliders (lines 195-481)
- **CTA Section**: Call-to-action with buttons (lines 483-503)

**Block Structure:**
- Hero section → `block_hero` (can reuse existing)
- Stats bar → `block_stats` (from Plan 10)
- Portfolio cases → `block_portfolio` (from Plan 7)
- CTA section → Optional `block_hero` or simple section

---

## Files to Modify/Create

### New Files
- `app/our-work/page.tsx` - Portfolio page component

### Modified Files
- None (blocks are already registered in PageBuilder from Plans 7 and 10)

---

## Step-by-Step Tasks

### Task 1: Create Portfolio Page Component
**File**: `app/our-work/page.tsx`  
**Action**: Create new  
**Lines**: New file

**Proposed Change**:
```typescript
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
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

// SEO metadata
export const metadata: Metadata = {
  title: "ผลงานของเรา | BAOMUE Dental Clinic",
  description: "ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม พร้อมรายละเอียดขั้นตอนและระยะเวลาการรักษา",
  openGraph: {
    title: "ผลงานของเรา | BAOMUE Dental Clinic",
    description: "ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม",
    type: "website",
  },
};

export default async function OurWorkPage() {
  // Try optimized query first
  let result = await getPageWithBlocks("our-work");
  
  // Fallback to batched approach if nested query not supported
  if (!result) {
    result = await getPageWithBlocksBatched("our-work");
  }
  
  // Final fallback to original pattern (backward compatibility)
  if (!result) {
    const page = await getPageBySlug("our-work");
    if (!page) {
      notFound();
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

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder blocks={blocksWithContent} />
    </main>
  );
}
```

**Why**: Creates the portfolio page using the same block-based CMS pattern as the homepage. This allows content editors to manage the page structure in Directus. The page will automatically render blocks in the order configured in Directus.

**Validation**: `npx tsc --noEmit` - Check no type errors
**Test**: Verify page compiles without errors

---

## Directus Setup

### Create Page in Directus

1. **Collection**: `pages` (already exists)
2. **Create New Page**:
   - `slug`: `our-work`
   - `title`: `ผลงานของเรา` (Our Work)
   - `status`: `published`

3. **Add Blocks** (via `page_blocks` collection):
   - **Block 1**: `block_hero` - Hero section
     - Title: "Our Work"
     - Subtitle: "ผลงานที่ภาคภูมิใจ"
     - Description: "ผลงานจริงจากคนไข้ของเรา"
   - **Block 2**: `block_stats` - Statistics bar
     - Stats: `[{"value": "500+", "label": "เคสสำเร็จ"}, {"value": "4.9", "label": "คะแนนรีวิว", "icon": "star", "icon_color": "amber"}, {"value": "98%", "label": "ความพึงพอใจ"}, {"value": "15+", "label": "ปีประสบการณ์"}]`
     - Columns: 4
   - **Block 3**: `block_portfolio` - Portfolio cases grid
     - Configure portfolio block settings (from Plan 7)
   - **Block 4** (Optional): `block_hero` - CTA section
     - Title: "พร้อมเปลี่ยนรอยยิ้มของคุณหรือยัง?"
     - Description: "ปรึกษาทันตแพทย์ผู้เชี่ยวชาญของเราฟรี ไม่มีค่าใช้จ่าย"
     - CTA buttons configured

4. **Block Order** (set `sort` field in `page_blocks`):
   - Hero: `sort: 1`
   - Stats: `sort: 2`
   - Portfolio: `sort: 3`
   - CTA (optional): `sort: 4`

---

## Testing Strategy

### Functional Testing
1. Start dev server: `npm run dev`
2. Navigate to `/our-work`
3. Test functionality:
   - [ ] Page loads without errors
   - [ ] Hero section displays correctly
   - [ ] Stats block displays 4 statistics
   - [ ] Portfolio block displays cases grid
   - [ ] Category filters work (if PortfolioBlock implemented)
   - [ ] Before/after sliders work (if PortfolioBlock implemented)
   - [ ] CTA section displays (if added)
   - [ ] Page is responsive on mobile/tablet/desktop

### Visual Testing
- [ ] Hero section matches HTML design
- [ ] Stats bar matches HTML design (glass-card styling)
- [ ] Portfolio grid matches HTML design
- [ ] Filter pills match HTML design
- [ ] Case cards match HTML design
- [ ] CTA section matches HTML design (if added)
- [ ] Overall page layout matches `our-work.html`

### SEO Testing
- [ ] Page has correct metadata
- [ ] Title tag is correct
- [ ] Description tag is correct
- [ ] OpenGraph tags are correct
- [ ] Page is accessible (no console errors)

---

## Validation Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Dev server
npm run dev
```

---

## Acceptance Criteria

- [x] Page file created at `app/our-work/page.tsx`
- [x] Page uses block-based CMS approach
- [x] Page includes SEO metadata
- [x] Page uses `revalidate = 60` for ISR
- [x] Page handles missing page gracefully (notFound)
- [ ] Hero section displays (via block_hero) - *Requires Directus setup*
- [ ] Stats block displays (via block_stats) - *Requires Directus setup*
- [ ] Portfolio block displays (via block_portfolio) - *Requires Directus setup*
- [ ] Page is responsive - *Requires browser testing*
- [x] No TypeScript errors
- [x] No console errors (build-time)
- [x] Build passes
- [ ] Visual match with HTML design - *Requires browser testing and Directus data*

---

## Context Notes

- **Block-Based Approach**: This page uses the same pattern as homepage, allowing content editors to manage page structure in Directus
- **Dependencies**: Requires Plans 7 and 10 to be completed first (PortfolioBlock and StatsBlock)
- **Block Order**: Blocks are rendered in the order specified by the `sort` field in `page_blocks`
- **Optional CTA**: CTA section is optional - can be added as a second `block_hero` or a simple section
- **Error Handling**: Page uses `notFound()` if page doesn't exist in Directus
- **ISR**: Page uses `revalidate = 60` for incremental static regeneration

---

## Project-Specific Requirements

- ✅ ISR: Include `export const revalidate = 60`
- ✅ Server Components: Page is a Server Component
- ✅ Tailwind Only: All styling with Tailwind classes
- ✅ Fallbacks: Handle missing page with `notFound()`
- ✅ Type Safety: Uses typed interfaces from `lib/types`
- ✅ SEO: Includes metadata for search engines
- ✅ Block Pattern: Follows same pattern as homepage

---

## Alternative Approach (If Blocks Not Ready)

If PortfolioBlock and StatsBlock are not yet implemented, you can create a temporary version that directly fetches data:

```typescript
// Temporary approach - replace with block-based when blocks are ready
import Header from "@/components/Header";
import { getPortfolioCases, getPortfolioCategories } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ผลงานของเรา | BAOMUE Dental Clinic",
  description: "ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม",
};

export default async function OurWorkPage() {
  const [cases, categories] = await Promise.all([
    getPortfolioCases(),
    getPortfolioCategories(),
  ]);

  return (
    <main className="antialiased text-slate-600 bg-white">
      <Header />
      {/* Temporary direct rendering - replace with blocks later */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Work</h1>
        {/* Render cases directly */}
      </div>
    </main>
  );
}
```

**Note**: This is a temporary approach. Once Plans 7 and 10 are complete, switch to the block-based approach above.

---

## Next Steps

After completing this plan:
1. Test page with sample data in Directus
2. Verify all blocks render correctly
3. Test responsive behavior
4. Verify SEO metadata
5. Complete remaining Phase 3 plans (Plan 16: Contact Page)

---

## Related Plans

- **Plan 7**: Create PortfolioBlock (required dependency)
- **Plan 10**: Create StatsBlock (required dependency)
- **Plan 11**: Update Homepage (similar block-based pattern)
- **Plan 16**: Create Contact Page (next page to create)

---

## Review Status

- [x] Plan reviewed by: AI Assistant
- [x] Review date: 2025-01-27
- [x] Status: ✅ Approved

### Review Feedback

**Quality Assessment**: Excellent plan with clear structure and proper alignment with existing patterns.

**Findings**:
- ✅ Dependencies verified: PortfolioBlock and StatsBlock exist and are registered in PageBuilder (lines 41, 44)
- ✅ Pattern alignment: Matches homepage block-based CMS pattern exactly (app/page.tsx)
- ✅ Code structure: Uses correct fallback pattern (getPageWithBlocks → getPageWithBlocksBatched → manual)
- ✅ Error handling: Correctly uses `notFound()` from next/navigation (better than homepage's current div return)
- ✅ Project requirements: Includes ISR (`revalidate = 60`), SEO metadata, Server Component pattern
- ✅ Block registration: Blocks already registered in PageBuilder, no changes needed

**Minor Note**: The plan's error handling using `notFound()` is actually better than the current homepage implementation which returns a div. This is a good improvement.

### Approved Changes
- [x] Task 1: Create Portfolio Page Component at `app/our-work/page.tsx`

### Additional Notes
- No `our-work` directory exists, confirming this is a new route
- PageBuilder already has both block_portfolio and block_stats registered
- Plan correctly follows the three-tier fallback pattern for data fetching
- Metadata includes Thai language content which is appropriate for the project

### Questions Resolved
- ✅ Are dependencies (PortfolioBlock, StatsBlock) available? Yes, both exist
- ✅ Does the pattern match existing code? Yes, matches homepage pattern
- ✅ Is the error handling correct? Yes, uses `notFound()` correctly

**Ready for Execution**: ✅ All prerequisites met, plan is clear and correct.

---

## Completion Status

- [x] All tasks completed
- [x] All validations passed (TypeScript, Build)
- [ ] Feature tested in browser (requires Directus setup)
- Completed: 2025-01-27

### Implementation Summary

**File Created**: `app/our-work/page.tsx`

**Key Features Implemented**:
- ✅ Block-based CMS page using `getPageWithBlocks()` pattern
- ✅ Three-tier fallback system (optimized → batched → manual)
- ✅ Proper error handling with `notFound()`
- ✅ ISR configuration (`revalidate = 60`)
- ✅ SEO metadata with Thai language content
- ✅ Server Component pattern
- ✅ Follows homepage pattern exactly

**Validation Results**:
- ✅ TypeScript compilation: Passed (`npx tsc --noEmit`)
- ✅ Build: Passed (`npm run build`)
- ✅ Code matches plan exactly

**Next Steps**:
1. Set up page and blocks in Directus (see Directus Setup section)
2. Test page in browser with `npm run dev`
3. Verify blocks render correctly
4. Test responsive design

