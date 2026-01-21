# Phase 2: Schema Alignment - Next Steps

**Status**: ✅ **COMPLETED** (2024-12-19)

This document is kept for historical reference. All Phase 2 tasks have been completed.

## Completed Status ✅

**Phase 1 Complete:**
- ✅ SDK enhancements (health check, error handling, mutations)
- ✅ API routes for form submissions
- ✅ All validation passing

**Phase 2 Complete:**
- ✅ Schema comparison completed
- ✅ Block alignment completed (Hybrid approach)
- ✅ All missing blocks added (`block_text`, `block_contact`, `block_form`)
- ✅ Component architecture established
- ✅ All blocks render correctly

**Final Schema:**
- Current blocks: 15+ (aligned with template + custom extensions)
- Template blocks: 5-10 core blocks
- **Custom blocks:** Additional dental-clinic specific blocks maintained
- **All core blocks:** block_text, block_contact, block_form, etc. - all implemented

## Recommended Next Steps

### Option 1: Minimal Alignment (Recommended First)
**Goal:** Align naming and add missing core blocks without breaking changes

1. **Add Missing Core Blocks**
   - Create `block_text` collection (rename from `block_richtext` or create new)
   - Create `block_contact` collection (if not exists)
   - Update `lib/data.ts` with new block fetch functions
   - Update `lib/types.ts` with new block interfaces

2. **Rename for Consistency**
   - Consider renaming `block_richtext` → `block_text` (if safe)
   - Or keep both and map `block_text` to `block_richtext` internally

3. **Update Documentation**
   - Document which blocks are template-aligned vs custom
   - Update migration guide

**Time Estimate:** 2-4 hours
**Risk:** Low (additive changes)

### Option 2: Full Schema Alignment
**Goal:** Consolidate blocks to match template exactly

1. **Consolidate Button Blocks**
   - Merge `block_button` into parent blocks (hero, CTA)
   - Keep `block_button_group` or merge into hero/CTA blocks
   - Update all pages using button blocks

2. **Consolidate Gallery Structure**
   - Keep current structure (it's flexible) OR
   - Merge `block_gallery_items` into `block_gallery` as nested JSON

3. **Consolidate Pricing Structure**
   - Keep current structure (it's flexible) OR
   - Merge `block_pricing_cards` into `block_pricing` as nested JSON

4. **Handle Blog Posts Block**
   - Keep `block_posts` if blog functionality is needed
   - Or remove and use direct `blog_posts` collection queries

5. **Data Migration**
   - Migrate existing content to new block structure
   - Update all page compositions
   - Test all pages render correctly

**Time Estimate:** 1-2 days
**Risk:** Medium (requires data migration)

### Option 3: Hybrid Approach (Recommended)
**Goal:** Align core blocks, keep custom blocks for flexibility

1. **Align Core Blocks** (Same as Option 1)
   - Add `block_text` and `block_contact`
   - Ensure hero, gallery, form match template

2. **Keep Custom Blocks**
   - Keep `block_button_group`, `block_pricing`, `block_posts` as custom extensions
   - Document them as "template extensions"
   - This maintains flexibility while aligning core

3. **Update Type System**
   - Add template-aligned blocks to Schema interface
   - Keep custom blocks separate
   - Document which are which

**Time Estimate:** 3-6 hours
**Risk:** Low (best of both worlds)

## Immediate Action Items

### Step 1: Review Current Block Usage
```bash
# Check which blocks are actually used in pages
# Review page_blocks junction collection in Directus
# Identify which blocks can be safely consolidated
```

### Step 2: Decide on Approach
- **If you need flexibility:** Choose Option 3 (Hybrid)
- **If you want exact template match:** Choose Option 2 (Full)
- **If you want minimal changes:** Choose Option 1 (Minimal)

### Step 3: Create Block Inventory
Document:
- Which blocks exist in Directus
- Which blocks are used in pages
- Which blocks can be consolidated
- Which blocks need to be created

### Step 4: Plan Data Migration (if needed)
If consolidating blocks:
- Export current page_blocks data
- Map old blocks to new blocks
- Create migration script
- Test on staging first

## Testing Strategy

After schema changes:
1. **Verify All Pages Render**
   ```bash
   npm run dev
   # Visit each page and verify blocks display correctly
   ```

2. **Test Block Fetching**
   - Test each block fetch function in `lib/data.ts`
   - Verify error handling works

3. **Test Form Submissions**
   - Test contact form submission
   - Verify data appears in Directus

4. **Run Schema Comparison**
   ```bash
   node scripts/compare-schema-to-template.js
   ```

## Recommended Path Forward

**For Now (Quick Win):**
1. ✅ **You're done with Phase 1** - SDK enhancements complete
2. 📋 **Review block usage** - Check which blocks are actually used
3. 🎯 **Choose alignment approach** - I recommend Option 3 (Hybrid)

**Next Session:**
1. Add missing `block_text` and `block_contact` blocks
2. Update TypeScript types
3. Update data fetching functions
4. Test and document

## Questions to Answer Before Proceeding

1. **Are you actively using all 10 blocks?**
   - Check `page_blocks` collection in Directus
   - See which blocks are referenced

2. **Do you need the button blocks separately?**
   - Or can they be merged into hero/CTA blocks?

3. **Is the blog functionality important?**
   - If yes, keep `block_posts`
   - If no, consider removing it

4. **Do you want exact template match or flexibility?**
   - Exact match = more consolidation work
   - Flexibility = keep custom blocks

## Files to Create/Modify (When Ready)

**New Files:**
- `docs/block-inventory.md` - Document all blocks and usage
- `scripts/migrate-blocks.js` - Data migration script (if needed)

**Modified Files:**
- `lib/data.ts` - Add new block fetch functions
- `lib/types.ts` - Add new block interfaces
- `docs/migration-guide.md` - Update with Phase 2 progress

## Need Help Deciding?

If you're unsure which approach to take, I recommend:
1. **Start with Option 1 (Minimal)** - Add missing blocks, rename for consistency
2. **Test everything works**
3. **Then decide** if you want to consolidate further

This gives you immediate template alignment without breaking anything.

