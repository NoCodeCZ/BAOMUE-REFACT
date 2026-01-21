# Research: Official Directus Templates

## Template Types
1. **Simple CMS Template** - Basic content management
2. **E-commerce Template** - Product catalog and orders
3. **Blog Template** - Article and post management
4. **SaaS Template** - Multi-tenant applications

## Simple CMS Template Structure

### Core Collections
- `pages` - Static pages with page builder blocks
- `posts` - Blog posts/articles (optional)
- `categories` - Content categorization
- `navigation` - Site navigation structure
- `navigation_items` - Individual menu items
- `global_settings` - Site-wide settings (singleton)
- `forms` - Form definitions
- `form_submissions` - Form submission data

### Block System
The Simple CMS template recommends **5-10 core blocks**:

1. **block_hero** - Hero section with title, description, image, CTA
2. **block_text** - Rich text content block
3. **block_gallery** - Image gallery with captions
4. **block_form** - Embedded form block
5. **block_contact** - Contact information block

Optional blocks:
- `block_features` - Feature list/grid
- `block_testimonials` - Customer testimonials
- `block_pricing` - Pricing tables
- `block_cta` - Call-to-action section

### Navigation Structure
- Hierarchical menu system
- Support for nested items
- External and internal links
- Icon support

### Settings
- Global settings singleton collection
- Site name, logo, contact info
- SEO defaults
- Social media links

### Forms
- Form builder with field definitions
- Form submissions collection
- Support for multiple form types
- Email notifications (via flows)

## Comparison with Current Schema

### Current Schema Analysis
From `docs/snapshot.json`:
- **50+ collections** total
- **20+ block types** (block_hero, block_features, block_testimonials, block_pricing, block_button, block_button_group, block_form, block_gallery, block_posts, block_richtext, etc.)
- **M2A pattern** via `page_blocks` junction collection
- **Block-based page builder** with flexible composition

### Block Collections Found
Current blocks in schema:
- `block_button` - Individual button
- `block_button_group` - Group of buttons
- `block_form` - Form block
- `block_gallery` - Gallery block
- `block_gallery_items` - Gallery item details
- `block_hero` - Hero section
- `block_posts` - Blog posts display
- `block_pricing` - Pricing section
- `block_pricing_cards` - Pricing card details
- `block_richtext` - Rich text content

### Differences

| Aspect | Current Schema | Simple CMS Template | Recommendation |
|--------|---------------|---------------------|----------------|
| Block Count | 20+ blocks | 5-10 core blocks | Consolidate similar blocks |
| Button Blocks | Separate `block_button` and `block_button_group` | Single button in hero/CTA blocks | Consider merging into parent blocks |
| Gallery Structure | `block_gallery` + `block_gallery_items` | Single `block_gallery` with nested items | Current structure is fine (flexible) |
| Pricing Blocks | `block_pricing` + `block_pricing_cards` | Single `block_pricing` with nested cards | Current structure is fine |
| Rich Text | `block_richtext` | `block_text` | Rename for consistency |
| Posts Block | `block_posts` | Optional, separate posts collection | Keep if blog functionality needed |

### Recommendations

1. **Consolidate Button Blocks**
   - Merge `block_button` functionality into parent blocks (hero, CTA)
   - Or keep `block_button_group` and remove standalone `block_button`

2. **Standardize Naming**
   - Rename `block_richtext` → `block_text` for template alignment
   - Ensure consistent naming patterns

3. **Review Block Necessity**
   - Evaluate if all 20+ blocks are needed
   - Consider if some can be combined (e.g., multiple feature blocks)

4. **Maintain Flexibility**
   - Current M2A pattern via `page_blocks` is excellent
   - Keep flexible block composition
   - Don't over-consolidate if it reduces functionality

5. **Template Alignment**
   - Core blocks (hero, text, gallery, form) should match template
   - Additional blocks are fine for project-specific needs
   - Focus on SDK enhancements first, schema alignment later

## Migration Strategy

### Phase 1: SDK Enhancements (Current Focus)
- Health check functions
- Enhanced error handling
- Write operations (mutations)
- Query caching
- **No schema changes required**

### Phase 2: Schema Alignment (Future)
- Compare block collections
- Consolidate similar blocks
- Rename for consistency
- Update documentation

### Phase 3: Template Adoption (Future)
- Review official template structure
- Adopt best practices
- Optimize block usage
- Performance improvements

## References
- Official Template: https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms
- Current Schema: `docs/snapshot.json`
- Directus Documentation: Available in Archon RAG knowledge base

