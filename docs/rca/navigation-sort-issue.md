# RCA: Navigation Sort Order Issue

## Issue Summary
Navigation items in Directus have duplicate sort values and incorrect ordering, causing confusion in the UI and potentially incorrect display order on the website.

## Expected Behavior
- Each navigation item should have a unique, sequential sort value
- Navigation items should be ordered logically: Home → Services → Promotions → Our Work → Blog → About Us
- The "Page" column in Directus should clearly show which page each navigation item links to

## Actual Behavior
- **Duplicate sort values**: Items with IDs 3 (โปรโมชั่น) and 2 (บริการ) both have `sort: 3`
- **Incorrect order**: Current order is: Home (1), About Us (2), Promotions (3), Services (3), Our Work (4), Blog (5)
- **Confusing display**: The "Page" column shows page IDs (2, 3, 5, 7) which don't match navigation item IDs, causing confusion

## Root Cause

### Affected Files
- Directus `navigation` collection - data integrity issue
- `lib/data.ts` - `getNavigationItems()` function sorts by `sort` field, but duplicate values cause unpredictable ordering

### Code Analysis

The navigation fetch function in `lib/data.ts`:

```582:621:lib/data.ts
export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const items = await directus.request(
      readItemsTyped('navigation', {
        fields: ['*', 'page.slug', 'page.id', 'children.*', 'children.page.slug', 'children.page.id'],
        sort: ['sort'],
        filter: { parent: { _null: true } }, // Only get top-level items
      })
    ) as NavigationItem[];

    // Process navigation items to build proper structure
    const processedItems = items.map((item) => {
      const navItem: NavigationItem = {
        id: item.id,
        title: item.title,
        url: item.url || null,
        target: item.target || '_self',
        sort: item.sort || null,
        page: item.page ? (typeof item.page === 'object' ? item.page : null) : null,
        parent: null,
        children: item.children ? item.children.map((child: NavigationItem) => ({
          id: child.id,
          title: child.title,
          url: child.url || null,
          target: child.target || '_self',
          sort: child.sort || null,
          page: child.page ? (typeof child.page === 'object' ? child.page : null) : null,
          parent: item.id,
          children: [],
),
      };
      return navItem;
    });

    return processedItems;
  } catch (error) {
    logDirectusError('getNavigationItems', error);
    return [];
  }
}
```

**Problem**: When multiple items have the same `sort` value, database sorting becomes unpredictable. The query sorts by `['sort']`, but when sort values are equal, the database may return items in ID order or creation order, not the intended display order.

### Current Navigation Data

| ID | Title | Sort | Page ID | Page Slug | URL | Issue |
|----|-------|------|---------|-----------|-----|-------|
| 1 | หน้าแรก | 1 | 2 | home | null | ✅ Correct |
| 5 | About us | 2 | null | null | /about-us | ⚠️ Should be last |
| 3 | โปรโมชั่น | 3 | 5 | promotions | null | ⚠️ Duplicate sort |
| 2 | บริการ | 3 | 3 | services | null | ⚠️ Duplicate sort |
| 6 | ผลงานของเรา | 4 | 7 | our-work | null | ✅ Correct |
| 4 | บทความ | 5 | null | null | /blog | ✅ Correct |

## Impact
- **Severity**: Medium
- **Affected area**: Site navigation, user experience
- **User impact**: Navigation items may appear in wrong order, especially items with duplicate sort values

## Proposed Fix

### Files to Modify
- Directus `navigation` collection - update sort values
- Optionally: Add validation to prevent duplicate sort values

### Fix Steps

1. **Update navigation sort values** to ensure unique, sequential ordering:
   - หน้าแรก (Home): `sort: 1` ✅ (keep)
   - บริการ (Services): `sort: 2` (change from 3)
   - โปรโมชั่น (Promotions): `sort: 3` ✅ (keep)
   - ผลงานของเรา (Our Work): `sort: 4` ✅ (keep)
   - บทความ (Blog): `sort: 5` ✅ (keep)
   - About us: `sort: 6` (change from 2)

2. **Verify page relationships** are correct:
   - Ensure all navigation items either have a `page` link OR a `url` value
   - Verify page slugs match expected routes

3. **Optional: Add Directus validation** to prevent duplicate sort values in the future

4. **Test navigation rendering** to ensure correct order on the website

## Testing Strategy
- [x] Verify navigation items appear in correct order on homepage
- [x] Check mobile navigation menu order
- [ ] Verify all navigation links work correctly
- [ ] Test navigation active state highlighting
- [x] Confirm no duplicate sort values exist in Directus

## Fix Applied ✅

**Date**: 2025-12-26

**Changes Made**:
1. **Directus Data Fix**: Updated navigation sort values to ensure unique, sequential ordering:
   - หน้าแรก (Home): `sort: 1` ✅
   - บริการ (Services): `sort: 2` ✅ (fixed from 3)
   - โปรโมชั่น (Promotions): `sort: 3` ✅
   - ผลงานของเรา (Our Work): `sort: 4` ✅
   - บทความ (Blog): `sort: 5` ✅
   - About us: `sort: 6` ✅ (fixed from 2)

2. **Code Improvements** (`lib/data.ts`):
   - Added secondary sort by `id` in Directus query to ensure consistent ordering when sort values are duplicate
   - Added client-side sorting as fallback to handle null/undefined sort values
   - Added development-mode validation to detect and warn about duplicate sort values
   - Improved error handling and consistency

**Result**: All navigation items now have unique sort values and will display in the correct order. The code now handles edge cases better and provides warnings if duplicate sort values are introduced in the future.

---
## Resolution
- [x] Fix implemented
- [x] Directus data updated with unique sort values
- [x] Code improvements added for robustness
- [x] Navigation items verified in correct order
- [x] TypeScript validation passed for navigation code
- [x] Linter validation passed for navigation code
- Fixed: 2025-12-26
- Files Modified:
  - `lib/data.ts` - Enhanced `getNavigationItems()` function
  - Directus `navigation` collection - Updated sort values

## Prevention
1. **Add validation rule** in Directus to ensure unique sort values per parent level
2. **Document expected navigation order** in project documentation
3. **Add automated test** to check for duplicate sort values
4. **Consider using a "reorder" interface** in Directus that automatically manages sort values

## Additional Recommendations

### Navigation Structure Improvements
1. **Consistent naming**: Use Thai titles consistently or provide English alternatives
2. **Page linking**: Prefer linking to pages via `page` field rather than hardcoded URLs
3. **Sort field display**: Consider showing sort value more prominently in Directus UI
4. **Documentation**: Document the expected navigation order in the project README

### Directus UI Enhancement
The "Page" column showing page IDs (2, 3, 5, 7) is confusing. Consider:
- Displaying page title instead of ID
- Adding a computed field that shows the final URL path
- Grouping navigation items by parent for better organization

