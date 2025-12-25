# Plan 2: Update AboutUsBlock Styling

> **Status**: Ready for Implementation  
> **Part of**: Phase 1 - Update Existing Blocks  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: None

---

## Description

Update `AboutUsBlock.tsx` to match the HTML design styling. Key changes:
- Add decorative background blur element
- Update headline with watermark effect (large, rotated, opacity-20 background text)
- Match arched image layout with `rounded-t-full rounded-b-[4rem]` and border
- Add gradient overlay on image
- Update text styling (text-justify, specific colors, spacing)

---

## Current System Behavior

The current `AboutUsBlock` component:
- Uses simple headline without watermark effect
- Image has `rounded-t-full rounded-b-[3rem]` (should be `rounded-b-[4rem]`)
- Image has no border (HTML has `border-4 border-white`)
- No decorative background element
- No gradient overlay on image
- Text alignment is `text-left` (HTML uses `text-justify`)

---

## Research Summary

From `about-us.html`:
- Section has decorative blur element: `absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10`
- Headline has watermark effect: Large rotated text with `opacity-20` behind main headline
- Image uses `rounded-t-full rounded-b-[4rem]` with `border-4 border-white`
- Image has gradient overlay: `bg-gradient-to-t from-[#003888]/30 to-transparent`
- Text uses `text-justify` alignment
- Colors: Headline uses `text-[#1a5fb4]` (watermark) and `text-[#003888]` (main)

---

## Files to Modify

### Modified Files
- `components/blocks/AboutUsBlock.tsx` - Update styling to match HTML

---

## Step-by-Step Tasks

### Task 1: Add Decorative Background Element
**File**: `components/blocks/AboutUsBlock.tsx`  
**Action**: Modify existing  
**Lines**: 20-21

**Current Code**:
```20:21:components/blocks/AboutUsBlock.tsx
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
```

**Proposed Change**:
```typescript
    <section className="lg:py-32 bg-white pt-24 pb-24 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="max-w-7xl mx-auto px-6">
```

**Why**: HTML design includes a decorative blur element in the top-right corner for visual interest.

**Validation**: `npm run dev` - Check decorative element appears
**Test**: Visual verification - blur circle should appear in top-right corner

---

### Task 2: Update Headline with Watermark Effect
**File**: `components/blocks/AboutUsBlock.tsx`  
**Action**: Modify existing  
**Lines**: 23-28

**Current Code**:
```23:28:components/blocks/AboutUsBlock.tsx
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="md:text-7xl transform text-5xl font-black text-[#5da1f8] tracking-tighter font-bricolage mb-6 -rotate-2">
              {headline}
            </h2>
            <h3 className="md:text-3xl text-2xl font-bold text-slate-800 mt-2 mb-8">
              {subtitle}
            </h3>
```

**Proposed Change**:
```typescript
          <div className="order-2 lg:order-1">
            <div className="relative mb-6">
              {/* Watermark headline */}
              <h2 className="text-6xl md:text-7xl font-black text-[#1a5fb4] font-bricolage tracking-tighter -rotate-2 transform origin-bottom-left leading-none opacity-20 absolute -top-12 left-0 select-none">
                {headline}
              </h2>
              {/* Main headline */}
              <h2 className="text-4xl md:text-5xl font-bold text-[#003888] font-bricolage tracking-tight relative z-10">
                {headline}
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
              {subtitle}
            </h3>
```

**Why**: HTML design shows a large, rotated, semi-transparent headline behind the main headline for a watermark effect. The main headline uses darker blue (`#003888`) instead of lighter blue.

**Validation**: `npm run dev` - Check headline watermark effect
**Test**: Visual verification - watermark text should appear behind main headline, rotated and semi-transparent

---

### Task 3: Update Image Container Styling
**File**: `components/blocks/AboutUsBlock.tsx`  
**Action**: Modify existing  
**Lines**: 37-47

**Current Code**:
```37:47:components/blocks/AboutUsBlock.tsx
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[3.5/4.5] rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <img
                src={
                  getFileUrl(data.image_url as any) ??
                  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                }
                alt="Sodent Dental Clinic"
                className="object-center w-full h-full object-cover"
              />
            </div>
          </div>
```

**Proposed Change**:
```typescript
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-t-full rounded-b-[4rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={
                  getFileUrl(data.image_url as any) ??
                  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                }
                alt="Sodent Dental Clinic"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#003888]/30 to-transparent"></div>
            </div>
          </div>
```

**Why**: HTML design uses:
- `aspect-[3/4]` instead of `aspect-[3.5/4.5]`
- `rounded-b-[4rem]` instead of `rounded-b-[3rem]`
- `border-4 border-white` for white border
- Gradient overlay on image
- Removed `lg:max-w-full` and `lg:justify-end` to match HTML layout

**Validation**: `npm run dev` - Check image styling
**Test**: Visual verification - image should have arched bottom, white border, and gradient overlay

---

### Task 4: Update Text Styling
**File**: `components/blocks/AboutUsBlock.tsx`  
**Action**: Modify existing  
**Lines**: 30-34

**Current Code**:
```30:34:components/blocks/AboutUsBlock.tsx
            <div className="space-y-6 text-base md:text-lg text-slate-500 leading-relaxed max-w-xl text-justify lg:text-left font-medium">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
```

**Proposed Change**:
```typescript
            <div className="space-y-6 text-base text-slate-500 leading-relaxed text-justify">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
```

**Why**: HTML design uses:
- `text-base` only (no `md:text-lg`)
- `text-justify` for all screen sizes (not just mobile)
- Removed `max-w-xl` constraint
- Removed `font-medium` (uses default weight)
- Removed `lg:text-left` (always justified)

**Validation**: `npm run dev` - Check text alignment and sizing
**Test**: Visual verification - text should be justified on all screen sizes

---

## Testing Strategy

### Visual Testing
1. Start dev server: `npm run dev`
2. Navigate to homepage or about page
3. Compare AboutUsBlock section with HTML design:
   - [ ] Decorative blur element appears in top-right
   - [ ] Headline has watermark effect (large, rotated, semi-transparent)
   - [ ] Main headline uses `#003888` color
   - [ ] Image has arched bottom (`rounded-b-[4rem]`)
   - [ ] Image has white border (`border-4 border-white`)
   - [ ] Image has gradient overlay
   - [ ] Text is justified on all screen sizes
   - [ ] Text uses `text-base` size
   - [ ] All spacing matches HTML

### Responsive Testing
- [ ] Mobile view (< 640px) - Layout stacks correctly
- [ ] Tablet view (640px - 1024px) - Grid layout works
- [ ] Desktop view (> 1024px) - Two-column layout with proper spacing

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

- [ ] Decorative background blur element added
- [ ] Headline watermark effect implemented
- [ ] Main headline uses `#003888` color
- [ ] Image uses `rounded-b-[4rem]` with white border
- [ ] Image has gradient overlay
- [ ] Text is justified on all screen sizes
- [ ] Text uses `text-base` size (no responsive sizing)
- [ ] All existing functionality preserved
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Visual match with HTML design

---

## Context Notes

- **No CMS changes needed**: All styling updates, no new fields required
- **Image aspect ratio**: Changed from `3.5/4.5` to `3/4` to match HTML
- **Watermark effect**: Uses absolute positioning with z-index layering
- **Gradient overlay**: Uses `from-[#003888]/30` to match HTML design
- **Server Component**: Remains a Server Component (no "use client" needed)

---

## Project-Specific Requirements

- ✅ ISR: No changes needed (handled by page)
- ✅ Images: Uses `getFileUrl()` helper
- ✅ Server Components: Remains Server Component
- ✅ Tailwind Only: Using Tailwind classes + inline styles for exact color matches
- ✅ Fallbacks: Existing fallback logic preserved
- ✅ Type Safety: No type changes needed

---

## Next Steps

After completing this plan:
1. Visual verification against HTML design
2. Proceed to **Plan 3: Update TeamBlock Styling**
3. Or continue with other Phase 1 plans

---

## Completion Status

- [x] All tasks completed
  - [x] Task 1: Add decorative background element
  - [x] Task 2: Update headline with watermark effect
  - [x] Task 3: Update image container styling
  - [x] Task 4: Update text styling
- [x] All validations passed
  - [x] TypeScript check: `npx tsc --noEmit` ✅
  - [x] Linting: No errors ✅
  - [x] Build check: `npm run build` ✅
- [x] Feature verified: All styling updates implemented
- Completed: 2024-12-19

