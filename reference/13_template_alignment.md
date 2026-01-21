# Template Alignment Guide

> Reference for maintaining alignment with Directus Simple Website CMS template patterns.

## Overview

This project is based on the [Directus Simple Website CMS template](https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms) with domain-specific extensions for a dental clinic website.

## Core Pattern: Page Builder

```
pages (collection)
  └── blocks (M2A field)
        └── page_blocks (junction table)
              ├── block_hero
              ├── block_text
              ├── block_gallery
              ├── block_form
              ├── block_contact
              └── [domain-specific blocks]
```

### How It Works

1. **pages** collection stores page metadata (title, slug, status)
2. **page_blocks** is a junction table with `page`, `item`, `collection`, `sort` fields
3. Block collections store actual content (`block_hero`, `block_text`, etc.)
4. M2A relationship allows any block type to be added to any page

## Template Alignment Status

### Aligned ✅

| Template Component | Our Implementation |
|-------------------|-------------------|
| `pages` collection | ✅ `pages` |
| `navigation` (hierarchical) | ✅ `navigation` |
| `global_settings` (singleton) | ✅ `global_settings` |
| `forms` + `form_fields` + `form_submissions` | ✅ All three |
| M2A page builder | ✅ `page_blocks` |
| `block_hero` | ✅ `block_hero` |
| `block_text` | ✅ `block_text` |
| `block_gallery` | ✅ `block_gallery` |
| `block_form` | ✅ `block_form` |
| `block_contact` | ✅ `block_contact` |
| `block_features` | ✅ `block_features` |
| `block_testimonials` | ✅ `block_testimonials` |
| `block_pricing` | ✅ `block_pricing` |

### Extended (Domain-Specific)

These blocks are specific to dental clinic functionality:

- `block_about_us` - About section with headline, paragraphs, image
- `block_why_choose_us` - 4-point USP section
- `block_team` - Team/dentist profiles
- `block_signature_treatment` - Treatment showcase with steps and stats
- `block_safety_banner` - Safety protocols banner
- `block_services` - Services grid
- `block_locations` - Branch locations with map
- `block_booking` - Booking CTA section

### Naming Differences

| Template | Our Project | Reason |
|----------|-------------|--------|
| `posts` | `blog_posts` | More descriptive, no impact on functionality |

## Adding New Blocks

Follow `reference/01_creating_directus_blocks.md` with these template conventions:

### 1. Naming Convention

- **Collection**: `block_[name]` (snake_case)
- **Interface**: `Block[Name]` (PascalCase) in `lib/types.ts`
- **Component**: `[Name]Block.tsx` in `components/blocks/`

### 2. Collection Setup

```json
{
  "collection": "block_[name]",
  "meta": {
    "icon": "appropriate_icon",
    "note": "Brief description of what this block does",
    "group": "all_blocks",
    "hidden": false
  }
}
```

### 3. TypeScript Interface

Add to `lib/types.ts`:

```typescript
// In Schema interface
block_[name]: Block[Name][];

// Interface definition
export interface Block[Name] {
  id: number;
  // ... fields matching Directus collection
}
```

### 4. Data Fetching

Add to `lib/data.ts`:

```typescript
export async function get[Name]Block(blockId: number): Promise<Block[Name] | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_[name]', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as Block[Name] || null;
  } catch (error) {
    logDirectusError('get[Name]Block', error);
    return null;
  }
}
```

### 5. Component

Create `components/blocks/[Name]Block.tsx`:

```typescript
import type { Block[Name] } from "@/lib/types";

interface [Name]BlockProps {
  data?: Block[Name] | null;
}

export default function [Name]Block({ data }: [Name]BlockProps) {
  if (!data) return null;
  // ... render block content
}
```

### 6. Register in M2A

Update `page_blocks.item` relation's `one_allowed_collections` to include the new block.

## Forms System

### Architecture

```
forms (collection)
  ├── name, slug, description
  ├── submit_button_text, success_message
  ├── redirect_url
  └── fields → form_fields (O2M)
        └── label, field_type, placeholder, required, options, sort

form_submissions (collection)
  └── form, data (JSON), status, date_created

block_form (page builder block)
  └── form (M2O), title, description, background_style
```

### Form Field Types

Supported in `FormField.field_type`:
- `text` - Single line text input
- `email` - Email input with validation
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `checkbox` - Boolean checkbox
- `radio` - Radio button group
- `file` - File upload (if implemented)

### Form Submission API

Endpoint: `POST /api/forms/submit`

```typescript
{
  type: "form",
  formId: number,
  data: Record<string, any>
}
```

## Navigation System

Hierarchical navigation with parent-child relationships:

```typescript
interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;        // External URL
  page?: Page | number | null; // Internal page link
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];
}
```

### URL Resolution

Use `getNavigationUrl(item)` helper:
1. If `url` is set → use external URL
2. If `page` is linked → use `/${page.slug}`
3. Fallback → `#`

## Global Settings

Singleton collection for site-wide configuration:

```typescript
interface GlobalSettings {
  id: number;
  site_name?: string;
  site_description?: string;
  logo?: string;       // Directus file UUID
  favicon?: string;    // Directus file UUID
}
```

## Best Practices

### Server Components (Default)

Most block components should be Server Components:
- No `"use client"` directive
- Data fetching happens at page level
- Props passed down from page

### Client Components (When Needed)

Use `"use client"` only for:
- Form handling (FormBlock)
- Interactive elements (modals, carousels)
- Browser APIs (window, localStorage)

### Error Handling

All data fetching functions return `null` on error:

```typescript
const block = await getHeroBlock(blockId);
if (!block) return null; // or fallback UI
```

### Type Safety

Always use typed interfaces from `lib/types.ts`:

```typescript
import type { BlockHero } from "@/lib/types";

interface HeroBlockProps {
  data?: BlockHero | null;
}
```

## Resources

- **Template Repository**: https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms
- **Research Document**: `docs/research/directus-simple-website-cms-template-adoption.md`
- **Block Creation Guide**: `reference/01_creating_directus_blocks.md`
- **Data Fetching Reference**: `reference/03_data_fetching_functions.md`
- **TypeScript Interfaces**: `reference/08_typescript_interfaces.md`

