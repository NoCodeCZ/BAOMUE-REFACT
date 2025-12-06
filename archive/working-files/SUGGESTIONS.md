# Project Improvement Suggestions

Based on codebase analysis, here are prioritized features and improvements to plan:

## 🔴 Critical Priority

### 1. **Refactor Homepage to Use Block Components**
**Impact**: High | **Effort**: Medium | **Priority**: Critical

**Current State:**
- Homepage (`app/page.tsx`) is ~1800 lines with all block rendering inline
- Architecture expects `components/blocks/` directory but it doesn't exist
- All 14 block types are hardcoded in the homepage file

**What's Needed:**
- Create `components/blocks/` directory structure
- Extract each block section into separate React components
- Create a dynamic block renderer component
- Refactor homepage to use proper block-based rendering pattern

**Benefits:**
- Maintainability (1800 lines → ~100 lines + reusable components)
- Reusability (blocks can be used on other pages)
- Follows project architecture guidelines
- Easier to add new blocks in future

**Files to Create:**
- `components/blocks/Hero.tsx`
- `components/blocks/AboutUs.tsx`
- `components/blocks/WhyChooseUs.tsx`
- `components/blocks/Team.tsx`
- `components/blocks/SignatureTreatment.tsx`
- `components/blocks/SafetyBanner.tsx`
- `components/blocks/Services.tsx`
- `components/blocks/Locations.tsx`
- `components/blocks/Booking.tsx`
- `components/blocks/Contact.tsx`
- `components/blocks/BlockRenderer.tsx` (dynamic renderer)

**Files to Modify:**
- `app/page.tsx` - Refactor to use block components

---

## 🟠 High Priority

### 2. **Create Dynamic Block Renderer Component**
**Impact**: High | **Effort**: Low | **Priority**: High

**What's Needed:**
- A reusable `BlockRenderer` component that accepts `PageBlock[]` and renders appropriate block components
- Eliminates need for manual `if (block.collection === "...")` checks in every page
- Makes creating new pages trivial

**Benefits:**
- DRY principle (Don't Repeat Yourself)
- Easy page creation (just pass blocks array)
- Type-safe block rendering

**Files to Create:**
- `components/blocks/BlockRenderer.tsx`
- `lib/blocks/registry.ts` (block type → component mapping)

---

### 3. **Implement Blog Content Integration**
**Impact**: Medium | **Effort**: Medium | **Priority**: High

**Current State:**
- `app/blog/page.tsx` exists but is UI-only
- No blog posts collection or data fetching
- No blog detail pages

**What's Needed:**
- Create `blog_posts` collection interface in `lib/types.ts`
- Add data fetching functions (`getBlogPosts()`, `getBlogPostBySlug()`)
- Implement blog listing page with data
- Create `app/blog/[slug]/page.tsx` for individual posts
- Add featured image support

**Files to Create:**
- `app/blog/[slug]/page.tsx`
- Blog-related data functions in `lib/data.ts`

**Files to Modify:**
- `app/blog/page.tsx` - Connect to CMS data
- `lib/types.ts` - Add BlogPost interface

---

### 4. **Add FAQ Block Type**
**Impact**: Medium | **Effort**: Low | **Priority**: High

**What's Needed:**
- New block type following the pattern in `reference/01_creating_directus_blocks.md`
- Perfect example for demonstrating the block creation pattern
- Useful feature for dental clinic websites

**Files to Create:**
- `components/blocks/Faq.tsx`
- Directus collection: `block_faq`

**Files to Modify:**
- `lib/types.ts` - Add `BlockFaq` interface
- `lib/data.ts` - Add `getFaqBlock()` function
- Block renderer (once created) - Register FAQ block

---

## 🟡 Medium Priority

### 5. **Implement Analytics (GTM/GA4)**
**Impact**: Medium | **Effort**: Medium | **Priority**: Medium

**Current State:**
- Analytics architecture planned but not implemented
- Reference guide exists: `reference/04_analytics_event_tracking.md`
- No GTM provider or event tracking

**What's Needed:**
- Create `lib/analytics/gtm.tsx` - GTM provider component
- Create `lib/analytics/events.ts` - Event tracking helpers
- Add analytics config in `config/analytics.config.ts`
- Track key events (booking clicks, phone clicks, form submissions)

**Files to Create:**
- `lib/analytics/gtm.tsx`
- `lib/analytics/events.ts`
- `config/analytics.config.ts`

**Files to Modify:**
- `app/layout.tsx` - Add GTM provider
- Various components - Add event tracking

---

### 6. **Create Generic Dynamic Page Route**
**Impact**: High | **Effort**: Medium | **Priority**: Medium

**What's Needed:**
- Create `app/[slug]/page.tsx` that dynamically renders any page from CMS
- Uses block renderer to compose pages
- Eliminates need to create separate route files for each page

**Benefits:**
- CMS-driven page creation (no code changes needed for new pages)
- Follows headless CMS best practices

**Files to Create:**
- `app/[slug]/page.tsx`

**Files to Modify:**
- None (uses existing data fetching and block renderer)

---

### 7. **Add SEO Metadata & Structured Data**
**Impact**: Medium | **Effort**: Low | **Priority**: Medium

**What's Needed:**
- Dynamic meta tags per page (from CMS)
- JSON-LD structured data for services, organization
- Open Graph tags
- Sitemap generation

**Files to Create:**
- `lib/seo/generateMetadata.ts`
- `lib/seo/structuredData.ts`
- `app/sitemap.ts`

**Files to Modify:**
- All page components - Add metadata generation

---

## 🟢 Low Priority (Nice to Have)

### 8. **Contact Form with Backend Integration**
**Impact**: Low | **Effort**: High | **Priority**: Low

**What's Needed:**
- API route for form submission
- Form validation
- Email notification or Directus submission storage

### 9. **On-Demand ISR Revalidation Webhook**
**Impact**: Low | **Effort**: Low | **Priority**: Low

**What's Needed:**
- API route: `app/api/revalidate/route.ts`
- Webhook endpoint for Directus to trigger revalidation

### 10. **Image Optimization Component**
**Impact**: Low | **Effort**: Low | **Priority**: Low

**What's Needed:**
- Wrapper component using Next.js Image component
- Automatic optimization for Directus assets

---

## Recommended Implementation Order

1. **Start Here**: Refactor Homepage to Use Block Components (#1)
   - Foundation for all other improvements
   - Makes codebase maintainable

2. **Then**: Create Dynamic Block Renderer (#2)
   - Reusable component that simplifies everything

3. **Next**: Add FAQ Block (#4)
   - Quick win that demonstrates the pattern
   - Useful feature

4. **Follow Up**: Blog Integration (#3)
   - Complete the blog feature

5. **Enhancement**: Analytics (#5)
   - Track user interactions

6. **Scalability**: Dynamic Page Route (#6)
   - CMS-driven page creation

---

## To Create a Plan

Run `/planning` with any feature name from above:

```bash
/planning refactor-homepage-blocks
/planning dynamic-block-renderer
/planning blog-content-integration
/planning faq-block
/planning analytics-implementation
```

Each plan will include:
- Exact file paths and code snippets
- Step-by-step implementation tasks
- Testing strategies
- Validation commands

---

## Quick Wins (Can Do First)

If you want to start with something quick:

1. **FAQ Block** (#4) - ~1 hour, follows clear pattern
2. **Dynamic Block Renderer** (#2) - ~2 hours, high impact
3. **SEO Metadata** (#7) - ~2 hours, good SEO improvement

---

## Notes

- All features should follow existing patterns in `reference/` guides
- Use TypeScript strict mode
- Server Components by default, only use "use client" when needed
- Include `export const revalidate = 60` for ISR
- Use `getFileUrl()` helper for all images
- Graceful fallbacks for missing CMS data

