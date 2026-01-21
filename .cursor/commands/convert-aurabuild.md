---
description: Convert AuraBuild HTML export to React component
---

# /convert-aurabuild [block-name]

Convert an AuraBuild HTML export to a React component with CMS integration.

## Arguments
- `block-name`: Name for the new block (e.g., `gallery`, `pricing-table`)

## Prerequisites
Have the AuraBuild HTML code ready to paste or available in a file.

## Steps

### 1. Load Conversion Guide
Read `reference/05_aurabuild_conversion.md` for conversion rules.

### 2. Get HTML Source
Ask user to paste the AuraBuild HTML, or read from file if specified.

### 3. Analyze HTML Structure
Identify:
- Section title/heading
- Repeating items (cards, list items)
- Images and their sources
- Links (internal vs external)
- Color classes used

### 4. Map CMS Fields
Create a field mapping table:

| HTML Element | Directus Field | Type |
|--------------|----------------|------|
| Section title | `title` | String |
| Section subtitle | `subtitle` | Text |
| Repeating items | `items` | JSON (array) |
| Item title | `items[].name` | String |
| Item description | `items[].description` | Text |
| Item icon | `items[].icon_name` | String |
| Item image | `items[].image` | File |

### 5. Create TypeScript Interface
Edit `lib/types.ts`:

```typescript
export interface Block[Name] {
  id: number;
  title?: string;
  subtitle?: string;
  items?: Array<{
    name: string;
    description?: string;
    icon_name?: string;
    image?: string;
  }>;
}
```

Add to Schema interface.

Validate:
// turbo
```bash
npx tsc --noEmit
```

### 6. Create Fetch Function
Edit `lib/data.ts` following existing patterns.

### 7. Convert HTML to React Component
Create `components/blocks/[Name].tsx`:

Apply these conversion rules:

| AuraBuild | Next.js |
|-----------|---------|
| `class=""` | `className=""` |
| `<img src="">` | `<img src={getFileUrl(data.image)}` |
| `<a href="">` | `<Link href="">` for internal |
| Static text | `{data.field}` |
| `onclick=""` | `onClick={}` |
| `for=""` | `htmlFor=""` |

Apply color mapping:

| AuraBuild | Project |
|-----------|---------|
| `gray-*` | `slate-*` |
| `blue-*` | `cyan-*` |
| Primary | `cyan-600` |
| Text dark | `slate-900` |
| Text body | `slate-600` |

Ensure mobile-first responsive:
```tsx
// ❌ Wrong
<div className="grid-cols-3 md:grid-cols-1">

// ✅ Correct
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 8. Wire Up Component
Add to page renderer following `/add-block` pattern.

### 9. Validate
// turbo
```bash
npm run lint && npx tsc --noEmit && npm run build
```

### 10. Visual Verification
// turbo
```bash
npm run dev
```

Compare the React component to the original AuraBuild design at localhost:3000.

## Conversion Checklist
Before marking complete, verify:
- [ ] `class` → `className` everywhere
- [ ] Static text → CMS fields (`{data.field}`)
- [ ] Colors → Project palette (`cyan-*`, `slate-*`)
- [ ] Images → `getFileUrl(data.image)`
- [ ] Internal links → `<Link href="">`
- [ ] Icons → Lucide React (not inline SVG)
- [ ] Mobile-first responsive breakpoints
- [ ] Empty/null data handled gracefully
- [ ] Semantic HTML (`section`, `h2`, etc.)

## Return Condition
Return when:
1. HTML is converted to React component
2. CMS fields replace static content
3. All conversions applied correctly
4. Component renders matching original design

## Output Format
```
✅ Conversion Complete: block_[name]

📋 Conversions Applied:
  - [x] class → className
  - [x] Static text → CMS fields
  - [x] Colors → Project palette
  - [x] Images → getFileUrl()
  - [x] Links → <Link> for internal
  - [x] Mobile-first responsive

📁 Files Created/Modified:
  - lib/types.ts
  - lib/data.ts
  - components/blocks/[Name].tsx
  - app/page.tsx

📋 Directus Setup Required:
  - Collection: block_[name]
  - Fields: [list mapped fields]

📝 Ready for: /commit
```
