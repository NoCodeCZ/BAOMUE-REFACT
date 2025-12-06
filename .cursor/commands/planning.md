---
description: Create detailed implementation plan for a feature
---

# /planning [feature-name] [research-doc]

Create a detailed, executable implementation plan. This plan should be so clear and specific that "the dumbest model in the world is probably not going to screw this up."

## Arguments
- `feature-name`: Name of the feature (used for plan filename)
- `research-doc`: Optional. Path to research document (e.g., `docs/research/[feature-name].md`). If omitted, will check if research exists and use it if found.

## Steps

### 1. Check for Research Document
// turbo
```bash
# Check if research document exists
if [ -f "docs/research/[feature-name].md" ]; then
  echo "Research document found"
  cat docs/research/[feature-name].md
else
  echo "No research document found. Consider running /research [feature-name] first for complex features."
fi
```

**If research exists**: Read it to understand current system behavior.
**If research doesn't exist**: For simple features, proceed. For complex features, recommend running `/research` first.

### 2. Create Plans Directory (if needed)
// turbo
```bash
mkdir -p plans
```

### 3. Load Reference Guides
Based on the feature type, read the relevant reference guides:

| Feature Type | Read These Guides |
|--------------|-------------------|
| New block | `reference/01_creating_directus_blocks.md` |
| New page | `reference/02_adding_new_pages.md` |
| Data fetching | `reference/03_data_fetching_functions.md` |
| Analytics | `reference/04_analytics_event_tracking.md` |
| HTML conversion | `reference/05_aurabuild_conversion.md` |
| SEO/metadata | `reference/06_seo_metadata.md` |
| Client components | `reference/07_server_client_components.md` |
| TypeScript types | `reference/08_typescript_interfaces.md` |
| Images | `reference/09_image_handling.md` |
| Dynamic routes | `reference/10_dynamic_routes.md` |
| Navigation | `reference/11_navigation_items.md` |
| Error handling | `reference/12_error_loading_states.md` |

Also read project rules:
- `.claude/rules/sections/11_ai_instructions.md` - AI coding guidelines
- `.claude/rules/sections/10_common_patterns.md` - Common patterns
- `.claude/rules/sections/03_architecture.md` - Architecture patterns

### 4. Study Existing Patterns
Read these files to understand current patterns:
- `lib/types.ts` - Existing Block interfaces and Schema registration
- `lib/data.ts` - Existing fetch functions (getPageBySlug, getBlockContent, etc.)
- `app/page.tsx` - Block rendering pattern (findBlock usage)
- Find similar existing components in `components/` (Hero, Features, Testimonials, etc.)

**CRITICAL**: Read 2-3 similar implementations to understand:
- How blocks are structured (if adding new block)
- How data flows (getPageBlocks → getBlockContent pattern)
- How components are organized (Server vs Client)
- What Tailwind patterns are used
- How ISR is configured (`export const revalidate = 60`)

Document what you find in the plan.

### 5. Document Current System Behavior
Based on research document and code exploration, document:
- How the system currently works (if modifying existing)
- What patterns are followed
- What constraints exist

### 6. Create Implementation Plan
Create `plans/[feature-name].md` with this structure:

```markdown
# Feature: [Feature Name]

## Description
[2-3 sentences describing what this feature does]

## User Story
As a [user type], I want to [action] so that [benefit].

## Current System Behavior
[If modifying existing system, document how it currently works]
- [Current behavior 1]
- [Current behavior 2]
- [Patterns currently used]

## Research Summary
[If research document was used, summarize key findings]
- Key patterns identified: [list]
- Similar implementations: [list]
- Constraints: [list]

## Files to Modify/Create

### New Files
- `[path]` - [purpose]

### Modified Files
- `[path]` - [what to change, include line numbers if known]

## Step-by-Step Tasks

### Task 1: [Task Name]
**File**: `[exact path]`
**Action**: [create new / modify existing]
**Lines**: [specific line numbers if modifying, e.g., "lines 45-67"]

**Current Code** (if modifying):
```typescript
// Show actual current code snippet
// Include enough context (3-5 lines before/after)
```

**Proposed Change**:
```typescript
// Show exact code that will replace it
// Include complete function/component if creating new
```

**Why**: [Brief explanation of why this change is needed]

**Validation**: `[command to run]`
**Test**: [How to verify this step works]

### Task 2: [Task Name]
**File**: `[exact path]`
**Action**: [create new / modify existing]

**Code Snippet** (BEFORE):
```typescript
// Current code
```

**Code Snippet** (AFTER):
```typescript
// New code
```

**Why**: [Explanation]

**Validation**: `[command to run]`
**Test**: [Verification method]

### Task 3: [Task Name]
...

## Directus Setup (if applicable)

### For New Blocks:
- Collection name: `block_[name]` (follow naming convention)
- Fields to create: [list with types matching Block interface]
- Permissions: [public read, etc.]
- Register in Schema: Add `block_[name]: Block[Name][]` to Schema interface
- Junction table: Blocks connected via `page_blocks` collection

### For New Pages:
- Collection: `pages` (if new page type)
- Fields: [if adding new fields to pages]
- Route: `app/[route]/page.tsx`

### Collection Config:
- Check `config/COLLECTIONS_TO_CREATE.json` for collection structure
- Check `config/COLLECTIONS_USER_FRIENDLY.json` for UI configs

## Testing Strategy
For each task:
- [ ] Task 1: [How to test]
- [ ] Task 2: [How to test]
- [ ] Integration: [How to test the full feature]

## Validation Commands
```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Acceptance Criteria
- [ ] [Criterion 1 - specific and measurable]
- [ ] [Criterion 2 - specific and measurable]
- [ ] All validation commands pass
- [ ] Feature works in browser
- [ ] No regressions introduced

## Context Notes
[Any important context for the implementer]
- [Note 1: e.g., "Follow existing block pattern from block_hero"]
- [Note 2: e.g., "Must use getFileUrl() for all images"]
- [Note 3: e.g., "Server component only, no client needed"]
- [Note 4: e.g., "Include export const revalidate = 60"]

## Project-Specific Requirements
- ✅ ISR: Include `export const revalidate = 60`
- ✅ Images: Use `getFileUrl(item.image)` helper
- ✅ Server Components: Default to RSC
- ✅ Tailwind Only: No custom CSS
- ✅ Fallbacks: Handle null/empty responses
- ✅ Type Safety: Match Directus collection structure
```

### 7. Ensure Plan Quality
The plan must include:
- ✅ **Exact file paths** (no ambiguity)
- ✅ **Code snippets** showing BEFORE/AFTER (not just descriptions)
- ✅ **Line numbers** for modifications (when known)
- ✅ **Validation commands** for each step
- ✅ **Testing strategy** for verification
- ✅ **Clear rationale** for each change

### 8. Confirm Plan Created
// turbo
```bash
cat plans/[feature-name].md
```

## Return Condition
Return when the plan file is created at `plans/[feature-name].md` and contains:
- All required sections
- Specific, executable tasks with code snippets
- Clear BEFORE/AFTER code examples
- Validation and testing strategies
- Ready for `/review plan [feature-name]` or `/execute [feature-name]`

## Output Format
```
📋 Plan Created: plans/[feature-name].md
📝 Tasks: [count] tasks with code snippets
✅ Quality: Includes BEFORE/AFTER code examples
📝 Ready for: /review plan [feature-name] or /execute [feature-name]
```

## Tips
1. **Include code snippets**: Plans with actual code are 10x more effective
2. **Show context**: Include 3-5 lines before/after when modifying
3. **Be specific**: "Add function at line 45" not "add function somewhere"
4. **Test each step**: Every task needs a validation command
5. **Use research**: If research doc exists, reference its findings
