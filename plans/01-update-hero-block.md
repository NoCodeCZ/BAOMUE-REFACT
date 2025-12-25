# Plan 1: Update HeroBlock Styling

> **Status**: Ready for Implementation  
> **Part of**: Phase 1 - Update Existing Blocks  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: None

---

## Description

Update `HeroBlock.tsx` to match the HTML design styling. Key changes:
- Change background gradient from `sky-400/sky-600` to `blue-700` with overlay
- Add yellow accent color `#FEDF45` for "เบามืออย่างโปร" text
- Update headline styling to match HTML (bold, specific font sizes)
- Ensure contact info section matches HTML exactly

---

## Current System Behavior

The current `HeroBlock` component:
- Uses `bg-gradient-to-br from-sky-400 to-sky-600` gradient
- Has headline with `text-white/60` for second line
- Uses generic font weights (`font-semibold`)
- Contact info is hardcoded (not from CMS)

---

## Research Summary

From `docs/research/html-to-directus-conversion.md`:
- HTML uses `bg-blue-700` with overlay gradient
- Yellow accent `#FEDF45` for "เบามืออย่างโปร" text
- Headline uses `font-bold` with specific inline styles
- Contact info should be configurable (but can stay hardcoded for now)

---

## Files to Modify

### Modified Files
- `components/blocks/HeroBlock.tsx` - Update styling to match HTML

---

## Step-by-Step Tasks

### Task 1: Update Background Gradient
**File**: `components/blocks/HeroBlock.tsx`  
**Action**: Modify existing  
**Lines**: 22

**Current Code**:
```22:22:components/blocks/HeroBlock.tsx
    <section className="overflow-hidden min-h-[90vh] flex bg-gradient-to-br from-sky-400 to-sky-600 relative items-center">
```

**Proposed Change**:
```typescript
    <section className="overflow-hidden min-h-[90vh] flex bg-blue-700 relative items-center">
```

**Why**: HTML design uses solid `bg-blue-700` instead of sky gradient. The overlay gradient is already applied in the inner div.

**Validation**: `npm run dev` - Check hero section background color
**Test**: Visual verification - background should be blue-700, not sky gradient

---

### Task 2: Update Headline with Yellow Accent
**File**: `components/blocks/HeroBlock.tsx`  
**Action**: Modify existing  
**Lines**: 36-39

**Current Code**:
```36:39:components/blocks/HeroBlock.tsx
            <h1 className="sm:text-6xl lg:text-7xl leading-[1.05] text-5xl font-semibold text-white tracking-tight mb-6">
              {heroLine1}{" "}
              <span className="text-white/60">{heroLine2}</span>
            </h1>
```

**Proposed Change**:
```typescript
            <h1 className="sm:text-6xl lg:text-7xl leading-[1.05] text-5xl font-bold text-white tracking-tight mb-6" style={{ lineHeight: '94px' }}>
              <span style={{ color: '#FEDF45', fontSize: '70.30px', fontWeight: 700 }}>{heroLine1}</span>
              {" "}
              <span style={{ color: 'white', fontSize: '70.30px', fontWeight: 700 }}>{heroLine2}</span>
            </h1>
```

**Why**: HTML design shows first part of headline in yellow (`#FEDF45`) with specific font size and weight. Second part is white with same styling.

**Validation**: `npm run dev` - Check headline colors and sizing
**Test**: Visual verification - first part should be yellow, second part white, both bold

---

### Task 3: Update Description Text Color
**File**: `components/blocks/HeroBlock.tsx`  
**Action**: Modify existing  
**Lines**: 41-43

**Current Code**:
```41:43:components/blocks/HeroBlock.tsx
            <p className="text-white/70 text-lg sm:text-xl font-normal leading-relaxed max-w-lg mb-10">
              {heroDescription}
            </p>
```

**Proposed Change**:
```typescript
            <p className="text-stone-50/70 text-lg sm:text-xl font-normal leading-relaxed max-w-lg mb-10">
              {heroDescription}
            </p>
```

**Why**: HTML uses `text-stone-50/70` instead of `text-white/70` for better contrast on blue background.

**Validation**: `npm run dev` - Check description text color
**Test**: Visual verification - text should have slight stone tint, not pure white

---

### Task 4: Update Image Object Fit
**File**: `components/blocks/HeroBlock.tsx`  
**Action**: Modify existing  
**Lines**: 123-127

**Current Code**:
```123:127:components/blocks/HeroBlock.tsx
                <img
                  src="https://images.unsplash.com/photo-1629946832022-c327f74956e0?w=2160&q=80"
                  alt="Professional Dental Care"
                  className="transform hover:scale-105 transition-transform duration-700 w-full h-full object-cover -rotate-3 scale-110"
                />
```

**Proposed Change**:
```typescript
                <img
                  src="https://images.unsplash.com/photo-1629946832022-c327f74956e0?w=2160&q=80"
                  alt="Professional Dental Care"
                  className="transform hover:scale-105 transition-transform duration-700 w-full h-full object-contain"
                />
```

**Why**: HTML uses `object-contain` instead of `object-cover` and removes the `-rotate-3 scale-110` transforms. The image should fit within container without cropping.

**Validation**: `npm run dev` - Check hero image display
**Test**: Visual verification - image should fit completely without cropping

---

## Testing Strategy

### Visual Testing
1. Start dev server: `npm run dev`
2. Navigate to homepage
3. Compare hero section with HTML design:
   - [ ] Background is blue-700 (not sky gradient)
   - [ ] First part of headline is yellow (#FEDF45)
   - [ ] Second part of headline is white
   - [ ] Description text is stone-50/70
   - [ ] Image uses object-contain (no cropping)
   - [ ] Contact info section displays correctly
   - [ ] Badge, CTAs, and all elements match HTML

### Responsive Testing
- [ ] Mobile view (< 640px) - Headline wraps correctly
- [ ] Tablet view (640px - 1024px) - Layout adjusts properly
- [ ] Desktop view (> 1024px) - Full two-column layout

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

- [ ] Background color matches HTML (`bg-blue-700`)
- [ ] Headline first part is yellow (`#FEDF45`)
- [ ] Headline second part is white
- [ ] Description text uses `text-stone-50/70`
- [ ] Image uses `object-contain` (no cropping)
- [ ] All existing functionality preserved
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Visual match with HTML design

---

## Context Notes

- **No CMS changes needed**: All styling updates, no new fields required
- **Hardcoded contact info**: Can stay hardcoded for now (096 915 9391, @BAOMUE)
- **Image source**: Currently using placeholder. Will be updated when CMS image field is configured
- **Font families**: HTML uses inline styles for fonts, but we'll use Tailwind classes where possible
- **Server Component**: Remains a Server Component (no "use client" needed)

---

## Project-Specific Requirements

- ✅ ISR: No changes needed (handled by page)
- ✅ Images: Will use `getFileUrl()` when CMS image field is added
- ✅ Server Components: Remains Server Component
- ✅ Tailwind Only: Using Tailwind classes + minimal inline styles for exact color matches
- ✅ Fallbacks: Existing fallback logic preserved
- ✅ Type Safety: No type changes needed

---

## Next Steps

After completing this plan:
1. Visual verification against HTML design
2. Proceed to **Plan 2: Update AboutUsBlock Styling**
3. Or continue with other Phase 1 plans

---

## Completion Status

- [x] All tasks completed
  - [x] Task 1: Updated background gradient from sky-400/sky-600 to blue-700
  - [x] Task 2: Updated headline with yellow accent (#FEDF45) for first part
  - [x] Task 3: Updated description text color to text-stone-50/70
  - [x] Task 4: Updated image object-fit to object-contain
- [x] All validations passed
  - [x] TypeScript check: `npx tsc --noEmit` ✅
  - [x] Linting: No errors ✅
  - [x] Build check: `npm run build` ✅
- [x] Feature ready for visual testing
- Completed: 2024-12-24

