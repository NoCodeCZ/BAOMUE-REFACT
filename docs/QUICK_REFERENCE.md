# Quick Reference Card

A one-page cheat sheet for common tasks in your content management system.

## Where to Find Things

| Task | Location |
|------|----------|
| Edit homepage | **Pages** → "Home" |
| Add service | **Services** → Create Item |
| Write blog post | **Posts** → Create Item |
| Change site name | **Global Settings** |
| Update menu | **Navigation** |
| Upload image | **Files** → Upload |

## Status Meanings

| Status | What It Means |
|--------|---------------|
| **Draft** | Not visible on website, safe to edit |
| **Published** | Live on website, visible to everyone |
| **Archived** | Hidden but kept for reference |

## Common Actions

### Publishing Content
1. Edit item
2. Fill in fields
3. Set Status = **Published**
4. Click **Save**

### Unpublishing Content
1. Edit item
2. Set Status = **Draft** or **Archived**
3. Click **Save**

### Adding Images
1. Go to **Files** → Upload
2. Or use file picker in content fields
3. Select uploaded image

## Field Quick Guide

### Pages
- **Title** - Page name (appears in browser tab)
- **Slug** - URL part (e.g., "about-us" = /about-us)
- **Status** - Draft/Published/Archived
- **SEO Title** - Search engine title (50-60 chars)
- **SEO Description** - Search result description (150-160 chars)

### Services
- **Service Name** - Name of the service
- **Slug** - URL (e.g., "teeth-whitening")
- **Category** - Service category
- **Short Description** - Brief summary (1-2 sentences)
- **Full Description** - Detailed information
- **Duration** - How long it takes
- **Price From** - Starting price
- **Hero Image** - Main service image

### Blog Posts
- **Post Title** - Article title
- **Slug** - URL (e.g., "how-to-care-for-teeth")
- **Article Content** - Full blog post
- **Excerpt** - Short summary (or auto-generated)
- **Featured Image** - Main post image (1200x630px)
- **Author** - Post author
- **Published Date** - When to publish

### Global Settings
- **Site Name** - Website name
- **Site Description** - Brief description
- **Logo** - Header logo (PNG, 200px+ wide)
- **Favicon** - Browser icon (32x32px or 64x64px)

## Image Guidelines

| Use Case | Recommended Size | Format |
|----------|------------------|--------|
| Hero images | 1200x600px+ | JPG/PNG |
| Blog featured | 1200x630px | JPG/PNG |
| Service images | 800x600px+ | JPG/PNG |
| Logo | 200px+ wide | PNG (transparent) |
| Favicon | 32x32px or 64x64px | PNG/ICO |

**Tip:** Keep file sizes under 2MB for faster loading.

## SEO Checklist

- [ ] SEO Title: 50-60 characters, includes keyword
- [ ] SEO Description: 150-160 characters, compelling
- [ ] URL Slug: Short, descriptive, lowercase with hyphens
- [ ] Content: Natural keyword usage
- [ ] Images: Descriptive alt text

## Page Builder (Blocks)

### Adding Blocks
1. Edit page
2. Go to **Blocks** section
3. Click **Create Item** or "+"
4. Select block type
5. Fill content
6. Set **Sort** order (1 = first, 2 = second, etc.)
7. Save

### Reordering Blocks
Change the **Sort** number:
- Lower number = appears first
- Higher number = appears later

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save | Ctrl+S (Windows) / Cmd+S (Mac) |
| Search | Ctrl+K (Windows) / Cmd+K (Mac) |
| Refresh | F5 |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes not showing | Check status is "Published", click Save, refresh browser |
| Can't find collection | Check left sidebar, may need permissions |
| Image not showing | Re-upload in Files, re-select in content |
| Can't edit field | Some fields are read-only (dates, IDs) |

## Workflow Reminder

1. **Create/Edit** → Fill fields
2. **Save as Draft** → Review
3. **Set to Published** → Go live
4. **Check website** → Verify changes

## Need More Help?

- See **USER_GUIDE.md** for detailed instructions
- Check **COLLECTION_GUIDES/** for specific guides
- Review field notes in Directus (below each field)
- Contact your administrator

---

*Print this page and keep it handy!*

