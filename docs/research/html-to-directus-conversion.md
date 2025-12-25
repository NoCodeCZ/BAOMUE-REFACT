# Research: HTML to Directus CMS Conversion

**Generated**: 2024-12-11
**Reviewed**: 2024-12-24
**Scope**: Convert final HTML design files to Directus CMS-driven Next.js components
**Complexity**: Complex (multi-page, multi-block conversion)
**Status**: ✅ APPROVED (with recommendations)

---

## 📋 Review Feedback

### ✅ Verified Accurate
1. **System Overview** - Correct: Next.js 14 + App Router, Directus CMS, Block-based architecture
2. **Data Layer Structure** - Verified: `lib/types.ts`, `lib/data.ts`, `lib/directus.ts` patterns match actual code
3. **Block Registration** - Verified: `PageBuilder.tsx` uses `componentMap` approach with 16 registered blocks
4. **Existing Blocks Count** - Verified: 12 block components exist in `components/blocks/`
5. **Block Component Pattern** - Verified: Interface props, null check, fallback defaults, `getFileUrl()` usage
6. **HTML Files** - Verified: All 8 HTML files present in `/Downloads/site-files (2)/`
7. **Data Fetching Functions** - Verified: `getPageWithBlocks()`, `getPageWithBlocksBatched()` fallback patterns
8. **ISR Configuration** - Verified: `export const revalidate = 60` used consistently
9. **Key Patterns** - Verified: Code snippets match actual implementation

### ⚠️ Recommendations for Planning Phase
1. **Hero Block Styling Gap**: Current `HeroBlock.tsx` uses `from-sky-400 to-sky-600` gradient. HTML design uses `#FEDF45` yellow highlights for "เบามืออย่างโปร" text and different gradient tones. **Action**: Plan styling updates in Phase 1.

2. **Client Components Required**: Some new blocks need interactivity:
   - `block_portfolio`: Before/After image slider requires `"use client"` directive
   - `block_promotions`: Countdown timer requires `"use client"` directive
   - **Action**: Document these as Client Components in planning.

3. **Missing Block in index.html Analysis**: The research correctly notes About Us and Team sections but index.html also prominently features:
   - Hero section (exists as `block_hero` ✅)
   - Why Choose Us section (exists as `block_why_choose_us` ✅)
   - These should be verified and updated in Phase 1.

4. **Question Resolution Status**: The "Questions to Resolve" section has 6 unanswered questions that should be addressed during planning:
   - Promotions data model ➜ **Recommend**: Separate `promotions` collection (not a block)
   - Portfolio data model ➜ **Recommend**: Separate `portfolio_cases` collection with before/after image pairs
   - Blog search ➜ **Recommend**: Client-side filtering (simpler UX)
   - Before/after sliders ➜ **Recommend**: Image pairs stored in junction table or JSON field
   - Contact form ➜ **Recommend**: Reuse existing `block_form` with booking form fields

5. **Tailwind Custom Colors**: Research mentions color palette but Tailwind config should be verified for custom colors (`#1a5fb4`, `#FEDF45`, etc.). **Action**: Check `tailwind.config.ts` during planning.

### 📊 Research Quality Score: 8.5/10
- ✅ Clear system overview with correct architecture
- ✅ Relevant files identified with accurate roles
- ✅ Key patterns documented with code snippets
- ✅ Dependencies and integration points listed
- ✅ Phased conversion strategy
- ⚠️ Minor gaps in HTML section analysis (some blocks not mentioned)
- ⚠️ Questions to Resolve need resolution before planning completion

---

## System Overview

This Next.js 14 project uses a block-based page builder architecture where pages are composed of reusable blocks fetched from Directus CMS. Each page has a `pages` record that links to multiple `page_blocks` (junction table), which in turn reference specific block collections (e.g., `block_hero`, `block_about_us`). The `PageBuilder` component dynamically renders blocks based on their collection type.

**Current Architecture:**
- **Pages**: Stored in `pages` collection with slug-based routing
- **Blocks**: Stored in `block_*` collections (e.g., `block_hero`, `block_about_us`)
- **Junction**: `page_blocks` connects pages to blocks with sort order
- **Rendering**: `PageBuilder` component maps block collections to React components
- **Data Flow**: `getPageBySlug()` → `getPageBlocks()` → `getBlockContent()` → Component rendering

## HTML Files Analysis

### Files to Convert

1. **index.html** - Homepage *(Updated 2024-12-24)*
   - Header with navigation (matches `Header` component)
   - Hero section with badge, headline, CTAs, contact info (matches `block_hero`)
   - About Us section (matches `block_about_us`)
   - Why Choose Us section with feature cards (matches `block_why_choose_us`)
   - Dentists/Team section (matches `block_team`)
   - Footer (matches `block_footer`)

2. **about-us.html** - About Us page
   - Similar structure to homepage About Us section

3. **service-index.html** - Services listing page
   - Hero section with title
   - Tabbed service categories
   - Service cards grid
   - Consultation banner
   - Footer

4. **service-detail.html** - Individual service detail page
   - Hero with service name
   - Features grid
   - Why choose us section
   - Process/steps section
   - Pricing information
   - CTA buttons

5. **contact-page.html** - Contact/Booking page
   - Contact channels (phone, LINE, email, Facebook)
   - Map embed
   - Booking form
   - Footer

6. **blog.html** - Blog listing page
   - Hero section
   - Search and category filters
   - Featured article
   - Articles grid
   - Footer

7. **promotions.html** - Promotions page
   - Hero banner with countdown
   - Category filters
   - Promotion cards grid
   - Footer

8. **our-work.html** - Portfolio/Case studies page
   - Hero section
   - Stats bar
   - Category filters
   - Case study cards with before/after sliders
   - Footer

### Common Patterns Identified

**Header (Reusable):**
- Logo with gradient background
- Navigation menu (rounded pills with gradient active state)
- CTA button ("ติดต่อเรา")
- Mobile hamburger menu

**Footer (Reusable):**
- Brand column with logo, description, social links
- Service links column
- Info links column
- Contact column with phone, email, LINE, QR code
- Bottom bar with copyright and legal links

**Color Palette:**
- Primary blue: `#1a5fb4`, `#003888`, `#0F3FA1`
- Accent: `#1DAEE0` (cyan), `#FB9C2C` (orange)
- Background: `slate-50`, `slate-100`, white
- Text: `slate-900`, `slate-600`, `slate-500`

**Typography:**
- Font: 'Bricolage Grotesque' for headings (`.font-bricolage`)
- Font: 'Prompt' for body text
- Large headings: `text-4xl` to `text-7xl`
- Body: `text-base` to `text-lg`

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` - All TypeScript interfaces for blocks, pages, services, blog posts
- `lib/data.ts` - Data fetching functions:
  - `getPageBySlug(slug)` - Fetch page by slug
  - `getPageBlocks(pageId)` - Fetch blocks for a page
  - `getBlockContent(collection, itemId)` - Fetch specific block content
  - `getPageWithBlocks(slug)` - Optimized single-query page + blocks
  - `getServices()`, `getServiceBySlug()` - Service data
  - `getBlogPosts()`, `getBlogPostBySlug()` - Blog data
- `lib/directus.ts` - Directus client setup, `getFileUrl()` helper for images

### Component Layer
- `components/PageBuilder.tsx` - Dynamic block renderer (maps collection → component)
- `components/blocks/*.tsx` - Individual block components:
  - `HeroBlock.tsx` - Hero sections
  - `AboutUsBlock.tsx` - About us sections
  - `TeamBlock.tsx` - Team/dentists sections
  - `ServicesBlock.tsx` - Service listings
  - `ContactBlock.tsx` - Contact information
  - `BookingBlock.tsx` - Booking/CTA sections
  - `FormBlock.tsx` - Form sections
  - `LocationsBlock.tsx` - Location/map sections
  - `TextBlock.tsx` - Simple text content
  - `Footer.tsx` - Footer component
- `components/Header.tsx` - Server component that fetches navigation
- `components/HeaderClient.tsx` - Client component for interactive header

### Page Layer
- `app/page.tsx` - Homepage (uses PageBuilder)
- `app/services/page.tsx` - Services listing page
- `app/services/[slug]/page.tsx` - Service detail pages
- `app/blog/page.tsx` - Blog listing page
- `app/blog/[slug]/page.tsx` - Blog detail pages
- `app/[...slug]/page.tsx` - Dynamic page route for CMS pages

### Block Architecture
- Block collections: `block_*` in Directus (e.g., `block_hero`, `block_about_us`)
- Junction table: `page_blocks` connects pages to blocks
- Block registration: All blocks registered in `Schema` interface in `lib/types.ts`
- Block rendering: `PageBuilder` uses `componentMap` to render blocks

## Current Data Flow

**For Block-Based Pages:**
1. Page fetched via `getPageBySlug(slug)` or `getPageWithBlocks(slug)`
2. Page blocks fetched via `getPageBlocks(pageId)` (if not using optimized query)
3. Block content fetched via `getBlockContent(collection, itemId)` for each block
4. Blocks rendered in page using `PageBuilder` component
5. `PageBuilder` maps `block.collection` to React component via `componentMap`
6. Components receive block data and render with Tailwind CSS

**For List/Detail Pages:**
1. Data fetched via `getServices()`, `getBlogPosts()`, etc.
2. ISR configured with `export const revalidate = 60`
3. Components render with fallback handling
4. Images use `getFileUrl()` helper

## Key Patterns & Conventions

### TypeScript Patterns
- Block interfaces: `Block[Name]` in `lib/types.ts` (e.g., `BlockHero`, `BlockAboutUs`)
- Schema registration: All blocks added to `Schema` interface
- Optional fields: Use `?` for optional properties
- Image fields: Typed as `string` (file ID), use `getFileUrl()` to get URL

### Component Patterns
- **Server Components by default** (no "use client")
- **Client Components only for interactivity** (HeaderClient, forms, interactive elements)
- **ISR**: `export const revalidate = 60` in pages/components fetching data
- **Fallbacks**: Handle null/empty with sensible defaults
- **Images**: Always use `getFileUrl(item.image)` helper
- **Props**: Components receive `data` prop with block content

### Data Fetching Patterns
- Page fetching: `getPageBySlug(slug)` → `getPageBlocks(pageId)` → `getBlockContent(collection, itemId)`
- Optimized: `getPageWithBlocks(slug)` - single query for page + all blocks
- Block fetching: `get[BlockName]Block(blockId)` functions in `lib/data.ts`
- Error handling: Try/catch with null returns
- Directus queries: Use `readItems` with filters and fields

### Block Architecture Patterns
- Block collections: `block_[name]` in Directus (e.g., `block_hero`)
- Junction table: `page_blocks` connects pages to blocks with `sort` field
- Block rendering: `findBlock(collection)` pattern or `PageBuilder` component
- Block interfaces: Match Directus collection structure exactly

## HTML to Block Mapping

### Existing Blocks (Can Reuse/Update)
- `block_hero` - Hero sections (update styling to match HTML)
- `block_about_us` - About us sections (matches HTML structure)
- `block_team` - Team/dentists sections (matches HTML structure)
- `block_services` - Service listings (needs update for tabbed interface)
- `block_contact` - Contact information (matches HTML structure)
- `block_booking` - Booking/CTA sections (matches HTML structure)
- `block_form` - Form sections (matches HTML booking form)
- `block_locations` - Location/map sections (matches HTML structure)
- `block_footer` - Footer (matches HTML structure)

### New Blocks Needed *(Updated 2024-12-24)*

1. **`block_promotions`** - Promotion cards grid with filters
   - **Type**: Page Block (RSC) + Client Component for countdown timer
   - **Fields**: headline, subtitle, category_filter (boolean)
   - **Data**: Fetches from `promotions` collection
   - **Client Component**: Countdown timer with days/hours/mins/secs

2. **`block_portfolio`** - Case studies/portfolio grid with before/after sliders
   - **Type**: Page Block (RSC) + Client Component for slider
   - **Fields**: headline, subtitle, category_filter (boolean)
   - **Data**: Fetches from `portfolio_cases` collection
   - **Client Component**: Before/After image comparison slider with drag handle

3. **`block_blog_listing`** - Blog listing with search and filters
   - **Type**: Page Block (RSC) + Client Component for search/filter
   - **Fields**: headline, subtitle, show_featured (boolean), show_search (boolean)
   - **Data**: Fetches from `blog_posts` collection
   - **Client Component**: Search input, category filter chips

4. **`block_service_detail`** - Service detail page sections
   - **Type**: Page Block (RSC)
   - **Fields**: features_section, process_section, pricing_section (all optional toggles)
   - **Data**: Renders service-specific content from `services` collection

5. **`block_stats`** - Statistics bar (for portfolio page)
   - **Type**: Page Block (RSC)
   - **Fields**: stats (JSON array with label, value, icon)
   - **Data**: Self-contained, no external collection

### Pages to Create/Update
- `app/page.tsx` - Homepage (update blocks to match HTML)
- `app/services/page.tsx` - Services listing (update for tabbed interface)
- `app/services/[slug]/page.tsx` - Service detail (create/update)
- `app/blog/page.tsx` - Blog listing (create/update)
- `app/blog/[slug]/page.tsx` - Blog detail (create/update)
- `app/promotions/page.tsx` - Promotions page (create)
- `app/our-work/page.tsx` - Portfolio page (create)
- `app/contact/page.tsx` - Contact page (create/update)

## Conversion Strategy

### Phase 1: Update Existing Blocks
1. Update `HeroBlock` to match HTML hero styling (gradient backgrounds, badges, CTAs)
2. Update `AboutUsBlock` to match HTML styling (arched image, text layout)
3. Update `TeamBlock` to match HTML dentist grid (5-column layout, cards)
4. Update `ServicesBlock` to support tabbed interface
5. Update `Footer` to match HTML footer structure

### Phase 2: Create New Blocks
1. Create `PromotionsBlock` component
2. Create `PortfolioBlock` component (with before/after slider)
3. Create `BlogListingBlock` component (with search/filters)
4. Create `ServiceDetailBlock` component (features, process, pricing)
5. Create `StatsBlock` component

### Phase 3: Create/Update Pages
1. Update homepage (`app/page.tsx`) with correct blocks
2. Create/update services listing page
3. Create/update service detail pages
4. Create/update blog listing page
5. Create/update blog detail pages
6. Create promotions page
7. Create portfolio/our-work page
8. Create/update contact page

### Phase 4: Directus Setup
1. Create new block collections in Directus
2. Add fields to existing block collections if needed
3. Create pages in Directus
4. Link blocks to pages via `page_blocks` junction
5. Populate initial content

## Dependencies & Integration Points

### Directus Collections
- `pages` - Page records with slugs
- `page_blocks` - Junction table linking pages to blocks
- `block_*` - Individual block collections
- `services` - Service records
- `service_categories` - Service categories
- `blog_posts` - Blog post records
- `blog_categories` - Blog categories
- `navigation` - Navigation items
- `global_settings` - Site-wide settings

### External Integrations
- Google Maps embed (for contact page)
- LINE Official Account integration
- Form submission handling (via `block_form`)

## Known Constraints

- **ISR**: Must include `export const revalidate = 60` in pages/components fetching data
- **Images**: Always use `getFileUrl(item.image)` helper, never direct URLs
- **Server Components**: Default to RSC; only use `"use client"` for interactivity
- **Tailwind Only**: No custom CSS; use Tailwind classes exclusively
- **Fallbacks**: Always handle null/empty CMS responses with sensible defaults
- **Block Registration**: New blocks must be added to Schema interface in `lib/types.ts`
- **Block Collections**: Must follow `block_[name]` naming convention
- **Type Safety**: All Directus collections must have TypeScript interfaces

## Similar Implementations

### Example 1: AboutUsBlock
- Files: `components/blocks/AboutUsBlock.tsx`, `lib/types.ts` (BlockAboutUs interface)
- Pattern: Two-column layout with text and image, uses `getFileUrl()` for images
- Reusable patterns: Image handling, text layout, responsive grid

### Example 2: TeamBlock
- Files: `components/blocks/TeamBlock.tsx`, `lib/types.ts` (BlockTeam interface)
- Pattern: Grid of team members with images, names, specialties
- Reusable patterns: Card grid, image handling, responsive columns

### Example 3: ServicesBlock
- Files: `components/blocks/ServicesBlock.tsx`, `lib/types.ts` (BlockServices interface)
- Pattern: Service listing with icons and labels
- Reusable patterns: Grid layout, icon mapping

## Code Snippets (Key Patterns)

### Pattern: Block Component Structure
```typescript
// components/blocks/ExampleBlock.tsx
import type { BlockExample } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface ExampleBlockProps {
  data?: BlockExample | null;
}

export default function ExampleBlock({ data }: ExampleBlockProps) {
  if (!data) return null;

  // Extract data with fallbacks
  const title = data.title ?? "Default Title";
  const imageUrl = getFileUrl(data.image_url as any);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Component JSX */}
      </div>
    </section>
  );
}
```

### Pattern: Page with Blocks
```typescript
// app/page.tsx
import PageBuilder from "@/components/PageBuilder";
import { getPageWithBlocks } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const result = await getPageWithBlocks("home");
  if (!result) return <div>Page not found</div>;

  const { page, blocks } = result;

  return (
    <main>
      <Header />
      <PageBuilder blocks={blocks} />
    </main>
  );
}
```

### Pattern: List Page
```typescript
// app/services/page.tsx
import { getServices } from "@/lib/data";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <main>
      <Header />
      {/* Render services */}
    </main>
  );
}
```

### Pattern: Detail Page
```typescript
// app/services/[slug]/page.tsx
import { getServiceBySlug } from "@/lib/data";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <main>
      <Header />
      {/* Render service detail */}
    </main>
  );
}
```

## Questions to Resolve (Updated 2024-12-24)

- [x] Should promotions be a separate collection or part of services?
  - **RESOLVED**: Separate `promotions` collection. Promotions have unique fields (countdown timers, discount values, date ranges) that don't fit services model.

- [x] Should portfolio/case studies be a separate collection or part of services?
  - **RESOLVED**: Separate `portfolio_cases` collection. Portfolio items need before/after image pairs, treatment categories, and dates that differ from services.

- [x] How should the tabbed service interface work in CMS? (Category-based filtering)
  - **RESOLVED**: Use existing `service_categories` collection. Frontend filters services by category. Tab UI is client-side component.

- [x] Should blog search/filter be client-side or server-side?
  - **RESOLVED**: Client-side filtering. Simpler implementation, better UX for small/medium blog sizes. For large blogs, can add server-side pagination later.

- [x] How should before/after sliders work? (Image pairs in CMS)
  - **RESOLVED**: Store `image_before` and `image_after` fields in `portfolio_cases` collection. Use Client Component with draggable slider for comparison.

- [x] Should contact form be handled by existing `block_form` or new component?
  - **RESOLVED**: Reuse existing `block_form` infrastructure. Configure form fields in Directus for booking/contact forms. Existing form submission API (`/api/forms`) can be reused.

## Research Notes

**HTML Design Characteristics:**
- Modern, clean design with gradient accents
- Rounded corners (`rounded-2xl`, `rounded-3xl`)
- Glass morphism effects (backdrop blur)
- Responsive mobile-first design
- Thai language content
- Consistent color palette (blues, cyan, orange)
- Bricolage Grotesque font for headings
- Prompt font for body text

**Key Design Elements:**
- Gradient backgrounds (`bg-gradient-to-br`, `bg-gradient-to-r`)
- Shadow effects (`shadow-xl`, `shadow-2xl`)
- Hover effects (`hover:scale-105`, `hover:shadow-md`)
- Badge components (rounded pills with colors)
- Card components (white background, rounded, shadow)
- Icon usage (Lucide React icons)

**Conversion Priorities:**
1. Header/Footer (reusable across all pages)
2. Homepage blocks (About Us, Team)
3. Services pages (listing and detail)
4. Contact/Booking page
5. Blog pages
6. Promotions page
7. Portfolio page
