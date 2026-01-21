# Research: System Improvements

**Generated**: 2024-12-07
**Scope**: Comprehensive analysis of system architecture, performance, type safety, and scalability improvements
**Complexity**: High

## System Overview

The เบามือ website is a Next.js 14 + Directus CMS dental clinic website with a block-based page builder architecture. The system follows core principles (Server Components, ISR, graceful degradation) but has several areas for improvement in architecture patterns, data fetching efficiency, type safety, and scalability compared to industry-standard templates like agency-os.

**Current State:**
- ✅ Block-based architecture functional (12 block types)
- ✅ Server Components with ISR (60s revalidate)
- ✅ TypeScript types defined
- ⚠️ Manual block rendering pattern (findBlock)
- ⚠️ Multiple data fetching round trips (N+1 queries)
- ⚠️ Type safety gaps (uses `any` in critical places)
- ⚠️ No dynamic page routing
- ⚠️ Limited scalability for new blocks

## Relevant Files & Their Roles

### Data Layer
- `lib/types.ts` (lines 1-409) - TypeScript Schema interface, 16 block types, all collection interfaces
- `lib/data.ts` (lines 1-641) - 30+ data fetching functions using `readItems`/`readSingleton` pattern
- `lib/directus.ts` (lines 1-60) - Directus client setup with `getFileUrl()` helper, static token auth
- `lib/mutations.ts` (lines 1-110) - Write operations (form submissions, updates, deletes)
- `lib/errors.ts` (lines 1-64) - Centralized error handling with type guards

### Component Layer
- `components/blocks/` - 12 block components (HeroBlock, TextBlock, AboutUsBlock, etc.)
- `components/Header.tsx` - Server component fetching navigation
- `components/HeaderClient.tsx` - Client component for mobile menu
- `components/Footer.tsx` - Footer component (exists but not used on homepage)

### Page Layer
- `app/page.tsx` (lines 1-73) - Homepage with manual `findBlock()` pattern, 3 separate queries
- `app/services/page.tsx` - Services listing (custom logic, not block-based)
- `app/services/[slug]/page.tsx` - Service detail page
- `app/blog/page.tsx` - Blog listing (UI shell)
- `app/layout.tsx` - Root layout with metadata, ISR configured

### API Layer
- `app/api/revalidate/route.ts` - On-demand ISR webhook (exists ✅)
- `app/api/forms/submit/route.ts` - Form submission endpoint

## Current Data Flow

### Block-Based Page Rendering (Homepage)
**Current Pattern (3+ Round Trips):**
1. `getPageBySlug("home")` → Returns Page object (1 query)
2. `getPageBlocks(page.id)` → Returns PageBlock[] junction records (1 query)
3. `Promise.all(pageBlocks.map(block => getBlockContent(block.collection, block.item)))` → N queries (one per block)
4. Blocks stored in `blocksWithContent: any[]` array
5. Blocks extracted using `findBlock(collection)` helper (manual pattern)
6. Blocks rendered inline with conditional checks: `{hero && <HeroBlock data={hero} />}`

**Performance Impact:**
- Homepage with 12 blocks = 1 + 1 + 12 = **14 database queries**
- Average query time: ~50-100ms
- Total time: **700-1400ms** for data fetching alone

**Issues:**
- N+1 query problem (one query per block)
- No field optimization (fetches `fields: ['*']`)
- Sequential block content fetching
- Type safety lost (`any[]`, `as any`)

### Services Pages (Custom Logic)
**Current Pattern:**
1. `Promise.all([getServiceCategories(), getServices()])` → 2 parallel queries ✅
2. Client-side grouping and filtering
3. Custom rendering (not block-based)

**Status:** Efficient for this use case, but inconsistent with block-based pattern

## Key Patterns & Conventions

### TypeScript Patterns
- **Block Interfaces**: `Block[Name]` in `lib/types.ts` ✅
- **Schema Registration**: All blocks in `Schema` interface ✅
- **Type Safety Issues**: 
  - Uses `any` in `lib/data.ts` (lines 6-7, 80, 451, 463, 524)
  - Uses `any[]` in `app/page.tsx` (line 26)
  - Uses `as any` for block content (line 39)
  - No union types for `BlockType` or `Block`
- **Optional Fields**: Use `?` for optional properties ✅

### Component Patterns
- **Server Components**: Default pattern (no "use client") ✅
- **Client Components**: Only for interactivity (HeaderClient, FormBlock) ✅
- **ISR**: `export const revalidate = 60` in all pages ✅
- **Fallbacks**: Handle null/empty with sensible defaults ✅
- **Images**: Always use `getFileUrl()` helper ✅
- **Component Naming**: Mixed (`HeroBlock` vs should be `BlocksHero` for consistency)

### Data Fetching Patterns
- **Page Fetching**: `getPageBySlug(slug)` → Single query ✅
- **Block Fetching**: `getPageBlocks(pageId)` → Single query ✅
- **Content Fetching**: `getBlockContent(collection, itemId)` → N queries ❌
- **Error Handling**: Try/catch with null returns, `logDirectusError()` ✅
- **Field Selection**: Uses `fields: ['*']` (no optimization) ❌

### Block Architecture Patterns
- **Block Collections**: `block_[name]` naming convention ✅
- **Junction Table**: `page_blocks` M2A relationship ✅
- **Block Rendering**: Manual `findBlock()` + inline conditional rendering ❌
- **Block Registration**: All in Schema interface ✅
- **Component Mapping**: No dynamic component map (manual imports) ❌

## Dependencies & Integration Points

### Directus Collections
- **Core**: `pages`, `page_blocks`, `global_settings`, `navigation`
- **Blocks** (16 types): `block_hero`, `block_text`, `block_about_us`, `block_why_choose_us`, `block_team`, `block_signature_treatment`, `block_safety_banner`, `block_services`, `block_locations`, `block_booking`, `block_contact`, `block_form`, `block_footer`, `block_features`, `block_testimonials`, `block_pricing`
- **Content**: `services`, `service_categories`, `blog_posts`, `blog_categories`
- **Forms**: `forms`, `form_fields`, `form_submissions`

### External Dependencies
- **Next.js 14.2.18**: App Router, Server Components, ISR
- **@directus/sdk 16.0.0**: REST client with static token
- **TypeScript 5.6.2**: Type safety (partially utilized)
- **Tailwind CSS 3.4.11**: Styling (exclusive)

## Known Constraints

### Performance Constraints
- **N+1 Queries**: Block content fetched individually (12+ queries per page)
- **No Query Optimization**: Uses `fields: ['*']` instead of specific fields
- **No Caching Layer**: Each request hits Directus directly
- **Sequential Block Fetching**: `Promise.all` helps but still N queries

### Type Safety Constraints
- **Dynamic Collections**: Block collections require `as any` casting
- **No Union Types**: `BlockType` and `Block` union types not defined
- **Weak Type Guards**: No runtime type checking for blocks
- **Type Loss**: `findBlock()` returns `any`, loses type information

### Scalability Constraints
- **Manual Block Rendering**: Adding new blocks requires code changes in pages
- **No Dynamic Routing**: Only homepage uses blocks, no `[...slug]` catch-all
- **Component Registration**: Must manually import and conditionally render each block
- **No Block Container**: No reusable wrapper for consistent styling

### Architecture Constraints
- **Inconsistent Patterns**: Homepage uses blocks, services pages use custom logic
- **No PageBuilder Component**: Blocks rendered inline instead of dynamic component
- **Mixed Naming**: `HeroBlock` vs should be `BlocksHero` for consistency
- **Limited Reusability**: Block rendering logic duplicated per page

## Similar Implementations

### Example 1: agency-os Template (Best Practice)
- **Files**: `components/PageBuilder.vue`, `pages/[...permalink].vue`
- **Pattern**: Dynamic component mapping with single nested query
- **Key Features**:
  - `componentMap: Record<BlockType, Component>` for dynamic rendering
  - Single query with nested block fields: `fields: [{ blocks: [{ item: { block_hero: [...] } }] }]`
  - Union types: `type BlockType = 'block_hero' | 'block_faqs' | ...`
  - `PageBuilder` component handles all blocks automatically
- **Performance**: 1 query vs 14 queries (14x faster)
- **Scalability**: Add block = add to componentMap, done

### Example 2: Current Homepage Pattern
- **Files**: `app/page.tsx` (lines 23-73)
- **Pattern**: Manual `findBlock()` + conditional rendering
- **Issues**:
  - 3+ separate queries
  - Manual block extraction (12 `findBlock()` calls)
  - Inline conditional rendering (12 `{block && <Block />}` checks)
  - Type safety lost (`any[]`, `as any`)

### Example 3: Services Pages (Custom Logic)
- **Files**: `app/services/page.tsx`
- **Pattern**: Direct data fetching, custom rendering
- **Status**: Efficient for this use case, but inconsistent with block pattern

## Code Snippets (Key Patterns)

### Pattern: Current Block Data Fetching (Inefficient)
```typescript
// From app/page.tsx (lines 23-36)
const page = await getPageBySlug("home");
const pageBlocks = await getPageBlocks(page.id);
const blocksWithContent = await Promise.all(
  pageBlocks.map(async (block: any) => ({
    ...block,
    content: await getBlockContent(block.collection, block.item),
  }))
);
// Result: 1 + 1 + N queries (N = number of blocks)
```

### Pattern: Current Block Rendering (Manual)
```typescript
// From app/page.tsx (lines 38-52)
const findBlock = (collection: string) =>
  blocksWithContent.find((b) => b.collection === collection)?.content as any;

const hero = findBlock("block_hero");
const text = findBlock("block_text");
// ... 10 more findBlock calls

{hero && <HeroBlock data={hero} />}
{text && <TextBlock data={text} />}
// ... 10 more conditional renders
```

### Pattern: Type Safety Issues
```typescript
// From lib/data.ts (lines 6-7)
const readItemsTyped = readItems as any;
const readSingletonTyped = readSingleton as any;

// From app/page.tsx (line 26)
let blocksWithContent: any[] = [];

// From app/page.tsx (line 39)
blocksWithContent.find((b) => b.collection === collection)?.content as any;
```

### Pattern: Optimized Data Fetching (Target)
```typescript
// Target pattern (single nested query)
const page = await directus.request(
  readItems('pages', {
    filter: { slug: { _eq: 'home' }, status: { _eq: 'published' } },
    fields: [
      '*',
      {
        blocks: [
          'id', 'collection', 'item', 'sort', 'hide_block',
          {
            item: {
              block_hero: ['id', 'badge_text', 'headline_line1', ...],
              block_text: ['id', 'title', 'content', ...],
              // All blocks nested in single query
            }
          }
        ]
      }
    ],
    limit: 1,
  })
);
// Result: 1 query total
```

### Pattern: Dynamic Block Rendering (Target)
```typescript
// Target pattern (PageBuilder component)
const componentMap: Record<BlockType, ComponentType<any>> = {
  block_hero: HeroBlock,
  block_text: TextBlock,
  // ... all blocks
};

export default function PageBuilder({ blocks }: { blocks: PageBlock[] }) {
  return (
    <>
      {blocks
        .filter(block => !block.hide_block)
        .map(block => {
          const Component = componentMap[block.collection];
          return Component ? <Component key={block.id} data={block.content} /> : null;
        })}
    </>
  );
}
```

## Improvement Areas Identified

### 1. Data Fetching Efficiency (Critical)
**Current**: 14 queries per homepage load
**Target**: 1 nested query
**Impact**: 14x performance improvement
**Effort**: Medium (requires query restructuring)

**Implementation:**
- Create `getPageWithBlocks(slug)` function
- Use nested field selection in Directus query
- Fetch all block content in single query
- Maintain backward compatibility

### 2. Type Safety (High Priority)
**Current**: Uses `any` in 24+ places
**Target**: Full type safety with union types
**Impact**: Better IDE support, compile-time error detection
**Effort**: Low-Medium (add union types, remove `any`)

**Implementation:**
- Create `BlockType` union type
- Create `Block` union type
- Update `PageBlock` interface with typed `collection`
- Remove `as any` casts where possible
- Add type guards for runtime safety

### 3. Block Rendering Architecture (High Priority)
**Current**: Manual `findBlock()` + inline rendering
**Target**: Dynamic `PageBuilder` component
**Impact**: Scalability, maintainability, consistency
**Effort**: Low (create component, refactor homepage)

**Implementation:**
- Create `components/PageBuilder.tsx`
- Create `componentMap` with all blocks
- Refactor `app/page.tsx` to use PageBuilder
- Future pages can use PageBuilder immediately

### 4. Dynamic Page Routing (Medium Priority)
**Current**: Only homepage uses blocks
**Target**: `app/[...slug]/page.tsx` for all CMS pages
**Impact**: Content managers can create pages without code changes
**Effort**: Medium (create catch-all route, handle 404s)

**Implementation:**
- Create `app/[...slug]/page.tsx`
- Use `getPageBySlug()` with slug from params
- Render using PageBuilder
- Handle 404 for non-existent pages

### 5. Component Naming Consistency (Low Priority)
**Current**: `HeroBlock`, `TextBlock` (mixed)
**Target**: `BlocksHero`, `BlocksText` (consistent with agency-os)
**Impact**: Better code organization, easier to find
**Effort**: Low (rename files, update imports)

### 6. Query Field Optimization (Medium Priority)
**Current**: `fields: ['*']` everywhere
**Target**: Specific field selection per query
**Impact**: Reduced payload size, faster queries
**Effort**: Medium (update all queries)

**Implementation:**
- Analyze which fields are actually used
- Update queries to select specific fields
- Use nested field selection for relations

### 7. Block Container Pattern (Low Priority)
**Current**: Each block handles its own container
**Target**: Reusable `BlockContainer` wrapper
**Impact**: Consistent spacing, easier styling
**Effort**: Low (create component, refactor blocks)

## Performance Analysis

### Current Performance (Homepage)
- **Queries**: 14 (1 page + 1 blocks + 12 block content)
- **Query Time**: ~50-100ms each
- **Total Fetch Time**: 700-1400ms
- **ISR Cache**: 60 seconds
- **First Load**: 700-1400ms + render time
- **Cached Load**: ~50ms (ISR)

### Target Performance (After Optimization)
- **Queries**: 1 (nested query with all blocks)
- **Query Time**: ~100-200ms (single optimized query)
- **Total Fetch Time**: 100-200ms
- **ISR Cache**: 60 seconds
- **First Load**: 100-200ms + render time (7x faster)
- **Cached Load**: ~50ms (ISR)

### Performance Bottlenecks
1. **N+1 Query Problem**: Biggest bottleneck (12+ extra queries)
2. **Field Selection**: Fetching all fields increases payload
3. **No Query Caching**: Each request hits Directus
4. **Sequential Processing**: Block content fetched in parallel but still N queries

## Scalability Analysis

### Current Scalability
**Adding New Block Type:**
1. Add interface to `lib/types.ts`
2. Add to Schema interface
3. Create `get[Block]Block()` function in `lib/data.ts`
4. Create component in `components/blocks/`
5. Add `findBlock()` call in `app/page.tsx`
6. Add conditional render in `app/page.tsx`
7. **Total**: 6 steps, ~30 minutes

**Adding New Page:**
1. Create new route in `app/`
2. Copy block fetching pattern from homepage
3. Copy `findBlock()` pattern
4. Add all block conditionals
5. **Total**: 4 steps, ~20 minutes, code duplication

### Target Scalability (After Improvements)
**Adding New Block Type:**
1. Add interface to `lib/types.ts`
2. Add to Schema interface
3. Create component in `components/blocks/`
4. Add to `componentMap` in PageBuilder
5. **Total**: 4 steps, ~15 minutes

**Adding New Page:**
1. Create page in Directus CMS
2. Add blocks via CMS interface
3. **Total**: 2 steps, ~5 minutes, no code changes

## Comparison with Best Practices (agency-os Template)

| Feature | Current (เบามือ) | Best Practice (agency-os) | Gap |
|---------|------------------|---------------------------|-----|
| Block Rendering | Manual `findBlock()` | Dynamic `PageBuilder` | ❌ |
| Data Fetching | 14 queries | 1 nested query | ❌ |
| Type Safety | Uses `any` | Union types | ❌ |
| Component Naming | Mixed | Consistent | ⚠️ |
| Dynamic Routing | No | Yes (`[...permalink]`) | ❌ |
| Query Optimization | `fields: ['*']` | Specific fields | ❌ |
| Block Container | No | Yes | ⚠️ |
| Error Handling | Good | Excellent | ✅ |
| ISR | Configured | Configured | ✅ |
| Documentation | Excellent | Good | ✅ |

## Questions to Resolve

- [ ] Should we implement PageBuilder now or wait for all designs?
- [ ] Should we optimize data fetching immediately or incrementally?
- [ ] Should we add dynamic routing (`[...slug]`) or keep explicit routes?
- [ ] Should we rename components to match agency-os pattern (`BlocksHero`)?
- [ ] Should we create `BlockContainer` wrapper for consistency?
- [ ] What's the priority order for improvements?

## Research Notes

1. **PageBuilder Timing**: User workflow is HTML → Next.js → Page. PageBuilder doesn't disrupt this - it just makes rendering cleaner. Can be implemented incrementally.

2. **Data Fetching Priority**: N+1 query problem is the biggest performance issue. Should be addressed first for significant performance gains.

3. **Type Safety**: Current `any` usage is acceptable for dynamic collections but can be improved with union types and better type guards.

4. **Scalability**: Current manual pattern works but doesn't scale. PageBuilder would make adding new pages/blocks much easier.

5. **Incremental Approach**: Improvements can be done incrementally without breaking existing functionality.

6. **Template Comparison**: agency-os template shows best practices but our project has better documentation. We can adopt patterns without full migration.

## Recommended Improvement Roadmap

### Phase 1: Quick Wins (1-2 hours)
1. Create `PageBuilder` component
2. Refactor homepage to use PageBuilder
3. Add `BlockType` union type

### Phase 2: Performance (2-3 hours)
1. Create `getPageWithBlocks()` optimized function
2. Update homepage to use single query
3. Add field optimization to queries

### Phase 3: Type Safety (1-2 hours)
1. Create `Block` union type
2. Remove `any` types where possible
3. Add type guards

### Phase 4: Scalability (2-3 hours)
1. Add dynamic routing `app/[...slug]/page.tsx`
2. Create `BlockContainer` wrapper
3. Standardize component naming

### Phase 5: Polish (1-2 hours)
1. Optimize all queries with specific fields
2. Add query result caching (if needed)
3. Performance testing and optimization

**Total Estimated Time**: 7-12 hours for complete system improvements

## Review Status

- [x] Research reviewed by: AI Assistant
- [x] Review date: 2024-12-07
- [x] Status: ✅ Approved with Recommendations

### Review Feedback

**Overall Assessment**: Excellent research document with accurate code analysis and clear improvement roadmap. The research correctly identifies performance bottlenecks, type safety gaps, and scalability constraints. However, several robustness concerns and implementation considerations need to be addressed before proceeding to planning.

#### ✅ Strengths

1. **Accurate Code Analysis**: Research correctly identifies:
   - N+1 query problem (14 queries verified in `app/page.tsx`)
   - Type safety issues (`any` usage confirmed in code)
   - Manual block rendering pattern (verified in homepage)
   - Current data fetching flow (matches actual implementation)

2. **Comprehensive Coverage**: All relevant files identified, patterns documented, dependencies mapped

3. **Clear Improvement Areas**: Well-prioritized improvements with realistic effort estimates

4. **Good Comparison**: Useful comparison with agency-os template patterns

#### ⚠️ Robustness Concerns & Recommendations

**1. Nested Query Feasibility (Critical)**
- **Concern**: The proposed nested query pattern for M2A relationships needs verification. Directus M2A queries with nested field selection can be complex and may have limitations.
- **Recommendation**: 
  - Verify Directus SDK supports nested queries for M2A relationships before implementation
  - Test with a small subset first (2-3 blocks) to validate query structure
  - Have fallback plan: batch queries in groups of 5-10 if nested query fails
  - Document query structure in plan with actual working example

**2. Error Handling for Edge Cases (High Priority)**
- **Missing Scenarios**:
  - What happens if a block's `item` ID is invalid/deleted?
  - What if `page_blocks` has orphaned records (collection/item doesn't exist)?
  - What if nested query returns partial data?
  - What if Directus is temporarily unavailable?
- **Recommendation**:
  - Add error boundaries for block rendering failures
  - Implement graceful degradation: skip invalid blocks, log errors, continue rendering
  - Add validation: verify block content exists before rendering
  - Consider retry logic for transient Directus failures

**3. Performance Assumptions (Medium Priority)**
- **Concern**: "14x performance improvement" may be optimistic. Single nested query with 12+ blocks may be slower than expected.
- **Recommendation**:
  - Benchmark actual query times before/after
  - Consider query complexity: nested M2A with 12+ collections may have overhead
  - Realistic target: 3-5x improvement (still significant)
  - Document actual performance gains in implementation

**4. Type Safety with Dynamic Collections (Medium Priority)**
- **Concern**: Type safety for M2A relationships is inherently challenging. Union types help but runtime validation still needed.
- **Recommendation**:
  - Implement runtime type guards for block content validation
  - Use discriminated unions: `{ collection: 'block_hero', content: BlockHero }`
  - Add TypeScript strict mode checks
  - Consider zod schemas for runtime validation

**5. Backward Compatibility (High Priority)**
- **Concern**: Migration from current pattern to PageBuilder must not break existing pages.
- **Recommendation**:
  - Implement PageBuilder alongside existing pattern initially
  - Migrate homepage first, test thoroughly
  - Keep old functions (`getBlockContent`, etc.) for transition period
  - Add feature flag to toggle between patterns during migration

**6. Missing Robustness Patterns**
- **Not Addressed**:
  - ISR cache invalidation strategy for nested queries
  - Handling of `hide_block` flag in PageBuilder
  - Block ordering/priority when multiple blocks of same type exist
  - Empty state handling (page with no blocks)
- **Recommendation**:
  - Document ISR behavior with nested queries
  - Ensure `hide_block` filtering in PageBuilder
  - Clarify: should multiple blocks of same type be allowed?
  - Add empty state component for pages without blocks

**7. Security Considerations (Low Priority)**
- **Not Addressed**: 
  - Query injection risks (minimal with SDK, but worth noting)
  - Rate limiting for Directus queries
  - Token security (static token in env)
- **Recommendation**:
  - Document that SDK handles query sanitization
  - Note: static token is acceptable for read-only operations
  - Consider rate limiting if queries become too frequent

#### 📋 Questions Resolved

- [x] **Nested Query Feasibility**: Needs verification in plan phase
- [x] **Error Handling**: Edge cases identified, needs implementation strategy
- [x] **Performance Assumptions**: Realistic targets recommended
- [x] **Type Safety**: Approach validated, runtime guards needed
- [x] **Backward Compatibility**: Migration strategy recommended

#### 🔍 Additional Notes

1. **Incremental Approach Validated**: Research correctly identifies that improvements can be done incrementally. This is critical for robustness - allows testing at each phase.

2. **ISR Configuration**: Current 60s revalidate is appropriate. Nested queries should maintain same ISR behavior.

3. **Component Naming**: While `BlocksHero` is more consistent, migration effort vs benefit should be evaluated. Low priority is appropriate.

4. **Query Field Optimization**: While beneficial, should be done after nested query optimization to avoid premature optimization.

5. **Block Container Pattern**: Good for consistency but not critical for robustness. Can be added later.

### Recommended Next Steps

1. **Before Planning**: 
   - Verify Directus nested query syntax for M2A relationships
   - Test with 2-3 blocks to validate approach
   - Document actual query structure

2. **In Planning Phase**:
   - Add error handling strategy for all edge cases
   - Define backward compatibility approach
   - Specify ISR behavior with nested queries
   - Add validation steps for each improvement

3. **Implementation Priority**:
   - Phase 1 (PageBuilder) - Low risk, high value ✅
   - Phase 2 (Nested Queries) - Medium risk, verify first ⚠️
   - Phase 3 (Type Safety) - Low risk, incremental ✅
   - Phase 4 (Dynamic Routing) - Medium risk, test thoroughly ⚠️

### Robustness Validation

**System Robustness After Improvements**: ✅ **Will be significantly improved** with the following caveats:

- ✅ **Performance**: 3-5x improvement expected (realistic)
- ✅ **Type Safety**: Improved but runtime validation still needed
- ✅ **Scalability**: Much better with PageBuilder pattern
- ⚠️ **Error Handling**: Needs explicit implementation (not automatic)
- ⚠️ **Backward Compatibility**: Requires careful migration strategy

**Overall Assessment**: Research provides solid foundation for robust system improvements. Address error handling and verify nested query feasibility before implementation.

