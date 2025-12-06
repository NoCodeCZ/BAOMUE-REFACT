# Complete Collection Setup Guide

## Problem

The current Directus setup is missing **most of the block collections** that your home page design requires. The config files only include basic collections (pages, services, posts), but your home page uses 10+ block collections that don't exist yet.

## Missing Collections

### Block Collections (Required for Home Page)
1. ✅ `block_hero` - Hero section
2. ✅ `block_about_us` - About Us section  
3. ✅ `block_why_choose_us` - Why Choose Us section
4. ✅ `block_team` - Team/Dentists section
5. ✅ `block_signature_treatment` - Signature treatment section
6. ✅ `block_safety_banner` - Safety protocols banner
7. ✅ `block_services` - Services grid section
8. ✅ `block_locations` - Locations section
9. ✅ `block_booking` - Booking form section
10. ✅ `block_contact` - Contact information section
11. ✅ `block_features` - Features section (in types, not used in home page yet)
12. ✅ `block_testimonials` - Testimonials section (in types, not used in home page yet)
13. ✅ `block_pricing` - Pricing section (in types, not used in home page yet)
14. ✅ `block_footer` - Footer content (in types, not used in home page yet)

### Supporting Collections
15. ✅ `page_blocks` - Junction table for M2A relationship (connects pages to blocks)
16. ✅ `navigation` - Site navigation menu
17. ✅ `blog_categories` - Blog post categories
18. ✅ `blog_posts` - Blog posts (note: config has "posts" but code uses "blog_posts")

### Updated Collections
19. ✅ `services` - Needs `highlights` field (JSON array)

## Solution

I've created a **complete collection configuration file** at:
```
config/ALL_COLLECTIONS_COMPLETE.json
```

This file contains all 19 collections with their complete field definitions based on your TypeScript interfaces in `lib/types.ts`.

## How to Create Collections in Directus

You have two options:

### Option 1: Use Directus MCP Server (Recommended)

If you have the Directus MCP server configured, I can create all these collections programmatically using the `collections` and `fields` tools.

### Option 2: Manual Creation in Directus Admin

1. **Log into Directus Admin Panel**
2. **For each block collection**, follow these steps:
   - Go to Settings → Data Model
   - Click "Create Collection"
   - Collection Name: `block_hero` (or other block name)
   - Primary Key: Integer (Auto Increment)
   - Click "Create Collection"
   - Add fields one by one using the field definitions from `config/ALL_COLLECTIONS_COMPLETE.json`

3. **Create the `page_blocks` junction collection**:
   - Collection Name: `page_blocks`
   - Primary Key: Integer (Auto Increment)
   - Add fields: `page` (Integer, M2O to `pages`), `collection` (String), `item` (String), `sort` (Integer)
   - Set as hidden collection (optional)

4. **Set up M2A relationship**:
   - In `pages` collection, add an alias field
   - Field name: `blocks`
   - Type: Alias
   - Interface: Many-to-Any (M2A)
   - Configure to use `page_blocks` junction

## Quick Reference: Block Collections Summary

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `block_hero` | Hero section | headline_line1, headline_line2, description, primary_cta_text, background_image |
| `block_about_us` | About section | headline, subtitle, paragraph_1/2/3, image_url |
| `block_why_choose_us` | Why choose us | title, subtitle, point_1/2/3/4_title, point_1/2/3/4_text |
| `block_team` | Team section | title, subtitle, dentists (JSON array) |
| `block_signature_treatment` | Treatment showcase | title, steps (JSON), stats, before/after images |
| `block_safety_banner` | Safety banner | title, subtitle, points (JSON array) |
| `block_services` | Services grid | title, subtitle, services (JSON array) |
| `block_locations` | Locations | branch_name, branch_address, branch_hours, map_embed_url |
| `block_booking` | Booking form | title, phone_number, line_handle, hours_value |
| `block_contact` | Contact info | title, hq_address, phone_text, email_text |

## Next Steps

1. **Review** `config/ALL_COLLECTIONS_COMPLETE.json` to see all field definitions
2. **Create collections** in Directus (using MCP or manually)
3. **Set up relationships**:
   - `page_blocks` → `pages` (M2O)
   - `pages` → `page_blocks` → blocks (M2A)
   - `navigation` → `pages` (M2O, optional)
   - `navigation` → `navigation` (self-referencing for hierarchy)
   - `blog_posts` → `blog_categories` (M2O)
   - `services` → `service_categories` (M2O)
4. **Set permissions**: Make all block collections publicly readable
5. **Test**: Create a "home" page and add blocks to verify everything works

## Field Types Reference

- **String**: Text input (single line)
- **Text**: Textarea (multiline)
- **Integer**: Number input
- **UUID**: File/image field (use `file-image` interface)
- **JSON**: Complex data (arrays, objects) - use `list` interface for arrays
- **Timestamp**: Date/time picker
- **Boolean**: Toggle/checkbox
- **CSV**: Tags (comma-separated values)

## Important Notes

1. **JSON Fields**: For arrays like `dentists`, `steps`, `points`, use JSON type with `list` interface
2. **File Fields**: Use UUID type with `file-image` interface and `special: ["file"]`
3. **Relationships**: Use Integer type with `select-dropdown-m2o` interface and `special: ["m2o"]`
4. **System Fields**: All collections should have `user_created`, `date_created`, `user_updated`, `date_updated` (auto-added by Directus)

## Verification Checklist

After creating collections, verify:

- [ ] All 14 block collections exist
- [ ] `page_blocks` junction collection exists
- [ ] `navigation` collection exists
- [ ] `blog_categories` and `blog_posts` exist (not just "posts")
- [ ] `services` collection has `highlights` field
- [ ] M2A relationship is set up between `pages` and blocks
- [ ] All collections have public read permissions
- [ ] Can create a page with slug "home"
- [ ] Can add blocks to the home page
- [ ] Home page renders correctly with block data

---

**Need Help?** If you want me to create these collections programmatically using Directus MCP, just let me know!

