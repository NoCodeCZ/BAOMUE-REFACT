# Plan 5: Update Footer Styling

> **Status**: Ready for Implementation  
> **Part of**: Phase 1 - Update Existing Blocks  
> **Estimated Time**: 1-2 hours  
> **Dependencies**: None

---

## Description

Update `Footer.tsx` to match the HTML design styling. Key changes:
- Change background to dark (`bg-slate-950`)
- Update grid layout to 12-column system with specific column spans
- Add social media links with hover effects
- Add contact information section with icons
- Add QR code section for LINE
- Update bottom bar styling
- Match all text colors and spacing

---

## Current System Behavior

The current `Footer` component:
- Uses light background (`bg-[#FAFAFA]`)
- Uses 4-column grid (`grid-cols-2 md:grid-cols-4`)
- Has different link structure (product_links, company_links, legal_links)
- No social media links section
- No contact information section
- No QR code section
- Different bottom bar styling

---

## Research Summary

From `index.html` footer section:
- Background: `bg-slate-950` (dark)
- Grid: `lg:grid-cols-12` with:
  - Brand column: `lg:col-span-4`
  - Service links: `lg:col-span-2`
  - Info links: `lg:col-span-2`
  - Contact column: `lg:col-span-4`
- Social links: Facebook, Instagram, YouTube, TikTok with hover effects
- Contact info: Phone, Email, LINE with icons
- QR code: LINE QR code with text
- Bottom bar: Copyright and legal links
- Text colors: `text-white/70`, `text-white/60`, `text-white/50`

---

## Files to Modify

### Modified Files
- `components/Footer.tsx` - Complete redesign to match HTML

---

## Step-by-Step Tasks

### Task 1: Update Footer Background and Container
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 18-21

**Current Code**:
```18:21:components/Footer.tsx
    <footer className="bg-[#FAFAFA] pt-20 pb-10 border-t border-neutral-200/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
```

**Proposed Change**:
```typescript
    <footer className="bg-slate-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
```

**Why**: HTML design uses dark background (`bg-slate-950`), larger max-width (`max-w-7xl`), and 12-column grid system.

**Validation**: `npm run dev` - Check footer background
**Test**: Visual verification - footer should have dark background

---

### Task 2: Update Brand Column
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 22-32

**Current Code**:
```22:32:components/Footer.tsx
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-lg font-semibold tracking-tight text-neutral-900 flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-neutral-800"></div>
              {content.site_name || 'Aura'}
            </a>
            {content.description && (
              <p className="text-neutral-400 text-sm font-light">
                {content.description}
              </p>
            )}
          </div>
```

**Proposed Change**:
```typescript
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c4b9c3ac-abfd-48b9-b61e-6a6a55621186_320w.png" 
                alt="Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              {content.description || 'สร้างรอยยิ้มที่มั่นใจ ด้วยบริการที่ใส่ใจทุกรายละเอียด โดยทีมทันตแพทย์ผู้เชี่ยวชาญ'}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-[#1DAEE0] hover:text-white transition-all duration-300">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                </svg>
              </a>
            </div>
          </div>
```

**Why**: HTML design shows:
- Logo image instead of text
- Description text with `text-white/70`
- Social media links (Facebook, Instagram, YouTube, TikTok) with hover effects
- Links use `bg-white/10` with `hover:bg-[#1DAEE0]`

**Validation**: `npm run dev` - Check brand column
**Test**: Visual verification - logo, description, and social links should match HTML

---

### Task 3: Update Service Links Column
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 34-46

**Current Code**:
```34:46:components/Footer.tsx
          {content.product_links && content.product_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.product_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
```

**Proposed Change**:
```typescript
          {/* Service Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-base mb-5">บริการ</h4>
            <ul className="space-y-3">
              {content.product_links && content.product_links.length > 0 ? (
                content.product_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ทันตกรรมทั่วไป</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">จัดฟัน</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">รากเทียม</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ฟอกสีฟัน</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">วีเนียร์</a></li>
                </>
              )}
            </ul>
          </div>
```

**Why**: HTML design shows:
- Column title "บริการ" (Services)
- Links use `text-white/60` with `hover:text-[#1DAEE0]`
- Fallback links if CMS doesn't have data

**Validation**: `npm run dev` - Check service links column
**Test**: Visual verification - links should match HTML styling

---

### Task 4: Update Info Links Column
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 49-62

**Current Code**:
```49:62:components/Footer.tsx
          {content.company_links && content.company_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.company_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
```

**Proposed Change**:
```typescript
          {/* Info Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-base mb-5">ข้อมูล</h4>
            <ul className="space-y-3">
              {content.company_links && content.company_links.length > 0 ? (
                content.company_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">เกี่ยวกับเรา</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">ทีมทันตแพทย์</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">สาขา</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">บทความ</a></li>
                  <li><a href="#" className="text-white/60 text-sm hover:text-[#1DAEE0] transition-colors">โปรโมชั่น</a></li>
                </>
              )}
            </ul>
          </div>
```

**Why**: HTML design shows:
- Column title "ข้อมูล" (Information)
- Same styling as service links column
- Fallback links if CMS doesn't have data

**Validation**: `npm run dev` - Check info links column
**Test**: Visual verification - links should match HTML styling

---

### Task 5: Add Contact Column
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 64-77

**Current Code**:
```64:77:components/Footer.tsx
          {content.legal_links && content.legal_links.length > 0 && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                {content.legal_links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-neutral-900 transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
```

**Proposed Change**:
```typescript
          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-base mb-5">ติดต่อเรา</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1DAEE0]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <span className="text-white/70 text-sm">096 915 9391</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1DAEE0]/20 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1DAEE0]">
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  </svg>
                </div>
                <span className="text-white/70 text-sm">contact@baomue.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#06c755]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#06c755] text-[8px] font-black">LINE</span>
                </div>
                <span className="text-white/70 text-sm">@BAOMUE</span>
              </li>
            </ul>

            {/* QR Code */}
            <div className="inline-flex gap-4 bg-white/5 border-white/10 border rounded-2xl mt-6 pt-4 pr-4 pb-4 pl-4 items-center">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                  <rect fill="#000" x="10" y="10" width="20" height="20"></rect>
                  <rect fill="#000" x="70" y="10" width="20" height="20"></rect>
                  <rect fill="#000" x="10" y="70" width="20" height="20"></rect>
                  <rect fill="#000" x="40" y="40" width="20" height="20"></rect>
                  <rect fill="#000" x="35" y="10" width="10" height="10"></rect>
                  <rect fill="#000" x="55" y="10" width="10" height="10"></rect>
                  <rect fill="#000" x="10" y="35" width="10" height="10"></rect>
                  <rect fill="#000" x="10" y="55" width="10" height="10"></rect>
                </svg>
              </div>
              <div>
                <div className="text-white font-medium text-sm mb-0.5">Add LINE</div>
                <div className="text-white/50 text-xs">@BAOMUE</div>
              </div>
            </div>
          </div>
```

**Why**: HTML design shows:
- Contact information with icons (phone, email, LINE)
- Icons in colored circles (`bg-[#1DAEE0]/20`, `bg-[#06c755]/20`)
- QR code section with placeholder SVG
- All text uses white colors with opacity

**Validation**: `npm run dev` - Check contact column
**Test**: Visual verification - contact info and QR code should match HTML

---

### Task 6: Update Bottom Bar
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 80-102

**Current Code**:
```80:102:components/Footer.tsx
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-200">
          {content.copyright && (
            <div className="text-xs text-neutral-400 mb-4 md:mb-0">
              {content.copyright}
            </div>
          )}
          {content.social_links && content.social_links.length > 0 && (
            <div className="flex gap-4">
              {content.social_links.map((link, index) => {
                const IconComponent = socialIconMap[link.platform] || Twitter;
                return (
                  <a
                    key={index}
                    href={link.href}
                    className="text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
```

**Proposed Change**:
```typescript
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            {content.copyright || '© 2024 คลินิกทันตกรรมเบามือ. All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            {content.legal_links && content.legal_links.length > 0 ? (
              content.legal_links.map((link, index) => (
                <a key={index} href={link.href} className="text-white/50 text-sm hover:text-white transition-colors">
                  {link.text}
                </a>
              ))
            ) : (
              <>
                <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">Terms of Service</a>
              </>
            )}
          </div>
        </div>
```

**Why**: HTML design shows:
- Border uses `border-white/10` instead of `border-neutral-200`
- Copyright text uses `text-white/50 text-sm`
- Legal links on the right side
- All text uses white colors with opacity

**Validation**: `npm run dev` - Check bottom bar
**Test**: Visual verification - bottom bar should match HTML styling

---

### Task 7: Remove Unused Imports
**File**: `components/Footer.tsx`  
**Action**: Modify existing  
**Lines**: 1-12

**Current Code**:
```1:12:components/Footer.tsx
import { Twitter, Github, Instagram } from 'lucide-react';
import type { BlockFooter } from '@/lib/types';

interface FooterProps {
  block: BlockFooter;
}

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  github: Github,
  instagram: Instagram,
};
```

**Proposed Change**:
```typescript
import type { BlockFooter } from '@/lib/types';

interface FooterProps {
  block: BlockFooter;
}
```

**Why**: Social icons are now inline SVG elements matching HTML design, so Lucide icons are no longer needed.

**Validation**: `npm run dev` - Check no import errors
**Test**: Visual verification - footer should render correctly

---

## Testing Strategy

### Visual Testing
1. Start dev server: `npm run dev`
2. Navigate to any page with footer
3. Compare footer section with HTML design:
   - [ ] Background is `bg-slate-950` (dark)
   - [ ] Grid uses 12-column system
   - [ ] Brand column has logo, description, and social links
   - [ ] Service links column matches HTML
   - [ ] Info links column matches HTML
   - [ ] Contact column has phone, email, LINE with icons
   - [ ] QR code section displays correctly
   - [ ] Bottom bar has copyright and legal links
   - [ ] All text colors match HTML (white with opacity)
   - [ ] Hover effects work on links

### Responsive Testing
- [ ] Mobile view (< 640px) - Columns stack correctly
- [ ] Tablet view (640px - 1024px) - Grid adjusts properly
- [ ] Desktop view (> 1024px) - 12-column layout works

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

- [ ] Background is `bg-slate-950` (dark)
- [ ] Grid uses 12-column system with correct column spans
- [ ] Brand column has logo, description, and 4 social links
- [ ] Service links column matches HTML
- [ ] Info links column matches HTML
- [ ] Contact column has phone, email, LINE with icons
- [ ] QR code section displays correctly
- [ ] Bottom bar has copyright and legal links
- [ ] All text colors match HTML (white with opacity)
- [ ] Hover effects work on all links
- [ ] All existing functionality preserved
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Visual match with HTML design

---

## Context Notes

- **CMS Structure**: Footer uses `BlockFooter` with `content` object. May need to update CMS fields to match new structure, but can use fallbacks for now.
- **Social Links**: Currently hardcoded in component. Can be moved to CMS later if needed.
- **Contact Info**: Currently hardcoded. Can be moved to CMS later if needed.
- **QR Code**: Uses placeholder SVG. Can be replaced with actual QR code image from CMS later.
- **Logo**: Uses hardcoded URL. Should use `getFileUrl()` when logo field is added to CMS.
- **Server Component**: Remains a Server Component (no "use client" needed)

---

## Project-Specific Requirements

- ✅ ISR: No changes needed (handled by page)
- ✅ Images: Logo should use `getFileUrl()` when CMS field is added
- ✅ Server Components: Remains Server Component
- ✅ Tailwind Only: Using Tailwind classes + inline SVG for icons
- ✅ Fallbacks: Fallback content provided for all sections
- ✅ Type Safety: No type changes needed (uses existing BlockFooter interface)

---

## Next Steps

After completing this plan:
1. Visual verification against HTML design
2. Consider updating CMS structure to support new footer fields
3. Proceed to **Plan 4: Update ServicesBlock for Tabs** or other Phase 1 plans

---

## Completion Status

- [x] All tasks completed
- [x] All validations passed (TypeScript, Build)
- [x] Feature tested in browser
- Completed: 2024-12-19

### Tasks Completed
- [x] Task 1: Update Footer Background and Container
- [x] Task 2: Update Brand Column
- [x] Task 3: Update Service Links Column
- [x] Task 4: Update Info Links Column
- [x] Task 5: Add Contact Column
- [x] Task 6: Update Bottom Bar
- [x] Task 7: Remove Unused Imports

### Validation Results
- ✅ TypeScript: No errors (`npx tsc --noEmit`)
- ✅ Build: Successful (`npm run build`)
- ✅ Linter: No errors found

