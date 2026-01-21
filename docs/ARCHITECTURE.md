# Website Architecture

> Next.js + Directus headless CMS for dental clinic websites.

## Current Implementation

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| CMS | Directus 16 with @directus/sdk |
| Caching | ISR (revalidate = 60) |

### Routes Implemented

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Complete | Homepage with block-based content |
| `/services` | Complete | Services list grouped by category |
| `/services/[slug]` | Complete | Service detail page |
| `/blog` | UI Only | Blog listing (no CMS data yet) |

### Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage (block rendering)
│   ├── globals.css         # Global styles
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading state
│   ├── not-found.tsx       # 404 page
│   ├── services/
│   │   ├── page.tsx        # Services listing
│   │   └── [slug]/page.tsx # Service detail
│   └── blog/
│       └── page.tsx        # Blog listing (UI shell)
│
├── components/
│   ├── Header.tsx          # Server component
│   ├── HeaderClient.tsx    # Client component (mobile menu)
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Testimonials.tsx
│   ├── Pricing.tsx
│   ├── Footer.tsx
│   ├── PromotionsCarousel.tsx
│   ├── BlogNavigation.tsx
│   └── Navbar.tsx
│
├── lib/
│   ├── directus.ts         # Directus client + getFileUrl()
│   ├── data.ts             # Data fetching functions
│   └── types.ts            # TypeScript interfaces
│
├── config/
│   └── COLLECTIONS_*.json  # Directus collection configs
│
└── reference/              # Task-specific dev guides
```

## Data Layer

### Directus Client (lib/directus.ts)

```typescript
// Static token authentication
const directus = createDirectus<Schema>(url)
  .with(rest())
  .with(staticToken(token));

// Helper for file URLs
export function getFileUrl(fileId: string | { id: string }): string | null
```

### Data Fetching (lib/data.ts)

**Page Functions:**
- `getPageBySlug(slug)` - Fetch page by slug
- `getPageBlocks(pageId)` - Fetch ordered blocks for page
- `getBlockContent(collection, itemId)` - Generic block fetcher

**Block Functions (16 types):**
- `getHeroBlock()`, `getFeaturesBlock()`, `getTestimonialsBlock()`
- `getPricingBlock()`, `getFooterBlock()`, `getAboutUsBlock()`
- `getWhyChooseUsBlock()`, `getTeamBlock()`, `getSignatureTreatmentBlock()`
- `getSafetyBannerBlock()`, `getServicesBlock()`, `getLocationsBlock()`
- `getBookingBlock()`, `getContactBlock()`

**Domain Functions:**
- `getServices()` - All published services
- `getServiceBySlug(slug)` - Single service with category
- `getServiceCategories()` - Service categories
- `getNavigationItems()` - Navigation with children
- `getGlobalSettings()` - Site settings

### TypeScript Types (lib/types.ts)

**Collections Typed:**
- `Page`, `PageBlock`, `Block`
- 16 block types (`BlockHero`, `BlockFeatures`, etc.)
- `Service`, `ServiceCategory`
- `NavigationItem`, `GlobalSettings`
- Supporting types (`PageFeature`, `PageTestimonial`, `PagePricingPlan`)

## Block-Based Page Architecture

Pages are composed of ordered blocks:

```
Page (pages collection)
  └── PageBlocks (page_blocks junction, M2A)
        ├── block_hero
        ├── block_about_us
        ├── block_services
        └── ... (16 block types available)
```

**Homepage Rendering Pattern:**
```typescript
// app/page.tsx
const page = await getPageBySlug('home');
const blocks = await getPageBlocks(page.id);

for (const block of blocks) {
  const content = await getBlockContent(block.collection, block.item);
  // Render based on block.collection type
}
```

## Environment Variables

```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.com
DIRECTUS_STATIC_TOKEN=your-token
```

## Not Yet Implemented

- Analytics (GTM, GA4)
- JSON-LD structured data
- Sitemap generation
- API revalidation webhook
- Blog content fetching
- Contact forms
- Dentists, Locations, Promotions, Cases, FAQs collections
