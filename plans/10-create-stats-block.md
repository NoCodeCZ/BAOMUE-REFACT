# Plan 10: Create StatsBlock

> **Status**: Ready for Implementation  
> **Part of**: Phase 2 - Create New Blocks  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: None (simple block)

---

## Description

Create a new `StatsBlock` component that displays numerical statistics in a bar format:
- Grid of stat cards (2-4 columns responsive)
- Each stat shows: number, label, optional icon
- Glass-card styling with rounded corners
- Matches HTML design from `our-work.html` (stats bar section)

---

## Current System Behavior

No stats block exists. This is a completely new feature.

---

## Research Summary

From `docs/research/html-to-directus-conversion.md`:
- Stats block is a simple display component
- Used on portfolio page to show: cases, reviews, satisfaction, experience
- Stats are configurable via Directus (not hardcoded)
- Each stat has: value (string/number), label, optional icon

---

## Files to Modify/Create

### New Files
- `components/blocks/StatsBlock.tsx` - Server Component (main block)

### Modified Files
- `lib/types.ts` - Add `BlockStats` and `StatItem` interfaces
- `lib/data.ts` - Add `getStatsBlock()` function
- `components/PageBuilder.tsx` - Register `block_stats` in componentMap

---

## Step-by-Step Tasks

### Task 1: Add TypeScript Interfaces
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: After line 431 (after BlogPost interface)

**Current Code**:
```412:431:lib/types.ts
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}
```

**Proposed Change**:
```typescript
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

// Stats block interfaces
export interface StatItem {
  value: string; // e.g., "500+", "4.9", "98%", "15+"
  label: string; // e.g., "เคสสำเร็จ", "คะแนนรีวิว"
  icon?: string; // Optional icon name (e.g., "star")
  icon_color?: string; // Optional icon color (e.g., "amber")
}

export interface BlockStats {
  id: number;
  stats?: StatItem[] | any; // JSON field - array of stat items
  columns?: number; // Number of columns (2, 3, or 4), default: 4
  show_icons?: boolean; // Whether to show icons, default: true
}
```

**Why**: Need interfaces for stats block data structure. Stats are stored as JSON array in Directus.

**Validation**: `npx tsc --noEmit` - Check no type errors
**Test**: Verify interfaces compile correctly

---

### Task 2: Register Block in Schema
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 1-31 (Schema interface)

**Current Code**:
```1:31:lib/types.ts
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  // ... other blocks
  blog_posts: BlogPost[];
}
```

**Proposed Change**:
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  // ... other blocks
  blog_posts: BlogPost[];
  block_stats: BlockStats[];
}
```

**Why**: Register new block collection in Schema interface for type safety.

**Validation**: `npx tsc --noEmit`
**Test**: Verify Schema interface includes new collection

---

### Task 3: Add BlockStats to BlockType Union
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 57-73 (BlockType union)

**Current Code**:
```57:73:lib/types.ts
export type BlockType = 
  | 'block_hero'
  | 'block_text'
  // ... other blocks
  | 'block_pricing';
```

**Proposed Change**:
```typescript
export type BlockType = 
  | 'block_hero'
  | 'block_text'
  // ... other blocks
  | 'block_pricing'
  | 'block_stats';
```

**Why**: Add to BlockType union so PageBuilder can recognize it.

**Validation**: `npx tsc --noEmit`
**Test**: Verify BlockType includes 'block_stats'

---

### Task 4: Add BlockStats to BlockContent Union
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 75-92 (BlockContent union)

**Current Code**:
```75:92:lib/types.ts
export type BlockContent = 
  | BlockHero
  | BlockText
  // ... other blocks
  | BlockPricing;
```

**Proposed Change**:
```typescript
export type BlockContent = 
  | BlockHero
  | BlockText
  // ... other blocks
  | BlockPricing
  | BlockStats;
```

**Why**: Add to BlockContent union for type safety in PageBlockWithContent.

**Validation**: `npx tsc --noEmit`
**Test**: Verify BlockContent includes BlockStats

---

### Task 5: Add Data Fetching Function
**File**: `lib/data.ts`  
**Action**: Modify existing  
**Lines**: After line 763 (after getFormBySlug function)

**Current Code**:
```749:763:lib/data.ts
export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form | null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}
```

**Proposed Change**:
```typescript
export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form | null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}

// Stats block function
export async function getStatsBlock(blockId: number): Promise<BlockStats | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_stats', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockStats || null;
  } catch (error) {
    logDirectusError('getStatsBlock', error);
    return null;
  }
}
```

**Why**: Need function to fetch stats block configuration from Directus.

**Validation**: `npx tsc --noEmit` - Check imports and types
**Test**: Function compiles without errors

---

### Task 6: Create StatsBlock Component
**File**: `components/blocks/StatsBlock.tsx`  
**Action**: Create new  
**Lines**: New file

**Proposed Change**:
```typescript
import type { BlockStats, StatItem } from "@/lib/types";
import { Star } from "lucide-react";

interface StatsBlockProps {
  data?: BlockStats | null;
}

// Icon mapping helper
const getIcon = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    star: Star,
    // Add more icons as needed
  };
  return iconMap[iconName || ""] || null;
};

// Icon color mapping helper
const getIconColorClass = (color?: string) => {
  const colorMap: Record<string, string> = {
    amber: "text-amber-400 fill-amber-400",
    blue: "text-blue-400 fill-blue-400",
    green: "text-green-400 fill-green-400",
    red: "text-red-400 fill-red-400",
  };
  return colorMap[color || "amber"] || "text-amber-400 fill-amber-400";
};

export default function StatsBlock({ data }: StatsBlockProps) {
  if (!data) return null;

  // Parse stats JSON field
  const stats: StatItem[] = Array.isArray(data.stats)
    ? data.stats
    : typeof data.stats === "string"
      ? JSON.parse(data.stats || "[]")
      : [];

  if (stats.length === 0) {
    return null;
  }

  const columns = data.columns || 4;
  const showIcons = data.show_icons ?? true;

  // Grid column classes based on number of columns
  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns] || "grid-cols-2 md:grid-cols-4";

  return (
    <section className="pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-3xl border border-white/50 shadow-xl p-6 md:p-8">
          <div className={`grid ${gridColsClass} gap-6 md:gap-8`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon && showIcons ? getIcon(stat.icon) : null;
              const iconColorClass = stat.icon_color && showIcons 
                ? getIconColorClass(stat.icon_color) 
                : "";

              return (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
                    {Icon && (
                      <Icon className={`w-4 h-4 ${iconColorClass}`} />
                    )}
                    <span>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Why**: Server Component renders stats in a responsive grid. Handles JSON parsing for stats array. Supports optional icons with color coding.

**Validation**: `npm run dev` - Check component renders
**Test**: Verify stats display correctly with sample data

---

### Task 7: Register Block in PageBuilder
**File**: `components/PageBuilder.tsx`  
**Action**: Modify existing  
**Lines**: 1-35 (imports and componentMap)

**Current Code**:
```1:35:components/PageBuilder.tsx
import HeroBlock from "@/components/blocks/HeroBlock";
// ... other imports
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
  block_hero: HeroBlock,
  // ... other blocks
  block_pricing: () => null, // Placeholder
};
```

**Proposed Change**:
```typescript
import HeroBlock from "@/components/blocks/HeroBlock";
// ... other imports
import StatsBlock from "@/components/blocks/StatsBlock";
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
  block_hero: HeroBlock,
  // ... other blocks
  block_pricing: () => null, // Placeholder
  block_stats: StatsBlock,
};
```

**Why**: Register new block in PageBuilder so it can be rendered dynamically.

**Validation**: `npm run dev` - Check PageBuilder recognizes block
**Test**: Create page with block_stats in Directus, verify it renders

---

## Directus Setup

### Create `block_stats` Collection
1. **Collection Name**: `block_stats`
2. **Fields**:
   - `id` (integer, primary key, auto-increment)
   - `stats` (JSON) - Array of stat items: `[{value: string, label: string, icon?: string, icon_color?: string}]`
   - `columns` (integer, default: 4) - Number of columns (2, 3, or 4)
   - `show_icons` (boolean, default: true) - Whether to show icons

3. **Permissions**: Public read access

**Example JSON for `stats` field**:
```json
[
  {
    "value": "500+",
    "label": "เคสสำเร็จ"
  },
  {
    "value": "4.9",
    "label": "คะแนนรีวิว",
    "icon": "star",
    "icon_color": "amber"
  },
  {
    "value": "98%",
    "label": "ความพึงพอใจ"
  },
  {
    "value": "15+",
    "label": "ปีประสบการณ์"
  }
]
```

---

## Testing Strategy

### Functional Testing
1. Start dev server: `npm run dev`
2. Create test data in Directus:
   - [ ] Create block_stats block
   - [ ] Add JSON stats array with 4 items
   - [ ] Link block to a page
3. Test functionality:
   - [ ] Stats display in grid
   - [ ] Icons display when provided
   - [ ] Icon colors apply correctly
   - [ ] Responsive columns work (2 on mobile, 4 on desktop)
   - [ ] Empty stats array doesn't break
   - [ ] Different column counts work (2, 3, 4)

### Visual Testing
- [ ] Glass-card styling matches HTML
- [ ] Stats grid matches HTML design
- [ ] Icons display correctly (star icon with amber color)
- [ ] Responsive layout works
- [ ] Text sizes and spacing match HTML

---

## Validation Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Dev server
npm run dev
```

---

## Acceptance Criteria

- [ ] TypeScript interfaces added
- [ ] Block registered in Schema, BlockType, and BlockContent
- [ ] Data fetching function works
- [ ] StatsBlock component created
- [ ] Stats display in grid
- [ ] Icons display when provided
- [ ] Icon colors apply correctly
- [ ] Responsive columns work
- [ ] Block registered in PageBuilder
- [ ] Directus collection created
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Visual match with HTML design

---

## Context Notes

- **JSON Field**: Stats are stored as JSON array in Directus
- **Icon Support**: Currently supports "star" icon, can be extended
- **Color Coding**: Icons can have different colors (amber, blue, green, red)
- **Responsive Grid**: 2 columns on mobile, up to 4 on desktop
- **Simple Component**: No Client Component needed, pure Server Component
- **Empty States**: Returns null if no stats provided

---

## Project-Specific Requirements

- ✅ ISR: Handled by page component
- ✅ Server Components: Pure Server Component (no interactivity)
- ✅ Tailwind Only: All styling with Tailwind classes
- ✅ Fallbacks: Handle empty stats gracefully
- ✅ Type Safety: All interfaces match Directus collection structure
- ✅ Lucide Icons: Use Star icon from lucide-react
- ✅ JSON Parsing: Handle both array and string JSON formats

---

## Next Steps

After completing this plan:
1. Test with sample data in Directus
2. Verify stats display correctly
3. Proceed to **Plan 15: Portfolio Page** to use StatsBlock on portfolio page
4. Or continue with other Phase 2 plans

---

## Completion Status
- [x] All tasks completed
- [x] All validations passed
- [x] TypeScript compilation successful
- [x] Build successful
- Completed: 2024-12-19

