# Research: Directus Backend & SDK Integration

**Generated**: 2024-12-28
**Scope**: Directus SDK v16 functionality verification and BaaS template adaptation
**Complexity**: Medium

## System Overview

This project uses **Directus SDK v16.0.0** with Next.js 14 for a headless CMS architecture. The Directus backend follows a block-based page builder pattern where pages are composed of ordered content blocks. The SDK is configured with static token authentication using the `rest()` transport and `staticToken()` extension. All data fetching functions use try/catch error handling with graceful fallbacks returning null or empty arrays.

The backend schema (from `docs/snapshot.json`) shows a comprehensive Directus 11.7.2 instance with PostgreSQL, containing 50+ collections organized into block types, content types (pages, services, blog), and utility collections (navigation, forms, etc.). The schema follows Directus BaaS template patterns with M2A (Many-to-Any) relationships for flexible page composition.

## Relevant Files & Their Roles

### SDK Configuration
- `lib/directus.ts` (lines 1-56) - Directus client initialization with Schema types, static token auth, fallback noop client
- `package.json` (line 14) - `@directus/sdk: ^16.0.0` dependency

### Data Fetching Layer
- `lib/data.ts` (lines 1-573) - All data fetching functions using `readItems` and `readSingleton` from SDK
- `lib/types.ts` (lines 1-337) - TypeScript Schema interface and collection type definitions

### Backend Schema
- `docs/snapshot.json` (15,916 lines) - Complete Directus schema snapshot including:
  - Collection metadata (50+ collections)
  - Field definitions with types, interfaces, and validation
  - Relationship mappings (M2O, O2M, M2M, M2A)
  - Block collections (block_hero, block_features, block_pricing, etc.)
  - Content collections (pages, services, blog_posts)
  - Utility collections (navigation, forms, global_settings)

### Page Rendering
- `app/page.tsx` (lines 1-1802) - Homepage with block rendering pattern using `findBlock()` helper
- Block fetching pattern: `getPageBySlug()` → `getPageBlocks()` → `getBlockContent()`

## Current Data Flow

**SDK Client Initialization:**
1. Environment variables loaded: `NEXT_PUBLIC_DIRECTUS_URL`, `DIRECTUS_STATIC_TOKEN`
2. URL sanitized (trailing slash removed)
3. Client created: `createDirectus<Schema>(url).with(rest()).with(staticToken(token))`
4. Fallback noop client if env vars missing (throws descriptive error)

**Data Fetching Pattern:**
1. All functions use `directus.request()` wrapper
2. SDK methods: `readItems()` for collections, `readSingleton()` for singletons
3. Type-safe wrappers: `readItemsTyped` and `readSingletonTyped` (cast to `any` to handle dynamic collections)
4. Query options: `filter`, `fields`, `sort`, `limit`
5. Error handling: Try/catch with console.error, return null/empty array on failure

**Block-Based Page Architecture:**
1. Page fetched via `getPageBySlug(slug)`
2. Page blocks fetched via `getPageBlocks(pageId)` from `page_blocks` junction table
3. Each block content fetched via `getBlockContent(collection, itemId)` using M2A pattern
4. Blocks rendered using `findBlock(collection)` pattern in pages

## Key Patterns & Conventions

### SDK Configuration Patterns

**Client Setup:**
```typescript
// From lib/directus.ts
import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types';

const directus = createDirectus<Schema>(url)
  .with(rest())
  .with(staticToken(token));
```

**Error Handling:**
- All data functions wrapped in try/catch
- Errors logged to console.error with context
- Functions return `null` for single items, `[]` for arrays on error
- No throwing errors to calling code - graceful degradation

**Type Safety:**
- Schema interface in `lib/types.ts` defines all collections
- Generic `<Schema>` type parameter on client
- Type casting (`as any`) for dynamic collection names (blocks)
- Return type assertions: `as Page`, `as BlockHero`, etc.

### SDK Method Usage

**Reading Items (Collections):**
```typescript
const pages = await directus.request(
  readItemsTyped('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*'],
    limit: 1,
  })
);
```

**Reading Singletons:**
```typescript
const settings = await directus.request(
  readSingletonTyped('global_settings', {
    fields: ['*', 'logo.*'],
  })
);
```

**Query Patterns:**
- Filter operators: `_eq`, `_null`, `_icontains`, `_or` (nested objects)
- Field selection: `['*']` for all, `['id', 'title']` for specific, nested `'logo.*'`
- Sorting: `sort: ['sort']`, `sort: ['-published_date']` (descending)
- Limits: `limit: 1` for single items, `limit: 100` for lists

### Backend Schema Patterns (from snapshot.json)

**Block Collections:**
- Naming: `block_[name]` (e.g., `block_hero`, `block_pricing`)
- All blocks have: `id`, `status`, `date_created`, `user_created`, `date_updated`, `user_updated`
- Hidden in UI: `hidden: true` in meta
- Grouped under: `group: "blocks"` in meta
- Junction table: `page_blocks` with M2A relationship

**Page Architecture:**
- `pages` collection: `id`, `title`, `slug`, `status`
- `page_blocks` junction: `page` (M2O to pages), `collection` (string), `item` (string ID), `sort` (integer)
- M2A pattern allows blocks from any `block_*` collection

**Content Collections:**
- `services`: Service catalog with categories, images, SEO fields
- `blog_posts`: Blog system with categories, featured images, metadata
- `navigation`: Menu system with hierarchical items

## Dependencies & Integration Points

### Directus SDK Version
- **Current**: `@directus/sdk@^16.0.0`
- **Compatible with**: Directus 11.7.2 (per snapshot.json)
- **SDK Methods Used**: `readItems`, `readSingleton` (from query export)
- **Extensions Used**: `rest()`, `staticToken()`

### Environment Variables Required
- `NEXT_PUBLIC_DIRECTUS_URL`: Directus instance URL
- `DIRECTUS_STATIC_TOKEN`: Static token for authentication

### Directus Collections Referenced
- **Core**: `pages`, `page_blocks`, `global_settings`, `navigation`
- **Blocks** (16 types): `block_hero`, `block_features`, `block_testimonials`, `block_pricing`, `block_footer`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`, `block_contact`, `block_button`, `block_form`, `block_gallery`, `block_posts`, `block_richtext`, `block_pricing_cards`
- **Content**: `services`, `service_categories`, `blog_posts`, `blog_categories`
- **Forms**: `forms`, `form_fields`, `form_submissions`, `form_submission_values`

### External Dependencies
- **Next.js 14.2.18**: App Router for server components
- **TypeScript 5.6.2**: Type safety with Schema interface
- **PostgreSQL**: Database (vendor from snapshot.json)

## Known Constraints

- **Type Casting**: Dynamic block collections require `as any` casting for `readItemsTyped()`
- **No Create/Update/Delete**: Current implementation is read-only (no mutations)
- **Static Token Only**: No OAuth or session-based auth patterns
- **No Real-time**: No subscriptions or WebSocket connections
- **Error Boundaries**: Errors caught at function level, not propagated to React error boundaries
- **No Query Caching**: Each request hits Directus directly (no cache layer)
- **Collection Discovery**: Must manually maintain Schema interface when collections change

## SDK Functionality Verification Checklist

### ✅ Current Implementation Status

- [x] **SDK Installation**: `@directus/sdk@^16.0.0` in package.json
- [x] **Client Initialization**: `createDirectus<Schema>().with(rest()).with(staticToken())`
- [x] **Read Operations**: `readItems()` and `readSingleton()` implemented
- [x] **Type Safety**: Schema interface defined, generic types used
- [x] **Error Handling**: Try/catch with graceful fallbacks
- [x] **File URL Helper**: `getFileUrl()` function for asset URLs
- [x] **Environment Validation**: Warns if env vars missing, provides noop fallback

### ❌ Missing/Incomplete Features

- [ ] **Write Operations**: No `createItems()`, `updateItems()`, `deleteItems()` implemented
- [ ] **Error Type Checking**: No `isDirectusError()` utility usage
- [ ] **GraphQL Transport**: Only REST transport, no GraphQL option
- [ ] **Query Caching**: No caching layer for repeated queries
- [ ] **Batch Operations**: No batch read/write patterns
- [ ] **File Upload**: No file upload functionality
- [ ] **Authentication Helpers**: No login/logout/auth refresh patterns
- [ ] **WebSocket/Realtime**: No real-time subscriptions
- [ ] **SDK Health Check**: No connection test or health check function

## Directus BaaS Template Alignment

### Current Schema Matches Simple CMS Template Patterns

**Block-Based Page Builder:**
- ✅ M2A relationship for flexible page composition
- ✅ Junction table pattern (`page_blocks`)
- ✅ Block collections follow naming convention
- ✅ Status workflow (`published`/`draft`)

**Content Types:**
- ✅ Services with categories
- ✅ Blog posts with categories
- ✅ Navigation menu system
- ✅ Global settings singleton

**Form System:**
- ✅ Reusable forms collection
- ✅ Form fields with validation
- ✅ Form submissions tracking
- ✅ Form block for page integration

### Recommended Adaptations for Simple Website Template

**1. Simplify Block System:**
- Current: 20+ block types may be overkill for simple website
- Recommendation: Core blocks only (hero, features, text, gallery, form, contact)
- Keep M2A pattern but reduce block collection count

**2. Enhance Error Handling:**
- Add `isDirectusError()` checks for better error messages
- Implement retry logic for transient failures
- Add error boundaries at page level

**3. Add Write Operations:**
- Form submission handlers using `createItems()`
- Contact form submissions to Directus
- Newsletter signups

**4. Optimize Queries:**
- Add query caching (React Cache or SWR)
- Batch block fetching in single request where possible
- Use GraphQL transport for complex nested queries

**5. Health Check Function:**
```typescript
export async function checkDirectusConnection(): Promise<boolean> {
  try {
    await directus.request(
      readSingletonTyped('global_settings', {
        fields: ['id'],
      })
    );
    return true;
  } catch {
    return false;
  }
}
```

## Code Snippets (Key Patterns)

### Pattern: SDK Client Initialization
```typescript
// From lib/directus.ts
import { createDirectus, rest, staticToken } from '@directus/sdk';
import type { Schema } from './types';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_STATIC_TOKEN;

const directus = cleanUrl
  ? createDirectus<Schema>(cleanUrl)
      .with(rest())
      .with(staticToken(directusToken || ''))
  : ({
      request: async () => {
        throw new Error('[Directus] Client not configured');
      },
    } as any);
```

### Pattern: Reading Items with Filters
```typescript
// From lib/data.ts
const pages = await directus.request(
  readItemsTyped('pages', {
    filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
    fields: ['*'],
    limit: 1,
  })
);
```

### Pattern: Reading Nested Relations
```typescript
// From lib/data.ts
const services = await directus.request(
  readItemsTyped('services', {
    filter: { status: { _eq: 'published' } },
    fields: ['*', 'category.*', 'hero_image.*'],
    sort: ['name'],
  })
);
```

### Pattern: Reading Singleton
```typescript
// From lib/data.ts
const settings = await directus.request(
  readSingletonTyped('global_settings', {
    fields: ['*', 'logo.*'],
  })
);
```

### Pattern: Error Handling
```typescript
// From lib/data.ts (all functions follow this pattern)
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await directus.request(/* ... */);
    return pages?.[0] as Page || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
```

### Pattern: File URL Helper
```typescript
// From lib/directus.ts
export function getFileUrl(
  fileId: string | { id: string } | null | undefined
): string | null {
  if (!fileId || !process.env.NEXT_PUBLIC_DIRECTUS_URL) return null;
  
  if (typeof fileId === 'string' && (fileId.startsWith('http') || fileId.startsWith('/'))) {
    return fileId;
  }
  
  const id = typeof fileId === 'string' ? fileId : fileId.id;
  if (!id) return null;
  
  const cleanUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL.replace(/\/$/, '');
  return `${cleanUrl}/assets/${id}`;
}
```

## Questions to Resolve

- [ ] Should we implement write operations (form submissions) using SDK?
- [ ] Should we add GraphQL transport for complex nested queries?
- [ ] Should we implement query caching (React Cache API)?
- [ ] Should we add SDK health check function for monitoring?
- [ ] Should we reduce block collection count to match Simple CMS template?
- [ ] Should we implement `isDirectusError()` error type checking?

## Research Notes

### SDK v16 Features Not Currently Used

1. **GraphQL Transport**: Can use `.with(graphql())` for GraphQL queries
2. **WebSocket Transport**: Can use `.with(websocket())` for real-time subscriptions
3. **Error Utilities**: `isDirectusError()` from SDK for error type checking
4. **File Upload**: `createFiles()` method available for file uploads
5. **Write Operations**: `createItems()`, `updateItems()`, `deleteItems()` available
6. **Batch Operations**: Can batch multiple operations in single request

### Backend Schema Insights

- **Snapshot Version**: 1 (Directus 11.7.2)
- **Database**: PostgreSQL
- **Collections Count**: 50+ collections
- **Block Collections**: 20+ block types (may be excessive for simple website)
- **Relationships**: M2O, O2M, M2M, M2A patterns all used
- **System Fields**: All collections include accountability fields (user_created, date_created, etc.)

### Alignment with Directus BaaS Templates

The current schema closely matches Directus "Simple CMS" template patterns:
- ✅ Block-based page builder
- ✅ Content types (services, blog)
- ✅ Navigation system
- ✅ Form system
- ✅ Global settings

**Difference**: Current schema has more block types (20+) than typical simple website template (5-10 core blocks).

## Next Steps

1. **Implement SDK Health Check**: Add connection verification function
2. **Add Write Operations**: Implement form submission handlers
3. **Enhance Error Handling**: Use `isDirectusError()` utility
4. **Optimize Queries**: Add caching layer for repeated queries
5. **Simplify Blocks**: Consider reducing to core block types for simpler sites
6. **Document SDK Patterns**: Create reference guide for SDK usage patterns

