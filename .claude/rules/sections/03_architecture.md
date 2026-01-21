# Architecture

## Folder Structure
```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── error.tsx           # Error boundary
│   ├── loading.tsx         # Loading state
│   ├── not-found.tsx       # 404 page
│   ├── api/                # API routes
│   │   └── revalidate/     # On-demand ISR webhook
│   ├── blog/
│   ├── services/
│   │   └── [slug]/
│   └── [other-pages]/
│
├── components/             # React components
│   ├── blocks/             # CMS block components
│   ├── ui/                 # Reusable UI components
│   └── [Feature]Client.tsx # Client components (interactive)
│
├── lib/                    # Utilities & data layer
│   ├── directus.ts         # Directus client setup
│   ├── data.ts             # Data fetching functions
│   ├── types.ts            # TypeScript interfaces
│   └── analytics/          # Analytics utilities
│       ├── gtm.tsx         # GTM provider
│       └── events.ts       # Event tracking helpers
│
├── config/                 # Configuration files
│   └── analytics.config.ts # Per-client analytics config
│
├── reference/              # On-demand developer guides
│
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Block-Based Page Architecture
Pages are built from composable blocks fetched from Directus:

```
Page (pages collection)
  └── PageBlocks (page_blocks junction)
        ├── block_hero
        ├── block_features
        ├── block_testimonials
        ├── block_services
        └── ... (other blocks)
```
