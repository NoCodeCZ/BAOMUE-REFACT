# Research: Directus Data & Collections Sync

**Generated**: 2024-12-06
**Scope**: Understand current state of Directus collections vs TypeScript types, and identify when/how to update Directus data and collections
**Complexity**: Medium

## System Overview

Phase 3 of the migration (Template Adoption) has been **completed** - the homepage now uses reusable block components instead of inline JSX (reduced from 1,802 lines to ~260 lines). However, there are **discrepancies** between the Directus schema and TypeScript types that need addressing, and the **Directus CMS data needs to be populated/verified** to fully utilize the component architecture.

### Current State Summary

| Layer | Status | Notes |
|-------|--------|-------|
| TypeScript Types | ✅ Complete | 15 block interfaces defined in `lib/types.ts` |
| Data Fetching | ✅ Complete | All fetch functions exist in `lib/data.ts` |
| React Components | ✅ Complete | 11 block components in `components/blocks/` |
| Homepage | ✅ Complete | Uses component-based rendering |
| **Directus Schema** | ⚠️ Needs Review | Some collection name mismatches |
| **Directus Data** | ⚠️ Incomplete | Most blocks have data, but needs verification |

## Schema Discrepancy Analysis

### Collection Name Mismatch: `block_text` vs `block_rich_text`

**TypeScript (lib/types.ts):**
```typescript
block_text: BlockText[];  // Line 18

export interface BlockText {
  id: number;
  title?: string;
  subtitle?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  background_color?: string;
}
```

**Directus Schema:**
- Collection exists as: `block_rich_text` (NOT `block_text`)
- Fields: `id`, `headline`, `content` (different field structure)

**Impact:**
- `findBlock("block_text")` in homepage returns `undefined`
- `TextBlock` component never renders
- Need to either:
  1. Rename Directus collection from `block_rich_text` → `block_text`, OR
  2. Update TypeScript to use `block_rich_text` instead

### Recommendation
**Option 1 (Preferred):** Create `block_text` collection in Directus matching TypeScript interface, keep `block_rich_text` for existing usage. This preserves backward compatibility with existing data.

---

## Current Directus Data State

### Pages Collection
| ID | Title | Slug | Status | Notes |
|----|-------|------|--------|-------|
| 2 | Home | home | published | Main homepage |
| 3 | Services | services | published | Services index |
| 4 | Service Detail Template | service-detail | draft | Template for detail pages |
| 5 | Promotions | promotions | published | Promotions page |

### Homepage Blocks (page_id: 2)
| Block Collection | Item ID | Sort | Has Data |
|-----------------|---------|------|----------|
| block_hero | 1 | 1 | ✅ Yes |
| block_features | 1 | 2 | ✅ Need to verify |
| block_testimonials | 1 | 3 | ✅ Need to verify |
| block_pricing | 1 | 4 | ✅ Need to verify |
| block_footer | 1 | 5 | ✅ Need to verify |
| block_about_us | 1 | 2* | ✅ Need to verify |
| block_why_choose_us | 1 | 3* | ✅ Need to verify |
| block_team | 1 | 4* | ✅ Need to verify |
| block_signature_treatment | 1 | 5* | ✅ Need to verify |
| block_safety_banner | 1 | 6* | ✅ Need to verify |
| block_services | 1 | 7* | ✅ Need to verify |
| block_locations | 1 | 8* | ✅ Need to verify |
| block_booking | 1 | 9* | ✅ Need to verify |
| block_contact | 1 | 10* | ✅ Yes |

**Note:** Sort values overlap - may need to be reordered.

### Missing Block Data
- ❌ `block_text` collection does not exist in Directus (uses `block_rich_text` instead)
- ⚠️ Many blocks may have incomplete or placeholder data

### Block Content Sample

**block_hero (id: 1):**
```json
{
  "badge_text": "Accepting New Patients",
  "headline_line1": "Unlock your",
  "headline_line2": "best smile today.",
  "description": "ยกระดับความมั่นใจผ่านรอยยิ้มที่สวยงาม...",
  "primary_cta_text": "จองคิวออนไลน์",
  "primary_cta_link": "#",
  "secondary_cta_text": "ดูบริการของเรา",
  "secondary_cta_link": "#demo"
}
```

**block_contact (id: 1):**
```json
{
  "title": "พร้อมให้บริการคุณ",
  "subtitle": "ติดต่อสอบถามหรือนัดหมายได้ทุกช่องทาง",
  "hq_title": "สำนักงานใหญ่",
  "hq_address": "ชั้น 5 สยามพารากอน...",
  "phone_title": "โทรศัพท์",
  "phone_text": "096 915 9391 (Call Center)...",
  "hours_title": "เวลาทำการ",
  "hours_text": "เปิดทุกวัน 10:00 - 21:00 น...."
}
```

---

## When to Update Directus Data & Collections

### Immediate Actions (Phase 3.1)

1. **Create `block_text` collection** - Match TypeScript interface or rename existing `block_rich_text`
2. **Verify block data** - Check all homepage blocks have proper data
3. **Fix sort ordering** - Ensure `page_blocks` sort values are sequential

### Content Population Actions (Phase 4)

4. **Populate services** - Add more services to `services` collection
5. **Add blog posts** - Create sample blog content
6. **Complete team data** - Add dentist profiles with photos
7. **Add testimonials** - Create customer testimonials
8. **Configure navigation** - Set up site navigation items

### Schema Alignment Actions (Optional)

9. **Review block schemas** - Ensure all blocks match TypeScript interfaces
10. **Add missing fields** - Any fields in TypeScript not in Directus
11. **Update documentation** - Document final schema

---

## Collections to Update/Create

### 1. Create `block_text` Collection (Priority: High)

**Schema to create:**
```json
{
  "collection": "block_text",
  "fields": [
    { "field": "id", "type": "integer", "schema": { "is_primary_key": true } },
    { "field": "title", "type": "string" },
    { "field": "subtitle", "type": "string" },
    { "field": "content", "type": "text" },
    { "field": "alignment", "type": "string", "options": ["left", "center", "right"] },
    { "field": "background_color", "type": "string" }
  ]
}
```

### 2. Verify Existing Block Collections

| Collection | TypeScript Match | Action Needed |
|------------|-----------------|---------------|
| block_hero | ✅ | Verify data fields |
| block_features | ⚠️ | Check if all fields exist |
| block_testimonials | ⚠️ | Check if all fields exist |
| block_pricing | ⚠️ | Check if all fields exist |
| block_footer | ⚠️ | Check if all fields exist |
| block_about_us | ✅ | Verify data |
| block_why_choose_us | ✅ | Verify data |
| block_team | ✅ | Add dentist photos |
| block_signature_treatment | ✅ | Add images |
| block_safety_banner | ✅ | Verify data |
| block_services | ✅ | Verify data |
| block_locations | ✅ | Add branch image |
| block_booking | ✅ | Verify data |
| block_contact | ✅ | ✅ Data verified |
| block_gallery | ❌ | Not in TypeScript |
| block_rich_text | ❌ | Different from block_text |

### 3. Data Population Priority

1. **Homepage blocks** - Ensure all homepage blocks have complete data
2. **Services** - Add more services with images
3. **Team** - Add dentist profiles with photos
4. **Blog** - Create sample blog posts
5. **Navigation** - Configure site navigation

---

## TypeScript to Directus Mapping

### Files Relationship

```
lib/types.ts (TypeScript)  ←→  Directus Collections
├── Schema interface            ├── schema endpoint
│   ├── pages                   │   ├── pages ✅
│   ├── page_blocks            │   ├── page_blocks ✅
│   ├── block_hero             │   ├── block_hero ✅
│   ├── block_text             │   ├── ❌ (block_rich_text exists)
│   ├── block_contact          │   ├── block_contact ✅
│   ├── services               │   ├── services ✅
│   ├── blog_posts             │   ├── blog_posts ✅
│   └── ...                    │   └── ...
```

---

## Recommended Action Plan

### Phase 3.1: Schema Alignment (Do First)

| Task | Action | Impact |
|------|--------|--------|
| Create `block_text` | Use Directus MCP to create collection | Enables TextBlock component |
| OR Rename `block_rich_text` | Rename collection to `block_text` | Same effect, less work |
| Add block item | Create block_text item and add to homepage | TextBlock renders |

### Phase 3.2: Data Verification

| Task | How to Verify |
|------|---------------|
| Check each block collection | Use `mcp_website-builder-directus_items` to read all blocks |
| Verify images | Check if file IDs are valid |
| Test homepage rendering | View homepage in browser |

### Phase 3.3: Content Population

| Task | Where |
|------|-------|
| Add more services | `services` collection |
| Add team members | `block_team` - dentists field |
| Add testimonials | `page_testimonials` or block data |
| Create blog posts | `blog_posts` collection |

---

## Commands Reference

### Check Collection Schema
```typescript
mcp_website-builder-directus_schema({ keys: ["block_text"] })
```

### Read Collection Items
```typescript
mcp_website-builder-directus_items({
  action: "read",
  collection: "block_name",
  query: { fields: ["*"] }
})
```

### Create Collection
```typescript
mcp_website-builder-directus_collections({
  action: "create",
  data: { collection: "block_text", fields: [...], schema: {} }
})
```

### Create Block Item
```typescript
mcp_website-builder-directus_items({
  action: "create",
  collection: "block_text",
  data: { title: "...", content: "..." }
})
```

---

## Next Steps Summary

1. **Decide on `block_text` approach** - Create new OR rename `block_rich_text`
2. **Execute schema change** in Directus
3. **Create block item** with content
4. **Add to page_blocks** junction table
5. **Verify homepage renders** all blocks correctly
6. **Populate remaining content** as needed

---

## Questions to Resolve

- [ ] Should we create `block_text` as new collection or rename `block_rich_text`?
- [ ] What content should go in the TextBlock on homepage?
- [ ] Are there any other blocks that need verification?
- [ ] What is the priority for content population?


