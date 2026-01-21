# Feature: Template Adoption Next Steps

**STATUS: ✅ COMPLETED** (2024-12-06)

## Description
Complete the Directus Simple Website CMS template adoption by implementing the remaining alignment tasks: adding form block functionality, evaluating blog collection naming, establishing block patterns documentation, and creating schema decision reference.

## User Story
As a developer, I want the project fully aligned with Directus template best practices so that future development follows consistent patterns and the CMS is feature-complete for content editors.

## Final System State
- ✅ Page builder pattern (M2A via `page_blocks`) implemented
- ✅ 15+ block types implemented with components
- ✅ Forms system exists (`forms`, `form_fields`, `form_submissions`)
- ✅ API route for form submissions (`/api/forms/submit`)
- ✅ `block_form` collection created and added to M2A
- ✅ `FormBlock.tsx` component created
- ✅ Blog naming decision documented (keeping `blog_posts`)
- ✅ Template alignment reference guide created

## Research Summary
From `docs/research/directus-simple-website-cms-template-adoption.md`:
- **Key patterns identified**: M2A page builder, hierarchical navigation, singleton settings
- **Similar implementations**: All block components in `components/blocks/`
- **Constraints**: ISR required, Server Components default, Tailwind only

## Files to Modify/Create

### New Files
- `lib/types.ts` - Add `BlockForm` interface
- `lib/data.ts` - Add form fetching functions
- `components/blocks/FormBlock.tsx` - Form block component
- `reference/13_template_alignment.md` - Template alignment guide

### Modified Files
- `lib/types.ts` - Add BlockForm interface, update Schema
- `docs/research/directus-simple-website-cms-template-adoption.md` - Update completion status

## Step-by-Step Tasks

---

### Task 1: Add `block_form` Collection in Directus
**File**: Directus Schema
**Action**: Create new collection using MCP

**Why**: Enable form embedding in page builder blocks. Template pattern requires `block_form` for embedding dynamic forms in pages.

**Proposed Collection Structure**:
```json
{
  "collection": "block_form",
  "meta": {
    "icon": "dynamic_form",
    "note": "Embed a form in page content. Links to the forms collection.",
    "group": "all_blocks",
    "hidden": false
  },
  "fields": [
    {
      "field": "id",
      "type": "integer",
      "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["id"] },
      "schema": { "is_primary_key": true, "has_auto_increment": true }
    },
    {
      "field": "form",
      "type": "integer",
      "meta": {
        "interface": "select-dropdown-m2o",
        "display": "related-values",
        "display_options": { "template": "{{name}}" },
        "note": "Select which form to embed"
      }
    },
    {
      "field": "title",
      "type": "string",
      "meta": { "interface": "input", "width": "full", "note": "Optional title above the form" }
    },
    {
      "field": "description",
      "type": "text",
      "meta": { "interface": "input-multiline", "width": "full", "note": "Optional description text" }
    },
    {
      "field": "background_style",
      "type": "string",
      "meta": {
        "interface": "select-dropdown",
        "options": { "choices": [{"text": "White", "value": "white"}, {"text": "Light Gray", "value": "gray"}, {"text": "Primary", "value": "primary"}] },
        "width": "half"
      },
      "schema": { "default_value": "white" }
    }
  ]
}
```

**Validation**: `mcp_website-builder-directus_schema({ keys: ["block_form"] })`
**Test**: Collection appears in Directus Admin under all_blocks folder

---

### Task 2: Add `BlockForm` TypeScript Interface
**File**: `lib/types.ts`
**Action**: Add interface and register in Schema
**Lines**: After line 303 (after `BlockText`) and update Schema (lines 1-28)

**Current Code** (lines 1-28):
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  block_text: BlockText[];
  // ... rest
}
```

**Proposed Change** (add to Schema interface after line 17):
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_features: BlockFeatures[];
  block_testimonials: BlockTestimonials[];
  block_pricing: BlockPricing[];
  block_footer: BlockFooter[];
  block_about_us: BlockAboutUs[];
  block_why_choose_us: BlockWhyChooseUs[];
  block_team: BlockTeam[];
  block_signature_treatment: BlockSignatureTreatment[];
  block_safety_banner: BlockSafetyBanner[];
  block_services: BlockServices[];
  block_locations: BlockLocations[];
  block_booking: BlockBooking[];
  block_contact: BlockContact[];
  block_text: BlockText[];
  block_form: BlockForm[];  // ADD THIS LINE
  // ... rest
}
```

**Add interface** (after BlockText interface, around line 305):
```typescript
export interface BlockForm {
  id: number;
  form?: number | null; // FK to forms collection
  title?: string;
  description?: string;
  background_style?: 'white' | 'gray' | 'primary';
}

export interface Form {
  id: number;
  name: string;
  slug: string;
  description?: string;
  submit_button_text?: string;
  success_message?: string;
  redirect_url?: string;
  fields?: FormField[];
}

export interface FormField {
  id: number;
  form: number;
  label: string;
  field_type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: Record<string, any>;
  options?: Array<{ label: string; value: string }>;
  sort?: number;
}
```

**Why**: TypeScript types must match Directus collection structure for type safety.

**Validation**: `npx tsc --noEmit`
**Test**: No TypeScript errors, types available for import

---

### Task 3: Add Form Data Fetching Functions
**File**: `lib/data.ts`
**Action**: Add functions to fetch form block and form details
**Lines**: After existing block fetch functions (around line 400)

**Proposed Code** (add after `getTextBlock` function):
```typescript
// Add to imports at top of file
import type { BlockForm, Form, FormField } from './types';

export async function getFormBlock(blockId: number): Promise<BlockForm | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_form', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockForm || null;
  } catch (error) {
    logDirectusError('getFormBlock', error);
    return null;
  }
}

export async function getFormById(formId: number): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { id: { _eq: formId } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form || null;
  } catch (error) {
    logDirectusError('getFormById', error);
    return null;
  }
}

export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form || null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}
```

**Why**: Follow established pattern from other block fetch functions. Include form fields for rendering.

**Validation**: `npx tsc --noEmit`
**Test**: Import functions and verify no errors

---

### Task 4: Create FormBlock Component
**File**: `components/blocks/FormBlock.tsx` (new)
**Action**: Create new component

**Proposed Code**:
```typescript
"use client";

import { useState } from "react";
import type { BlockForm, Form, FormField } from "@/lib/types";

interface FormBlockProps {
  data?: BlockForm | null;
  formData?: Form | null;
}

export default function FormBlock({ data, formData }: FormBlockProps) {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data || !formData) return null;

  const title = data.title ?? "";
  const description = data.description ?? "";
  const bgStyle = data.background_style ?? "white";
  const fields = formData.fields ?? [];
  const submitText = formData.submit_button_text ?? "ส่งข้อมูล";
  const successMessage = formData.success_message ?? "ส่งข้อมูลสำเร็จแล้ว ขอบคุณครับ/ค่ะ";

  const bgClasses = {
    white: "bg-white",
    gray: "bg-slate-50",
    primary: "bg-cyan-50",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "form",
          formId: formData.id,
          data: formState,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setIsSuccess(true);
      setFormState({});

      if (formData.redirect_url) {
        window.location.href = formData.redirect_url;
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <section className={`py-16 px-4 ${bgClasses[bgStyle]}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <svg
              className="w-16 h-16 mx-auto text-green-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-lg text-green-800">{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 px-4 ${bgClasses[bgStyle]}`}>
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-center text-slate-600 mb-8">{description}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields
            .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
            .map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field, formState, handleChange)}
              </div>
            ))}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? "กำลังส่ง..." : submitText}
          </button>
        </form>
      </div>
    </section>
  );
}

function renderField(
  field: FormField,
  formState: Record<string, any>,
  onChange: (field: string, value: any) => void
) {
  const value = formState[field.label] ?? "";
  const baseClass =
    "w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500";

  switch (field.field_type) {
    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={`${baseClass} h-32 resize-none`}
        />
      );

    case "select":
      return (
        <select
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        >
          <option value="">{field.placeholder || "เลือก..."}</option>
          {field.options?.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            required={field.required}
            checked={!!value}
            onChange={(e) => onChange(field.label, e.target.checked)}
            className="w-5 h-5 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
          />
          <span className="text-slate-600">{field.placeholder}</span>
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.label}
                value={opt.value}
                required={field.required}
                checked={value === opt.value}
                onChange={(e) => onChange(field.label, e.target.value)}
                className="w-4 h-4 text-cyan-600 border-slate-300 focus:ring-cyan-500"
              />
              <span className="text-slate-600">{opt.label}</span>
            </label>
          ))}
        </div>
      );

    case "email":
      return (
        <input
          type="email"
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        />
      );

    default:
      return (
        <input
          type="text"
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.label, e.target.value)}
          className={baseClass}
        />
      );
  }
}
```

**Why**: Client component required for form interactivity. Renders dynamic forms from Directus form builder.

**Validation**: `npx tsc --noEmit`
**Test**: Import component, verify no errors

---

### Task 5: Create Relation for `block_form` → `forms`
**File**: Directus Relations
**Action**: Create M2O relationship using MCP

**Proposed Relation**:
```json
{
  "collection": "block_form",
  "field": "form",
  "related_collection": "forms",
  "schema": { "on_delete": "SET NULL" }
}
```

**Validation**: Check schema shows relation
**Test**: In Directus Admin, block_form.form field shows dropdown of forms

---

### Task 6: Add `block_form` to Page Blocks M2A
**File**: Directus Relations (pages.blocks)
**Action**: Update M2A allowed collections

**Why**: Enable editors to add form blocks to pages.

**Current M2A Collections** (from schema):
```
["block_hero", "block_rich_text", "block_gallery", "block_pricing", 
 "block_footer", "block_features", "block_testimonials", "block_about_us",
 "block_why_choose_us", "block_team", "block_signature_treatment", 
 "block_safety_banner", "block_locations", "block_booking", "block_contact"]
```

**Add**: `"block_form"` to the list

**Validation**: Create a test page block with block_form type
**Test**: Form block appears in page builder dropdown

---

### Task 7: Document Blog Collection Naming Decision
**File**: `docs/research/directus-simple-website-cms-template-adoption.md`
**Action**: Add decision documentation
**Lines**: After line 319 (Conclusion section)

**Proposed Addition**:
```markdown
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
```

**Why**: Document architectural decisions for future reference.

**Validation**: Document updated
**Test**: Review content for clarity

---

### Task 8: Create Template Alignment Reference Guide
**File**: `reference/13_template_alignment.md` (new)
**Action**: Create reference guide

**Proposed Content**:
```markdown
# Template Alignment Guide

> Reference for maintaining alignment with Directus Simple Website CMS template patterns.

## Overview

This project is based on the [Directus Simple Website CMS template](https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms) with domain-specific extensions for a dental clinic website.

## Core Pattern: Page Builder

```
pages (collection)
  └── blocks (M2A field)
        └── page_blocks (junction table)
              ├── block_hero
              ├── block_text
              ├── block_gallery
              ├── block_form
              ├── block_contact
              └── [domain-specific blocks]
```

## Template Alignment Status

### Aligned ✅
| Template Component | Our Implementation |
|-------------------|-------------------|
| `pages` collection | ✅ `pages` |
| `navigation` (hierarchical) | ✅ `navigation` |
| `global_settings` (singleton) | ✅ `global_settings` |
| `forms` + `form_fields` + `form_submissions` | ✅ All three |
| M2A page builder | ✅ `page_blocks` |
| `block_hero` | ✅ `block_hero` |
| `block_text` | ✅ `block_text` |
| `block_gallery` | ✅ `block_gallery` |
| `block_form` | ✅ `block_form` |
| `block_contact` | ✅ `block_contact` |

### Extended (Domain-Specific)
These blocks are specific to dental clinic functionality:
- `block_about_us`
- `block_why_choose_us`
- `block_team`
- `block_signature_treatment`
- `block_safety_banner`
- `block_services`
- `block_locations`
- `block_booking`

### Naming Differences
| Template | Our Project | Reason |
|----------|-------------|--------|
| `posts` | `blog_posts` | More descriptive, no impact |

## Adding New Blocks

Follow `reference/01_creating_directus_blocks.md` with these template conventions:

1. **Naming**: `block_[name]` (snake_case)
2. **Folder**: Group under `all_blocks` in Directus
3. **Interface**: `Block[Name]` (PascalCase) in `lib/types.ts`
4. **Component**: `[Name]Block.tsx` in `components/blocks/`
5. **Registration**: Add to Schema interface and M2A allowed collections

## Resources

- **Template Repository**: https://github.com/directus-labs/directus-templates/tree/main/simple-website-cms
- **Research Document**: `docs/research/directus-simple-website-cms-template-adoption.md`
- **Block Creation Guide**: `reference/01_creating_directus_blocks.md`
```

**Why**: Provide ongoing reference for template patterns.

**Validation**: File created and readable
**Test**: Review content for accuracy

---

### Task 9: Update Research Document Status
**File**: `docs/research/directus-simple-website-cms-template-adoption.md`
**Action**: Update Next Steps section
**Lines**: 386-392

**Current Code**:
```markdown
## Next Steps

1. ✅ Research complete - document created
2. Consider adding `block_form` component if form embedding needed
3. Optionally standardize `blog_posts` → `posts` naming
4. Continue using established patterns for new blocks
5. Reference this document for future schema decisions
```

**Proposed Change**:
```markdown
## Next Steps

1. ✅ Research complete - document created
2. ✅ `block_form` collection and component added (Task 1-6)
3. ✅ Blog naming decision documented - keeping `blog_posts` (Task 7)
4. ✅ Template alignment reference guide created (Task 8)
5. ✅ All alignment tasks complete

## Implementation Status

| Task | Status | Date |
|------|--------|------|
| block_form collection | ✅ Complete | |
| block_form component | ✅ Complete | |
| Blog naming decision | ✅ Documented | |
| Reference guide | ✅ Created | |
```

**Why**: Track completion of template adoption tasks.

**Validation**: Document updated
**Test**: Review status table

---

## Directus Setup

### Task 1: Create `block_form` Collection
- Collection name: `block_form`
- Group: `all_blocks` folder
- Fields: `id`, `form` (M2O), `title`, `description`, `background_style`
- Permissions: Public read

### Task 5: Create Relation
- Collection: `block_form`
- Field: `form`
- Related: `forms`
- On Delete: SET NULL

### Task 6: Update M2A
- Collection: `pages`
- Field: `blocks`
- Add `block_form` to allowed collections

## Testing Strategy

- [ ] Task 1: `block_form` collection appears in Directus schema
- [ ] Task 2: TypeScript types compile without errors
- [ ] Task 3: Data functions callable without errors
- [ ] Task 4: FormBlock component renders with test data
- [ ] Task 5: Relation creates working dropdown in Directus
- [ ] Task 6: block_form selectable in page builder
- [ ] Task 7: Decision documented in research doc
- [ ] Task 8: Reference guide created and accurate
- [ ] Task 9: Research doc status updated

### Integration Test
- [ ] Create form in Directus (e.g., "Contact Form")
- [ ] Add form fields (name, email, message)
- [ ] Create `block_form` item linking to form
- [ ] Add block to a page via page_blocks
- [ ] Load page, verify form renders
- [ ] Submit form, verify submission created in Directus

## Validation Commands
```bash
# TypeScript
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build

# Dev server
npm run dev
```

## Acceptance Criteria
- [ ] `block_form` collection exists in Directus
- [ ] `block_form` added to M2A allowed collections
- [ ] `BlockForm` interface in `lib/types.ts`
- [ ] Form fetch functions in `lib/data.ts`
- [ ] `FormBlock.tsx` component created and working
- [ ] Blog naming decision documented
- [ ] `reference/13_template_alignment.md` created
- [ ] Research document status updated
- [ ] All validation commands pass
- [ ] Form embedding works end-to-end

## Context Notes
- **Client Component Required**: FormBlock needs "use client" for interactivity
- **Existing API**: Form submission API at `/api/forms/submit` already works
- **Thai Language**: Success/error messages should be in Thai
- **ISR Not Needed**: Client component handles its own state
- **Forms System Complete**: `forms`, `form_fields`, `form_submissions` already exist

## Project-Specific Requirements
- ✅ ISR: Not applicable (client component)
- ✅ Images: Not used in form block
- ✅ Client Component: Required for form state/submission
- ✅ Tailwind Only: No custom CSS
- ✅ Fallbacks: Handle null form/fields gracefully
- ✅ Type Safety: Match Directus collection structure

## Risk Assessment
- **Low Risk**: Creating new collection (additive)
- **Low Risk**: Creating new component (additive)
- **Low Risk**: Documentation updates
- **Medium Risk**: M2A modification (test thoroughly)

## Execution Order

**Recommended sequence:**

1. **Task 1**: Create `block_form` collection in Directus
2. **Task 2**: Add TypeScript interfaces
3. **Task 3**: Add data fetching functions
4. **Task 4**: Create FormBlock component
5. **Task 5**: Create relation (block_form → forms)
6. **Task 6**: Add to M2A allowed collections
7. **Test**: End-to-end form embedding test
8. **Task 7**: Document blog naming decision
9. **Task 8**: Create reference guide
10. **Task 9**: Update research document status

---

## Ready to Execute

This plan is ready for execution using:
- `mcp_website-builder-directus_collections` - Create block_form collection
- `mcp_website-builder-directus_fields` - Add fields
- `mcp_website-builder-directus_relations` - Create relations
- Code editing tools - TypeScript and component files

**Proceed with**: `/execute template-adoption-next-steps` or individual task execution

