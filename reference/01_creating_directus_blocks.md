# Creating Directus Blocks

> Use this guide when adding a new CMS-driven content block (e.g., `block_testimonials`, `block_faq`).

## Pattern Overview

```
Directus Collection ──▶ TypeScript Interface ──▶ Fetch Function ──▶ React Component
     (block_*)              (lib/types.ts)        (lib/data.ts)     (components/)
```

---

## Step 1: Define TypeScript Interface

Add to `lib/types.ts`:

```typescript
// Add interface for the new block
export interface BlockFaq {
  id: number;
  title?: string;
  subtitle?: string;
  items?: Array<{
    question: string;
    answer: string;
  }>;
}
```

Add to `Schema` interface:

```typescript
export interface Schema {
  // ... existing collections
  block_faq: BlockFaq[];  // Add this line
}
```

**Rules:**
- Use `Block` prefix + PascalCase name
- All fields optional except `id`
- Arrays use inline object types
- Match Directus field names exactly

---

## Step 2: Create Data Fetching Function

Add to `lib/data.ts`:

```typescript
import type { BlockFaq } from './types';

export async function getFaqBlock(blockId: number): Promise<BlockFaq | null> {
  try {
    const blocks = await directus.request(
      readItems('block_faq', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockFaq || null;
  } catch (error) {
    console.error('Error fetching faq block:', error);
    return null;
  }
}
```

**Rules:**
- Function name: `get{BlockName}Block`
- Always wrap in try-catch
- Return `null` on error, not throw
- Use `readItems` with filter by id
- Cast result with `as BlockType`

---

## Step 3: Create React Component

**Component Location**: All block components should be created in `components/blocks/` directory.

Create `components/blocks/FaqBlock.tsx`:

```typescript
import type { BlockFaq } from "@/lib/types";

interface FaqBlockProps {
  data?: BlockFaq | null;
}

export default function FaqBlock({ data }: FaqBlockProps) {
  if (!data) return null;
  
  // Extract fallback values
  const title = data.title ?? "";
  const subtitle = data.subtitle ?? "";
  const items = data.items ?? [];
  
  if (!items.length) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="text-center text-slate-600 mb-12">{data.subtitle}</p>
        )}
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <details key={index} className="border border-slate-200 rounded-lg">
              <summary className="p-4 cursor-pointer font-medium text-slate-900">
                {item.question}
              </summary>
              <p className="px-4 pb-4 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Rules:**
- Component naming: `[BlockName]Block.tsx` (e.g., `FaqBlock.tsx`)
- Accept `data?: BlockType | null` as prop (optional/nullable)
- Return `null` if no data
- Extract fallback values inline with nullish coalescing (`??`)
- Check optional fields before rendering
- Use semantic HTML (`section`, `h2`)
- Follow Tailwind class ordering
- Server Components by default (no `"use client"` unless interactivity needed)
- Use `getFileUrl()` helper for images from Directus

---

## Step 4: Wire Up in Page Renderer

In your page component (e.g., `app/page.tsx`):

**Modern Pattern (Using findBlock helper):**
```typescript
import FaqBlock from "@/components/blocks/FaqBlock";
import { getPageBySlug, getPageBlocks, getBlockContent } from "@/lib/data";

export default async function HomePage() {
  const page = await getPageBySlug("home");
  
  // Fetch all blocks
  const pageBlocks = await getPageBlocks(page.id);
  const blocksWithContent = await Promise.all(
    pageBlocks.map(async (block: any) => ({
      ...block,
      content: await getBlockContent(block.collection, block.item),
    }))
  );

  // Find specific block
  const findBlock = (collection: string) =>
    blocksWithContent.find((b) => b.collection === collection)?.content as any;

  const faq = findBlock("block_faq");

  return (
    <main>
      {faq && <FaqBlock data={faq} />}
    </main>
  );
}
```

**Alternative Pattern (Individual fetch):**
```typescript
import { getFaqBlock } from "@/lib/data";
import FaqBlock from "@/components/blocks/FaqBlock";

// Inside block rendering loop:
if (block.collection === "block_faq") {
  const faqData = await getFaqBlock(parseInt(block.item));
  return faqData ? <FaqBlock key={block.id} data={faqData} /> : null;
}
```

**Recommendation**: Use the `findBlock()` pattern for cleaner, more maintainable code.

---

## Step 5: Create Directus Collection

In Directus Admin:

1. **Create Collection**: `block_faq`
2. **Add Fields**:
   - `title` (Input, String)
   - `subtitle` (Textarea)
   - `items` (JSON, Array of objects)
3. **Set Permissions**: Public read access

---

## Quick Checklist

- [ ] Interface added to `lib/types.ts`
- [ ] Collection added to `Schema` interface
- [ ] Fetch function added to `lib/data.ts`
- [ ] React component created in `components/blocks/[BlockName]Block.tsx`
- [ ] Block wired up in page renderer
- [ ] Directus collection created with fields
- [ ] Public read permissions set
- [ ] Test with sample data in Directus
