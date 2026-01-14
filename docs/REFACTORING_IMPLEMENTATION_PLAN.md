# Refactoring Implementation Plan

**Project:** Baomue Website  
**Date:** 2024-12-19  
**Status:** Ready for Implementation

## Overview

This document provides step-by-step implementation guide for refactoring the codebase based on the comprehensive analysis. All changes are incremental, tested, and have fallback strategies.

---

## Phase 1: Code Consistency & Cleanup

### Goal
Ensure all pages use consistent patterns, optimize existing code, and remove inconsistencies.

### Task 1.1: Audit All Page Files

**Objective:** Review all page files to understand current patterns and identify inconsistencies.

**Files to Review:**
- [ ] `app/services/page.tsx`
- [ ] `app/services/[slug]/page.tsx`
- [ ] `app/blog/page.tsx`
- [ ] `app/blog/[slug]/page.tsx`
- [ ] `app/contact/page.tsx`
- [ ] `app/promotions/page.tsx`
- [ ] `app/our-work/page.tsx`

**Action Items:**
1. Document current implementation pattern for each page
2. Identify which pages use PageBuilder vs custom logic
3. Note any inconsistencies
4. Create checklist of pages that need updates

**Deliverable:** Page audit document with findings

---

### Task 1.2: Standardize Homepage Data Fetching

**Objective:** Ensure homepage consistently uses optimized query functions.

**File:** `app/page.tsx`

**Current State:**
- Uses `getPageWithBlocks()` first (good)
- Falls back to `getPageWithBlocksBatched()` (good)
- Final fallback uses old pattern (needs update)

**Changes Needed:**

```typescript
// Current fallback (lines 167-184)
if (!result) {
  const page = await getPageBySlug("home");
  if (!page) {
    return <FallbackHomePage />;
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
```

**Proposed Change:**
- Remove this fallback (already handled by `getPageWithBlocksBatched()`)
- Simplify to only use optimized functions
- Keep `FallbackHomePage` for when Directus is unavailable

**Validation:**
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] Homepage renders correctly
- [ ] All blocks display properly

---

### Task 1.3: Update Other Pages to Use PageBuilder (If Needed)

**Objective:** Ensure all pages that should use PageBuilder are using it.

**Files to Check:**
- `app/services/page.tsx`
- `app/blog/page.tsx`
- `app/contact/page.tsx`
- `app/promotions/page.tsx`
- `app/our-work/page.tsx`

**Decision Criteria:**
- If page uses block-based content from Directus → Use PageBuilder
- If page has custom logic → Keep custom logic but document why

**Action:**
1. Review each page
2. Determine if PageBuilder is appropriate
3. Update if needed
4. Document decision if keeping custom logic

---

### Task 1.4: Component Cleanup

**Objective:** Identify and document unused components.

**Components to Review:**
- `components/Features.tsx` (legacy?)
- `components/Hero.tsx` (legacy?)
- `components/Testimonials.tsx` (legacy?)
- `components/Pricing.tsx` (legacy?)
- `components/Navbar.tsx` (legacy?)

**Action:**
1. Search for imports of each component
2. Document usage
3. If unused, add to archive or remove
4. Update component README

**Command to check usage:**
```bash
grep -r "from.*Features" app/ components/
grep -r "from.*Hero" app/ components/
# etc.
```

---

## Phase 2: Performance Optimization

### Goal
Reduce query count and improve page load times by fully utilizing existing optimizations.

### Task 2.1: Optimize Query Field Selection

**Objective:** Replace `fields: ['*']` with specific fields to reduce payload size.

**File:** `lib/data.ts`

**Functions to Optimize:**
1. `getPageBlocks()` - Currently uses `fields: ['*']`
2. `getBlockContent()` - Currently uses `fields: ['*']` (with exceptions)
3. Other functions using `fields: ['*']`

**Example Change:**

```typescript
// Before
export async function getPageBlocks(pageId: number) {
  const blocks = await directus.request(
    readItemsTyped('page_blocks', {
      filter: { page: { _eq: pageId } },
      fields: ['*'], // ❌ Fetches all fields
      sort: ['sort'],
    })
  );
}

// After
export async function getPageBlocks(pageId: number) {
  const blocks = await directus.request(
    readItemsTyped('page_blocks', {
      filter: { page: { _eq: pageId } },
      fields: ['id', 'page', 'collection', 'item', 'sort', 'hide_block'], // ✅ Specific fields
      sort: ['sort'],
    })
  );
}
```

**Functions to Update:**
- [ ] `getPageBlocks()` - Lines 68-83
- [ ] `getBlockContent()` - Lines 85-125 (already has some optimization)
- [ ] Review other functions incrementally

**Validation:**
- [ ] All pages still render correctly
- [ ] Network payload size reduced
- [ ] No missing fields

---

### Task 2.2: Verify Optimized Query Functions

**Objective:** Ensure `getPageWithBlocks()` and `getPageWithBlocksBatched()` work correctly.

**File:** `lib/data.ts`

**Actions:**
1. Test `getPageWithBlocks()` with actual Directus instance
2. Verify nested query structure works
3. Test fallback to `getPageWithBlocksBatched()`
4. Document which approach is used in production

**Test Cases:**
```typescript
// Test 1: Single block page
const result1 = await getPageWithBlocks("test-page-1");

// Test 2: Multiple blocks page
const result2 = await getPageWithBlocks("home");

// Test 3: Non-existent page
const result3 = await getPageWithBlocks("non-existent");
```

**Expected Results:**
- `getPageWithBlocks()` returns data if nested queries work
- Falls back to `getPageWithBlocksBatched()` if nested queries fail
- Returns null for non-existent pages

---

### Task 2.3: Add Performance Monitoring

**Objective:** Track query performance to measure improvements.

**Approach:**
1. Add console.time/timeEnd for development
2. Log query counts
3. Measure before/after improvements

**Example:**
```typescript
export async function getPageWithBlocks(slug: string) {
  const startTime = Date.now();
  try {
    // ... query logic
    const queryTime = Date.now() - startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] getPageWithBlocks(${slug}): ${queryTime}ms, ${blocks.length} blocks`);
    }
    return { page, blocks };
  } catch (error) {
    // ...
  }
}
```

**Metrics to Track:**
- Query count per page
- Total query time
- Block count
- Payload size (if possible)

---

## Phase 3: Type Safety Improvements

### Goal
Remove `any` types and improve type safety throughout the codebase.

### Task 3.1: Remove `any` Types in `lib/data.ts`

**File:** `lib/data.ts`

**Locations to Fix:**

1. **Lines 6-7:** Type wrappers
```typescript
// Current
const readItemsTyped = readItems as any;
const readSingletonTyped = readSingleton as any;

// Keep as-is (Directus SDK limitation)
// But add comment explaining why
```

2. **Line 80:** Collection parameter
```typescript
// Current
readItemsTyped(collection as any, {

// After
readItemsTyped(collection as string, { // More specific
```

3. **Line 451:** Navigation items
```typescript
// Current
) as any[];

// After
) as NavigationItem[];
```

4. **Line 463:** Children mapping
```typescript
// Current
item.children.map((child: any) => ({

// After
item.children.map((child: NavigationItem) => ({
```

**Validation:**
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No runtime errors
- [ ] All types are correct

---

### Task 3.2: Improve Type Assertions

**Objective:** Replace unsafe type assertions with type guards where possible.

**Approach:**
1. Create type guard functions for block types
2. Use type guards instead of `as` assertions
3. Add runtime validation

**Example Type Guard:**
```typescript
// lib/type-guards.ts (new file)
export function isBlockHero(content: BlockContent): content is BlockHero {
  return content && typeof (content as BlockHero).headline_line1 !== 'undefined';
}

export function isBlockText(content: BlockContent): content is BlockText {
  return content && typeof (content as BlockText).content !== 'undefined';
}
```

**Usage:**
```typescript
// Instead of
const hero = block.content as BlockHero;

// Use
if (isBlockHero(block.content)) {
  // TypeScript knows block.content is BlockHero here
}
```

**Note:** This is optional - current `as` assertions work but type guards are safer.

---

## Phase 4: Architecture Enhancements

### Goal
Improve scalability and maintainability of the architecture.

### Task 4.1: Verify Dynamic Routing

**Objective:** Ensure `app/[...slug]/page.tsx` works correctly for CMS-driven pages.

**File:** `app/[...slug]/page.tsx`

**Test Cases:**
1. Create test page in Directus with slug "test-page"
2. Visit `/test-page` - should render
3. Create nested page "about/team" - should render at `/about/team`
4. Visit non-existent page - should show 404
5. Verify explicit routes (services, blog) still work

**Actions:**
- [ ] Test dynamic routing with real pages
- [ ] Verify 404 handling
- [ ] Check routing conflicts
- [ ] Document usage

---

### Task 4.2: Create Shared Utilities

**Objective:** Extract common patterns into shared utilities.

**Potential Utilities:**
1. `lib/utils/page-helpers.ts` - Page-related helpers
2. `lib/utils/block-helpers.ts` - Block-related helpers
3. `lib/utils/url-helpers.ts` - URL generation helpers

**Example:**
```typescript
// lib/utils/page-helpers.ts
export async function getPageData(slug: string) {
  // Try optimized queries
  let result = await getPageWithBlocks(slug);
  if (!result) {
    result = await getPageWithBlocksBatched(slug);
  }
  return result;
}
```

**Benefits:**
- Reduces code duplication
- Centralizes logic
- Easier to maintain

---

### Task 4.3: Improve Component Documentation

**Objective:** Document component usage and patterns.

**Files to Update:**
- `components/README.md` - Update with current components
- `components/blocks/README.md` - Document block components
- Add JSDoc comments to key components

**Template:**
```typescript
/**
 * HeroBlock Component
 * 
 * Renders a hero section with headline, description, and CTAs.
 * 
 * @param data - BlockHero data from Directus
 * @example
 * <HeroBlock data={heroData} />
 */
export default function HeroBlock({ data }: { data: BlockHero }) {
  // ...
}
```

---

## Phase 5: Testing & Documentation

### Goal
Ensure reliability and maintainability through testing and documentation.

### Task 5.1: Create Testing Checklist

**Objective:** Document manual testing procedures.

**Create:** `docs/TESTING_CHECKLIST.md`

**Include:**
- Pre-deployment checklist
- Page rendering tests
- Performance tests
- Browser compatibility tests
- Mobile responsiveness tests

---

### Task 5.2: Update Documentation

**Objective:** Keep documentation up to date with changes.

**Files to Update:**
- `docs/ARCHITECTURE.md` - Update with new patterns
- `README.md` - Update if needed
- `docs/QUICK_REFERENCE.md` - Update patterns

---

## Implementation Checklist

### Phase 1: Code Consistency
- [ ] Task 1.1: Audit all page files
- [ ] Task 1.2: Standardize homepage data fetching
- [ ] Task 1.3: Update other pages to use PageBuilder (if needed)
- [ ] Task 1.4: Component cleanup

### Phase 2: Performance
- [ ] Task 2.1: Optimize query field selection
- [ ] Task 2.2: Verify optimized query functions
- [ ] Task 2.3: Add performance monitoring

### Phase 3: Type Safety
- [ ] Task 3.1: Remove `any` types in `lib/data.ts`
- [ ] Task 3.2: Improve type assertions (optional)

### Phase 4: Architecture
- [ ] Task 4.1: Verify dynamic routing
- [ ] Task 4.2: Create shared utilities (optional)
- [ ] Task 4.3: Improve component documentation

### Phase 5: Testing & Documentation
- [ ] Task 5.1: Create testing checklist
- [ ] Task 5.2: Update documentation

---

## Validation Commands

After each phase, run:

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build
npm run build

# Development server (manual testing)
npm run dev
```

---

## Rollback Plan

If issues arise:

1. **Git:** All changes should be in feature branches
2. **Incremental:** Each phase is independent
3. **Fallbacks:** All optimizations have fallback patterns
4. **Testing:** Test each phase before moving to next

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All pages use consistent patterns
- ✅ Homepage uses optimized queries consistently
- ✅ Unused components documented/removed

### Phase 2 Complete When:
- ✅ Query field selection optimized
- ✅ Performance improved (measured)
- ✅ Monitoring in place

### Phase 3 Complete When:
- ✅ Unnecessary `any` types removed
- ✅ TypeScript compiles without errors
- ✅ Type safety improved

### Phase 4 Complete When:
- ✅ Dynamic routing verified
- ✅ Documentation updated
- ✅ Architecture improved

### Phase 5 Complete When:
- ✅ Testing procedures documented
- ✅ All documentation up to date

---

## Notes

- All changes are incremental and can be done independently
- Each phase can be tested separately
- Fallback strategies ensure no breaking changes
- Focus on high-impact, low-risk improvements first

---

## Questions & Decisions Needed

1. **Dynamic Routing:** Should all pages use dynamic routing, or keep explicit routes for key pages?
2. **Type Guards:** Are type guards worth the added complexity, or are `as` assertions sufficient?
3. **Performance Monitoring:** Should performance monitoring be production-ready or dev-only?
4. **Component Cleanup:** Should unused components be removed or archived?

---

**Next Step:** Start with Phase 1, Task 1.1 (Audit all page files)

