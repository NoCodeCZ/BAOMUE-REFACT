# User Guide - Website Content Management

Welcome to your website content management system! This guide will help you understand how to edit and manage your website content using Directus CMS.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Interface](#understanding-the-interface)
3. [Navigation Guide](#navigation-guide)
4. [Common Tasks](#common-tasks)
5. [Understanding the Page Builder](#understanding-the-page-builder)
6. [Image Upload Guidelines](#image-upload-guidelines)
7. [SEO Best Practices](#seo-best-practices)
8. [Publishing Workflow](#publishing-workflow)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Logging In

1. Go to your Directus admin panel URL (provided by your developer)
2. Enter your username and password
3. Click "Sign In"

### Understanding the Dashboard

When you first log in, you'll see the main dashboard. This shows:
- **Recent activity** - Items you've recently edited
- **Quick actions** - Common tasks you can perform
- **Collection overview** - Quick access to your content collections

### Key Concepts

- **Collections** - Groups of similar content (like "Pages", "Services", "Blog Posts")
- **Items** - Individual pieces of content within a collection
- **Fields** - The individual pieces of information for each item (like "Title", "Description")
- **Status** - Whether content is Draft, Published, or Archived

---

## Understanding the Interface

### Main Navigation

The left sidebar contains all your content collections:

- **Pages** - Manage website pages
- **Services** - Manage service offerings
- **Service Categories** - Organize services
- **Posts** - Blog articles
- **Navigation** - Website menu items
- **Global Settings** - Site-wide settings
- **Files** - Image and file library

### Collection View

When you click on a collection, you'll see:
- **List of items** - All content in that collection
- **Search bar** - Find specific items quickly
- **Filter options** - Filter by status, date, etc.
- **Create button** - Add new items

### Item Edit View

When editing an item, you'll see:
- **Fields** - All the information you can edit
- **Save button** - Save your changes
- **Status dropdown** - Change publication status
- **Field notes** - Helpful hints below each field

---

## Navigation Guide

### Where to Find Things

| What You Want to Edit | Where to Find It |
|----------------------|------------------|
| Homepage content | **Pages** → Find "Home" page → Edit |
| Service listings | **Services** → View all services |
| Blog posts | **Posts** → View all articles |
| Website menu | **Navigation** → Edit menu items |
| Site name/logo | **Global Settings** → Edit |
| Images | **Files** → Upload and manage |

### Collection Organization

Collections are organized by content type:

**Content Collections:**
- Pages - All website pages
- Services - Your service offerings
- Posts - Blog articles

**Configuration Collections:**
- Global Settings - Site-wide settings
- Navigation - Menu structure
- Service Categories - Service organization

**Supporting Collections:**
- Files - All uploaded images and documents
- Page Blocks - Content blocks for pages (advanced)

---

## Common Tasks

### Editing Homepage Content

1. Go to **Pages** in the left sidebar
2. Find the page named "Home" (or "home")
3. Click on it to open
4. You'll see the page details and blocks
5. To edit blocks:
   - Scroll to the "Blocks" section
   - Click on a block to edit it
   - Or create a new block using the "+" button
6. Make your changes
7. Click **Save** at the top right
8. Change status to **Published** if you want it visible

### Adding a New Service

1. Go to **Services** in the left sidebar
2. Click **Create Item** (or the "+" button)
3. Fill in the required fields:
   - **Service Name** - The name of your service
   - **URL Slug** - Auto-generates from name (or customize)
   - **Service Category** - Select from dropdown
   - **Short Description** - Brief summary (1-2 sentences)
   - **Full Description** - Detailed information
   - **Duration** - How long it takes (optional)
   - **Price From** - Starting price (optional)
   - **Hero Image** - Main service image
4. Set **Status** to "Published" when ready
5. Click **Save**

### Editing an Existing Service

1. Go to **Services**
2. Find the service you want to edit
3. Click on it
4. Make your changes
5. Click **Save**

### Managing Blog Posts

#### Creating a New Post

1. Go to **Posts**
2. Click **Create Item**
3. Fill in:
   - **Post Title** - Engaging title
   - **URL Slug** - Auto-generates (or customize)
   - **Article Content** - Full blog post content
   - **Excerpt** - Short summary (or leave empty)
   - **Featured Image** - Main image for the post
   - **Author** - Select author
   - **Published Date** - When to publish
4. Set **Status** to "Published"
5. Click **Save**

#### Editing a Post

1. Go to **Posts**
2. Find the post
3. Click to edit
4. Make changes
5. Click **Save**

### Updating Navigation Menu

1. Go to **Navigation** in the left sidebar
2. You'll see all menu items
3. To edit an item:
   - Click on it
   - Change the **Title** (what appears in menu)
   - Set the **URL** or link to a **Page**
   - Adjust **Sort Order** to change position
4. To add a new menu item:
   - Click **Create Item**
   - Fill in title and URL
   - Set sort order
5. Click **Save**

### Changing Site Settings

1. Go to **Global Settings** (it's a singleton, so there's only one)
2. Edit:
   - **Site Name** - Your website name
   - **Site Description** - Brief description
   - **Logo** - Upload or change logo
   - **Favicon** - Small browser icon
3. Click **Save**

---

## Understanding the Page Builder

Your website uses a "block-based" page builder system. This means pages are made up of reusable content blocks.

### What are Blocks?

Blocks are sections of content that can be added to pages. Examples:
- **Hero Block** - Large banner at top of page
- **Services Block** - Showcase your services
- **Team Block** - Display team members
- **Contact Block** - Contact information

### How Blocks Work

1. **Blocks are reusable** - Create once, use on multiple pages
2. **Blocks are ordered** - Control what appears first, second, etc.
3. **Blocks are independent** - Edit a block without affecting the page structure

### Adding Blocks to a Page

1. Edit the page (e.g., go to **Pages** → "Home")
2. Find the **Blocks** section
3. Click **Create Item** or the "+" button
4. Select the block type you want
5. Fill in the block content
6. Set the **Sort** order (lower numbers appear first)
7. Click **Save**

### Reordering Blocks

1. Edit the page
2. In the **Blocks** section, you'll see all blocks
3. Each block has a **Sort** field
4. Change the sort numbers:
   - Block with sort = 1 appears first
   - Block with sort = 2 appears second
   - And so on...
5. Click **Save**

### Editing Block Content

1. Edit the page containing the block
2. Find the block in the **Blocks** section
3. Click on the block to edit it
4. Make your changes
5. Click **Save**

---

## Image Upload Guidelines

### Uploading Images

1. Go to **Files** in the left sidebar
2. Click **Upload File** or drag and drop
3. Select your image
4. Wait for upload to complete
5. The image is now available to use

### Image Best Practices

**File Formats:**
- Use **JPG** for photos
- Use **PNG** for logos and graphics with transparency
- Use **WebP** for optimized web images (if available)

**Image Sizes:**
- **Hero images**: 1200x600px or larger
- **Featured images**: 1200x630px (blog posts)
- **Service images**: 800x600px or larger
- **Logo**: At least 200px wide, PNG with transparency
- **Favicon**: 32x32px or 64x64px, square

**File Size:**
- Keep images under 2MB when possible
- Compress images before uploading for faster page loads

### Using Images in Content

When editing content:
1. Find an image field (like "Hero Image" or "Featured Image")
2. Click the file selector
3. Choose from uploaded files or upload new
4. Select the image
5. It will be attached to your content

---

## SEO Best Practices

### What is SEO?

SEO (Search Engine Optimization) helps your website appear in search results. Good SEO means more visitors find your website.

### SEO Fields Explained

**SEO Title:**
- Appears in search results and browser tabs
- Should be 50-60 characters
- Include your main keyword
- Make it compelling

**SEO Description:**
- Appears below the title in search results
- Should be 150-160 characters
- Write a compelling summary
- Include a call to action

**URL Slug:**
- The part of the URL after your domain
- Use lowercase letters, numbers, and hyphens
- Keep it short and descriptive
- Include keywords when possible

### SEO Tips

1. **Use descriptive titles** - Tell visitors what the page is about
2. **Write good descriptions** - Summarize content clearly
3. **Use keywords naturally** - Don't stuff keywords, use them naturally
4. **Add alt text to images** - Describe images for accessibility and SEO
5. **Keep content fresh** - Update content regularly
6. **Link related content** - Connect related pages and posts

### Checking Your SEO

After publishing:
1. Use Google Search Console to see how your pages appear
2. Test with Google's Rich Results Test
3. Check that titles and descriptions look good in search results

---

## Publishing Workflow

### Understanding Status

Every content item has a status:

- **Draft** - Not visible on website, still being edited
- **Published** - Visible to everyone on the website
- **Archived** - Hidden from website but kept for reference

### Publishing Process

1. **Create or Edit** your content
2. **Fill in all fields** you want to display
3. **Set Status to "Draft"** while editing
4. **Review your content** carefully
5. **Set Status to "Published"** when ready
6. **Click Save**

### Draft vs Published

- **Draft** - Safe to edit, won't affect live website
- **Published** - Changes appear immediately on website

**Tip:** Always save as Draft first, review, then publish.

### Unpublishing Content

To hide content without deleting:
1. Edit the item
2. Change **Status** from "Published" to "Draft" or "Archived"
3. Click **Save**

---

## Troubleshooting

### Common Issues and Solutions

#### "I can't see my changes on the website"

**Possible causes:**
- Content status is "Draft" - Change to "Published"
- Browser cache - Try refreshing (Ctrl+F5 or Cmd+Shift+R)
- Changes not saved - Make sure you clicked "Save"

**Solution:**
1. Check the status is "Published"
2. Click "Save" again
3. Clear browser cache and refresh

#### "I can't find a collection"

**Solution:**
- Check the left sidebar - collections are listed there
- If you don't see it, you may not have permission - contact your administrator

#### "Images aren't showing"

**Possible causes:**
- Image not uploaded properly
- Wrong file selected
- Image file corrupted

**Solution:**
1. Go to **Files** and verify image uploaded
2. Re-upload the image if needed
3. Re-select the image in your content

#### "I can't edit a field"

**Possible causes:**
- Field is read-only (like creation date)
- You don't have permission
- Field is hidden

**Solution:**
- Some fields (like dates, IDs) are automatically set and can't be edited
- If you need to edit a field, contact your administrator

#### "My page looks wrong"

**Possible causes:**
- Block order incorrect
- Missing content in blocks
- Status not published

**Solution:**
1. Check block sort order
2. Verify all blocks have content
3. Ensure page status is "Published"

### Getting Help

If you encounter issues:
1. Check this guide first
2. Review the field notes in Directus (they appear below each field)
3. Contact your website administrator or developer

---

## Quick Tips

- **Save frequently** - Don't lose your work
- **Use Draft status** - Edit safely before publishing
- **Check field notes** - Helpful hints appear below each field
- **Organize with categories** - Use categories to group related content
- **Use descriptive names** - Make it easy to find content later
- **Review before publishing** - Always preview or review before going live

---

## Next Steps

Now that you understand the basics:

1. **Explore your collections** - Click around and see what's there
2. **Edit existing content** - Practice on existing items
3. **Create test content** - Try creating a new item as Draft
4. **Review the Quick Reference** - Keep `QUICK_REFERENCE.md` handy

For collection-specific help, see the guides in the `COLLECTION_GUIDES/` folder.

---

*Last updated: [Date will be updated when template is delivered]*

