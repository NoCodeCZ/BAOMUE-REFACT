# Directus Collection Organization Guide

## Overview

This guide explains how the Directus collections are organized in the admin interface for better usability.

## Collection Folders

Collections are organized into logical folders:

### 📁 Content Blocks
All content block collections (`block_*`) are grouped here:
- `block_hero` - Hero section
- `block_about_us` - About Us section
- `block_why_choose_us` - Why Choose Us section
- `block_team` - Team/Dentists section
- `block_signature_treatment` - Signature treatment showcase
- `block_safety_banner` - Safety protocols banner
- `block_services` - Services grid
- `block_locations` - Locations section
- `block_booking` - Booking form section
- `block_contact` - Contact information
- `block_features` - Features section
- `block_testimonials` - Testimonials section
- `block_pricing` - Pricing section
- `block_footer` - Footer content
- `block_gallery` - Image gallery (if used)
- `block_rich_text` - Rich text block (if used)

### 📁 Blog
Blog-related collections:
- `blog_categories` - Blog post categories
- `blog_posts` - Blog posts and articles

### 📁 Services
Service-related collections:
- `service_categories` - Service categories
- `services` - Service offerings

### 📁 Page Items
Page-level content items:
- `page_features` - Feature items for pages
- `page_testimonials` - Testimonial items for pages
- `page_pricing_plans` - Pricing plan items for pages

### 📁 Website
Main website collections:
- `pages` - Website pages
- `navigation` - Site navigation menu
- `global_settings` - Site-wide settings
- `forms` - Form definitions
- `form_submissions` - Form responses

## Hidden Collections

These collections are hidden from the navigation (they're system/junction tables):
- `page_blocks` - Junction table for M2A relationship (hidden)
- `posts` - Duplicate collection (hidden, use `blog_posts` instead)
- Various `block_*` collections that were previously hidden (now visible in Content Blocks folder)

## Organizing Collections

To reorganize collections in Directus, run:

```bash
npm run organize-collections
```

This script will:
1. Group all `block_*` collections into "Content Blocks" folder
2. Fix `blog_posts` grouping (move to Blog folder)
3. Hide duplicate "posts" collection
4. Organize `page_*` collections into "Page Items" folder
5. Add metadata (icons, notes) to collections missing them
6. Make hidden block collections visible

## Manual Organization

You can also organize collections manually in Directus:

1. Go to **Settings** → **Data Model**
2. Click on a collection
3. Edit the collection settings
4. Set the **Group** field to the desired folder name
5. Set **Hidden** to true/false as needed
6. Add **Icon** and **Note** for better UI

## Collection Icons

Collections have appropriate icons:
- 📄 `pages` - folder icon
- 🎨 `block_*` - various icons (star, image, people, etc.)
- 📝 `blog_posts` - article icon
- 🏥 `services` - medical_services icon
- ⚙️ `global_settings` - settings icon
- 🧭 `navigation` - menu icon

## Best Practices

1. **Keep block collections together** - All `block_*` collections should be in "Content Blocks" folder
2. **Hide junction tables** - Collections like `page_blocks` should be hidden
3. **Use descriptive notes** - Each collection should have a helpful note explaining its purpose
4. **Set appropriate icons** - Icons help users quickly identify collections
5. **Organize by function** - Group related collections together

## Troubleshooting

**Q: Collections are not showing in folders**
- Refresh the Directus admin panel
- Check that the `group` field is set correctly in collection metadata
- Verify folder collections exist (they're virtual, not real tables)

**Q: Some collections are hidden when they shouldn't be**
- Run `npm run organize-collections` to fix visibility
- Or manually set `hidden: false` in collection settings

**Q: Duplicate collections**
- The `posts` collection is a duplicate of `blog_posts` and should be hidden
- Use `blog_posts` for all blog functionality

