# AuraBuild to Next.js Conversion

> Use this guide when converting AuraBuild HTML exports to React/Next.js components.

## Pattern Overview

```
AuraBuild HTML ──▶ Identify Sections ──▶ Create Block Type ──▶ Build Component ──▶ Wire to CMS
```

---

## Step 1: Analyze HTML Structure

From AuraBuild export, identify:

```html
<!-- Example AuraBuild section -->
<section class="py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center">Our Services</h2>
    <p class="text-gray-600 text-center mt-4">Quality dental care</p>
    <div class="grid grid-cols-3 gap-8 mt-12">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="font-semibold">Service 1</h3>
        <p class="text-gray-500">Description here</p>
      </div>
      <!-- More items -->
    </div>
  </div>
</section>
```

**Extract:**
- Section title: `Our Services`
- Section subtitle: `Quality dental care`
- Repeating items: Service cards with title + description

---

## Step 2: Define CMS Fields

Map HTML to Directus fields:

| HTML Element | Directus Field | Type |
|--------------|----------------|------|
| Section title | `title` | String |
| Section subtitle | `subtitle` | Text |
| Service cards | `items` | JSON (array) |
| Card title | `items[].name` | String |
| Card description | `items[].description` | Text |
| Card icon | `items[].icon_name` | String |

---

## Step 3: Create TypeScript Interface

```typescript
// lib/types.ts
export interface BlockServicesGrid {
  id: number;
  title?: string;
  subtitle?: string;
  items?: Array<{
    name: string;
    description: string;
    icon_name?: string;
  }>;
}
```

---

## Step 4: Convert to React Component

**DO NOT copy HTML directly.** Convert properly:

```typescript
// components/blocks/ServicesGrid.tsx
import { Grid, Sparkles, Heart, Shield } from "lucide-react";
import type { BlockServicesGrid } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  grid: Grid,
  sparkles: Sparkles,
  heart: Heart,
  shield: Shield,
};

interface ServicesGridProps {
  data: BlockServicesGrid;
}

export default function ServicesGrid({ data }: ServicesGridProps) {
  if (!data.items?.length) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        {data.title && (
          <h2 className="text-3xl font-bold text-center text-slate-900">
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="text-slate-600 text-center mt-4">{data.subtitle}</p>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {data.items.map((item, index) => {
            const Icon = iconMap[item.icon_name || "grid"];
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                {Icon && <Icon className="w-8 h-8 text-cyan-600 mb-4" />}
                <h3 className="font-semibold text-lg text-slate-900">
                  {item.name}
                </h3>
                <p className="text-slate-500 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

---

## Conversion Rules

| AuraBuild | Next.js |
|-----------|---------|
| `class=""` | `className=""` |
| `<img src="">` | `<img src={getFileUrl(data.image)}` or Next.js `<Image>` |
| `<a href="">` | `<Link href="">` for internal links |
| Inline styles | Tailwind classes |
| Static text | `{data.field}` from CMS |
| `onclick=""` | `onClick={}` handler |
| `for=""` | `htmlFor=""` |

---

## Step 5: Map Colors to Project Palette

| AuraBuild | Project |
|-----------|---------|
| `gray-*` | `slate-*` |
| `blue-*` | `cyan-*` |
| Primary color | `cyan-600` |
| Text dark | `slate-900` |
| Text body | `slate-600` |
| Text muted | `slate-500` |
| Background | `white` or `slate-50` |

---

## Step 6: Add Responsive Breakpoints

Ensure mobile-first:

```tsx
// ❌ Desktop-first (wrong)
<div className="grid-cols-3 md:grid-cols-1">

// ✅ Mobile-first (correct)
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

## Quick Checklist

- [ ] HTML structure analyzed and sections identified
- [ ] CMS fields mapped from static content
- [ ] TypeScript interface created
- [ ] Component uses `data` prop (not hardcoded)
- [ ] `class` converted to `className`
- [ ] Static text replaced with CMS fields
- [ ] Colors mapped to project palette
- [ ] Responsive breakpoints are mobile-first
- [ ] Links use `<Link>` for internal navigation
- [ ] Images use `getFileUrl()` helper
- [ ] Icons use Lucide React (not inline SVG)
- [ ] Component handles empty/missing data
