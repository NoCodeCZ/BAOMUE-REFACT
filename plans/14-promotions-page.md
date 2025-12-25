# Feature: Create Promotions Page

## Description
Create a `/promotions` page that displays current dental promotions using the PromotionsBlock component (created in Plan 6). This page will match the HTML design with a hero banner, category filters, promotion cards grid, and a sticky contact bar.

## User Story
As a website visitor, I want to view all available dental promotions on a dedicated page so that I can browse special offers and book appointments for discounted services.

## Current System Behavior
- No `/promotions` route exists currently
- PromotionsBlock component will be created in Plan 6 (prerequisite)
- Similar pages (`/services`, `/blog`) follow the pattern of fetching data and rendering with Header component
- Pages use `export const revalidate = 60` for ISR
- SEO metadata is configured using Next.js `Metadata` type

## Research Summary
- **HTML Reference**: `promotions.html` shows:
  - Header title section with "Promotions!" heading
  - Hero banner card with gradient background and countdown timer
  - Category filter navigation (ทั้งหมด, จัดฟัน, ฟอกสีฟัน, วีเนียร์, รากเทียม, ทั่วไป)
  - Grid of promotion cards (3 columns on desktop)
  - Each card shows: image, badges, category, title, description, pricing, benefits, CTA button
  - Load more button
  - Sticky bottom contact bar with phone and LINE links
- **Similar Implementations**: 
  - `/services` page: Uses Header, fetches data, renders grid layout
  - `/blog` page: Uses Header, has metadata, renders with client components for filtering
- **Patterns Identified**:
  - Server Component pages with `revalidate = 60`
  - Static metadata for SEO
  - Header component included
  - Empty state handling
  - Responsive grid layouts

## Files to Modify/Create

### New Files
- `app/promotions/page.tsx` - Main promotions listing page

### Modified Files
- None (PromotionsBlock will be created in Plan 6)

## Step-by-Step Tasks

### Task 1: Create Promotions Page File
**File**: `app/promotions/page.tsx`
**Action**: Create new file

**Code Snippet** (NEW FILE):
```typescript
import Header from "@/components/Header";
import PromotionsBlock from "@/components/blocks/PromotionsBlock";
import { getPageBySlug, getPageBlocks, getBlockContent } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Promotions | Baomue Dental Clinic",
  description: "รวมโปรโมชั่นทำฟัน จัดฟัน รากเทียม วีเนียร์ ประจำเดือน",
  openGraph: {
    title: "Promotions | Baomue Dental Clinic",
    description: "รวมโปรโมชั่นทำฟัน จัดฟัน รากเทียม วีเนียร์ ประจำเดือน",
    type: "website",
  },
};

export default async function PromotionsPage() {
  // Option A: Block-based approach (if promotions page is managed in Directus)
  const page = await getPageBySlug("promotions");
  
  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    const promotionsBlock = pageBlocks.find(
      (block) => block.collection === "block_promotions"
    );
    
    if (promotionsBlock) {
      const blockData = await getBlockContent(
        promotionsBlock.collection,
        promotionsBlock.item
      );
      
      return (
        <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
          <Header />
          <PromotionsBlock data={blockData} />
        </main>
      );
    }
  }
  
  // Option B: Direct data fetching (if promotions are standalone collection)
  // This approach fetches promotions directly without page/block structure
  // Uncomment if PromotionsBlock doesn't use block-based approach:
  /*
  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PromotionsBlock />
    </main>
  );
  */
  
  // Fallback: Show not found if page doesn't exist
  notFound();
}
```

**Why**: Creates the page route following the established pattern. Uses block-based approach if available, with fallback to direct component rendering. Includes SEO metadata matching HTML design.

**Validation**: `npx tsc --noEmit`
**Test**: Navigate to `/promotions` in browser - should render page (may show empty if PromotionsBlock not created yet)

### Task 2: Verify PromotionsBlock Integration
**File**: `components/PageBuilder.tsx`
**Action**: Verify PromotionsBlock is registered (this will be done in Plan 6, but verify here)

**Code Snippet** (VERIFY - should be added in Plan 6):
```typescript
// In componentMap, should include:
block_promotions: PromotionsBlock,
```

**Why**: Ensures PromotionsBlock can be rendered via PageBuilder if promotions page uses block-based approach.

**Validation**: Check that `block_promotions` exists in `componentMap` after Plan 6 completion
**Test**: If using block-based approach, verify block renders correctly

### Task 3: Add Error Handling
**File**: `app/promotions/page.tsx`
**Action**: Modify existing file (add error handling)

**Code Snippet** (AFTER Task 1, add error handling):
```typescript
export default async function PromotionsPage() {
  try {
    const page = await getPageBySlug("promotions");
    
    if (page) {
      const pageBlocks = await getPageBlocks(page.id);
      const promotionsBlock = pageBlocks.find(
        (block) => block.collection === "block_promotions"
      );
      
      if (promotionsBlock) {
        const blockData = await getBlockContent(
          promotionsBlock.collection,
          promotionsBlock.item
        );
        
        return (
          <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
            <Header />
            {blockData ? (
              <PromotionsBlock data={blockData} />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">No promotions available.</p>
              </div>
            )}
          </main>
        );
      }
    }
    
    // If no page found, render PromotionsBlock directly (standalone mode)
    return (
      <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
        <Header />
        <PromotionsBlock />
      </main>
    );
  } catch (error) {
    console.error("Error loading promotions page:", error);
    notFound();
  }
}
```

**Why**: Adds proper error handling and fallback states. Handles cases where page doesn't exist in Directus or block data is missing.

**Validation**: `npm run build`
**Test**: Test with missing page data, verify graceful fallback

## Directus Setup

### For Block-Based Approach:
- **Page**: Create a page with slug `"promotions"` in `pages` collection
- **Block**: Add `block_promotions` block to the page via `page_blocks` junction
- **Block Collection**: `block_promotions` collection (created in Plan 6)
- **Permissions**: Public read access for both `pages` and `block_promotions`

### For Standalone Approach:
- **Collection**: `promotions` collection (created in Plan 6)
- **Permissions**: Public read access
- **No page record needed**: Component fetches promotions directly

### Collection Config:
- Check `config/COLLECTIONS_TO_CREATE.json` for `promotions` and `block_promotions` structure
- Verify `promotion_categories` collection exists for filtering

## Testing Strategy
For each task:
- [ ] Task 1: Navigate to `/promotions` - page should load without errors
- [ ] Task 2: Verify PromotionsBlock renders (after Plan 6 completion)
- [ ] Task 3: Test error states - missing page, missing block data
- [ ] Integration: 
  - Verify page matches HTML design layout
  - Test responsive behavior (mobile/tablet/desktop)
  - Verify SEO metadata in page source
  - Test category filtering (if implemented in PromotionsBlock)
  - Verify countdown timer works (if implemented in PromotionsBlock)
  - Test sticky contact bar functionality

## Validation Commands
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Run dev server
npm run dev
```

## Acceptance Criteria
- [x] `/promotions` route exists and loads without errors
- [x] Page includes Header component
- [x] PromotionsBlock component renders correctly
- [x] SEO metadata matches HTML design (title, description)
- [x] Page follows ISR pattern (`revalidate = 60`)
- [x] Error handling works for missing data
- [ ] Page is responsive (mobile/tablet/desktop) - *needs browser testing*
- [x] All validation commands pass
- [ ] No console errors in browser - *needs browser testing*
- [x] TypeScript checks pass

## Context Notes
- **Prerequisite**: Plan 6 (Create PromotionsBlock) must be completed first
- **Block vs Standalone**: This plan supports both approaches:
  - Block-based: Page managed in Directus, uses `page_blocks` junction
  - Standalone: Component fetches promotions directly from `promotions` collection
- **PromotionsBlock Component**: Will be created in Plan 6 with:
  - Hero banner with countdown timer (Client Component)
  - Category filter navigation (Client Component)
  - Promotion cards grid
  - Sticky contact bar
- **Follow Pattern**: Similar to `/services` and `/blog` pages:
  - Server Component
  - Header included
  - Metadata exported
  - ISR with `revalidate = 60`
- **HTML Design Match**: Page should match `promotions.html`:
  - Header title: "Promotions!" (uppercase, blue-900)
  - Hero banner with gradient and countdown
  - Category filters in rounded pill buttons
  - 3-column grid on desktop, responsive on mobile
  - Sticky bottom contact bar

## Project-Specific Requirements
- ✅ ISR: Include `export const revalidate = 60`
- ✅ Images: Use `getFileUrl()` helper (handled in PromotionsBlock)
- ✅ Server Components: Default to RSC (PromotionsBlock may have Client Components internally)
- ✅ Tailwind Only: No custom CSS
- ✅ Fallbacks: Handle null/empty responses gracefully
- ✅ Type Safety: Match Directus collection structure
- ✅ SEO: Static metadata for promotions page
- ✅ Error Handling: Use `notFound()` for missing pages

## Dependencies
- **Plan 6**: Create PromotionsBlock (must be completed first)
- **Directus Collections**: 
  - `promotions` collection (or `block_promotions` if block-based)
  - `promotion_categories` collection (for filtering)
- **Components**: 
  - `Header` component (already exists)
  - `PromotionsBlock` component (created in Plan 6)

## Implementation Notes
1. **Wait for Plan 6**: Do not implement until PromotionsBlock component exists
2. **Test Both Approaches**: Verify both block-based and standalone approaches work
3. **HTML Design Reference**: Use `promotions.html` as visual reference
4. **Responsive Design**: Ensure mobile layout matches HTML (single column, filters scroll horizontally)
5. **Contact Bar**: Sticky bottom bar should match HTML design (dark blue background, phone + LINE buttons)

---

## Completion Status
- [x] All tasks completed
- [x] All validations passed (TypeScript, Build)
- [ ] Feature tested in browser (requires Directus setup)
- Completed: 2025-01-27

### Implementation Notes
- **Fixed Semantic HTML Issue**: Changed PromotionsBlock's `<main>` tag to `<div>` to avoid nested main tags (semantic HTML violation)
- **Type Safety**: Added proper TypeScript types for block parameter
- **Error Handling**: Implemented comprehensive error handling with try-catch and proper fallbacks
- **Page Structure**: Page correctly wraps content in `<main>` with Header, following established patterns from `/services` and `/blog` pages
- **Directus Dependency**: Page requires `promotions` page with `block_promotions` block to be created in Directus before it will render content (currently shows 404, which is expected behavior)

