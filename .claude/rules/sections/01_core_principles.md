# Core Principles

- **Type Safety First**: All Directus collections must have corresponding TypeScript interfaces in `lib/types.ts`
- **Server Components by Default**: Use React Server Components; only add `"use client"` when interactivity is required
- **Graceful Degradation**: Always provide fallback content when CMS data is unavailable
- **ISR Strategy**: Use `revalidate = 60` for fresh content without full rebuilds
- **No Hardcoded Content**: All user-facing text must come from Directus CMS
- **Mobile-First**: Design responsive layouts starting from mobile breakpoints
