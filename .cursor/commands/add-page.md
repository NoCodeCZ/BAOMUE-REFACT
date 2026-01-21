---
description: Create a new page with complete data chain (list, detail, or CMS-based)
---

# /add-page [page-type] [route-name]

Create a new page with complete TypeScript → Fetch → Page → Directus chain.

## Arguments
- `page-type`: One of `list`, `detail`, or `cms`
- `route-name`: The route path (e.g., `promotions`, `about`, `services`)

## The Complete Chain
```
Define Data Source → TypeScript Interface → Schema → Fetch Function → Page Component → Metadata → Directus Setup → Validate
```

---

## PHASE 0: CLARIFY REQUIREMENTS

Before starting, determine:

| Question | List Page | Detail Page | CMS Page |
|----------|-----------|-------------|----------|
| Data source? | Collection (many items) | Single item by slug | Page with blocks |
| Dynamic route? | No (`/route`) | Yes (`/route/[slug]`) | No (`/route`) |
| Example | `/services` | `/services/[slug]` | `/about` |

---

## PHASE 1: DEFINE DATA SCHEMA

### Step 1.1: Check Existing Types
Read `lib/types.ts` to see if the content type already exists.

If it exists, note the interface name and fields.
If not, create it following the pattern below.

### Step 1.2: Add/Verify TypeScript Interface
Edit `lib/types.ts`:

**For List/Detail pages (new collection):**
```typescript
export interface [ContentType] {
  id: number;
  name: string;
  slug: string;
  status: 'published' | 'draft';
  // Content fields
  short_description?: string;
  long_description?: string;
  // Image fields (Directus file ID)
  hero_image?: string;
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  // Relations
  category?: [CategoryType] | number | null;
}
```

**For CMS pages:** Use existing `Page` interface (already defined).

### Step 1.3: Register in Schema Interface
Edit `lib/types.ts` - add to Schema:

```typescript
export interface Schema {
  // ... existing
  [content_type]: [ContentType][];  // e.g., promotions: Promotion[];
}
```

### Step 1.4: Validate TypeScript
// turbo
```bash
npx tsc --noEmit
```

---

## PHASE 2: CREATE FETCH FUNCTIONS

### Step 2.1: Add Type Import
Edit `lib/data.ts`:

```typescript
import type { 
  // ... existing
  [ContentType],
} from './types';
```

### Step 2.2: Create Fetch Functions

**For List pages - get all items:**
```typescript
export async function get[ContentTypes](): Promise<[ContentType][]> {
  try {
    const items = await directus.request(
      readItems('[collection_name]', {
        filter: { status: { _eq: 'published' } },
        fields: ['*', 'hero_image.*', 'category.*'],
        sort: ['sort', 'name'],
      })
    );
    return (items || []) as [ContentType][];
  } catch (error) {
    console.error('Error fetching [content types]:', error);
    return [];
  }
}
```

**For Detail pages - get by slug:**
```typescript
export async function get[ContentType]BySlug(slug: string): Promise<[ContentType] | null> {
  try {
    const items = await directus.request(
      readItems('[collection_name]', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['*', 'hero_image.*', 'category.*'],
        limit: 1,
      })
    );
    return (items?.[0] as [ContentType]) || null;
  } catch (error) {
    console.error('Error fetching [content type] by slug:', error);
    return null;
  }
}
```

**For CMS pages:** Use existing `getPageBySlug` and `getPageBlocks`.

### Step 2.3: Validate
// turbo
```bash
npx tsc --noEmit
```

---

## PHASE 3: CREATE PAGE COMPONENT

### Step 3.1: Create Page File

**For List page:** Create `app/[route]/page.tsx`
**For Detail page:** Create `app/[route]/[slug]/page.tsx`
**For CMS page:** Create `app/[route]/page.tsx`

---

### TEMPLATE A: List Page

```tsx
import { get[ContentTypes] } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "[Page Title] | Site Name",
  description: "[Page description for SEO]",
};

export default async function [Route]Page() {
  const items = await get[ContentTypes]();

  if (!items.length) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            No items available
          </h1>
          <p className="text-slate-500">Check back soon for updates.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-12">
          [Page Title]
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/[route]/${item.slug}`}
              className="group block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {item.hero_image && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={getFileUrl(item.hero_image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h2>
                {item.short_description && (
                  <p className="text-slate-500 line-clamp-2">
                    {item.short_description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
```

---

### TEMPLATE B: Detail Page

```tsx
import { get[ContentType]BySlug, get[ContentTypes] } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const items = await get[ContentTypes]();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await get[ContentType]BySlug(slug);
  
  if (!item) {
    return { title: "Not Found" };
  }

  return {
    title: item.seo_title || item.name,
    description: item.seo_description || item.short_description,
  };
}

export default async function [ContentType]DetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await get[ContentType]BySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="py-16 lg:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/[route]" className="hover:text-slate-700">[Route Title]</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{item.name}</span>
        </nav>

        {/* Hero Image */}
        {item.hero_image && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={getFileUrl(item.hero_image)}
              alt={item.name}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
          {item.name}
        </h1>
        
        {item.long_description && (
          <div className="prose prose-lg prose-slate max-w-none">
            {item.long_description}
          </div>
        )}
      </div>
    </main>
  );
}
```

---

### TEMPLATE C: CMS Block Page

```tsx
import { getPageBySlug, getPageBlocks, getBlockContent } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Import block components as needed
import Hero from "@/components/blocks/Hero";
// Add more block imports...

export const revalidate = 60;

export const metadata: Metadata = {
  title: "[Page Title] | Site Name",
  description: "[Page description]",
};

export default async function [Route]Page() {
  const page = await getPageBySlug("[route-slug]");
  
  if (!page) {
    notFound();
  }

  const pageBlocks = await getPageBlocks(page.id);
  const blocksWithContent = await Promise.all(
    pageBlocks.map(async (block: any) => ({
      ...block,
      content: await getBlockContent(block.collection, block.item),
    }))
  );

  const findBlock = (collection: string) =>
    blocksWithContent.find((b) => b.collection === collection)?.content;

  const hero = findBlock("block_hero");
  // Add more blocks...

  return (
    <main>
      {hero && <Hero data={hero} />}
      {/* Add more block renders */}
    </main>
  );
}
```

---

## PHASE 4: VALIDATE BUILD

### Step 4.1: Lint Check
// turbo
```bash
npm run lint
```

### Step 4.2: Type Check
// turbo
```bash
npx tsc --noEmit
```

### Step 4.3: Build Check
// turbo
```bash
npm run build
```

---

## PHASE 5: DIRECTUS SETUP

### Step 5.1: Collection Setup Checklist

**For List/Detail pages (new collection):**
```
📋 DIRECTUS SETUP CHECKLIST

1. CREATE COLLECTION
   - Name: [collection_name] (e.g., promotions)
   - Primary Key: id (auto-increment)

2. ADD FIELDS:
   ┌─────────────────────┬──────────────────┬──────────┐
   │ Field               │ Type             │ Required │
   ├─────────────────────┼──────────────────┼──────────┤
   │ id                  │ (auto)           │ Yes      │
   │ status              │ Dropdown         │ Yes      │
   │                     │ (published/draft)│          │
   │ name                │ Input            │ Yes      │
   │ slug                │ Input (slug)     │ Yes      │
   │ short_description   │ Textarea         │ No       │
   │ long_description    │ WYSIWYG/Markdown │ No       │
   │ hero_image          │ Image            │ No       │
   │ seo_title           │ Input            │ No       │
   │ seo_description     │ Textarea         │ No       │
   │ sort                │ Input (integer)  │ No       │
   └─────────────────────┴──────────────────┴──────────┘

3. SET PERMISSIONS
   - Public role: Read access on published items

4. CREATE TEST CONTENT
   - Add 2-3 sample items with status: published
```

**For CMS pages:**
```
📋 DIRECTUS SETUP CHECKLIST

1. CREATE PAGE ENTRY
   - Go to: pages collection
   - Add item with slug: [route-slug]
   - Set status: published

2. ADD BLOCKS TO PAGE
   - Go to page_blocks
   - Link desired blocks to this page
   - Set sort order
```

---

## PHASE 6: RUNTIME TEST

### Step 6.1: Start Dev Server
// turbo
```bash
npm run dev
```

### Step 6.2: Test Checklist
```
□ List page loads: /[route]
□ Empty state shows if no content
□ Items display correctly with images
□ Links work to detail pages
□ Detail page loads: /[route]/[slug]
□ 404 shows for invalid slug
□ Breadcrumb navigation works
□ No console errors
```

---

## SCHEMA VALIDATION CHECKLIST

```
✓ TypeScript Interface (lib/types.ts)
  - [ContentType] interface defined
  - Fields match Directus collection
  - status field: 'published' | 'draft'
  - slug field: string
  - Image fields: string (file ID)

✓ Schema Registration (lib/types.ts)
  - [collection]: [ContentType][] added

✓ Fetch Functions (lib/data.ts)
  - get[ContentTypes]() for list
  - get[ContentType]BySlug(slug) for detail
  - Correct collection name
  - status filter: 'published'
  - Image relations expanded

✓ Page Files
  - app/[route]/page.tsx exists
  - app/[route]/[slug]/page.tsx exists (if detail)
  - revalidate = 60 set
  - Metadata defined
  - Error states handled

✓ Directus Collection
  - Collection exists with correct name
  - Fields match TypeScript interface
  - Public read access for published
  - Test content created
```

---

## Return Condition
Return when ALL are complete:
1. TypeScript interface exists/verified
2. Schema interface updated
3. Fetch functions exist
4. Page file(s) created
5. Build succeeds
6. Directus setup checklist provided

## Output Format
```
✅ Page Created: /[route]

📁 Files Modified/Created:
  - lib/types.ts
    └── [ContentType] interface (verified/added)
  - lib/data.ts  
    ├── get[ContentTypes]() (list)
    └── get[ContentType]BySlug() (detail)
  - app/[route]/page.tsx (created)
  - app/[route]/[slug]/page.tsx (created, if detail)

📊 Data Schema:
  | Field             | TS Type  | Directus    | Required |
  |-------------------|----------|-------------|----------|
  | id                | number   | (auto)      | Yes      |
  | status            | string   | Dropdown    | Yes      |
  | name              | string   | Input       | Yes      |
  | slug              | string   | Input       | Yes      |
  | short_description | string?  | Textarea    | No       |
  | hero_image        | string?  | Image       | No       |

📋 Directus Setup Required:
  [Checklist from Phase 5]

🧪 Validated:
  - ✓ TypeScript compiles
  - ✓ Lint passes
  - ✓ Build succeeds

📝 Ready for: /commit
```
