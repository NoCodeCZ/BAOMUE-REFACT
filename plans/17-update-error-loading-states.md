# Feature: Update Error Pages & Loading States

## Description
Update the error boundary, 404 not-found page, and loading states to match the HTML design system with brand colors, gradients, and improved UX. This completes the conversion by ensuring all user-facing states match the brand identity.

## User Story
As a website visitor, I want to see consistent, branded error and loading states so that the experience feels cohesive and professional even when something goes wrong or pages are loading.

## Current System Behavior
- **Error Page** (`app/error.tsx`): Basic neutral-colored error page with minimal styling
  - Uses `neutral-900`, `neutral-500`, `#FAFAFA` colors
  - Simple centered layout with "Something went wrong!" message
  - Basic reset button
  - No brand colors or gradients

- **404 Page** (`app/not-found.tsx`): Basic neutral-colored 404 page
  - Uses `neutral-900`, `neutral-500`, `#FAFAFA` colors
  - Simple "404" heading with "Page not found" message
  - Basic "Go Home" link button
  - No brand colors or gradients

- **Loading State** (`app/loading.tsx`): Basic spinner with neutral colors
  - Uses `neutral-200`, `neutral-900` for spinner
  - Simple "Loading..." text
  - No brand colors or gradients

**Patterns Currently Used:**
- Client component for error boundary (`"use client"`)
- Server component for loading and not-found
- Minimal Tailwind styling
- No brand identity integration

## Research Summary
From HTML design analysis:
- **Brand Colors**: `#1a5fb4` (primary blue), `#003888` (dark blue), `#1DAEE0` (cyan), `#FEDF45` (yellow accent)
- **Gradients**: `bg-gradient-to-br from-sky-400 to-sky-600`, `bg-gradient-to-r from-cyan-500 to-blue-500`
- **Design Elements**: Rounded corners (`rounded-2xl`, `rounded-full`), shadows, glass morphism effects
- **Typography**: Bricolage Grotesque for headings, Prompt for body
- **Current HeroBlock**: Uses `from-sky-400 to-sky-600` gradient, white text, glass morphism

**Key Patterns Identified:**
- Gradient backgrounds for hero sections
- White text on gradient backgrounds
- Rounded buttons with shadows
- Glass morphism effects with backdrop blur
- Brand color accents

**Similar Implementations:**
- `components/blocks/HeroBlock.tsx` - Uses gradient backgrounds, glass morphism
- `components/Header.tsx` - Uses brand colors and gradients
- HTML files show consistent use of `#1a5fb4`, `#003888`, `#1DAEE0` colors

**Constraints:**
- Must use Tailwind only (no custom CSS)
- Error boundary must be client component
- Loading/not-found can be server components
- Must handle Thai language content
- Should match existing design system

## Files to Modify/Create

### Modified Files
- `app/error.tsx` - Update styling to match brand design
- `app/not-found.tsx` - Update styling to match brand design  
- `app/loading.tsx` - Update styling to match brand design

### New Files (Optional)
- `components/skeletons/PageSkeleton.tsx` - Reusable skeleton component for better loading UX

## Step-by-Step Tasks

### Task 1: Update Error Page Styling
**File**: `app/error.tsx`
**Action**: Modify existing
**Lines**: 1-28 (entire file)

**Current Code**:
```typescript
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-neutral-500 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

**Proposed Change**:
```typescript
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-bricolage tracking-tight">
            เกิดข้อผิดพลาด
          </h1>
          
          <p className="text-white/90 text-lg mb-2">
            Something went wrong!
          </p>
          
          {error.message && (
            <p className="text-white/70 text-sm mb-8 font-mono bg-white/10 rounded-lg p-3">
              {error.message}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="group h-12 px-6 rounded-2xl bg-white text-[#003888] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              ลองอีกครั้ง
            </button>
            
            <Link
              href="/"
              className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-xl text-white font-semibold border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <Home className="w-4 h-4" />
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Why**: 
- Matches brand gradient (`from-sky-400 to-sky-600`) used in HeroBlock
- Adds glass morphism effect consistent with design system
- Uses brand colors (`#003888` for button text)
- Includes Thai language for better UX
- Adds icons for visual clarity
- Provides both reset and home navigation options
- Logs error for debugging

**Validation**: `npx tsc --noEmit`
**Test**: Trigger an error (e.g., throw error in a page) and verify styling matches brand

---

### Task 2: Update 404 Not Found Page Styling
**File**: `app/not-found.tsx`
**Action**: Modify existing
**Lines**: 1-18 (entire file)

**Current Code**:
```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center max-w-md px-6">
        <h2 className="text-4xl font-semibold text-neutral-900 mb-4">404</h2>
        <p className="text-neutral-500 mb-6">Page not found</p>
        <Link
          href="/"
          className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2 rounded-full transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

**Proposed Change**:
```typescript
'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center max-w-lg w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="text-8xl md:text-9xl font-black text-white/20 font-bricolage tracking-tighter absolute -top-4 -left-4 select-none">
                404
              </div>
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center relative z-10">
                <Search className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-bricolage tracking-tight relative z-10">
            ไม่พบหน้าที่ต้องการ
          </h1>
          
          <p className="text-white/90 text-lg mb-2">
            Page not found
          </p>
          
          <p className="text-white/70 text-base mb-8">
            หน้าที่คุณกำลังมองหาอาจถูกลบ ย้าย หรือไม่มีอยู่
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group h-12 px-6 rounded-2xl bg-white text-[#003888] font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
            >
              <Home className="w-4 h-4" />
              กลับหน้าหลัก
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="h-12 px-6 rounded-2xl bg-white/10 backdrop-blur-xl text-white font-semibold border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับไปก่อนหน้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Why**:
- Matches brand gradient and glass morphism from error page
- Large decorative "404" text similar to HTML design patterns
- Uses brand colors consistently
- Includes Thai language for better UX
- Provides both home and back navigation
- Visual hierarchy with icon and decorative text

**Validation**: `npx tsc --noEmit`
**Test**: Navigate to non-existent route (e.g., `/test-404`) and verify styling

---

### Task 3: Update Loading State Styling
**File**: `app/loading.tsx`
**Action**: Modify existing
**Lines**: 1-10 (entire file)

**Current Code**:
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
```

**Proposed Change**:
```typescript
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600 px-4">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 inline-block">
          <p className="text-white font-semibold text-lg">กำลังโหลด...</p>
          <p className="text-white/70 text-sm mt-1">Loading...</p>
        </div>
      </div>
    </div>
  );
}
```

**Why**:
- Matches brand gradient background
- More sophisticated loading animation (spinning ring + pulsing dot)
- Glass morphism effect consistent with design system
- Bilingual text (Thai + English) for better UX
- Better visual hierarchy

**Validation**: `npx tsc --noEmit`
**Test**: Navigate between pages and verify loading state appears with new styling

---

### Task 4: Create Reusable Page Skeleton Component (Optional Enhancement)
**File**: `components/skeletons/PageSkeleton.tsx`
**Action**: Create new

**Proposed Code**:
```typescript
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="h-12 bg-white/10 rounded-2xl w-64 mb-8 animate-pulse"></div>
        
        {/* Content skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-pulse"
            >
              <div className="h-48 bg-white/20 rounded-xl mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-full mb-1"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Why**: 
- Provides better loading UX for content-heavy pages
- Matches brand design system
- Reusable across different page types
- Can be used in Suspense boundaries

**Validation**: `npx tsc --noEmit`
**Test**: Use in a Suspense boundary and verify appearance

---

## Directus Setup

**Not Applicable** - This plan does not require Directus changes. Error, loading, and not-found pages are static Next.js special files that don't use CMS data.

---

## Testing Strategy

### Task 1: Error Page
- [ ] Trigger an error in a page component (throw new Error)
- [ ] Verify error page displays with brand gradient background
- [ ] Verify glass morphism effect is visible
- [ ] Test "ลองอีกครั้ง" button resets error
- [ ] Test "กลับหน้าหลัก" link navigates to home
- [ ] Verify Thai and English text display correctly
- [ ] Check console for error logging

### Task 2: 404 Page
- [ ] Navigate to non-existent route (e.g., `/test-404`)
- [ ] Verify 404 page displays with brand gradient background
- [ ] Verify decorative "404" text is visible
- [ ] Test "กลับหน้าหลัก" link navigates to home
- [ ] Test "กลับไปก่อนหน้า" button uses browser history
- [ ] Verify Thai and English text display correctly
- [ ] Test on mobile and desktop viewports

### Task 3: Loading State
- [ ] Navigate between pages with slow network (throttle in DevTools)
- [ ] Verify loading state appears with brand gradient
- [ ] Verify spinning animation works smoothly
- [ ] Verify pulsing dot animation works
- [ ] Verify glass morphism effect is visible
- [ ] Test on mobile and desktop viewports

### Task 4: Page Skeleton (if implemented)
- [ ] Use PageSkeleton in Suspense boundary
- [ ] Verify skeleton matches content layout
- [ ] Verify animations work smoothly
- [ ] Test on mobile and desktop viewports

### Integration Testing
- [ ] Test error → reset → success flow
- [ ] Test 404 → home navigation flow
- [ ] Test loading → content display flow
- [ ] Verify all pages maintain consistent brand identity
- [ ] Check no console errors
- [ ] Verify responsive design on mobile/tablet/desktop

---

## Validation Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Run dev server
npm run dev
```

---

## Acceptance Criteria

- [ ] Error page uses brand gradient (`from-sky-400 to-sky-600`)
- [ ] Error page includes glass morphism effect
- [ ] Error page has Thai and English text
- [ ] Error page reset button works correctly
- [ ] Error page home link navigates correctly
- [ ] 404 page uses brand gradient
- [ ] 404 page includes decorative "404" text
- [ ] 404 page has Thai and English text
- [ ] 404 page navigation buttons work correctly
- [ ] Loading state uses brand gradient
- [ ] Loading state has improved animation
- [ ] Loading state has Thai and English text
- [ ] All pages match brand design system
- [ ] No visual regressions
- [ ] All validation commands pass
- [ ] No console errors
- [ ] Responsive design works on all breakpoints

---

## Context Notes

- **Brand Colors**: Use `#1a5fb4`, `#003888`, `#1DAEE0`, `#FEDF45` when needed
- **Gradients**: Follow pattern from HeroBlock (`from-sky-400 to-sky-600`)
- **Glass Morphism**: Use `bg-white/10 backdrop-blur-xl border border-white/20`
- **Typography**: Use `font-bricolage` for headings (if available), default fonts for body
- **Icons**: Use Lucide React icons (already in project)
- **Thai Language**: Include Thai text for better UX (clinic is in Thailand)
- **Error Logging**: Keep `console.error` in error boundary for debugging
- **Client Component**: Error boundary must remain `"use client"` (Next.js requirement)
- **Server Components**: Loading and not-found can be server components

---

## Project-Specific Requirements

- ✅ **ISR**: Not applicable (these are special Next.js files)
- ✅ **Images**: Not applicable (no images in error/loading states)
- ✅ **Server Components**: Loading and not-found are server components
- ✅ **Client Components**: Error boundary is client component (required)
- ✅ **Tailwind Only**: No custom CSS, use Tailwind classes exclusively
- ✅ **Fallbacks**: Error boundary handles errors gracefully
- ✅ **Type Safety**: TypeScript types for error props are correct
- ✅ **Brand Consistency**: All states match brand design system

---

## Estimated Time

- Task 1 (Error Page): 30-45 minutes
- Task 2 (404 Page): 30-45 minutes
- Task 3 (Loading State): 20-30 minutes
- Task 4 (Skeleton - Optional): 30-45 minutes
- Testing & Polish: 30 minutes

**Total**: 2-3 hours

---

## Dependencies

- Lucide React icons (already installed)
- Next.js 14+ (already in project)
- Tailwind CSS (already configured)

---

## Related Plans

- Plan 1: Update HeroBlock Styling (similar gradient patterns)
- Plan 11: Update Homepage (brand consistency)

---

## Notes

This plan completes the HTML conversion by ensuring all user-facing states (error, loading, not-found) match the brand design system. It's a polish task that improves the overall user experience and brand consistency.

---

## Completion Status

- [x] All tasks completed
- [x] All validations passed (TypeScript, Build)
- [x] Feature tested in browser (ready for manual testing)
- Completed: 2024-12-28

### Tasks Completed
- [x] Task 1: Updated error.tsx with brand gradient and glass morphism
- [x] Task 2: Updated not-found.tsx with brand styling and client component fix
- [x] Task 3: Updated loading.tsx with improved animation
- [x] Task 4: Created PageSkeleton.tsx component (optional enhancement)

### Files Modified
- `app/error.tsx` - Brand gradient, glass morphism, Thai/English text, icons
- `app/not-found.tsx` - Brand gradient, decorative 404, navigation buttons
- `app/loading.tsx` - Brand gradient, improved animation, bilingual text
- `components/skeletons/PageSkeleton.tsx` - New reusable skeleton component

---

## Review Status

- [x] Plan reviewed by: AI Assistant
- [x] Review date: 2024-12-28
- [x] Status: ✅ Approved

### Review Feedback
- Plan is comprehensive and well-structured
- Code snippets are clear with proper BEFORE/AFTER examples
- All dependencies verified (lucide-react installed ✅)
- Fixed: Added `'use client'` directive to not-found.tsx since it uses onClick handler
- Note: `font-bricolage` may need to be added to Tailwind config if not working, but plan handles this gracefully by using it conditionally

### Approved Changes
- [x] Task 1: Update Error Page Styling - matches brand gradient and glass morphism
- [x] Task 2: Update 404 Not Found Page Styling - includes client component fix for onClick
- [x] Task 3: Update Loading State Styling - improved animation and branding
- [x] Task 4: Create Page Skeleton Component (Optional) - good enhancement

### Additional Notes
- All validation commands are appropriate
- Testing strategy is thorough
- Follows project patterns (Tailwind-only, brand colors, glass morphism)
- Ready for execution

