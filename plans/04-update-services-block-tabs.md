# Plan 4: Update ServicesBlock for Tabbed Interface

> **Status**: Ready for Implementation  
> **Part of**: Phase 1 - Update Existing Blocks  
> **Estimated Time**: 2-3 hours  
> **Dependencies**: `services` and `service_categories` collections must exist

---

## Description

Transform `ServicesBlock` from a simple grid to a tabbed interface that filters services by category. This requires:
- Creating a Client Component for tab interactivity
- Fetching services from `services` collection (not hardcoded)
- Grouping services by category
- Implementing tab switching UI matching HTML design

---

## Current System Behavior

The current `ServicesBlock` component:
- Displays hardcoded service list in a simple grid
- No category filtering
- No tabs
- Server Component only

---

## Research Summary

From `docs/research/html-to-directus-conversion.md`:
- HTML shows tabbed interface with categories: จัดฟัน, ความงาม, ฟันปลอม, รักษาราก, ทั่วไป, ศัลยกรรมช่องปาก
- Services are displayed in cards with icons, titles, descriptions
- Active tab has dark background (`bg-[#0F2942]`), inactive tabs are white
- Services should be fetched from `services` collection and grouped by `category`

---

## Files to Modify/Create

### New Files
- `components/blocks/ServicesBlockClient.tsx` - Client Component for tab interactivity

### Modified Files
- `components/blocks/ServicesBlock.tsx` - Update to fetch services and use client component
- `lib/data.ts` - Add function to fetch services grouped by category (if needed)

---

## Step-by-Step Tasks

### Task 1: Update ServicesBlock to Fetch Services
**File**: `components/blocks/ServicesBlock.tsx`  
**Action**: Modify existing  
**Lines**: 1-58

**Current Code**:
```1:58:components/blocks/ServicesBlock.tsx
import type { BlockServices } from "@/lib/types";

interface ServicesBlockProps {
  data?: BlockServices | null;
}

export default function ServicesBlock({ data }: ServicesBlockProps) {
  if (!data) return null;

  const title = data.title ?? "OUR SERVICES!";
  const subtitle = data.subtitle ?? "บริการทางทันตกรรมของ Tooth Box";
  const services = data.services ?? [
    { label: "อุดฟัน" },
    // ... hardcoded services
  ];

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      {/* Simple grid display */}
    </section>
  );
}
```

**Proposed Change**:
```typescript
import type { BlockServices, Service, ServiceCategory } from "@/lib/types";
import { getServices, getServiceCategories } from "@/lib/data";
import ServicesBlockClient from "./ServicesBlockClient";

interface ServicesBlockProps {
  data?: BlockServices | null;
}

export default async function ServicesBlock({ data }: ServicesBlockProps) {
  if (!data) return null;

  const title = data.title ?? "OUR SERVICES!";
  const subtitle = data.subtitle ?? "บริการทางทันตกรรมของ Baomue";
  
  // Fetch services and categories
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories(),
  ]);

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = {};
  categories.forEach((cat) => {
    servicesByCategory[cat.slug] = services.filter(
      (s) => s.category && (typeof s.category === 'object' ? s.category.slug : null) === cat.slug
    );
  });

  return (
    <section className="md:py-16 bg-white pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-[#0F3FA1] mb-2 tracking-tighter uppercase">
            {title}
          </h1>
          <p className="text-[#1e3a8a] text-lg font-bold">{subtitle}</p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none"></div>

          {/* Card Header */}
          <div className="text-center pt-12 px-6 pb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FB9C2C] text-white shadow-sm mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span className="text-xs font-bold tracking-wide">เปิดให้บริการทุกวัน</span>
            </div>
            <h2 className="text-3xl md:text-3xl font-bold text-[#1e3a8a] mb-2 tracking-tight">
              บริการทันตกรรมของ Baomue
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล
            </p>
          </div>

          {/* Client Component for Tabs */}
          <ServicesBlockClient 
            categories={categories}
            servicesByCategory={servicesByCategory}
          />
        </div>
      </div>
    </section>
  );
}
```

**Why**: Need to fetch real services from Directus and group by category. Server Component fetches data, Client Component handles interactivity.

**Validation**: `npm run dev` - Check that services are fetched
**Test**: Verify services display in browser (may show empty if no data in Directus yet)

---

### Task 2: Create ServicesBlockClient Component
**File**: `components/blocks/ServicesBlockClient.tsx`  
**Action**: Create new  
**Lines**: New file

**Proposed Change**:
```typescript
"use client";

import { useState } from "react";
import type { Service, ServiceCategory } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";

interface ServicesBlockClientProps {
  categories: ServiceCategory[];
  servicesByCategory: Record<string, Service[]>;
}

export default function ServicesBlockClient({ 
  categories, 
  servicesByCategory 
}: ServicesBlockClientProps) {
  const [activeTab, setActiveTab] = useState<string>(
    categories[0]?.slug || ""
  );

  const activeServices = servicesByCategory[activeTab] || [];

  return (
    <>
      {/* Navigation Tabs */}
      <div className="px-6 md:px-10 py-2 mb-4 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start overflow-x-auto pb-2 md:pb-0">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveTab(category.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap min-w-[80px] ${
                activeTab === category.slug
                  ? "bg-[#0F2942] text-white shadow-sm"
                  : "bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid Content */}
      <div className="p-6 md:px-10 md:pb-10 relative z-10">
        <div className="grid md:grid-cols-2 gap-5">
          {activeServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-[#E6F4FF] rounded-2xl p-6 flex flex-col items-start hover:shadow-md transition-all cursor-pointer group h-full border border-blue-50/50"
            >
              {/* Icon placeholder - can be enhanced with actual icon from service */}
              <div className="w-12 h-12 rounded-xl bg-[#FB9C2C] flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">
                {service.name}
              </h3>
              <p className="text-[#1e3a8a]/70 text-xs mb-6 leading-relaxed">
                {service.short_description || "บริการทันตกรรมคุณภาพ"}
              </p>
              <div className="mt-auto text-[#0099FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                อ่านเพิ่มเติม
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
```

**Why**: Client Component needed for tab state management and interactivity. Handles tab switching and displays filtered services.

**Validation**: `npm run dev` - Check tab switching works
**Test**: Click tabs, verify services filter correctly

---

## Directus Setup

### Verify Collections Exist
- `services` collection should exist with fields:
  - `name` (string)
  - `slug` (string)
  - `category` (M2O to `service_categories`)
  - `short_description` (text)
  - `status` (string, enum: 'published' | 'draft')

- `service_categories` collection should exist with fields:
  - `name` (string)
  - `slug` (string)
  - `sort` (integer)

### Sample Data Structure
Ensure services are linked to categories via the `category` field.

---

## Testing Strategy

### Functional Testing
1. Start dev server: `npm run dev`
2. Navigate to services page or page with ServicesBlock
3. Test tab functionality:
   - [ ] Tabs display all categories
   - [ ] Clicking tab changes active state
   - [ ] Services filter by selected category
   - [ ] Empty categories show no services (or empty state)
   - [ ] Service cards link to detail pages

### Visual Testing
- [ ] Tab styling matches HTML (dark active, white inactive)
- [ ] Service cards match HTML design
- [ ] Grid layout responsive (2 columns on desktop)
- [ ] Hover effects work on cards

### Data Testing
- [ ] Services fetch from Directus correctly
- [ ] Categories fetch correctly
- [ ] Services group by category correctly
- [ ] Handles missing data gracefully

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

- [ ] ServicesBlock fetches services from Directus
- [ ] Tabbed interface displays categories
- [ ] Tab switching filters services correctly
- [ ] Service cards match HTML design
- [ ] Cards link to service detail pages
- [ ] Client Component handles state correctly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive design works

---

## Context Notes

- **Client Component Required**: Tab interactivity needs `"use client"` directive
- **Data Fetching**: Server Component fetches, Client Component receives as props
- **Category Mapping**: HTML uses Thai names, Directus should match
- **Empty States**: Consider adding "No services in this category" message
- **Icons**: Service icons can be enhanced later with icon field in Directus

---

## Project-Specific Requirements

- ✅ ISR: Handled by page component
- ✅ Images: Use `getFileUrl()` when service images are added
- ✅ Server Components: Main block is Server, Client only for interactivity
- ✅ Tailwind Only: All styling with Tailwind classes
- ✅ Fallbacks: Handle empty categories/services gracefully
- ✅ Type Safety: Use existing Service and ServiceCategory types

---

## Next Steps

After completing this plan:
1. Test with sample data in Directus
2. Verify tab functionality works
3. Proceed to **Plan 12: Services Pages** to create detail pages
4. Or continue with other Phase 1 plans

---

## Completion Status

- [x] All tasks completed
- [x] Task 1: Updated ServicesBlock.tsx to fetch services from Directus
- [x] Task 2: Created ServicesBlockClient.tsx for tab interactivity
- [x] All validations passed (lint, TypeScript, build)
- [x] Feature tested in build
- Completed: 2025-01-27

### Implementation Notes
- ServicesBlock is now an async Server Component that fetches services and categories
- ServicesBlockClient is a Client Component handling tab state and interactivity
- Services are grouped by category slug for filtering
- Build completed successfully with no errors
- Services and categories are being fetched correctly (verified in build logs)

