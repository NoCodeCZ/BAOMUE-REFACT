# Reference Guides

> On-demand developer guides for the Dental Clinic Next.js + Directus framework.

## How to Use

These guides are task-specific references. Load them when working on a particular task type. Each guide contains:

- Pattern overview
- Step-by-step instructions
- Code templates
- Quick checklist

---

## Available Guides

### Core Development

| # | Guide | When to Use |
|---|-------|-------------|
| 01 | [Creating Directus Blocks](./01_creating_directus_blocks.md) | Adding new CMS-driven content blocks |
| 02 | [Adding New Pages](./02_adding_new_pages.md) | Creating list pages, detail pages, static pages |
| 03 | [Data Fetching Functions](./03_data_fetching_functions.md) | Writing Directus query functions |
| 07 | [Server & Client Components](./07_server_client_components.md) | Deciding component type, building each |
| 08 | [TypeScript Interfaces](./08_typescript_interfaces.md) | Adding types for Directus collections |
| 10 | [Dynamic Routes](./10_dynamic_routes.md) | Creating `[slug]` pages |

### Content & Media

| # | Guide | When to Use |
|---|-------|-------------|
| 09 | [Image Handling](./09_image_handling.md) | Working with Directus file assets |
| 11 | [Navigation Items](./11_navigation_items.md) | Adding/modifying site navigation |
| 12 | [Error & Loading States](./12_error_loading_states.md) | Error boundaries, loading UI, empty states |

### Design & Analytics

| # | Guide | When to Use |
|---|-------|-------------|
| 04 | [Analytics Event Tracking](./04_analytics_event_tracking.md) | Adding GTM/GA4 event tracking |
| 05 | [AuraBuild to Next.js](./05_aurabuild_conversion.md) | Converting HTML designs to React |
| 06 | [SEO & Metadata](./06_seo_metadata.md) | Meta tags, structured data, sitemap |

---

## Quick Reference

### Common File Locations

| Task | Files to Modify |
|------|-----------------|
| New block type | `lib/types.ts`, `lib/data.ts`, `components/blocks/` |
| New page | `app/[route]/page.tsx` |
| New collection | `lib/types.ts`, `lib/data.ts`, `config/` |
| Add tracking event | `lib/analytics/events.ts`, component file |
| Add navigation item | Directus Admin → Navigation |

### Standard Patterns

```typescript
// ISR revalidation (add to all pages)
export const revalidate = 60;

// Handle missing data
if (!data) notFound();

// Handle empty lists
if (!items.length) return <EmptyState />;

// Server component data fetching
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Client component interactivity
"use client";
export default function Component({ data }) {
  const [state, setState] = useState();
  return <div onClick={() => setState(...)}>...</div>;
}
```

---

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Global project rules
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - System architecture
- [docs/USER_GUIDE.md](../docs/USER_GUIDE.md) - Content manager guide
