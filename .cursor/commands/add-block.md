---
description: Create a new Directus CMS block (end-to-end integrated)
---

# /add-block [block-name]

Create a new CMS-driven content block with complete TypeScript → Directus → Component chain.

## Arguments
- `block-name`: Name of the block (e.g., `faq`, `cta`, `gallery`)

## The Complete Chain
```
TypeScript Interface → Schema Registration → Fetch Function → Component → Page Wiring → Directus Collection → Validate
```

---

## PHASE 1: DEFINE THE DATA SCHEMA

### Step 1.1: Gather Block Requirements
Before coding, clarify with user:
- What fields does this block need?
- What field types? (string, number, array, nested object, image)
- Which fields are required vs optional?

Document the schema:
```
Block: block_[name]
Fields:
  - id: number (auto, required)
  - title: string (optional)
  - subtitle: string (optional)
  - [field]: [type] ([required/optional])
```

### Step 1.2: Add TypeScript Interface
Edit `lib/types.ts`:

Add the interface (place alphabetically with other Block* interfaces):
```typescript
export interface Block[Name] {
  id: number;
  title?: string;
  subtitle?: string;
  // Add fields matching your schema
  // Use `?` for optional fields
  // For images: field_name?: string; (Directus returns file ID)
  // For arrays: items?: Array<{ label: string; value: string }>;
}
```

### Step 1.3: Register in Schema Interface
Edit `lib/types.ts` - find the `Schema` interface and add:

```typescript
export interface Schema {
  // ... existing entries
  block_[name]: Block[Name][];  // <-- Add this line alphabetically
}
```

### Step 1.4: Validate TypeScript
// turbo
```bash
npx tsc --noEmit
```

If errors, fix the interface syntax before proceeding.

---

## PHASE 2: CREATE FETCH FUNCTION

### Step 2.1: Add Import
Edit `lib/data.ts` - add to the type imports at top:

```typescript
import type { 
  // ... existing imports
  Block[Name],  // <-- Add alphabetically
} from './types';
```

### Step 2.2: Create Fetch Function
Edit `lib/data.ts` - add function (place alphabetically with other get*Block functions):

```typescript
export async function get[Name]Block(blockId: number): Promise<Block[Name] | null> {
  try {
    const blocks = await directus.request(
      readItems('block_[name]', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],  // For images, use: ['*', 'image_field.*']
        limit: 1,
      })
    );
    return blocks?.[0] as Block[Name] || null;
  } catch (error) {
    console.error('Error fetching [name] block:', error);
    return null;
  }
}
```

**Important for images:** If the block has image fields, specify them:
```typescript
fields: ['*', 'hero_image.*', 'background_image.*'],
```

### Step 2.3: Validate TypeScript
// turbo
```bash
npx tsc --noEmit
```

---

## PHASE 3: CREATE REACT COMPONENT

### Step 3.1: Create Component File
Create `components/blocks/[Name].tsx`:

```tsx
import type { Block[Name] } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface [Name]Props {
  data: Block[Name];
}

export default function [Name]({ data }: [Name]Props) {
  if (!data) return null;

  return (
    <section className="py-16 lg:py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {data.title && (
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="text-xl text-slate-500 mb-12">{data.subtitle}</p>
        )}
        
        {/* Add component content here */}
        
      </div>
    </section>
  );
}
```

**For images, use:**
```tsx
{data.hero_image && (
  <img 
    src={getFileUrl(data.hero_image)} 
    alt={data.title || ''} 
    className="w-full h-auto"
  />
)}
```

### Step 3.2: Validate Component
// turbo
```bash
npm run lint
```

---

## PHASE 4: WIRE UP IN PAGE RENDERER

### Step 4.1: Add Imports to Target Page
Edit the page file (e.g., `app/page.tsx` or target page):

Add imports at top:
```typescript
import { get[Name]Block } from "@/lib/data";
import [Name] from "@/components/blocks/[Name]";
```

### Step 4.2: Add Block Case
Find the block rendering logic and add a case:

**Option A: If using findBlock pattern (like home page):**
```typescript
const [name] = findBlock("block_[name]");

// In JSX:
{[name] && <[Name] data={[name]} />}
```

**Option B: If using switch/map pattern:**
```typescript
if (block.collection === "block_[name]") {
  const data = await get[Name]Block(parseInt(block.item));
  return data ? <[Name] key={block.id} data={data} /> : null;
}
```

---

## PHASE 5: DIRECTUS COLLECTION SETUP

### Step 5.1: Create Collection Checklist
Output this checklist for Directus admin:

```
📋 DIRECTUS SETUP CHECKLIST

1. CREATE COLLECTION
   - Name: block_[name]
   - Primary Key: id (auto-increment)
   - Singleton: No (unless only one instance needed)

2. ADD FIELDS (match TypeScript interface exactly):
   ┌─────────────────┬──────────────┬──────────────┐
   │ Field Name      │ Type         │ Required     │
   ├─────────────────┼──────────────┼──────────────┤
   │ id              │ (auto)       │ Yes          │
   │ title           │ Input        │ No           │
   │ subtitle        │ Textarea     │ No           │
   │ [other fields per interface]                  │
   └─────────────────┴──────────────┴──────────────┘

3. SET PERMISSIONS
   - Public role: Read access ✓
   
4. ADD TO PAGE BUILDER (if applicable)
   - Go to: Settings → Data Model → page_blocks
   - Find M2A field "item"
   - Add "block_[name]" to allowed collections

5. CREATE TEST CONTENT
   - Add one item with sample data
```

---

## PHASE 6: FINAL VALIDATION

### Step 6.1: Full Build Check
// turbo
```bash
npm run lint && npx tsc --noEmit && npm run build
```

### Step 6.2: Runtime Test
// turbo
```bash
npm run dev
```

Open browser and verify:
1. No console errors
2. Block renders if content exists in Directus
3. Block handles missing/null data gracefully

---

## SCHEMA VALIDATION CHECKLIST

Before returning, verify schema alignment:

```
✓ TypeScript Interface (lib/types.ts)
  - Block[Name] interface matches Directus fields
  - All optional fields marked with ?
  - Image fields typed as string (Directus file ID)

✓ Schema Registration (lib/types.ts)  
  - block_[name]: Block[Name][] added to Schema interface

✓ Fetch Function (lib/data.ts)
  - Import added for Block[Name]
  - Function get[Name]Block exists
  - Correct collection name: 'block_[name]'
  - Image relations expanded: ['*', 'image_field.*']

✓ Component (components/blocks/[Name].tsx)
  - Imports Block[Name] type
  - Props interface uses Block[Name]
  - Null check: if (!data) return null

✓ Page Wiring
  - Import for get[Name]Block
  - Import for component
  - Render logic added

✓ Directus Collection
  - Collection name: block_[name]
  - Fields match TypeScript interface
  - Public read access enabled
  - Added to page_blocks M2A (if applicable)
```

---

## Return Condition
Return when ALL of these are complete:
1. Interface added to `lib/types.ts`
2. Schema interface updated
3. Fetch function added to `lib/data.ts`  
4. Component created
5. Block wired in page
6. All validations pass (`npm run build` succeeds)
7. Directus setup checklist provided

## Output Format
```
✅ Block Created: block_[name]

📁 Files Modified:
  - lib/types.ts
    ├── Added: Block[Name] interface
    └── Updated: Schema interface
  - lib/data.ts
    ├── Added: Block[Name] import
    └── Added: get[Name]Block function
  - components/blocks/[Name].tsx (created)
  - app/[page].tsx (wired)

📊 Schema:
  | Field      | TS Type  | Directus Type | Required |
  |------------|----------|---------------|----------|
  | id         | number   | (auto)        | Yes      |
  | title      | string?  | Input         | No       |
  | ...

📋 Directus Setup Required:
  [Checklist from Phase 5]

🧪 Validated:
  - ✓ TypeScript compiles
  - ✓ Lint passes  
  - ✓ Build succeeds

📝 Ready for: /commit
```
