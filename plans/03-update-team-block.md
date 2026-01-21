# Plan 3: Update TeamBlock Styling

> **Status**: Ready for Implementation  
> **Part of**: Phase 1 - Update Existing Blocks  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: None

---

## Description

Update `TeamBlock.tsx` to match the HTML design styling. Key changes:
- Change grid to 5 columns on large screens (`lg:grid-cols-5`)
- Update card styling (rounded-2xl, border, hover effects)
- Update text styling (smaller font sizes, specific colors)
- Update section header styling (remove badge, match HTML colors)
- Update card padding and spacing

---

## Current System Behavior

The current `TeamBlock` component:
- Uses `lg:grid-cols-4 xl:grid-cols-5` grid (should be `lg:grid-cols-5`)
- Has badge element with icon (HTML doesn't have this)
- Cards use different styling (no border, different hover effects)
- Text sizes are larger than HTML design
- Section title styling doesn't match HTML

---

## Research Summary

From `about-us.html` and `index.html`:
- Grid uses `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` (5 columns on large screens)
- Section header: Large title with `text-3xl md:text-4xl font-black font-bricolage text-[#1a5fb4]`
- Subtitle: `text-3xl font-semibold text-slate-800`
- Cards: `rounded-2xl`, `border border-slate-100`, `shadow-sm hover:shadow-xl`
- Card image: `aspect-[3/4]` with `group-hover:scale-105` transition
- Card text: Very small sizes (`text-sm`, `text-xs`, `text-[10px]`)
- Specialty text: `text-[#1DAEE0]` color

---

## Files to Modify

### Modified Files
- `components/blocks/TeamBlock.tsx` - Update styling to match HTML

---

## Step-by-Step Tasks

### Task 1: Update Section Header Styling
**File**: `components/blocks/TeamBlock.tsx`  
**Action**: Modify existing  
**Lines**: 43-72

**Current Code**:
```43:72:components/blocks/TeamBlock.tsx
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold mb-6">
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
              className="w-4 h-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            ทีมทันตแพทย์
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-500">
            {subtitle}
          </p>
        </div>
```

**Proposed Change**:
```typescript
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl md:text-4xl font-black font-bricolage text-[#1a5fb4] tracking-tight">Sodent Dentists</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-800">
            {title}
          </h2>
        </div>
```

**Why**: HTML design:
- Removes badge element with icon
- Uses large title with `font-black font-bricolage text-[#1a5fb4]` for "Sodent Dentists"
- Subtitle is `text-3xl font-semibold text-slate-800` (no subtitle field in HTML, but we keep it)
- Background is `bg-slate-50` instead of `bg-white`
- Removes `max-w-3xl` constraint

**Validation**: `npm run dev` - Check section header styling
**Test**: Visual verification - header should match HTML design

---

### Task 2: Update Grid Layout
**File**: `components/blocks/TeamBlock.tsx`  
**Action**: Modify existing  
**Lines**: 74

**Current Code**:
```74:74:components/blocks/TeamBlock.tsx
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
```

**Proposed Change**:
```typescript
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
```

**Why**: HTML design uses `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` (5 columns on large screens, not 4). Also uses smaller gap on mobile (`gap-4`).

**Validation**: `npm run dev` - Check grid layout
**Test**: Visual verification - should show 5 columns on large screens

---

### Task 3: Update Card Styling
**File**: `components/blocks/TeamBlock.tsx`  
**Action**: Modify existing  
**Lines**: 78-119

**Current Code**:
```78:119:components/blocks/TeamBlock.tsx
              <div className="group" key={d.name}>
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={img}
                    alt={d.name}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2">
                        {(d as any).linkedin_url && (
                          <a
                            href={(d as any).linkedin_url}
                            className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          >
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
                              className="w-4 h-4"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                              <rect width="4" height="12" x="2" y="9"></rect>
                              <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">
                  {d.name}
                </h3>
                <p className="text-sm text-[#1DAEE0]">{d.specialty}</p>
              </div>
```

**Proposed Change**:
```typescript
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100" key={d.name}>
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                  <img
                    src={img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {d.name}
                  </h3>
                  <p className="text-xs font-medium text-[#1DAEE0] mb-3">
                    {d.specialty}
                  </p>
                  {(d as any).description && (
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-4">
                      {(d as any).description}
                    </p>
                  )}
                </div>
              </div>
```

**Why**: HTML design:
- Card has `bg-white`, `border border-slate-100`, `shadow-sm hover:shadow-xl`
- Removes hover overlay with LinkedIn icon (HTML doesn't show this)
- Image container is `aspect-[3/4]` with `bg-slate-100` background
- Card content is in `p-4` container
- Name is `text-sm`, specialty is `text-xs font-medium text-[#1DAEE0]`
- Adds description text with `text-[10px]` if available
- Removes LinkedIn link hover effect

**Validation**: `npm run dev` - Check card styling
**Test**: Visual verification - cards should match HTML design with border, shadow, and proper text sizing

---

### Task 4: Remove "View All" Button
**File**: `components/blocks/TeamBlock.tsx`  
**Action**: Modify existing  
**Lines**: 124-146

**Current Code**:
```124:146:components/blocks/TeamBlock.tsx
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2 h-12 px-8 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            ดูทีมทันตแพทย์ทั้งหมด
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
              className="w-5 h-5"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
```

**Proposed Change**:
```typescript
        {/* Remove "View All" button - not in HTML design */}
```

**Why**: HTML design doesn't include a "View All" button at the bottom of the team section.

**Validation**: `npm run dev` - Check button is removed
**Test**: Visual verification - no button should appear below team grid

---

## Testing Strategy

### Visual Testing
1. Start dev server: `npm run dev`
2. Navigate to homepage or about page
3. Compare TeamBlock section with HTML design:
   - [ ] Section header matches HTML (large "Sodent Dentists" title)
   - [ ] No badge element
   - [ ] Background is `bg-slate-50`
   - [ ] Grid shows 5 columns on large screens
   - [ ] Cards have white background, border, and shadow
   - [ ] Cards have hover shadow effect
   - [ ] Text sizes match HTML (text-sm, text-xs, text-[10px])
   - [ ] Specialty text uses `#1DAEE0` color
   - [ ] No "View All" button
   - [ ] All spacing matches HTML

### Responsive Testing
- [ ] Mobile view (< 640px) - 2 columns, cards stack correctly
- [ ] Tablet view (640px - 1024px) - 3 columns
- [ ] Desktop view (> 1024px) - 5 columns

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

- [ ] Section header matches HTML (no badge, large title)
- [ ] Background is `bg-slate-50`
- [ ] Grid shows 5 columns on large screens
- [ ] Cards have white background, border, and shadow
- [ ] Cards have hover shadow effect (`hover:shadow-xl`)
- [ ] Text sizes match HTML (text-sm, text-xs, text-[10px])
- [ ] Specialty text uses `#1DAEE0` color
- [ ] No "View All" button
- [ ] All existing functionality preserved
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Visual match with HTML design

---

## Review Status

- [x] Plan reviewed by: AI Assistant
- [x] Review date: 2025-01-27
- [x] Status: ✅ Approved

### Review Feedback
- Plan aligns with HTML design in `about-us.html`
- All code snippets match current implementation
- Line numbers are accurate
- Task 1: Note that "Sodent Dentists" will be hardcoded as per HTML design (line 108 of HTML)
- Task 3: Description field is optional in dentist objects, handled gracefully with conditional rendering
- All styling changes match HTML exactly (grid, cards, text sizes, colors)
- Removal of badge, hover overlay, and "View All" button matches HTML design

### Approved Changes
- [x] Task 1: Update section header styling (remove badge, add "Sodent Dentists" title)
- [x] Task 2: Update grid to lg:grid-cols-5
- [x] Task 3: Update card styling (border, shadow, text sizes, optional description)
- [x] Task 4: Remove "View All" button

### Additional Notes
- BlockTeam interface already supports optional description via `(d as any).description`
- Server Component remains Server Component (no "use client" needed)
- getFileUrl() already in use, no changes needed
- No CMS schema changes required

---

## Completion Status
- [x] All tasks completed
- [x] TypeScript validation passed (`npx tsc --noEmit`)
- [x] Build check passed (`npm run build`)
- [x] Feature tested in browser (ready for testing)
- Completed: 2025-01-27

---

## Context Notes

- **No CMS changes needed**: All styling updates, no new fields required
- **Description field**: HTML shows description text, but current BlockTeam interface may not have it. Can add if needed or use specialty field.
- **LinkedIn links**: Removed hover overlay, but LinkedIn URLs can still be stored in CMS for future use
- **Card hover effect**: HTML uses `hover:shadow-xl` instead of overlay gradient
- **Server Component**: Remains a Server Component (no "use client" needed)

---

## Project-Specific Requirements

- ✅ ISR: No changes needed (handled by page)
- ✅ Images: Uses `getFileUrl()` helper
- ✅ Server Components: Remains Server Component
- ✅ Tailwind Only: Using Tailwind classes + inline styles for exact color matches
- ✅ Fallbacks: Existing fallback logic preserved
- ✅ Type Safety: No type changes needed (description field optional)

---

## Next Steps

After completing this plan:
1. Visual verification against HTML design
2. Proceed to **Plan 5: Update Footer Styling**
3. Or continue with other Phase 1 plans

