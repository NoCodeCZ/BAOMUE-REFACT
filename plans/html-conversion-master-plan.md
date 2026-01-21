# Master Plan: HTML to Directus CMS Conversion

> **Status**: Planning Phase  
> **Research Document**: `docs/research/html-to-directus-conversion.md`  
> **Created**: 2024-12-24  
> **Strategy**: Broken into 17 focused implementation plans

---

## Overview

Convert 8 static HTML files into dynamic, CMS-driven Next.js pages. This master plan breaks the work into **17 smaller, focused plans** that can be implemented step-by-step.

### Conversion Scope

| HTML File | Target Route | Plan Reference |
|-----------|--------------|----------------|
| `index.html` | `/` | Plan 11: Update Homepage |
| `about-us.html` | `/about` | Plan 2: Update AboutUsBlock |
| `service-index.html` | `/services` | Plan 4: Update ServicesBlock + Plan 12: Services Pages |
| `service-detail.html` | `/services/[slug]` | Plan 9: Create ServiceDetailBlock + Plan 12 |
| `contact-page.html` | `/contact` | Plan 16: Create Contact Page |
| `blog.html` | `/blog` | Plan 8: Create BlogListingBlock + Plan 13: Blog Pages |
| `promotions.html` | `/promotions` | Plan 6: Create PromotionsBlock + Plan 14: Promotions Page |
| `our-work.html` | `/our-work` | Plan 7: Create PortfolioBlock + Plan 15: Portfolio Page |

---

## Implementation Phases

### Phase 1: Update Existing Blocks (5 plans)
Update styling and functionality of existing blocks to match HTML design.

1. **Plan 1**: Update HeroBlock Styling
   - File: `plans/01-update-hero-block.md`
   - Update gradient colors, yellow accent text, contact info styling
   - Estimated: 1-2 hours

2. **Plan 2**: Update AboutUsBlock Styling
   - File: `plans/02-update-about-us-block.md`
   - Match HTML arched image layout, text styling
   - Estimated: 1-2 hours

3. **Plan 3**: Update TeamBlock Styling
   - File: `plans/03-update-team-block.md`
   - Match 5-column dentist grid, card styling
   - Estimated: 1-2 hours

4. **Plan 4**: Update ServicesBlock for Tabs
   - File: `plans/04-update-services-block-tabs.md`
   - Add tabbed interface with category filtering (Client Component)
   - Estimated: 2-3 hours

5. **Plan 5**: Update Footer Styling
   - File: `plans/05-update-footer-styling.md`
   - Match HTML footer structure, columns, social links
   - Estimated: 1-2 hours

### Phase 2: Create New Blocks (5 plans)
Create new block components for features not yet implemented.

6. **Plan 6**: Create PromotionsBlock
   - File: `plans/06-create-promotions-block.md`
   - Block component + Client Component for countdown timer
   - Estimated: 3-4 hours

7. **Plan 7**: Create PortfolioBlock
   - File: `plans/07-create-portfolio-block.md`
   - Block component + Client Component for before/after slider
   - Estimated: 4-5 hours

8. **Plan 8**: Create BlogListingBlock
   - File: `plans/08-create-blog-listing-block.md`
   - Block component + Client Component for search/filter
   - Estimated: 3-4 hours

9. **Plan 9**: Create ServiceDetailBlock
   - File: `plans/09-create-service-detail-block.md`
   - Features, process, pricing sections
   - Estimated: 2-3 hours

10. **Plan 10**: Create StatsBlock
    - File: `plans/10-create-stats-block.md`
    - Statistics bar component for portfolio page
    - Estimated: 1-2 hours

### Phase 3: Create/Update Pages (6 plans)
Create or update Next.js pages to use the blocks.

11. **Plan 11**: Update Homepage
    - File: `plans/11-update-homepage.md`
    - Update `app/page.tsx` with correct block order
    - Estimated: 1 hour

12. **Plan 12**: Create/Update Services Pages
    - File: `plans/12-services-pages.md`
    - Update listing page, create/update detail pages
    - Estimated: 2-3 hours

13. **Plan 13**: Create/Update Blog Pages
    - File: `plans/13-blog-pages.md`
    - Update listing page, create/update detail pages
    - Estimated: 2-3 hours

14. **Plan 14**: Create Promotions Page
    - File: `plans/14-promotions-page.md`
    - Create `/promotions` page with PromotionsBlock
    - Estimated: 1-2 hours

15. **Plan 15**: Create Portfolio Page
    - File: `plans/15-portfolio-page.md`
    - Create `/our-work` page with PortfolioBlock + StatsBlock
    - Estimated: 1-2 hours

16. **Plan 16**: Create Contact Page
    - File: `plans/16-contact-page.md`
    - Create `/contact` page with ContactBlock + FormBlock + LocationsBlock
    - Estimated: 1-2 hours

### Phase 4: Polish & Final Touches (1 plan)
Complete the conversion by ensuring all user-facing states match the brand design.

17. **Plan 17**: Update Error Pages & Loading States
    - File: `plans/17-update-error-loading-states.md`
    - Update error, 404, and loading pages to match brand design
    - Estimated: 2-3 hours

---

## Directus Setup

Directus collections will be created as part of each plan. Each plan includes:
- Collection structure definition
- Field types and relationships
- Permission settings
- Sample data structure

**Collections to Create:**
- `promotions` (Plan 6)
- `promotion_categories` (Plan 6)
- `portfolio_cases` (Plan 7)
- `portfolio_categories` (Plan 7)
- `block_promotions` (Plan 6)
- `block_portfolio` (Plan 7)
- `block_blog_listing` (Plan 8)
- `block_service_detail` (Plan 9)
- `block_stats` (Plan 10)

---

## Implementation Order

### Recommended Sequence

**Week 1: Foundation (Plans 1-5)**
- Start with existing blocks to establish design patterns
- These are lower risk, can validate styling approach
- Total: ~8-12 hours

**Week 2: New Blocks (Plans 6-10)**
- Create new functionality
- Higher complexity, includes Client Components
- Total: ~13-18 hours

**Week 3: Pages (Plans 11-16)**
- Wire everything together
- Test full page flows
- Total: ~8-13 hours

**Week 4: Polish (Plan 17)**
- Complete brand consistency
- Final user experience improvements
- Total: ~2-3 hours

### Alternative: Feature-First Approach

If you prefer to complete full features end-to-end:

1. **Homepage Feature** (Plans 1, 2, 3, 5, 11)
2. **Services Feature** (Plans 4, 9, 12)
3. **Blog Feature** (Plan 8, 13)
4. **Promotions Feature** (Plan 6, 14)
5. **Portfolio Feature** (Plans 7, 10, 15)
6. **Contact Feature** (Plan 16)

---

## Common Patterns Across All Plans

### TypeScript Interface Pattern
```typescript
// lib/types.ts
export interface Block[Name] {
  id: number;
  // Fields matching Directus collection
}
```

### Data Fetching Pattern
```typescript
// lib/data.ts
export async function get[Name]Block(blockId: number): Promise<Block[Name] | null> {
  // Standard fetch pattern with error handling
}
```

### Component Pattern
```typescript
// components/blocks/[Name]Block.tsx
export default function [Name]Block({ data }: { data?: Block[Name] | null }) {
  if (!data) return null;
  // Component JSX
}
```

### Page Pattern
```typescript
// app/[route]/page.tsx
export const revalidate = 60;
export default async function Page() {
  // Fetch data, render blocks
}
```

---

## Validation Commands

Each plan includes validation, but here are the global checks:

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

---

## Testing Strategy

### Per-Plan Testing
- Each plan includes specific test steps
- Visual verification against HTML design
- Browser testing on mobile/desktop

### Integration Testing
After completing each phase:
- Test full page flows
- Verify Directus data displays correctly
- Check responsive behavior
- Validate SEO metadata

---

## Acceptance Criteria

### Phase 1 Complete
- [ ] All existing blocks match HTML styling
- [ ] No visual regressions
- [ ] All blocks render correctly from Directus

### Phase 2 Complete
- [ ] All new blocks created and registered
- [ ] Client Components work correctly
- [ ] Directus collections created with sample data

### Phase 3 Complete
- [ ] All pages created/updated
- [ ] All routes work correctly
- [ ] SEO metadata configured
- [ ] Full site navigation functional

### Phase 4 Complete
- [ ] Error pages match brand design
- [ ] Loading states match brand design
- [ ] 404 page matches brand design
- [ ] All user-facing states are consistent

### Final Acceptance
- [ ] All 8 HTML files converted
- [ ] All pages match HTML design
- [ ] All functionality working
- [ ] Error/loading/404 states match brand
- [ ] No console errors
- [ ] Build passes
- [ ] TypeScript checks pass

---

## Next Steps

1. **Review this master plan** - Ensure strategy aligns with goals
2. **Start with Plan 1** - Update HeroBlock Styling
3. **Execute plans sequentially** - Or in feature groups as preferred
4. **Track progress** - Check off completed plans

---

## Plan Files

All individual plans will be created in `/plans/` directory:

- `01-update-hero-block.md`
- `02-update-about-us-block.md`
- `03-update-team-block.md`
- `04-update-services-block-tabs.md`
- `05-update-footer-styling.md`
- `06-create-promotions-block.md`
- `07-create-portfolio-block.md`
- `08-create-blog-listing-block.md`
- `09-create-service-detail-block.md`
- `10-create-stats-block.md`
- `11-update-homepage.md`
- `12-services-pages.md`
- `13-blog-pages.md`
- `14-promotions-page.md`
- `15-portfolio-page.md`
- `16-contact-page.md`
- `17-update-error-loading-states.md`

---

## Questions or Issues?

- Review research document: `docs/research/html-to-directus-conversion.md`
- Check reference guides in `/reference/` directory
- Review existing block implementations for patterns

