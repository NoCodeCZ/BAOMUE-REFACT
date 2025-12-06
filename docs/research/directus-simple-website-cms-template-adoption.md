# Research: Directus Simple Website CMS Template Adoption

**Generated**: 2024-12-06
**Scope**: How to apply the official Directus Simple Website CMS template to our existing project
**Complexity**: Medium-High

## System Overview

This research explores how to adopt the official [Directus Simple Website CMS template](https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms) for our Next.js dental clinic website. The template provides a proven schema structure and best practices for content management websites.

**Current State:**
- Next.js 14 + Directus CMS integration is working
- 15+ block types implemented (beyond template's 5-10 core blocks)
- Component-based rendering completed (Phase 3)
- Homepage using block system with 11 active blocks
- TypeScript types aligned with Directus schema

**Template Offers:**
- Standardized schema for website CMS
- Core collections: pages, posts, navigation, forms, global_settings
- 5-10 core block types (hero, text, gallery, form, contact)
- M2A page builder pattern via junction table
- Proven architecture from Directus Labs

## Template Application Methods

### Method 1: CLI Template Application (Fresh Install)

The official method using `directus-template-cli`:

```bash
npx directus-template-cli@latest apply
```

**Interactive Prompts:**
1. Template Source: "From a GitHub repository"
2. Repository URL: `https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms`
3. Directus URL: Your instance URL
4. Admin Token: Static token from Directus user

**⚠️ WARNING**: This method is designed for **fresh Directus instances**. Applying to existing instances may:
- Overwrite existing collections with same names
- Create duplicate data
- Conflict with existing relations

**Recommendation**: NOT suitable for our existing project with established data.

### Method 2: Schema Comparison & Manual Adoption (Recommended)

Compare our schema with template and adopt patterns selectively:

1. **Extract template schema** via CLI to empty instance
2. **Export schema snapshot** from template instance
3. **Compare with our schema** to identify gaps
4. **Adopt beneficial patterns** without disrupting existing data

### Method 3: Hybrid Approach (Best for Our Case)

Since we already have:
- ✅ Working page builder with `page_blocks` M2A junction
- ✅ 15+ block types (more than template's 5-10)
- ✅ Component-based rendering (Phase 3 complete)
- ✅ TypeScript types aligned

We should:
1. **Review template patterns** without applying CLI
2. **Adopt naming conventions** where beneficial
3. **Add missing core features** (forms, global_settings)
4. **Document alignment** for future maintenance

## Template vs Current Schema Comparison

### Core Collections

| Collection | Template | Our Project | Status |
|------------|----------|-------------|--------|
| `pages` | ✅ | ✅ | **Aligned** |
| `posts` | ✅ | ✅ `blog_posts` | Naming difference |
| `navigation` | ✅ | ✅ | **Aligned** |
| `global_settings` | ✅ | ✅ | **Aligned** |
| `forms` | ✅ | ✅ | **Aligned** |
| `form_fields` | ✅ | ✅ | **Aligned** |
| `form_submissions` | ✅ | ✅ | **Aligned** |

### Block Collections

| Template Block | Our Project | Status |
|----------------|-------------|--------|
| `block_hero` | ✅ `block_hero` | **Aligned** |
| `block_text` | ✅ `block_text` | **Aligned** (added Phase 2) |
| `block_gallery` | ✅ `block_gallery` | **Aligned** |
| `block_form` | ⚠️ Not implemented | Need to add |
| `block_contact` | ✅ `block_contact` | **Aligned** |
| `block_features` | ✅ `block_features` | **Aligned** |
| `block_testimonials` | ✅ `block_testimonials` | **Aligned** |
| `block_pricing` | ✅ `block_pricing` | **Aligned** |

### Additional Blocks (Our Project Specific)

These blocks are dental-clinic specific and not in the template:

- `block_about_us` - About section
- `block_why_choose_us` - USP section
- `block_team` - Team/dentist profiles
- `block_signature_treatment` - Treatment showcase
- `block_safety_banner` - Safety protocols
- `block_services` - Services grid
- `block_locations` - Branch locations
- `block_booking` - Booking CTA

**Assessment**: Having more blocks than template is fine - they're domain-specific.

### Page Builder Pattern

| Aspect | Template | Our Project | Status |
|--------|----------|-------------|--------|
| Junction table | `page_blocks` | `page_blocks` | **Aligned** |
| Relationship type | M2A | M2A | **Aligned** |
| Sort field | `sort` | `sort` | **Aligned** |
| Collection field | `collection` | `collection` | **Aligned** |

## Schema Details from Template

### Pages Collection (Template)

```json
{
  "collection": "pages",
  "fields": [
    "id", "title", "slug", "status",
    "blocks" // M2A relationship to page_blocks
  ]
}
```

**Our pages collection has additional fields:**
- `site_name`, `nav_links` - Legacy page-level settings
- `hero_*`, `features_*`, etc. - Legacy inline fields
- `blocks` - M2A relationship ✅

### Navigation Collection (Template)

```json
{
  "collection": "navigation",
  "fields": [
    "id", "title", "url", "page", "parent", 
    "target", "sort", "children"
  ]
}
```

**Our navigation matches** with hierarchical structure support.

### Posts Collection (Template)

The template uses `posts` while we use `blog_posts`. Fields are similar:
- status, title, slug, content, excerpt
- featured_image, author, published_date
- seo_title, seo_description

## Recommended Actions

### Priority 1: Schema Alignment (Low Effort)

1. **Consider renaming** `blog_posts` → `posts` for template alignment
   - Update TypeScript types
   - Update data fetching functions
   - Update components
   - **Risk**: Breaking change, requires migration

2. **Add `block_form`** if form embedding is needed
   - Create collection following template pattern
   - Add to M2A allowed collections
   - Create component

### Priority 2: Feature Adoption (Medium Effort)

1. **Review form submission flow**
   - Template may have specific patterns for form handling
   - Compare with our `form_submissions` implementation

2. **Review global_settings usage**
   - Ensure singleton pattern matches template
   - Add any missing global fields

### Priority 3: Optional Cleanup (Low Priority)

1. **Remove legacy page fields**
   - `hero_*`, `features_*`, etc. on pages collection
   - These are replaced by block system
   - Keep for backward compatibility if old pages use them

2. **Consolidate duplicate block types**
   - `block_rich_text` vs `block_text` → Standardize on `block_text`

## Current Schema Status (Directus Instance)

Based on schema query, we have:

**Collections (58 total):**
- Content: `pages`, `posts`, `blog_posts`, `services`, `service_categories`
- Blocks: 17 block collections
- Forms: `forms`, `form_fields`, `form_submissions`
- Navigation: `navigation`
- Settings: `global_settings`
- System: `directus_*` collections

**Collection Folders:**
- `all_blocks` - Block collections
- `Blog` - Blog-related
- `Services` - Service-related
- `website` - Website content
- `Page Items` / `page_items` - Page content items

## Implementation Recommendations

### Do NOT Apply Template CLI

❌ **Don't run**: `npx directus-template-cli@latest apply`

**Reasons:**
1. We have existing data that could be overwritten
2. Our schema is already more feature-rich
3. Risk of conflicts with M2A relationships
4. No rollback mechanism

### Instead, Adopt Template Patterns Selectively

✅ **Recommended Actions:**

1. **Document schema alignment** (this research)
2. **Add missing core blocks** if needed (`block_form`)
3. **Standardize naming** where beneficial
4. **Keep domain-specific blocks** (dental clinic features)
5. **Follow template conventions** for new additions

### Future: Reference Implementation

If starting a new project, use template as reference:

```bash
# Extract template to review structure
npx directus-template-cli@latest apply \
  --template-url "https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms" \
  --directus-url "http://localhost:8056" \
  --admin-token "test-token"
```

Then export schema snapshot for reference:
```bash
# From Directus API
GET /schema/snapshot
```

## Template Structure Reference

Based on template repository and web search:

### Template Core Components

1. **Pages with Block Builder**
   - M2A relationship via `page_blocks`
   - Sortable blocks
   - Multiple block types per page

2. **Navigation System**
   - Hierarchical menu support
   - Internal (page) and external (url) links
   - Parent-child relationships

3. **Forms System**
   - Form definitions collection
   - Field definitions collection
   - Submissions collection
   - (Flows for email notifications)

4. **Global Settings**
   - Singleton collection
   - Site-wide configuration
   - SEO defaults

### Template Block Types

Core blocks recommended by template:
1. `block_hero` - Hero section
2. `block_text` / `block_rich_text` - Text content
3. `block_gallery` - Image gallery
4. `block_form` - Form embedding
5. `block_contact` - Contact info

Optional blocks:
- `block_features` - Feature list
- `block_testimonials` - Testimonials
- `block_pricing` - Pricing tables
- `block_cta` - Call-to-action

## Conclusion

**Our project is already well-aligned with the Simple Website CMS template:**

✅ **Aligned:**
- Page builder pattern (M2A via page_blocks)
- Core block types (hero, text, gallery, contact)
- Navigation structure
- Forms system
- Global settings

⚠️ **Minor Gaps:**
- `block_form` not implemented (can add if needed)
- `blog_posts` naming vs `posts`
- Legacy page fields still present

❌ **No Action Needed:**
- CLI template application (would cause conflicts)
- Major schema restructuring
- Block consolidation (domain-specific blocks are valuable)

**Recommendation**: Consider this project as **template-compatible** with domain-specific extensions. Document the alignment for maintenance and continue building on the established patterns.

## Decision Log

### Blog Collection Naming: Keep `blog_posts`

**Decision**: Keep `blog_posts` instead of renaming to template's `posts`

**Rationale**:
1. **Breaking Change Risk**: Renaming requires updating:
   - TypeScript interfaces (`BlogPost`)
   - All data fetching functions (`getBlogPosts`, `getBlogPostBySlug`, `getFeaturedBlogPost`)
   - All components using blog data
   - Directus collection and relations
   
2. **No Functional Impact**: The name difference doesn't affect functionality
   
3. **Semantic Clarity**: `blog_posts` is more descriptive than generic `posts`
   
4. **Template Has Both**: Directus schema shows both `posts` and `blog_posts` exist - this is fine

**Alternative Considered**: Rename to `posts` for strict template alignment
- Rejected due to effort vs. benefit ratio
- Would require migration script and testing

**Status**: ✅ Decided - Keep `blog_posts`

## Resources

- **Template Repository**: https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms
- **Template CLI**: https://github.com/directus-labs/directus-template-cli
- **Directus Docs**: https://docs.directus.io
- **Our Research**: `docs/research/directus-templates.md`

## Code Snippets (Template Patterns)

### Pattern: Page with Blocks (Already Implemented)

```typescript
// From app/page.tsx - Already using template pattern
const page = await getPageBySlug("home");
const pageBlocks = await getPageBlocks(page.id);
const blocksWithContent = await Promise.all(
  pageBlocks.map(async (block) => ({
    ...block,
    content: await getBlockContent(block.collection, block.item),
  }))
);
```

### Pattern: Navigation with Hierarchy (Already Implemented)

```typescript
// From lib/data.ts
export async function getNavigation(): Promise<NavigationItem[]> {
  const items = await directus.request(
    readItems('navigation', {
      filter: { parent: { _null: true } },
      fields: ['*', 'children.*'],
      sort: ['sort'],
    })
  );
  return items || [];
}
```

### Pattern: Block Form (To Be Added If Needed)

```typescript
// Template pattern for form block
interface BlockForm {
  id: number;
  form: number; // FK to forms collection
  title?: string;
  description?: string;
  success_message?: string;
}

// Component would render form fields from forms collection
export default function FormBlock({ data }: { data?: BlockForm }) {
  // Fetch form fields and render dynamic form
}
```

## Questions Resolved

- [x] Should we apply the template CLI? → **No**, risk of conflicts
- [x] Are we aligned with template? → **Yes**, mostly aligned
- [x] What's missing? → `block_form`, minor naming differences
- [x] What to do next? → Document alignment, add `block_form` if needed
- [x] Keep domain blocks? → **Yes**, they're valuable for dental clinic

## Next Steps

1. ✅ Research complete - document created
2. ✅ `block_form` collection and component added
3. ✅ Blog naming decision documented - keeping `blog_posts`
4. ✅ Template alignment reference guide created (`reference/13_template_alignment.md`)
5. ✅ All alignment tasks complete

## Implementation Status

| Task | Status | Date |
|------|--------|------|
| block_form collection | ✅ Complete | 2024-12-06 |
| block_form component | ✅ Complete | 2024-12-06 |
| Blog naming decision | ✅ Documented | 2024-12-06 |
| Reference guide | ✅ Created | 2024-12-06 |

