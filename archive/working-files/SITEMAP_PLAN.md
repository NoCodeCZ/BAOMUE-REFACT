# Website Sitemap & Implementation Plan

**Status:** 🟡 Planning Phase  
**Last Updated:** $(date)  
**Purpose:** Define complete site structure before schema fixes and design imports

---

## 📋 Table of Contents

1. [Site Structure Overview](#site-structure-overview)
2. [Page-by-Page Breakdown](#page-by-page-breakdown)
3. [Navigation Structure](#navigation-structure)
4. [Content Blocks Required](#content-blocks-required)
5. [Data Collections Needed](#data-collections-needed)
6. [Implementation Priority](#implementation-priority)
7. [Design Import Order](#design-import-order)

---

## 🌐 Site Structure Overview

### Primary Routes

```
/
├── / (homepage)
├── /services
│   └── /services/[slug]
├── /blog
│   └── /blog/[slug]
├── /our-work (portfolio/gallery)
├── /promotions
└── /contact
```

### Static Pages (CMS-driven)

- Homepage (`/`)
- Services Index (`/services`)
- Service Detail (`/services/[slug]`)
- Blog Index (`/blog`)
- Blog Post (`/blog/[slug]`)
- Our Work (`/our-work`)
- Promotions (`/promotions`)
- Contact (`/contact`)

---

## 📄 Page-by-Page Breakdown

### 1. Homepage (`/`)

**Route:** `app/page.tsx`  
**Status:** ✅ Partially implemented  
**Type:** Block-based page builder

**Required Blocks:**
- [x] `block_hero` - Hero section with CTA
- [x] `block_features` - Key features/benefits
- [x] `block_testimonials` - Customer testimonials
- [x] `block_pricing` - Pricing plans (if applicable)
- [ ] `block_services` - Featured services preview
- [ ] `block_promotions` - Current promotions carousel
- [ ] `block_about_us` - About section
- [ ] `block_why_choose_us` - Why choose us section
- [x] `block_footer` - Footer content

**Data Needed:**
- Page content from `pages` collection (slug: "home" or "/")
- Blocks via `page_blocks` junction
- Global settings for site-wide content

**Design File:** `docs/reference/site-files/index.html`

---

### 2. Services Index (`/services`)

**Route:** `app/services/page.tsx`  
**Status:** ✅ Implemented  
**Type:** List page with filtering

**Content:**
- Page title and description
- Service categories (filtering)
- Service cards grouped by category
- Each card: name, short description, category, CTA

**Data Needed:**
- `services` collection (published only)
- `service_categories` collection
- Page metadata from `pages` collection

**Design File:** `docs/reference/site-files/service-index.html`

**Required Blocks:**
- `block_hero` - Services page hero
- Service listing component (custom, not a block)

---

### 3. Service Detail (`/services/[slug]`)

**Route:** `app/services/[slug]/page.tsx`  
**Status:** ✅ Implemented  
**Type:** Dynamic detail page

**Content:**
- Service name
- Hero image
- Category badge
- Short description
- Long description (rich text)
- Duration label
- Price from
- Service highlights (key benefits)
- CTA buttons (book appointment, learn more)

**Data Needed:**
- Single `service` by slug
- Related `service_category`
- Hero image from `directus_files`

**Design File:** `docs/reference/site-files/service-detail.html`

**Required Blocks:**
- Service detail is custom component, not block-based
- May include `block_booking` for appointment CTA

---

### 4. Blog Index (`/blog`)

**Route:** `app/blog/page.tsx`  
**Status:** 🟡 UI only (no CMS data)  
**Type:** List page with pagination

**Content:**
- Page title
- Blog post cards:
  - Featured image
  - Title
  - Excerpt
  - Author
  - Published date
  - Read more link
- Pagination (if needed)
- Category filtering (future enhancement)

**Data Needed:**
- `posts` collection (published only)
- Author info from `directus_users`
- Featured images from `directus_files`

**Design File:** `docs/reference/site-files/blog.html`

**Required Blocks:**
- `block_hero` - Blog page hero
- Blog listing component (custom)

---

### 5. Blog Post (`/blog/[slug]`)

**Route:** `app/blog/[slug]/page.tsx`  
**Status:** ❌ Not implemented  
**Type:** Dynamic detail page

**Content:**
- Post title
- Featured image
- Author info
- Published date
- Article content (rich text)
- Related posts (optional)
- Social sharing (optional)

**Data Needed:**
- Single `post` by slug
- Author from `directus_users`
- Featured image from `directus_files`

**Design File:** None (use blog.html as reference)

**Required Blocks:**
- Blog post is custom component, not block-based

---

### 6. Our Work (`/our-work`)

**Route:** `app/our-work/page.tsx`  
**Status:** ❌ Not implemented  
**Type:** Portfolio/Gallery page

**Content:**
- Page title and description
- Gallery grid of before/after images
- Case studies (optional)
- Filter by treatment type (optional)

**Data Needed:**
- New collection: `portfolio_items` or `case_studies`
  - Title
  - Before image
  - After image
  - Treatment type
  - Description
  - Date

**Design File:** `docs/reference/site-files/our-work.html`

**Required Blocks:**
- `block_hero` - Our Work page hero
- `block_gallery` - Image gallery (may need to create)
- Portfolio listing component (custom)

---

### 7. Promotions (`/promotions`)

**Route:** `app/promotions/page.tsx`  
**Status:** ❌ Not implemented  
**Type:** List page

**Content:**
- Page title
- Active promotions carousel/cards:
  - Promotion image
  - Title
  - Description
  - Valid dates
  - CTA button
- Expired promotions (optional, collapsed)

**Data Needed:**
- New collection: `promotions`
  - Title
  - Description
  - Image
  - Valid from (date)
  - Valid until (date)
  - CTA text
  - CTA link
  - Status (active/expired)

**Design File:** `docs/reference/site-files/promotions.html`

**Required Blocks:**
- `block_hero` - Promotions page hero
- `block_promotions` - Promotions carousel (may need to create)
- Promotions listing component (custom)

---

### 8. Contact (`/contact`)

**Route:** `app/contact/page.tsx`  
**Status:** ❌ Not implemented  
**Type:** Static page with form

**Content:**
- Page title
- Contact information:
  - Address
  - Phone
  - Email
  - Hours
- Contact form:
  - Name
  - Email
  - Phone
  - Message
  - Submit button
- Map embed (optional)

**Data Needed:**
- Page content from `pages` collection
- `block_contact` - Contact information block
- `block_locations` - Location details
- Form submissions to `form_submissions` (already exists)

**Design File:** `docs/reference/site-files/contact-page.html`

**Required Blocks:**
- `block_hero` - Contact page hero
- `block_contact` - Contact information
- `block_locations` - Location details with map
- Contact form component (custom, uses `forms` collection)

---

## 🧭 Navigation Structure

### Main Navigation

```
Home
Services
  ├── [Service Category 1]
  ├── [Service Category 2]
  └── [Service Category 3]
Blog
Our Work
Promotions
Contact
```

### Footer Navigation

```
Company
  ├── About Us
  ├── Our Team
  └── Locations

Services
  ├── [All Services Link]
  └── [Service Categories]

Resources
  ├── Blog
  ├── Promotions
  └── Our Work

Legal
  ├── Privacy Policy
  ├── Terms of Service
  └── Cookie Policy
```

**Implementation:**
- Managed via `navigation` collection
- Supports nested items (parent/children)
- Can link to pages or external URLs

---

## 🧩 Content Blocks Required

### Existing Blocks (✅ Implemented)

1. `block_hero` - Hero section with headline, CTA buttons
2. `block_features` - Features section
3. `block_testimonials` - Testimonials section
4. `block_pricing` - Pricing plans
5. `block_footer` - Footer content
6. `block_about_us` - About us section
7. `block_why_choose_us` - Why choose us points
8. `block_team` - Team members
9. `block_signature_treatment` - Treatment process/steps
10. `block_safety_banner` - Safety information banner
11. `block_services` - Services listing
12. `block_locations` - Location information
13. `block_booking` - Booking/contact CTA
14. `block_contact` - Contact information

### Blocks That May Need Creation

1. `block_gallery` - Image gallery (for Our Work page)
2. `block_promotions` - Promotions carousel (may exist as component)
3. `block_rich_text` - Simple rich text content (already exists)

---

## 💾 Data Collections Needed

### ✅ Existing Collections

- `pages` - All website pages
- `page_blocks` - Junction for page blocks (M2A)
- `services` - Service offerings
- `service_categories` - Service categories
- `posts` - Blog posts
- `global_settings` - Site-wide settings
- `navigation` - Navigation items
- `forms` - Form definitions
- `form_fields` - Form field definitions
- `form_submissions` - Form submissions

### ❌ Collections to Create

1. **`promotions`**
   - Fields:
     - `id` (uuid)
     - `title` (string, required)
     - `slug` (string, required, unique)
     - `description` (text)
     - `image` (uuid → directus_files)
     - `valid_from` (date)
     - `valid_until` (date)
     - `cta_text` (string)
     - `cta_link` (string)
     - `status` (string: draft/published/expired)
     - System fields (user_created, date_created, etc.)

2. **`portfolio_items`** or **`case_studies`**
   - Fields:
     - `id` (uuid)
     - `title` (string, required)
     - `slug` (string, required, unique)
     - `description` (text)
     - `before_image` (uuid → directus_files)
     - `after_image` (uuid → directus_files)
     - `treatment_type` (string or relation to services)
     - `date` (date)
     - `status` (string: draft/published)
     - System fields

3. **`blog_categories`** (optional, for future)
   - Fields:
     - `id` (uuid)
     - `name` (string, required)
     - `slug` (string, required, unique)
     - `description` (text)

---

## 🎯 Implementation Priority

### Phase 1: Foundation (Current)
- [x] Homepage structure
- [x] Services index & detail
- [x] Basic navigation
- [ ] Fix schema issues (relations, types)

### Phase 2: Core Content (Next)
1. **Blog System**
   - [ ] Blog index page (`/blog`)
   - [ ] Blog post detail (`/blog/[slug]`)
   - [ ] Connect to `posts` collection
   - [ ] Author display

2. **Contact Page**
   - [ ] Contact page (`/contact`)
   - [ ] Contact form integration
   - [ ] Location blocks
   - [ ] Map embed

### Phase 3: Marketing Pages
3. **Promotions**
   - [ ] Create `promotions` collection
   - [ ] Promotions page (`/promotions`)
   - [ ] Promotions carousel component
   - [ ] Date-based filtering

4. **Our Work**
   - [ ] Create `portfolio_items` collection
   - [ ] Our Work page (`/our-work`)
   - [ ] Gallery component
   - [ ] Before/after display

### Phase 4: Enhancements
5. **Additional Features**
   - [ ] Blog categories
   - [ ] Related posts
   - [ ] Search functionality
   - [ ] Advanced filtering

---

## 🎨 Design Import Order

Based on reference HTML files, import in this order:

### Step 1: Core Pages
1. **Homepage** (`index.html`)
   - Most complex, establishes design system
   - Contains multiple block types
   - Sets visual language

### Step 2: Service Pages
2. **Service Index** (`service-index.html`)
   - Service listing layout
   - Category filtering UI

3. **Service Detail** (`service-detail.html`)
   - Service detail layout
   - Image handling
   - CTA patterns

### Step 3: Content Pages
4. **Blog** (`blog.html`)
   - Blog listing layout
   - Card design patterns

5. **Contact** (`contact-page.html`)
   - Form layout
   - Contact info display
   - Map integration

### Step 4: Marketing Pages
6. **Promotions** (`promotions.html`)
   - Promotions carousel
   - Card layouts

7. **Our Work** (`our-work.html`)
   - Gallery layout
   - Image grid patterns

---

## 📝 Notes & Considerations

### Schema Fixes Required Before Import

1. **Fix Relations:**
   - `services.category` → `service_categories`
   - `services.hero_image` → `directus_files`
   - `global_settings.logo` → `directus_files`
   - `global_settings.favicon` → `directus_files`

2. **Type Consistency:**
   - Resolve `services.category` type mismatch (uuid vs integer)
   - Standardize primary keys across collections

3. **New Collections:**
   - Create `promotions` collection
   - Create `portfolio_items` collection
   - Set up proper relations

### Design Import Strategy

1. **One page at a time:**
   - Import design
   - Create/update components
   - Connect to CMS
   - Test thoroughly
   - Move to next page

2. **Component Reusability:**
   - Extract common patterns
   - Build reusable components
   - Maintain design consistency

3. **Responsive Design:**
   - Ensure all designs work on mobile
   - Test breakpoints
   - Optimize images

---

## ✅ Checklist Before Starting

### Schema & Data
- [ ] Fix all broken relations
- [ ] Resolve type mismatches
- [ ] Create missing collections (`promotions`, `portfolio_items`)
- [ ] Apply UI configurations to all collections
- [ ] Verify all system fields are present

### Routes & Pages
- [ ] Create all route folders
- [ ] Set up basic page structure
- [ ] Implement data fetching functions
- [ ] Add error handling

### Design Import
- [ ] Review all HTML reference files
- [ ] Identify component patterns
- [ ] Plan component structure
- [ ] Set up Tailwind utilities

---

## 🚀 Next Steps

1. **Fix Schema Issues** (from SCHEMA_ISSUES.md)
2. **Create Missing Collections** (`promotions`, `portfolio_items`)
3. **Set Up All Routes** (create page files, even if empty)
4. **Import Homepage Design** (start with index.html)
5. **Work Through Pages One by One**

---

**Status:** Ready for implementation once schema is fixed.

