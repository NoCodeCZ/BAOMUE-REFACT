---
description: Conversational flow for converting HTML files to Next.js pages with Directus integration
---

# /convert-html-flow - HTML to Next.js Conversion Assistant

Interactive command chain for converting HTML files to Next.js pages with automatic Directus collection analysis and creation.

## Session State Management

Track conversation state across commands:

```typescript
interface ConversionSession {
  uploadedFiles: string[];
  sitemap: Record<string, string>; // filename -> route
  conversions: Record<string, {
    status: 'pending' | 'completed' | 'in_progress';
    component?: string;
    blocks?: string[];
  }>;
  proposedCollections: Record<string, {
    name: string;
    fields: Array<{
      name: string;
      type: string;
      interface: string;
      required?: boolean;
      relation?: string;
    }>;
  }>;
  createdCollections: string[];
  currentPage?: string;
}
```

## Command Recognition Patterns

### File Upload Detection
- User uploads HTML files → Initialize session state
- Pattern: Detect file uploads in conversation

### Sitemap Configuration
- "homepage is root" / "products is /products" / "product-detail is /products/[slug]"
- Pattern: `{filename} is {route}` or `{filename} → {route}`
- Action: Update `session.sitemap`

### Conversion Requests
- "convert products.html to nextjs"
- "make products page into a component"
- "turn this into a next page"
- Pattern: `convert|make|turn` + `{filename}` + `nextjs|component|page`
- Action: `convertToNextJS(session, filename)`

### Collection Analysis
- "what collections needed?"
- "analyze the data structure"
- "what database tables should I create?"
- Pattern: `collections|data structure|database tables|schema`
- Action: `analyzeCollections(session, page)`

### Schema Modifications
- "add category relation and stock_count"
- "add field X as type Y"
- Pattern: `add` + `{field}` + `{type|relation}`
- Action: `updateProposedCollection(session, collectionName, modifications)`

### Execution
- "yes create it" / "create it" / "make it" / "proceed"
- Pattern: `yes|create|make|proceed` + `it`
- Action: `executeProposedAction(session)`

### Page Updates
- "update the nextjs page"
- "connect to directus"
- Pattern: `update|connect` + `nextjs|directus|page`
- Action: `connectPageToDirectus(session, page)`

## Workflow Functions

### 1. Initialize Session
```typescript
function initializeSession(files: string[]): ConversionSession {
  return {
    uploadedFiles: files,
    sitemap: {},
    conversions: {},
    proposedCollections: {},
    createdCollections: []
  };
}
```

### 2. Parse Sitemap Input
```typescript
function parseSitemapInput(input: string, session: ConversionSession): void {
  // Parse patterns like:
  // "homepage is root" → sitemap['homepage.html'] = '/'
  // "products is /products" → sitemap['products.html'] = '/products'
  // "product-detail is /products/[slug]" → sitemap['product-detail.html'] = '/products/[slug]'
}
```

### 3. Convert HTML to Next.js
```typescript
async function convertToNextJS(
  session: ConversionSession,
  filename: string
): Promise<void> {
  // 1. Read HTML file
  // 2. Parse HTML structure
  // 3. Identify sections/blocks
  // 4. Generate Next.js component
  // 5. Write to app/{route}/page.tsx
  // 6. Update session.conversions
}
```

### 4. Analyze Collections
```typescript
async function analyzeCollections(
  session: ConversionSession,
  page: string
): Promise<void> {
  // 1. Read converted component
  // 2. Identify repeating patterns
  // 3. Extract data fields
  // 4. Propose Directus collection schema
  // 5. Display formatted table
  // 6. Store in session.proposedCollections
}
```

### 5. Update Proposed Collection
```typescript
function updateProposedCollection(
  session: ConversionSession,
  collectionName: string,
  modifications: Array<{ field: string; type: string; relation?: string }>
): void {
  // Add/modify fields in proposed schema
}
```

### 6. Execute Proposed Action
```typescript
async function executeProposedAction(session: ConversionSession): Promise<void> {
  // 1. Create Directus collections via MCP
  // 2. Create fields
  // 3. Set up relations
  // 4. Configure permissions
  // 5. Update session.createdCollections
}
```

### 7. Connect Page to Directus
```typescript
async function connectPageToDirectus(
  session: ConversionSession,
  page: string
): Promise<void> {
  // 1. Read existing page component
  // 2. Add Directus SDK imports
  // 3. Create data fetching function
  // 4. Update component to use real data
  // 5. Add loading/error states
  // 6. Update TypeScript types
}
```

## Example Conversation Flow

### Step 1: File Upload
```
USER: [uploads 4 HTML files: homepage.html, products.html, product-detail.html, about.html]

SYSTEM: 
📁 Received 4 HTML files:
- homepage.html
- products.html
- product-detail.html
- about.html

Let me know which page each file represents in your sitemap.
```

### Step 2: Sitemap Configuration
```
USER: homepage is root, products is /products, product-detail is /products/[slug], about is /about

SYSTEM:
✓ Sitemap configured:
  / → homepage.html
  /products → products.html
  /products/[slug] → product-detail.html
  /about → about.html

Ready to convert. Which page should we start with?
```

### Step 3: Conversion Request
```
USER: convert products.html to nextjs

SYSTEM:
🔄 Converting products.html → Next.js component...

✓ Created: app/products/page.tsx
- Extracted 3 sections (hero, product-grid, cta)
- Preserved Tailwind classes
- Made product cards into reusable component

Want to see the code or analyze what data this page needs?
```

### Step 4: Collection Analysis
```
USER: what collections does this need?

SYSTEM:
📊 Analyzing product-grid section...

Detected repeating pattern with:
- Product title
- Price (currency format)
- Product image
- Short description
- "View Details" link

Proposed Collection: "products"

┌─────────────────┬──────────┬──────────────┐
│ Field           │ Type     │ Interface    │
├─────────────────┼──────────┼──────────────┤
│ id              │ uuid     │ (auto)       │
│ title           │ string   │ input        │
│ slug            │ string   │ slug         │
│ price           │ decimal  │ input        │
│ image           │ file     │ image        │
│ description     │ text     │ textarea     │
│ created_at      │ timestamp│ (auto)       │
└─────────────────┴──────────┴──────────────┘

Should I create this collection?
```

### Step 5: Schema Modification
```
USER: add category relation and stock_count

SYSTEM:
✓ Updated schema:

Added:
│ category_id     │ uuid     │ relation → categories │
│ stock_count     │ integer  │ input                 │

I'll also create a "categories" collection with:
│ id              │ uuid     │ (auto)                │
│ name            │ string   │ input                 │
│ slug            │ string   │ slug                  │

Looks good?
```

### Step 6: Execution
```
USER: yes create it

SYSTEM:
🔨 Creating collections in Directus...

✓ Created collection: categories
✓ Created collection: products
✓ Created relation: products.category_id → categories.id
✓ Set up permissions (draft mode)

Collections ready! Check Directus admin to add your first products.

Want me to:
- Update the Next.js page to fetch from Directus API
- Generate sample data
- Move to the next page
```

### Step 7: Connect to Directus
```
USER: update the nextjs page

SYSTEM:
🔄 Connecting app/products/page.tsx to Directus...

✓ Added Directus SDK setup
✓ Generated API fetch with proper typing
✓ Updated ProductCard to use real data
✓ Added loading and error states

Your /products page is now fully connected!

Test it: npm run dev and add products in Directus admin.

Next page?
```

## Implementation Details

### HTML Parsing
- Use regex/DOM parser to identify sections
- Extract Tailwind classes
- Identify repeating patterns (cards, lists, grids)
- Detect images, links, forms

### Component Generation
- Follow project patterns from `reference/05_aurabuild_conversion.md`
- Use Server Components by default
- Convert `class` to `className`
- Map colors: `gray-*` → `slate-*`, `blue-*` → `cyan-*`
- Mobile-first responsive breakpoints

### Collection Schema Inference
- Detect repeating HTML structures
- Infer field types from content:
  - Text content → `string`
  - Long text → `text`
  - Numbers/currency → `decimal` or `integer`
  - Images → `file` (image interface)
  - Links to other pages → `relation`
  - Dates → `timestamp`
- Auto-generate `slug` fields for detail pages
- Auto-add `id`, `created_at`, `updated_at`

### Directus MCP Integration
```typescript
// Behind the scenes when user says "create it"
await mcp.directus.createCollection({
  collection: 'products',
  schema: proposedSchema
});

await mcp.directus.createField({
  collection: 'products',
  field: 'title',
  type: 'string',
  interface: 'input'
});

await mcp.directus.createRelation({
  collection: 'products',
  field: 'category_id',
  related_collection: 'categories'
});
```

### File Generation
```typescript
// Write Next.js files
await write({
  path: 'app/products/page.tsx',
  content: generatedComponent
});

// Update types.ts
await search_replace({
  file_path: 'lib/types.ts',
  old_string: 'export interface Schema {',
  new_string: `export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image?: string;
  description?: string;
  category_id?: string | Category;
  stock_count?: number;
  created_at: string;
}

export interface Schema {`
});
```

### Validation Logic
```typescript
function validateConnection(page: string, collection: string): ValidationReport {
  // Check if component has Directus import
  // Check if collection exists in Directus
  // Check if fields match
  // Return detailed report
}
```

## Error Handling

- **Missing files**: Prompt user to upload
- **Invalid routes**: Validate Next.js route format
- **Parse errors**: Show specific HTML section causing issue
- **Directus errors**: Display API error messages
- **Type mismatches**: Suggest corrections

## State Persistence

- Store session state in conversation context
- Allow resuming: "continue with products page"
- Support multiple pages in parallel
- Track progress: "what's left to convert?"

## Return Condition

Return when:
- All requested conversions are complete
- User explicitly ends conversation
- Error requires user intervention
- User asks to move to next step

--- End Command ---

