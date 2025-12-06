# TypeScript Interfaces

> Use this guide when adding TypeScript types for Directus collections.

## Pattern Overview

```
Directus Collection ──▶ TypeScript Interface ──▶ Schema Registration
   (snake_case)           (PascalCase)           (lib/types.ts)
```

---

## Step 1: Create Interface

Add to `lib/types.ts`:

```typescript
export interface Promotion {
  id: number;
  status: 'published' | 'draft';
  title: string;
  slug: string;
  short_description?: string;
  content?: string;
  image?: string | { id: string };
  category?: PromotionCategory | number | null;
  start_date?: string;
  end_date?: string;
  seo_title?: string;
  seo_description?: string;
  date_created?: string;
  date_updated?: string;
}
```

**Field Type Rules:**

| Directus Field | TypeScript Type |
|----------------|-----------------|
| String (input) | `string` |
| Text (textarea) | `string` |
| Integer | `number` |
| Boolean | `boolean` |
| DateTime | `string` (ISO format) |
| JSON (object) | Inline object type |
| JSON (array) | `Array<{ ... }>` |
| File (single) | `string \| { id: string }` |
| M2O relation | `RelatedType \| number \| null` |
| O2M relation | `RelatedType[]` |
| Status | `'published' \| 'draft'` |

---

## Step 2: Register in Schema

Add collection to Schema interface:

```typescript
export interface Schema {
  // Existing collections...
  pages: Page[];
  services: Service[];

  // Add new collection
  promotions: Promotion[];
  promotion_categories: PromotionCategory[];
}
```

**Rules:**
- Collection name matches Directus exactly
- Use plural form
- Type is array of interface

---

## Step 3: Related Interfaces

For M2O relationships, create the related interface:

```typescript
export interface PromotionCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort?: number;
}
```

---

## Step 4: Block Interfaces

For CMS blocks, follow the naming convention:

```typescript
export interface BlockPromotion {
  id: number;
  title?: string;
  subtitle?: string;
  featured_promotions?: number[];  // IDs of promotions to feature
  show_expired?: boolean;
  layout?: 'grid' | 'carousel' | 'list';
}
```

**Block Naming:**
- Prefix with `Block`
- Match collection name: `block_promotion` → `BlockPromotion`

---

## Step 5: Nested Object Types

For JSON fields with structure:

```typescript
export interface BlockTeam {
  id: number;
  title?: string;
  dentists?: Array<{
    name: string;
    specialty: string;
    photo_url?: string;
    linkedin_url?: string;
  }>;
}
```

**Rules:**
- Use `Array<{ ... }>` for JSON arrays
- Make object properties match JSON structure
- Use optional (`?`) for non-required fields

---

## Step 6: Union Types for Relations

Handle fields that can be object or ID:

```typescript
export interface Service {
  id: number;
  name: string;
  // Can be full object (when expanded) or just ID
  category?: ServiceCategory | number | null;
  // Can be file object or string ID
  hero_image?: string | { id: string; filename_disk?: string };
}
```

**When to use:**
- M2O relations: `RelatedType | number | null`
- File fields: `string | { id: string }`
- Depends on whether relation is expanded in query

---

## Common Patterns

### Status Field
```typescript
status: 'published' | 'draft' | 'archived';
```

### Timestamps
```typescript
date_created?: string;
date_updated?: string;
```

### Sort Field
```typescript
sort?: number | null;
```

### SEO Fields
```typescript
seo_title?: string;
seo_description?: string;
```

### Navigation Target
```typescript
target?: '_self' | '_blank';
```

---

## Complete Example

```typescript
// Full interface for a Dentist collection
export interface Dentist {
  id: number;
  status: 'published' | 'draft';
  name: string;
  slug: string;
  title?: string;
  specialty?: string;
  bio?: string;
  photo?: string | { id: string };
  qualifications?: Array<{
    degree: string;
    institution: string;
    year?: number;
  }>;
  languages?: string[];
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
  sort?: number;
  date_created?: string;
  date_updated?: string;
}

// Add to Schema
export interface Schema {
  // ...
  dentists: Dentist[];
}
```

---

## Quick Checklist

- [ ] Interface name matches collection (PascalCase)
- [ ] `id: number` always required
- [ ] Optional fields use `?:`
- [ ] Status uses union type
- [ ] Relations use `Type | number | null`
- [ ] File fields handle both formats
- [ ] JSON arrays use `Array<{ ... }>`
- [ ] Collection added to `Schema` interface
- [ ] Field names match Directus exactly
