# AI Coding Assistant Instructions

1. **Read before editing**: Always read existing files before making changes to understand patterns
2. **Follow type definitions**: Check `lib/types.ts` for all Directus collection interfaces
3. **Use Server Components**: Default to RSC; only use `"use client"` for interactivity
4. **Maintain ISR**: Include `export const revalidate = 60` in pages/components fetching data
5. **Graceful fallbacks**: Always handle null/empty CMS responses with sensible defaults
6. **Track important events**: Add GTM events for booking clicks, form submissions, phone clicks
7. **Tailwind only**: No custom CSS; use Tailwind classes exclusively
8. **Run lint before commit**: Execute `npm run lint` to catch issues
9. **Test builds**: Run `npm run build` to verify no SSR/SSG errors
10. **Check mobile**: Verify responsive design works on mobile breakpoints

## Reference Guides
Load task-specific guides from `reference/` folder:
- `reference/01_creating_directus_blocks.md` - New CMS blocks
- `reference/02_adding_new_pages.md` - List & detail pages
- `reference/03_data_fetching_functions.md` - Directus queries
- `reference/04_analytics_event_tracking.md` - GTM/GA4 events
- `reference/05_aurabuild_conversion.md` - HTML → React
- `reference/06_seo_metadata.md` - Meta tags & JSON-LD
- `reference/07_server_client_components.md` - Component types
- `reference/08_typescript_interfaces.md` - Directus types
- `reference/09_image_handling.md` - Asset URLs
- `reference/10_dynamic_routes.md` - [slug] pages
- `reference/11_navigation_items.md` - Site navigation
- `reference/12_error_loading_states.md` - Error boundaries

## Quick Patterns
```typescript
// ISR revalidation
export const revalidate = 60;

// Handle missing data
if (!data) notFound();

// Handle empty lists
if (!items.length) return <EmptyState />;

// Image URLs
const url = getFileUrl(item.image);
```
