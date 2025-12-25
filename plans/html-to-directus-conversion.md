# Implementation Plan: HTML to Directus CMS Conversion

> **Status**: Ready for Implementation  
> **Research Document**: `docs/research/html-to-directus-conversion.md`  
> **Created**: December 24, 2025  
> **Estimated Effort**: 3-4 days

---

## Table of Contents

1. [Overview](#1-overview)
2. [Current System Behavior](#2-current-system-behavior)
3. [Key Research Findings](#3-key-research-findings)
4. [Files to Modify/Create](#4-files-to-modifycreate)
5. [Implementation Tasks](#5-implementation-tasks)
   - [Phase 1: TypeScript Types & Data Layer](#phase-1-typescript-types--data-layer)
   - [Phase 2: New Block Components](#phase-2-new-block-components)
   - [Phase 3: New Pages](#phase-3-new-pages)
   - [Phase 4: Directus Setup](#phase-4-directus-setup)
6. [Testing Strategy](#6-testing-strategy)
7. [Acceptance Criteria](#7-acceptance-criteria)
8. [Context Notes](#8-context-notes)

---

## 1. Overview

### Objective
Convert 8 static HTML files from AuraBuild export into dynamic, CMS-driven Next.js pages using Directus as the headless CMS.

### Scope
| HTML File | Target Route | Status |
|-----------|--------------|--------|
| `index.html` | `/` | Existing (needs updates) |
| `about-us.html` | `/about` | Existing (needs updates) |
| `service-index.html` | `/services` | Existing (needs updates) |
| `service-detail.html` | `/services/[slug]` | Existing (needs updates) |
| `contact-page.html` | `/contact` | Existing (needs updates) |
| `blog.html` | `/blog` | Existing (needs updates) |
| `promotions.html` | `/promotions` | **NEW** |
| `our-work.html` | `/our-work` | **NEW** |

### New Directus Collections Required
- `promotions` - Promotion items with countdown, pricing, benefits
- `promotion_categories` - Categories for filtering promotions
- `portfolio_cases` - Before/after case studies
- `portfolio_categories` - Categories for filtering cases
- `block_promotions` - CMS block for promotions page hero/settings
- `block_portfolio` - CMS block for portfolio page hero/settings
- `block_stats` - Statistics bar component (used on portfolio page)

---

## 2. Current System Behavior

### Data Flow
```
[Directus CMS] 
    ↓ REST API
[lib/directus.ts] → directus client
    ↓
[lib/data.ts] → data fetching functions (getPageBySlug, getBlockContent, etc.)
    ↓
[app/page.tsx] → Server Component fetches data
    ↓
[components/PageBuilder.tsx] → Maps block types to components
    ↓
[components/blocks/*.tsx] → Individual block components render content
```

### Existing Block Types (12 blocks)
```typescript
// lib/types.ts - BlockType union
type BlockType = 
  | 'block_hero'
  | 'block_about_us'
  | 'block_why_choose_us'
  | 'block_team'
  | 'block_signature_treatment'
  | 'block_safety_banner'
  | 'block_services'
  | 'block_locations'
  | 'block_booking'
  | 'block_contact'
  | 'block_text'
  | 'block_form'
```

### PageBuilder Pattern
```typescript
// components/PageBuilder.tsx - Current implementation
const componentMap: Record<BlockType, React.ComponentType<any>> = {
  block_hero: HeroBlock,
  block_about_us: AboutUsBlock,
  // ... maps block type to component
};

// Renders blocks dynamically
{filteredBlocks.map((block) => {
  const Component = componentMap[block.collection];
  return <Component key={block.id} data={block.content} />;
})}
```

### Data Fetching Pattern
```typescript
// lib/data.ts - Example block fetcher
export async function getHeroBlock(id: string): Promise<BlockHero | null> {
  try {
    const block = await directus.request(
      readItem('block_hero', id, {
        fields: ['*', 'background_image.*'],
      })
    );
    return block;
  } catch (error) {
    console.error('Error fetching hero block:', error);
    return null;
  }
}
```

---

## 3. Key Research Findings

### Resolved Design Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Promotions data model | Separate `promotions` collection | Each promotion needs countdown, pricing, benefits list |
| Portfolio data model | Separate `portfolio_cases` collection | Supports before/after images, detailed case info |
| Blog search | Client-side filtering | Keep it simple, small dataset |
| Before/After slider | `image_before` + `image_after` fields | Direct mapping to slider component |
| Contact form | Reuse existing `block_form` | Form already handles dynamic fields |

### New Components Identified

1. **CountdownTimer** (Client Component)
   - Displays countdown to promotion end date
   - Updates every second
   - Shows days, hours, minutes, seconds

2. **BeforeAfterSlider** (Client Component)
   - Interactive comparison slider
   - Drag handle to reveal before/after
   - Touch-friendly

3. **FilterNavigation** (Client Component)
   - Horizontal scrollable category filter
   - Active state highlighting
   - Category count display

4. **PromotionCard** (Server Component)
   - Image, tags, pricing, benefits list
   - Badge system (HOT, NEW, LIMITED, etc.)

5. **PortfolioCard** (Server Component)
   - Before/after thumbnail
   - Case summary, duration, patient info

### Color Mapping (from reference/05_aurabuild_conversion.md)
```
HTML gray-* → Tailwind slate-*
HTML blue-* → Tailwind cyan-*
Primary color: cyan-600 (#0891b2)
```

---

## 4. Files to Modify/Create

### Files to MODIFY

| File | Changes |
|------|---------|
| `lib/types.ts` | Add Promotion, PortfolioCase, BlockStats, BlockPromotions, BlockPortfolio interfaces |
| `lib/data.ts` | Add fetch functions for new collections |
| `components/PageBuilder.tsx` | Register new block components |

### Files to CREATE

| File | Purpose |
|------|---------|
| `lib/types/promotions.ts` | Promotion-related type definitions |
| `lib/types/portfolio.ts` | Portfolio-related type definitions |
| `components/blocks/StatsBlock.tsx` | Statistics bar component |
| `components/blocks/PromotionsBlock.tsx` | Promotions hero/settings block |
| `components/blocks/PortfolioBlock.tsx` | Portfolio hero/settings block |
| `components/promotions/PromotionCard.tsx` | Individual promotion card |
| `components/promotions/CountdownTimer.tsx` | Countdown timer (client) |
| `components/promotions/FilterNav.tsx` | Category filter (client) |
| `components/portfolio/PortfolioCard.tsx` | Individual case card |
| `components/portfolio/BeforeAfterSlider.tsx` | Image slider (client) |
| `components/portfolio/CaseModal.tsx` | Case detail modal (client) |
| `app/promotions/page.tsx` | Promotions list page |
| `app/promotions/[slug]/page.tsx` | Promotion detail page |
| `app/our-work/page.tsx` | Portfolio list page |
| `app/our-work/[slug]/page.tsx` | Case detail page |

---

## 5. Implementation Tasks

### Phase 1: TypeScript Types & Data Layer

---

#### Task 1.1: Add Promotion Types

**File**: `lib/types.ts`

**BEFORE** (end of types.ts):
```typescript
// Blog Post
export interface BlogPost {
  id: string;
  status: 'published' | 'draft' | 'archived';
  // ...existing fields
}
```

**AFTER** (add after BlogPost):
```typescript
// Blog Post
export interface BlogPost {
  id: string;
  status: 'published' | 'draft' | 'archived';
  // ...existing fields
}

// ============================================
// PROMOTIONS
// ============================================

export interface PromotionCategory {
  id: string;
  name: string;
  slug: string;
  sort: number | null;
}

export interface PromotionBenefit {
  text: string;
}

export interface Promotion {
  id: string;
  status: 'published' | 'draft' | 'archived';
  sort: number | null;
  date_created: string | null;
  date_updated: string | null;
  
  // Content
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: DirectusFile | string | null;
  
  // Pricing
  original_price: number | null;
  discounted_price: number | null;
  discount_percentage: number | null;
  
  // Promotion Details
  end_date: string | null;
  remaining_quantity: number | null;
  benefits: PromotionBenefit[] | null;
  
  // Tags/Badges
  is_hot: boolean;
  is_popular: boolean;
  is_new_customer: boolean;
  is_limited: boolean;
  is_free: boolean;
  
  // Relations
  category: PromotionCategory | string | null;
  
  // SEO
  meta_title: string | null;
  meta_description: string | null;
}

export interface BlockPromotions {
  id: string;
  hero_title: string | null;
  hero_description: string | null;
  featured_promotion: Promotion | string | null;
  show_countdown: boolean;
}
```

**Rationale**: Separating promotion types enables strong typing for the promotion card component and data fetching. The benefits array allows for dynamic list rendering.

**Validation**: Run `npx tsc --noEmit` to verify types compile.

---

#### Task 1.2: Add Portfolio Types

**File**: `lib/types.ts`

**ADD** (after Promotion types):
```typescript
// ============================================
// PORTFOLIO / CASE STUDIES
// ============================================

export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort: number | null;
}

export interface PortfolioCase {
  id: string;
  status: 'published' | 'draft' | 'archived';
  sort: number | null;
  date_created: string | null;
  date_updated: string | null;
  
  // Content
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  
  // Before/After Images
  image_before: DirectusFile | string | null;
  image_after: DirectusFile | string | null;
  gallery: DirectusFile[] | string[] | null;
  
  // Case Details
  treatment_duration: string | null;
  patient_gender: 'male' | 'female' | 'other' | null;
  patient_age: number | null;
  rating: number | null;
  
  // Treatment Info
  problem_description: string | null;
  treatment_plan: string | null;
  
  // Relations
  category: PortfolioCategory | string | null;
  
  // SEO
  meta_title: string | null;
  meta_description: string | null;
}

export interface BlockPortfolio {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  show_stats: boolean;
}

export interface BlockStats {
  id: string;
  items: StatItem[];
}

export interface StatItem {
  value: string;
  label: string;
  suffix: string | null;
}
```

**Rationale**: Portfolio cases need before/after images for the slider component. Patient info enables personalized case display.

---

#### Task 1.3: Update BlockType Union and Schema

**File**: `lib/types.ts`

**BEFORE**:
```typescript
export type BlockType =
  | 'block_hero'
  | 'block_about_us'
  | 'block_why_choose_us'
  | 'block_team'
  | 'block_signature_treatment'
  | 'block_safety_banner'
  | 'block_services'
  | 'block_locations'
  | 'block_booking'
  | 'block_contact'
  | 'block_text'
  | 'block_form';
```

**AFTER**:
```typescript
export type BlockType =
  | 'block_hero'
  | 'block_about_us'
  | 'block_why_choose_us'
  | 'block_team'
  | 'block_signature_treatment'
  | 'block_safety_banner'
  | 'block_services'
  | 'block_locations'
  | 'block_booking'
  | 'block_contact'
  | 'block_text'
  | 'block_form'
  | 'block_stats'
  | 'block_promotions'
  | 'block_portfolio';
```

**ALSO UPDATE** the Schema interface:
```typescript
export interface Schema {
  // ... existing collections
  
  // NEW: Add these collections
  promotions: Promotion[];
  promotion_categories: PromotionCategory[];
  portfolio_cases: PortfolioCase[];
  portfolio_categories: PortfolioCategory[];
  block_stats: BlockStats[];
  block_promotions: BlockPromotions[];
  block_portfolio: BlockPortfolio[];
}
```

---

#### Task 1.4: Add Promotion Data Fetching Functions

**File**: `lib/data.ts`

**ADD** (new section after existing functions):
```typescript
// ============================================
// PROMOTIONS
// ============================================

/**
 * Get all published promotions
 */
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const promotions = await directus.request(
      readItems('promotions', {
        filter: {
          status: { _eq: 'published' },
        },
        sort: ['sort', '-date_created'],
        fields: [
          '*',
          'image.*',
          'category.id',
          'category.name',
          'category.slug',
        ],
      })
    );
    return promotions as Promotion[];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }
}

/**
 * Get a single promotion by slug
 */
export async function getPromotionBySlug(slug: string): Promise<Promotion | null> {
  try {
    const promotions = await directus.request(
      readItems('promotions', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        limit: 1,
        fields: [
          '*',
          'image.*',
          'category.id',
          'category.name',
          'category.slug',
        ],
      })
    );
    return promotions[0] || null;
  } catch (error) {
    console.error('Error fetching promotion by slug:', error);
    return null;
  }
}

/**
 * Get all promotion categories
 */
export async function getPromotionCategories(): Promise<PromotionCategory[]> {
  try {
    const categories = await directus.request(
      readItems('promotion_categories', {
        sort: ['sort', 'name'],
        fields: ['*'],
      })
    );
    return categories as PromotionCategory[];
  } catch (error) {
    console.error('Error fetching promotion categories:', error);
    return [];
  }
}

/**
 * Get promotions block data
 */
export async function getPromotionsBlock(id: string): Promise<BlockPromotions | null> {
  try {
    const block = await directus.request(
      readItem('block_promotions', id, {
        fields: [
          '*',
          'featured_promotion.*',
          'featured_promotion.image.*',
        ],
      })
    );
    return block as BlockPromotions;
  } catch (error) {
    console.error('Error fetching promotions block:', error);
    return null;
  }
}
```

**Validation**: Test with `console.log(await getPromotions())` after Directus setup.

---

#### Task 1.5: Add Portfolio Data Fetching Functions

**File**: `lib/data.ts`

**ADD** (after promotion functions):
```typescript
// ============================================
// PORTFOLIO / CASE STUDIES
// ============================================

/**
 * Get all published portfolio cases
 */
export async function getPortfolioCases(): Promise<PortfolioCase[]> {
  try {
    const cases = await directus.request(
      readItems('portfolio_cases', {
        filter: {
          status: { _eq: 'published' },
        },
        sort: ['sort', '-date_created'],
        fields: [
          '*',
          'image_before.*',
          'image_after.*',
          'category.id',
          'category.name',
          'category.slug',
        ],
      })
    );
    return cases as PortfolioCase[];
  } catch (error) {
    console.error('Error fetching portfolio cases:', error);
    return [];
  }
}

/**
 * Get a single portfolio case by slug
 */
export async function getPortfolioCaseBySlug(slug: string): Promise<PortfolioCase | null> {
  try {
    const cases = await directus.request(
      readItems('portfolio_cases', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
        },
        limit: 1,
        fields: [
          '*',
          'image_before.*',
          'image_after.*',
          'gallery.*',
          'category.id',
          'category.name',
          'category.slug',
        ],
      })
    );
    return cases[0] || null;
  } catch (error) {
    console.error('Error fetching portfolio case by slug:', error);
    return null;
  }
}

/**
 * Get all portfolio categories
 */
export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  try {
    const categories = await directus.request(
      readItems('portfolio_categories', {
        sort: ['sort', 'name'],
        fields: ['*'],
      })
    );
    return categories as PortfolioCategory[];
  } catch (error) {
    console.error('Error fetching portfolio categories:', error);
    return [];
  }
}

/**
 * Get portfolio block data
 */
export async function getPortfolioBlock(id: string): Promise<BlockPortfolio | null> {
  try {
    const block = await directus.request(
      readItem('block_portfolio', id, {
        fields: ['*'],
      })
    );
    return block as BlockPortfolio;
  } catch (error) {
    console.error('Error fetching portfolio block:', error);
    return null;
  }
}

/**
 * Get stats block data
 */
export async function getStatsBlock(id: string): Promise<BlockStats | null> {
  try {
    const block = await directus.request(
      readItem('block_stats', id, {
        fields: ['*'],
      })
    );
    return block as BlockStats;
  } catch (error) {
    console.error('Error fetching stats block:', error);
    return null;
  }
}
```

---

### Phase 2: New Block Components

---

#### Task 2.1: Create StatsBlock Component

**File**: `components/blocks/StatsBlock.tsx` (CREATE)

```tsx
import { BlockStats } from '@/lib/types';

interface StatsBlockProps {
  data: BlockStats | null;
}

export default function StatsBlock({ data }: StatsBlockProps) {
  const defaultItems = [
    { value: '500', label: 'เคสสำเร็จ', suffix: '+' },
    { value: '4.9', label: 'คะแนนรีวิว', suffix: '/5' },
    { value: '98', label: 'ความพึงพอใจ', suffix: '%' },
    { value: '15', label: 'ปีประสบการณ์', suffix: '+' },
  ];

  const items = data?.items || defaultItems;

  return (
    <section className="bg-gradient-to-r from-cyan-600 to-cyan-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">
                {item.value}
                {item.suffix && (
                  <span className="text-xl md:text-2xl opacity-80">
                    {item.suffix}
                  </span>
                )}
              </div>
              <div className="text-sm md:text-base opacity-90">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Rationale**: Server component for static stats display. Matches the stats bar in `our-work.html`.

---

#### Task 2.2: Create BeforeAfterSlider Component (Client)

**File**: `components/portfolio/BeforeAfterSlider.tsx` (CREATE)

```tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { getFileUrl } from '@/lib/directus';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'ก่อน',
  afterLabel = 'หลัง',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl cursor-ew-resize select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
    >
      {/* After Image (Full) */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={getFileUrl(afterImage)}
          alt={afterLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* After Label */}
        <span className="absolute bottom-3 right-3 bg-cyan-600 text-white text-xs font-medium px-2 py-1 rounded">
          {afterLabel}
        </span>
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={getFileUrl(beforeImage)}
            alt={beforeLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Before Label */}
          <span className="absolute bottom-3 left-3 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded">
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Handle Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
```

**Rationale**: Client component required for drag interactivity. Uses CSS `clipPath` for smooth performance.

---

#### Task 2.3: Create CountdownTimer Component (Client)

**File**: `components/promotions/CountdownTimer.tsx` (CREATE)

```tsx
'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) {
    return (
      <div className={`text-center text-red-500 font-medium ${className}`}>
        โปรโมชั่นสิ้นสุดแล้ว
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'วัน' },
    { value: timeLeft.hours, label: 'ชั่วโมง' },
    { value: timeLeft.minutes, label: 'นาที' },
    { value: timeLeft.seconds, label: 'วินาที' },
  ];

  return (
    <div className={`flex justify-center gap-3 ${className}`}>
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="bg-slate-800 text-white text-2xl md:text-3xl font-bold w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center">
            {String(unit.value).padStart(2, '0')}
          </div>
          <span className="text-xs text-slate-500 mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
```

**Rationale**: Client component for real-time countdown updates. Uses `useEffect` with `setInterval`.

---

#### Task 2.4: Create FilterNav Component (Client)

**File**: `components/shared/FilterNav.tsx` (CREATE)

```tsx
'use client';

import { useState } from 'react';

interface FilterItem {
  id: string;
  name: string;
  slug: string;
}

interface FilterNavProps {
  items: FilterItem[];
  onFilterChange: (slug: string | null) => void;
  allLabel?: string;
  className?: string;
}

export default function FilterNav({
  items,
  onFilterChange,
  allLabel = 'ทั้งหมด',
  className = '',
}: FilterNavProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleClick = (slug: string | null) => {
    setActiveFilter(slug);
    onFilterChange(slug);
  };

  return (
    <div className={`overflow-x-auto -mx-4 px-4 ${className}`}>
      <div className="flex gap-2 min-w-max pb-2">
        {/* All Button */}
        <button
          onClick={() => handleClick(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === null
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {allLabel}
        </button>

        {/* Category Buttons */}
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === item.slug
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Rationale**: Reusable filter component for both promotions and portfolio pages. Client component for state management.

---

#### Task 2.5: Create PromotionCard Component

**File**: `components/promotions/PromotionCard.tsx` (CREATE)

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Promotion } from '@/lib/types';
import { getFileUrl } from '@/lib/directus';

interface PromotionCardProps {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: PromotionCardProps) {
  const imageUrl = promotion.image
    ? getFileUrl(typeof promotion.image === 'string' ? promotion.image : promotion.image.id)
    : '/placeholder-promotion.jpg';

  const categoryName =
    typeof promotion.category === 'object' && promotion.category
      ? promotion.category.name
      : 'โปรโมชั่น';

  const savings =
    promotion.original_price && promotion.discounted_price
      ? promotion.original_price - promotion.discounted_price
      : 0;

  return (
    <Link
      href={`/promotions/${promotion.slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={promotion.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {promotion.is_hot && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              HOT
            </span>
          )}
          {promotion.is_popular && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              POPULAR
            </span>
          )}
          {promotion.is_new_customer && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              ลูกค้าใหม่
            </span>
          )}
          {promotion.is_limited && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              LIMITED
            </span>
          )}
          {promotion.is_free && (
            <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">
              FREE
            </span>
          )}
          {promotion.discount_percentage && promotion.discount_percentage > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{promotion.discount_percentage}%
            </span>
          )}
        </div>

        {/* Remaining Quantity */}
        {promotion.remaining_quantity !== null && promotion.remaining_quantity > 0 && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-2 py-1 rounded">
            เหลือ {promotion.remaining_quantity} สิทธิ์
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-cyan-600 text-sm font-medium mb-1">
          {categoryName}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
          {promotion.title}
        </h3>

        {/* Description */}
        {promotion.short_description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
            {promotion.short_description}
          </p>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          {promotion.discounted_price !== null && (
            <span className="text-xl font-bold text-cyan-600">
              ฿{promotion.discounted_price.toLocaleString()}
            </span>
          )}
          {promotion.original_price !== null && promotion.discounted_price !== null && (
            <span className="text-sm text-slate-400 line-through">
              ฿{promotion.original_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="text-sm text-green-600 font-medium mb-3">
            ประหยัด ฿{savings.toLocaleString()}
          </div>
        )}

        {/* Benefits */}
        {promotion.benefits && promotion.benefits.length > 0 && (
          <ul className="space-y-1">
            {promotion.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
```

---

#### Task 2.6: Create PortfolioCard Component

**File**: `components/portfolio/PortfolioCard.tsx` (CREATE)

```tsx
import Link from 'next/link';
import { PortfolioCase } from '@/lib/types';
import BeforeAfterSlider from './BeforeAfterSlider';

interface PortfolioCaseCardProps {
  caseItem: PortfolioCase;
}

export default function PortfolioCard({ caseItem }: PortfolioCaseCardProps) {
  const categoryName =
    typeof caseItem.category === 'object' && caseItem.category
      ? caseItem.category.name
      : 'ผลงาน';

  const beforeImageId =
    typeof caseItem.image_before === 'object' && caseItem.image_before
      ? caseItem.image_before.id
      : caseItem.image_before;

  const afterImageId =
    typeof caseItem.image_after === 'object' && caseItem.image_after
      ? caseItem.image_after.id
      : caseItem.image_after;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      {/* Before/After Slider */}
      {beforeImageId && afterImageId && (
        <BeforeAfterSlider
          beforeImage={beforeImageId}
          afterImage={afterImageId}
          className="aspect-[4/3]"
        />
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-medium px-2 py-1 rounded mb-2">
          {categoryName}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2">
          {caseItem.title}
        </h3>

        {/* Description */}
        {caseItem.short_description && (
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
            {caseItem.short_description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
          {caseItem.rating && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{caseItem.rating}</span>
            </div>
          )}
          {caseItem.treatment_duration && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{caseItem.treatment_duration}</span>
            </div>
          )}
        </div>

        {/* Patient Info */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {caseItem.patient_gender && (
            <span>
              {caseItem.patient_gender === 'male' ? 'ชาย' : 'หญิง'}
            </span>
          )}
          {caseItem.patient_age && <span>อายุ {caseItem.patient_age} ปี</span>}
        </div>

        {/* View Details Button */}
        <Link
          href={`/our-work/${caseItem.slug}`}
          className="mt-4 block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-lg transition-colors"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
```

---

#### Task 2.7: Update PageBuilder to Register New Blocks

**File**: `components/PageBuilder.tsx`

**BEFORE** (imports):
```typescript
import HeroBlock from './blocks/HeroBlock';
import AboutUsBlock from './blocks/AboutUsBlock';
// ...existing imports
```

**AFTER** (add new imports):
```typescript
import HeroBlock from './blocks/HeroBlock';
import AboutUsBlock from './blocks/AboutUsBlock';
// ...existing imports
import StatsBlock from './blocks/StatsBlock';
```

**BEFORE** (componentMap):
```typescript
const componentMap: Record<BlockType, React.ComponentType<any>> = {
  block_hero: HeroBlock,
  block_about_us: AboutUsBlock,
  // ...existing mappings
  block_form: FormBlock,
};
```

**AFTER** (add new mappings):
```typescript
const componentMap: Record<BlockType, React.ComponentType<any>> = {
  block_hero: HeroBlock,
  block_about_us: AboutUsBlock,
  // ...existing mappings
  block_form: FormBlock,
  block_stats: StatsBlock,
};
```

**Note**: `block_promotions` and `block_portfolio` are page-level settings blocks, not rendered via PageBuilder.

---

### Phase 3: New Pages

---

#### Task 3.1: Create Promotions List Page

**File**: `app/promotions/page.tsx` (CREATE)

```tsx
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromotionCard from '@/components/promotions/PromotionCard';
import CountdownTimer from '@/components/promotions/CountdownTimer';
import PromotionsFilterClient from './PromotionsFilterClient';
import { getPromotions, getPromotionCategories } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'โปรโมชั่น | คลินิกทันตกรรมเบามือ',
  description: 'โปรโมชั่นพิเศษจากคลินิกทันตกรรมเบามือ จัดฟัน ฟอกสีฟัน วีเนียร์ ในราคาพิเศษ',
};

export default async function PromotionsPage() {
  const [promotions, categories] = await Promise.all([
    getPromotions(),
    getPromotionCategories(),
  ]);

  // Find featured promotion (first hot/popular promotion)
  const featuredPromotion = promotions.find((p) => p.is_hot || p.is_popular);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section with Featured Promotion */}
        {featuredPromotion && (
          <section className="bg-gradient-to-r from-cyan-600 to-cyan-700 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center text-white">
                <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  โปรโมชั่นพิเศษ
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {featuredPromotion.title}
                </h1>
                {featuredPromotion.short_description && (
                  <p className="text-lg opacity-90 mb-6">
                    {featuredPromotion.short_description}
                  </p>
                )}
                
                {/* Countdown Timer */}
                {featuredPromotion.end_date && (
                  <div className="mt-6">
                    <p className="text-sm opacity-75 mb-3">สิ้นสุดใน</p>
                    <CountdownTimer endDate={featuredPromotion.end_date} />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Promotions Grid with Filter */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <PromotionsFilterClient
              promotions={promotions}
              categories={categories}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

---

#### Task 3.2: Create Promotions Filter Client Component

**File**: `app/promotions/PromotionsFilterClient.tsx` (CREATE)

```tsx
'use client';

import { useState, useMemo } from 'react';
import { Promotion, PromotionCategory } from '@/lib/types';
import PromotionCard from '@/components/promotions/PromotionCard';
import FilterNav from '@/components/shared/FilterNav';

interface PromotionsFilterClientProps {
  promotions: Promotion[];
  categories: PromotionCategory[];
}

export default function PromotionsFilterClient({
  promotions,
  categories,
}: PromotionsFilterClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredPromotions = useMemo(() => {
    if (!activeFilter) return promotions;
    
    return promotions.filter((promo) => {
      const categorySlug =
        typeof promo.category === 'object' && promo.category
          ? promo.category.slug
          : null;
      return categorySlug === activeFilter;
    });
  }, [promotions, activeFilter]);

  return (
    <>
      {/* Filter Navigation */}
      <div className="mb-8">
        <FilterNav
          items={categories}
          onFilterChange={setActiveFilter}
          allLabel="ทั้งหมด"
        />
      </div>

      {/* Results Count */}
      <p className="text-slate-500 mb-6">
        แสดง {filteredPromotions.length} โปรโมชั่น
      </p>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">ไม่พบโปรโมชั่นในหมวดหมู่นี้</p>
        </div>
      )}
    </>
  );
}
```

---

#### Task 3.3: Create Promotion Detail Page

**File**: `app/promotions/[slug]/page.tsx` (CREATE)

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountdownTimer from '@/components/promotions/CountdownTimer';
import { getPromotionBySlug, getPromotions } from '@/lib/data';
import { getFileUrl } from '@/lib/directus';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const promotions = await getPromotions();
  return promotions.map((promo) => ({
    slug: promo.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const promotion = await getPromotionBySlug(params.slug);
  
  if (!promotion) {
    return { title: 'ไม่พบโปรโมชั่น' };
  }

  return {
    title: promotion.meta_title || `${promotion.title} | คลินิกทันตกรรมเบามือ`,
    description: promotion.meta_description || promotion.short_description || '',
  };
}

export default async function PromotionDetailPage({ params }: PageProps) {
  const promotion = await getPromotionBySlug(params.slug);

  if (!promotion) {
    notFound();
  }

  const imageUrl = promotion.image
    ? getFileUrl(typeof promotion.image === 'string' ? promotion.image : promotion.image.id)
    : null;

  const savings =
    promotion.original_price && promotion.discounted_price
      ? promotion.original_price - promotion.discounted_price
      : 0;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-cyan-600">
                หน้าแรก
              </Link>
              <span className="mx-2">/</span>
              <Link href="/promotions" className="hover:text-cyan-600">
                โปรโมชั่น
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">{promotion.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Image */}
              {imageUrl && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={imageUrl}
                    alt={promotion.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {promotion.is_hot && (
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                        HOT
                      </span>
                    )}
                    {promotion.discount_percentage && (
                      <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                        -{promotion.discount_percentage}%
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Countdown */}
                {promotion.end_date && (
                  <div className="bg-slate-100 rounded-xl p-4 mb-6 text-center">
                    <p className="text-sm text-slate-600 mb-2">โปรโมชั่นสิ้นสุดใน</p>
                    <CountdownTimer endDate={promotion.end_date} />
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  {promotion.title}
                </h1>

                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-6">
                  {promotion.discounted_price !== null && (
                    <span className="text-3xl font-bold text-cyan-600">
                      ฿{promotion.discounted_price.toLocaleString()}
                    </span>
                  )}
                  {promotion.original_price !== null && promotion.discounted_price !== null && (
                    <span className="text-xl text-slate-400 line-through">
                      ฿{promotion.original_price.toLocaleString()}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="text-lg text-green-600 font-medium">
                      ประหยัด ฿{savings.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Remaining Quantity */}
                {promotion.remaining_quantity !== null && (
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    เหลือเพียง {promotion.remaining_quantity} สิทธิ์
                  </div>
                )}

                {/* Description */}
                {promotion.description && (
                  <div
                    className="prose prose-slate max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: promotion.description }}
                  />
                )}

                {/* Benefits */}
                {promotion.benefits && promotion.benefits.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                      สิ่งที่ได้รับ
                    </h2>
                    <ul className="space-y-3">
                      {promotion.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-slate-600">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    นัดหมายเลย
                  </Link>
                  <a
                    href="tel:0XX-XXX-XXXX"
                    className="flex-1 text-center border border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    โทรสอบถาม
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
```

---

#### Task 3.4: Create Our Work (Portfolio) List Page

**File**: `app/our-work/page.tsx` (CREATE)

```tsx
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatsBlock from '@/components/blocks/StatsBlock';
import OurWorkFilterClient from './OurWorkFilterClient';
import { getPortfolioCases, getPortfolioCategories } from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ผลงานของเรา | คลินิกทันตกรรมเบามือ',
  description: 'ดูผลงานก่อน-หลังการรักษาจากคลินิกทันตกรรมเบามือ จัดฟัน วีเนียร์ และบริการทันตกรรมอื่นๆ',
};

export default async function OurWorkPage() {
  const [cases, categories] = await Promise.all([
    getPortfolioCases(),
    getPortfolioCategories(),
  ]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-cyan-600 to-cyan-700 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center text-white">
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                ผลงานของเรา
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                ดูผลลัพธ์จริงจากคนไข้ของเรา
              </h1>
              <p className="text-lg opacity-90">
                เปรียบเทียบก่อน-หลังการรักษา ด้วยมาตรฐานคุณภาพระดับสากล
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <StatsBlock data={null} />

        {/* Portfolio Grid with Filter */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <OurWorkFilterClient cases={cases} categories={categories} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cyan-600 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              พร้อมเริ่มเปลี่ยนแปลงรอยยิ้มของคุณ?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              นัดหมายปรึกษาฟรี เพื่อวางแผนการรักษาที่เหมาะสมกับคุณ
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-cyan-600 font-semibold py-3 px-8 rounded-lg hover:bg-slate-100 transition-colors"
            >
              นัดหมายปรึกษา
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
```

---

#### Task 3.5: Create Our Work Filter Client Component

**File**: `app/our-work/OurWorkFilterClient.tsx` (CREATE)

```tsx
'use client';

import { useState, useMemo } from 'react';
import { PortfolioCase, PortfolioCategory } from '@/lib/types';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import FilterNav from '@/components/shared/FilterNav';

interface OurWorkFilterClientProps {
  cases: PortfolioCase[];
  categories: PortfolioCategory[];
}

export default function OurWorkFilterClient({
  cases,
  categories,
}: OurWorkFilterClientProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredCases = useMemo(() => {
    if (!activeFilter) return cases;
    
    return cases.filter((caseItem) => {
      const categorySlug =
        typeof caseItem.category === 'object' && caseItem.category
          ? caseItem.category.slug
          : null;
      return categorySlug === activeFilter;
    });
  }, [cases, activeFilter]);

  return (
    <>
      {/* Filter Navigation */}
      <div className="mb-8">
        <FilterNav
          items={categories}
          onFilterChange={setActiveFilter}
          allLabel="ทั้งหมด"
        />
      </div>

      {/* Results Count */}
      <p className="text-slate-500 mb-6">
        แสดง {filteredCases.length} ผลงาน
      </p>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => (
          <PortfolioCard key={caseItem.id} caseItem={caseItem} />
        ))}
      </div>

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">ไม่พบผลงานในหมวดหมู่นี้</p>
        </div>
      )}
    </>
  );
}
```

---

#### Task 3.6: Create Portfolio Case Detail Page

**File**: `app/our-work/[slug]/page.tsx` (CREATE)

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/portfolio/BeforeAfterSlider';
import { getPortfolioCaseBySlug, getPortfolioCases } from '@/lib/data';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const cases = await getPortfolioCases();
  return cases.map((caseItem) => ({
    slug: caseItem.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const caseItem = await getPortfolioCaseBySlug(params.slug);
  
  if (!caseItem) {
    return { title: 'ไม่พบผลงาน' };
  }

  return {
    title: caseItem.meta_title || `${caseItem.title} | ผลงานคลินิกทันตกรรมเบามือ`,
    description: caseItem.meta_description || caseItem.short_description || '',
  };
}

export default async function CaseDetailPage({ params }: PageProps) {
  const caseItem = await getPortfolioCaseBySlug(params.slug);

  if (!caseItem) {
    notFound();
  }

  const beforeImageId =
    typeof caseItem.image_before === 'object' && caseItem.image_before
      ? caseItem.image_before.id
      : caseItem.image_before;

  const afterImageId =
    typeof caseItem.image_after === 'object' && caseItem.image_after
      ? caseItem.image_after.id
      : caseItem.image_after;

  const categoryName =
    typeof caseItem.category === 'object' && caseItem.category
      ? caseItem.category.name
      : 'ผลงาน';

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-cyan-600">
                หน้าแรก
              </Link>
              <span className="mx-2">/</span>
              <Link href="/our-work" className="hover:text-cyan-600">
                ผลงานของเรา
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">{caseItem.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Before/After Slider */}
              {beforeImageId && afterImageId && (
                <BeforeAfterSlider
                  beforeImage={beforeImageId}
                  afterImage={afterImageId}
                  className="w-full"
                />
              )}

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Category Badge */}
                <span className="inline-block bg-cyan-100 text-cyan-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {categoryName}
                </span>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  {caseItem.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-6">
                  {caseItem.rating && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{caseItem.rating}/5</span>
                    </div>
                  )}
                  {caseItem.treatment_duration && (
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>ระยะเวลา: {caseItem.treatment_duration}</span>
                    </div>
                  )}
                </div>

                {/* Patient Info */}
                {(caseItem.patient_gender || caseItem.patient_age) && (
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-slate-600 mb-2">
                      ข้อมูลคนไข้
                    </h3>
                    <div className="flex gap-4 text-sm text-slate-500">
                      {caseItem.patient_gender && (
                        <span>
                          เพศ:{' '}
                          {caseItem.patient_gender === 'male'
                            ? 'ชาย'
                            : caseItem.patient_gender === 'female'
                            ? 'หญิง'
                            : 'อื่นๆ'}
                        </span>
                      )}
                      {caseItem.patient_age && (
                        <span>อายุ: {caseItem.patient_age} ปี</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Problem Description */}
                {caseItem.problem_description && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-3">
                      ปัญหาที่พบ
                    </h2>
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: caseItem.problem_description }}
                    />
                  </div>
                )}

                {/* Treatment Plan */}
                {caseItem.treatment_plan && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-3">
                      แผนการรักษา
                    </h2>
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: caseItem.treatment_plan }}
                    />
                  </div>
                )}

                {/* CTA */}
                <div className="border-t pt-6 mt-6">
                  <p className="text-slate-600 mb-4">
                    สนใจรับบริการเดียวกันนี้?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact"
                      className="flex-1 text-center bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      นัดหมายปรึกษา
                    </Link>
                    <Link
                      href="/our-work"
                      className="flex-1 text-center border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      ดูผลงานอื่นๆ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
```

---

### Phase 4: Directus Setup

---

#### Task 4.1: Create `promotion_categories` Collection

**Collection Settings**:
- Name: `promotion_categories`
- Singleton: No
- Icon: `category`
- Sort Field: `sort`

**Fields**:

| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | uuid | - | Yes | Primary key |
| `name` | string | Input | Yes | Category name (e.g., "จัดฟัน") |
| `slug` | string | Input | Yes | URL slug, unique |
| `sort` | integer | Input | No | Sort order |

**Public Permissions**: Read only

---

#### Task 4.2: Create `promotions` Collection

**Collection Settings**:
- Name: `promotions`
- Singleton: No
- Icon: `local_offer`
- Sort Field: `sort`
- Archive Field: `status`
- Archive Value: `archived`
- Unarchive Value: `published`

**Fields**:

| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | uuid | - | Yes | Primary key |
| `status` | string | Select Dropdown | Yes | published/draft/archived |
| `sort` | integer | Input | No | Sort order |
| `date_created` | timestamp | Datetime | No | Auto |
| `date_updated` | timestamp | Datetime | No | Auto |
| `title` | string | Input | Yes | Promotion title |
| `slug` | string | Input | Yes | URL slug, unique |
| `short_description` | text | Textarea | No | Card preview text |
| `description` | text | WYSIWYG | No | Full description |
| `image` | uuid | File Image | No | M2O to directus_files |
| `original_price` | integer | Input | No | Price before discount |
| `discounted_price` | integer | Input | No | Price after discount |
| `discount_percentage` | integer | Input | No | Discount % (e.g., 30) |
| `end_date` | timestamp | Datetime | No | When promotion ends |
| `remaining_quantity` | integer | Input | No | Remaining slots |
| `benefits` | json | List | No | Array of benefit objects |
| `is_hot` | boolean | Toggle | No | HOT badge |
| `is_popular` | boolean | Toggle | No | POPULAR badge |
| `is_new_customer` | boolean | Toggle | No | New customer only |
| `is_limited` | boolean | Toggle | No | LIMITED badge |
| `is_free` | boolean | Toggle | No | FREE badge |
| `category` | uuid | M2O Dropdown | No | M2O to promotion_categories |
| `meta_title` | string | Input | No | SEO title |
| `meta_description` | text | Textarea | No | SEO description |

**Benefits Field Structure** (JSON List):
```json
{
  "fields": [
    {
      "field": "text",
      "name": "Benefit Text",
      "type": "string",
      "meta": {
        "interface": "input",
        "required": true
      }
    }
  ]
}
```

**Public Permissions**: Read only

---

#### Task 4.3: Create `portfolio_categories` Collection

**Collection Settings**:
- Name: `portfolio_categories`
- Singleton: No
- Icon: `category`
- Sort Field: `sort`

**Fields**:

| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | uuid | - | Yes | Primary key |
| `name` | string | Input | Yes | Category name |
| `slug` | string | Input | Yes | URL slug, unique |
| `icon` | string | Input | No | Icon name |
| `sort` | integer | Input | No | Sort order |

**Public Permissions**: Read only

---

#### Task 4.4: Create `portfolio_cases` Collection

**Collection Settings**:
- Name: `portfolio_cases`
- Singleton: No
- Icon: `compare`
- Sort Field: `sort`
- Archive Field: `status`

**Fields**:

| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | uuid | - | Yes | Primary key |
| `status` | string | Select Dropdown | Yes | published/draft/archived |
| `sort` | integer | Input | No | Sort order |
| `date_created` | timestamp | Datetime | No | Auto |
| `date_updated` | timestamp | Datetime | No | Auto |
| `title` | string | Input | Yes | Case title |
| `slug` | string | Input | Yes | URL slug, unique |
| `short_description` | text | Textarea | No | Card preview text |
| `description` | text | WYSIWYG | No | Full description |
| `image_before` | uuid | File Image | No | Before treatment image |
| `image_after` | uuid | File Image | No | After treatment image |
| `gallery` | alias | Files | No | Additional images |
| `treatment_duration` | string | Input | No | e.g., "6 เดือน" |
| `patient_gender` | string | Select Dropdown | No | male/female/other |
| `patient_age` | integer | Input | No | Patient age |
| `rating` | decimal | Input | No | 1-5 rating |
| `problem_description` | text | WYSIWYG | No | Problem details |
| `treatment_plan` | text | WYSIWYG | No | Treatment approach |
| `category` | uuid | M2O Dropdown | No | M2O to portfolio_categories |
| `meta_title` | string | Input | No | SEO title |
| `meta_description` | text | Textarea | No | SEO description |

**Public Permissions**: Read only

---

#### Task 4.5: Create `block_stats` Collection

**Collection Settings**:
- Name: `block_stats`
- Singleton: No
- Icon: `bar_chart`
- Hidden: Yes (block collection)

**Fields**:

| Field | Type | Interface | Required | Notes |
|-------|------|-----------|----------|-------|
| `id` | uuid | - | Yes | Primary key |
| `items` | json | List | No | Array of stat items |

**Items Field Structure** (JSON List):
```json
{
  "fields": [
    {
      "field": "value",
      "name": "Value",
      "type": "string",
      "meta": {
        "interface": "input",
        "required": true,
        "note": "e.g., 500, 4.9, 98"
      }
    },
    {
      "field": "label",
      "name": "Label",
      "type": "string",
      "meta": {
        "interface": "input",
        "required": true,
        "note": "e.g., เคสสำเร็จ, คะแนนรีวิว"
      }
    },
    {
      "field": "suffix",
      "name": "Suffix",
      "type": "string",
      "meta": {
        "interface": "input",
        "note": "e.g., +, %, /5"
      }
    }
  ]
}
```

**Public Permissions**: Read only

---

## 6. Testing Strategy

### Unit Tests (Components)

| Test | Description |
|------|-------------|
| `CountdownTimer` | Verify countdown updates every second, shows expired state |
| `BeforeAfterSlider` | Verify drag interaction, position calculation |
| `PromotionCard` | Verify all badge combinations render correctly |
| `PortfolioCard` | Verify before/after images load correctly |

### Integration Tests (Pages)

| Test | Description |
|------|-------------|
| Promotions List | Verify promotions load, filter works |
| Promotion Detail | Verify data renders, 404 for missing slug |
| Portfolio List | Verify cases load, filter works |
| Portfolio Detail | Verify slider works, data renders |

### Manual Testing Checklist

- [ ] **Promotions Page**
  - [ ] Hero section with featured promotion displays
  - [ ] Countdown timer updates in real-time
  - [ ] Filter navigation switches categories
  - [ ] All promotion cards display correctly
  - [ ] Tags/badges show correctly (HOT, POPULAR, etc.)
  - [ ] Pricing displays with savings calculation
  - [ ] Benefits list shows correctly
  - [ ] Mobile responsive layout

- [ ] **Promotion Detail Page**
  - [ ] Breadcrumb navigation works
  - [ ] Large image displays
  - [ ] Countdown timer works
  - [ ] Full description renders HTML
  - [ ] CTA buttons link correctly
  - [ ] 404 page for invalid slugs

- [ ] **Portfolio Page**
  - [ ] Hero section displays
  - [ ] Stats bar shows correct values
  - [ ] Filter navigation works
  - [ ] Before/after sliders are interactive
  - [ ] Case cards display meta info
  - [ ] CTA section links work

- [ ] **Portfolio Detail Page**
  - [ ] Large before/after slider works
  - [ ] Patient info displays
  - [ ] Problem and treatment sections render
  - [ ] Related cases/CTA links work

---

## 7. Acceptance Criteria

### Functional Requirements

1. **Promotions**
   - [ ] Users can view all published promotions
   - [ ] Users can filter promotions by category
   - [ ] Users can view promotion detail with full info
   - [ ] Countdown timer shows remaining time
   - [ ] Expired promotions show appropriate message

2. **Portfolio**
   - [ ] Users can view all published case studies
   - [ ] Users can filter cases by category
   - [ ] Before/after slider is interactive (drag/touch)
   - [ ] Users can view case detail with full info
   - [ ] Stats bar displays clinic metrics

### Technical Requirements

1. **Performance**
   - [ ] Pages use ISR with 60-second revalidation
   - [ ] Images are optimized with Next.js Image
   - [ ] Client components are code-split

2. **SEO**
   - [ ] All pages have appropriate metadata
   - [ ] Detail pages have dynamic meta titles/descriptions
   - [ ] Static paths are pre-generated

3. **Accessibility**
   - [ ] All interactive elements are keyboard accessible
   - [ ] Images have alt text
   - [ ] Color contrast meets WCAG guidelines

4. **Code Quality**
   - [ ] TypeScript types are complete
   - [ ] No console errors in production
   - [ ] Components follow established patterns

---

## 8. Context Notes

### Project-Specific Requirements

- **Language**: All UI text is in Thai
- **Currency**: Thai Baht (฿) formatting
- **Date Format**: Thai locale for dates
- **Phone Format**: Thai phone numbers (0XX-XXX-XXXX)

### Design System

- **Primary Color**: `cyan-600` (#0891b2)
- **Background**: `slate-50` for page backgrounds
- **Cards**: White with `rounded-2xl` and `shadow-sm`
- **Typography**: Default system fonts (consider adding Thai-optimized font)

### Known Limitations

- Before/after slider uses CSS `clipPath` which may have minor performance issues on older devices
- Countdown timer re-renders every second (consider optimization if many timers on page)
- Client-side filtering loads all data upfront (OK for current dataset size)

### Future Enhancements

- [ ] Add pagination for promotions/cases list
- [ ] Add search functionality
- [ ] Add sharing buttons for promotions
- [ ] Add case comparison feature
- [ ] Add "similar cases" section on detail pages

---

## Execution Order

1. **Day 1**: Phase 1 (Types & Data Layer) + Start Phase 2 (Components)
2. **Day 2**: Complete Phase 2 (Components) + Phase 4 (Directus Setup)
3. **Day 3**: Phase 3 (Pages) + Integration
4. **Day 4**: Testing + Bug Fixes + Polish

---

*Plan created following `/planning` workflow template. Ready for implementation.*

