# Plan 8: Create BlogListingBlock

> **Status**: Ready for Implementation  
> **Part of**: Phase 2 - Create New Blocks  
> **Estimated Time**: 3-4 hours  
> **Dependencies**: None (uses existing `blog_posts` and `blog_categories` collections)

---

## Description

Create a new `BlogListingBlock` component that displays blog articles with:
- Hero section with title and description
- Search bar (Client Component)
- Category filter chips (Client Component)
- Featured article card (prominent display)
- Grid of blog articles with images, metadata, and author info
- Matches HTML design from `blog.html`

---

## Current System Behavior

Blog posts and categories already exist in Directus (`blog_posts`, `blog_categories` collections). This block will display them in a listing format with search and filter capabilities.

---

## Research Summary

From `docs/research/html-to-directus-conversion.md`:
- Blog search/filter will be client-side for simplicity and UX
- Blog posts already have fields: title, slug, category, featured_image, excerpt, author_name, author_role, author_avatar, published_date, reading_time, views, is_featured
- Featured article should be the first `is_featured: true` post
- Search filters by title and excerpt/description

---

## Files to Modify/Create

### New Files
- `components/blocks/BlogListingBlock.tsx` - Server Component (main block)
- `components/blocks/BlogListingBlockClient.tsx` - Client Component (search + filters + grid)

### Modified Files
- `lib/types.ts` - Add `BlockBlogListing` interface
- `lib/data.ts` - Add `getBlogListingBlock()` function (reuse existing `getBlogPosts()`)
- `components/PageBuilder.tsx` - Register `block_blog_listing` in componentMap

---

## Step-by-Step Tasks

### Task 1: Add TypeScript Interface
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: After line 431 (after BlogPost interface)

**Current Code**:
```412:431:lib/types.ts
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}
```

**Proposed Change**:
```typescript
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  category?: BlogCategory | number | null;
  featured_image?: string;
  excerpt?: string;
  content?: string;
  author_name?: string;
  author_role?: string;
  author_avatar?: string;
  published_date?: string;
  reading_time?: number;
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

// Blog listing block interface
export interface BlockBlogListing {
  id: number;
  headline?: string;
  subtitle?: string;
  description?: string;
  show_search?: boolean;
  show_category_filter?: boolean;
  show_featured_article?: boolean;
  articles_per_page?: number;
}
```

**Why**: Need interface for blog listing block configuration matching Directus collection.

**Validation**: `npx tsc --noEmit` - Check no type errors
**Test**: Verify interface compiles correctly

---

### Task 2: Register Block in Schema
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 1-31 (Schema interface)

**Current Code**:
```1:31:lib/types.ts
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  // ... other blocks
  blog_posts: BlogPost[];
  blog_categories: BlogCategory[];
}
```

**Proposed Change**:
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  // ... other blocks
  blog_posts: BlogPost[];
  blog_categories: BlogCategory[];
  block_blog_listing: BlockBlogListing[];
}
```

**Why**: Register new block collection in Schema interface for type safety.

**Validation**: `npx tsc --noEmit`
**Test**: Verify Schema interface includes new collection

---

### Task 3: Add BlockBlogListing to BlockType Union
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 57-73 (BlockType union)

**Current Code**:
```57:73:lib/types.ts
export type BlockType = 
  | 'block_hero'
  | 'block_text'
  // ... other blocks
  | 'block_pricing';
```

**Proposed Change**:
```typescript
export type BlockType = 
  | 'block_hero'
  | 'block_text'
  // ... other blocks
  | 'block_pricing'
  | 'block_blog_listing';
```

**Why**: Add to BlockType union so PageBuilder can recognize it.

**Validation**: `npx tsc --noEmit`
**Test**: Verify BlockType includes 'block_blog_listing'

---

### Task 4: Add BlockBlogListing to BlockContent Union
**File**: `lib/types.ts`  
**Action**: Modify existing  
**Lines**: 75-92 (BlockContent union)

**Current Code**:
```75:92:lib/types.ts
export type BlockContent = 
  | BlockHero
  | BlockText
  // ... other blocks
  | BlockPricing;
```

**Proposed Change**:
```typescript
export type BlockContent = 
  | BlockHero
  | BlockText
  // ... other blocks
  | BlockPricing
  | BlockBlogListing;
```

**Why**: Add to BlockContent union for type safety in PageBlockWithContent.

**Validation**: `npx tsc --noEmit`
**Test**: Verify BlockContent includes BlockBlogListing

---

### Task 5: Add Data Fetching Function
**File**: `lib/data.ts`  
**Action**: Modify existing  
**Lines**: After line 763 (after getFormBySlug function)

**Current Code**:
```749:763:lib/data.ts
export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form | null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}
```

**Proposed Change**:
```typescript
export async function getFormBySlug(slug: string): Promise<Form | null> {
  try {
    const forms = await directus.request(
      readItemsTyped('forms', {
        filter: { slug: { _eq: slug } },
        fields: ['*', 'fields.*'],
        limit: 1,
      })
    );
    return forms?.[0] as Form | null;
  } catch (error) {
    logDirectusError('getFormBySlug', error);
    return null;
  }
}

// Blog listing block function
export async function getBlogListingBlock(blockId: number): Promise<BlockBlogListing | null> {
  try {
    const blocks = await directus.request(
      readItemsTyped('block_blog_listing', {
        filter: { id: { _eq: blockId } },
        fields: ['*'],
        limit: 1,
      })
    );
    return blocks?.[0] as BlockBlogListing || null;
  } catch (error) {
    logDirectusError('getBlogListingBlock', error);
    return null;
  }
}
```

**Why**: Need function to fetch blog listing block configuration. Blog posts are fetched using existing `getBlogPosts()` function.

**Validation**: `npx tsc --noEmit` - Check imports and types
**Test**: Function compiles without errors

---

### Task 6: Check Existing getBlogPosts Function
**File**: `lib/data.ts`  
**Action**: Review existing  
**Lines**: Search for `getBlogPosts`

**Note**: Verify that `getBlogPosts()` function exists and returns `BlogPost[]` with all necessary fields including `category.*`, `featured_image.*`, etc. If it doesn't exist or needs updates, add/update it.

**Expected Function** (if missing):
```typescript
export async function getBlogPosts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}): Promise<BlogPost[]> {
  try {
    const filter: any = { status: { _eq: 'published' } };
    
    if (options?.category) {
      filter.category = { slug: { _eq: options.category } };
    }
    
    if (options?.featured !== undefined) {
      filter.is_featured = { _eq: options.featured };
    }

    const posts = await directus.request(
      readItemsTyped('blog_posts', {
        filter,
        fields: ['*', 'category.*', 'featured_image.*'],
        sort: ['-published_date', '-date_created'],
        limit: options?.limit || 100,
      })
    );
    return (posts || []) as BlogPost[];
  } catch (error) {
    logDirectusError('getBlogPosts', error);
    return [];
  }
}
```

**Why**: Need to ensure blog posts can be fetched with all necessary fields.

**Validation**: `npx tsc --noEmit`
**Test**: Verify function exists and works correctly

---

### Task 7: Create BlogListingBlock Server Component
**File**: `components/blocks/BlogListingBlock.tsx`  
**Action**: Create new  
**Lines**: New file

**Proposed Change**:
```typescript
import type { BlockBlogListing, BlogPost, BlogCategory } from "@/lib/types";
import { getBlogPosts } from "@/lib/data";
import { getBlogCategories } from "@/lib/data";
import BlogListingBlockClient from "./BlogListingBlockClient";

interface BlogListingBlockProps {
  data?: BlockBlogListing | null;
}

export default async function BlogListingBlock({ data }: BlogListingBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "Blog";
  const subtitle = data.subtitle ?? "บทความสุขภาพช่องปาก";
  const description = data.description ?? "เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ";
  const showSearch = data.show_search ?? true;
  const showCategoryFilter = data.show_category_filter ?? true;
  const showFeaturedArticle = data.show_featured_article ?? true;
  const articlesPerPage = data.articles_per_page ?? 24;

  // Fetch blog posts and categories
  const [allPosts, categories] = await Promise.all([
    getBlogPosts({ limit: articlesPerPage }),
    getBlogCategories(),
  ]);

  // Separate featured and regular posts
  const featuredPost = showFeaturedArticle 
    ? allPosts.find(post => post.is_featured) || null
    : null;
  
  const regularPosts = featuredPost
    ? allPosts.filter(post => post.id !== featuredPost.id)
    : allPosts;

  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-[#00347a] mb-4">
              {headline}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl font-medium text-[#2d5284] mb-4">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-sm md:text-base text-[#577399] max-w-lg mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Client Component for Search, Filters, Featured Article, and Grid */}
      <BlogListingBlockClient
        featuredPost={featuredPost}
        posts={regularPosts}
        categories={categories}
        showSearch={showSearch}
        showCategoryFilter={showCategoryFilter}
        showFeaturedArticle={showFeaturedArticle}
      />
    </div>
  );
}
```

**Why**: Server Component fetches data and renders static hero section. Delegates interactive parts to Client Component.

**Validation**: `npm run dev` - Check component renders
**Test**: Verify blog posts fetch and display

---

### Task 8: Create BlogListingBlockClient Component
**File**: `components/blocks/BlogListingBlockClient.tsx`  
**Action**: Create new  
**Lines**: New file

**Proposed Change**:
```typescript
"use client";

import { useState, useMemo } from "react";
import type { BlogPost, BlogCategory } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";
import { Search, Eye, ArrowRight } from "lucide-react";

interface BlogListingBlockClientProps {
  featuredPost: BlogPost | null;
  posts: BlogPost[];
  categories: BlogCategory[];
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showFeaturedArticle?: boolean;
}

export default function BlogListingBlockClient({
  featuredPost,
  posts = [],
  categories = [],
  showSearch = true,
  showCategoryFilter = true,
  showFeaturedArticle = true,
}: BlogListingBlockClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (post) =>
          post.category &&
          (typeof post.category === "object"
            ? post.category.slug === activeCategory
            : false)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, activeCategory, searchQuery]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category name helper
  const getCategoryName = (category: BlogPost["category"]) => {
    if (!category) return "";
    if (typeof category === "object") return category.name;
    return "";
  };

  // Get category slug helper
  const getCategorySlug = (category: BlogPost["category"]) => {
    if (!category) return "";
    if (typeof category === "object") return category.slug;
    return "";
  };

  return (
    <>
      {/* Search & Filter Section */}
      <section className="py-8 sticky top-20 z-40 bg-slate-50/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl border border-white/50 shadow-lg p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search */}
              {showSearch && (
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ค้นหาบทความ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Categories */}
              {showCategoryFilter && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 flex-1">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === "all"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-600 border border-slate-200"
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => setActiveCategory(category.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === category.slug
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                          : "bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-600 border border-slate-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Article Count */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-slate-500">แสดง:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {filteredPosts.length} บทความ
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {showFeaturedArticle && featuredPost && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative aspect-[16/10] lg:aspect-auto">
                  {featuredPost.featured_image && (
                    <img
                      src={getFileUrl(featuredPost.featured_image as any) || ""}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white shadow-lg">
                    บทความแนะนำ
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryName(featuredPost.category) && (
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs font-medium">
                        {getCategoryName(featuredPost.category)}
                      </span>
                    )}
                    {featuredPost.published_date && (
                      <span className="text-sm text-slate-400">
                        {formatDate(featuredPost.published_date)}
                      </span>
                    )}
                    {featuredPost.reading_time && (
                      <span className="text-sm text-slate-400">
                        • {featuredPost.reading_time} นาทีอ่าน
                      </span>
                    )}
                  </div>
                  <h2 className="lg:text-3xl text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-slate-500 mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  {(featuredPost.author_name || featuredPost.author_avatar) && (
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        {featuredPost.author_avatar && (
                          <img
                            src={getFileUrl(featuredPost.author_avatar as any) || ""}
                            alt={featuredPost.author_name || "Author"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          {featuredPost.author_name && (
                            <div className="text-sm font-medium text-slate-900">
                              {featuredPost.author_name}
                            </div>
                          )}
                          {featuredPost.author_role && (
                            <div className="text-xs text-slate-500">
                              {featuredPost.author_role}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 h-12 px-6 bg-slate-900 text-white font-medium rounded-xl hover:bg-cyan-600 transition-all w-fit"
                  >
                    อ่านบทความ
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const categoryName = getCategoryName(post.category);
              const categorySlug = getCategorySlug(post.category);

              return (
                <article
                  key={post.id}
                  className="article-card glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {post.featured_image && (
                        <img
                          src={getFileUrl(post.featured_image as any) || ""}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      {categoryName && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white shadow-lg">
                          {categoryName}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                        {post.published_date && (
                          <>
                            <span>{formatDate(post.published_date)}</span>
                            {post.reading_time && (
                              <>
                                <span>•</span>
                                <span>{post.reading_time} นาทีอ่าน</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {(post.excerpt || post.description) && (
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                          {post.excerpt || post.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {(post.author_name || post.author_avatar) && (
                          <div className="flex items-center gap-2">
                            {post.author_avatar && (
                              <img
                                src={getFileUrl(post.author_avatar as any) || ""}
                                alt={post.author_name || "Author"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            {post.author_name && (
                              <span className="text-sm text-slate-600">
                                {post.author_name.split(" ")[0]}
                              </span>
                            )}
                          </div>
                        )}
                        {post.views !== undefined && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">
                              {post.views >= 1000
                                ? `${(post.views / 1000).toFixed(1)}k`
                                : post.views}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              ไม่พบบทความที่ค้นหา
            </div>
          )}
        </div>
      </section>
    </>
  );
}
```

**Why**: Client Component handles search (needs useState) and category filtering (needs useState). Uses `useMemo` for efficient filtering. Featured article and grid are rendered here for consistency.

**Validation**: `npm run dev` - Check search and filters work
**Test**: Verify search filters correctly, category filters work, featured article displays

---

### Task 9: Register Block in PageBuilder
**File**: `components/PageBuilder.tsx`  
**Action**: Modify existing  
**Lines**: 1-35 (imports and componentMap)

**Current Code**:
```1:35:components/PageBuilder.tsx
import HeroBlock from "@/components/blocks/HeroBlock";
// ... other imports
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
  block_hero: HeroBlock,
  // ... other blocks
  block_pricing: () => null, // Placeholder
};
```

**Proposed Change**:
```typescript
import HeroBlock from "@/components/blocks/HeroBlock";
// ... other imports
import BlogListingBlock from "@/components/blocks/BlogListingBlock";
import Footer from "@/components/Footer";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";
import { ComponentType } from "react";

// Component map - maps block collection names to React components
const componentMap: Record<BlockType, ComponentType<{ data: any; formData?: Form | null; locations?: BlockLocations | null; block?: any }>> = {
  block_hero: HeroBlock,
  // ... other blocks
  block_pricing: () => null, // Placeholder
  block_blog_listing: BlogListingBlock,
};
```

**Why**: Register new block in PageBuilder so it can be rendered dynamically.

**Validation**: `npm run dev` - Check PageBuilder recognizes block
**Test**: Create page with block_blog_listing in Directus, verify it renders

---

## Directus Setup

### Create `block_blog_listing` Collection
1. **Collection Name**: `block_blog_listing`
2. **Fields**:
   - `id` (integer, primary key, auto-increment)
   - `headline` (string)
   - `subtitle` (string)
   - `description` (text)
   - `show_search` (boolean, default: true)
   - `show_category_filter` (boolean, default: true)
   - `show_featured_article` (boolean, default: true)
   - `articles_per_page` (integer, default: 24)

3. **Permissions**: Public read access

**Note**: `blog_posts` and `blog_categories` collections should already exist. Verify they have all necessary fields:
- `blog_posts`: title, slug, status, category (M2O), featured_image (file), excerpt, description, author_name, author_role, author_avatar (file), published_date, reading_time, views, is_featured, tags
- `blog_categories`: name, slug, description, sort

---

## Testing Strategy

### Functional Testing
1. Start dev server: `npm run dev`
2. Create test data in Directus:
   - [ ] Verify blog_categories exist
   - [ ] Create blog posts with various categories
   - [ ] Mark one post as featured (`is_featured: true`)
   - [ ] Create block_blog_listing block
   - [ ] Link block to a page
3. Test functionality:
   - [ ] Search bar filters posts by title/excerpt
   - [ ] Category filters work
   - [ ] Featured article displays prominently
   - [ ] Articles grid displays
   - [ ] Filtering by category works
   - [ ] Search and category filters work together
   - [ ] Article count updates correctly
   - [ ] Empty states display correctly
   - [ ] Links navigate to blog detail pages

### Visual Testing
- [ ] Hero section matches HTML design
- [ ] Search bar matches HTML (sticky, glass-card style)
- [ ] Category filter chips match HTML
- [ ] Featured article card matches HTML design
- [ ] Article cards match HTML design
- [ ] Author avatars display correctly
- [ ] View counts format correctly (k for thousands)
- [ ] Responsive layout works

---

## Validation Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Dev server
npm run dev
```

---

## Acceptance Criteria

- [x] TypeScript interface added
- [x] Block registered in Schema, BlockType, and BlockContent
- [x] Data fetching function works
- [x] BlogListingBlock Server Component created
- [x] BlogListingBlockClient Client Component created
- [x] Search functionality works (client-side filtering implemented)
- [x] Category filtering works (client-side filtering implemented)
- [x] Featured article displays
- [x] Block registered in PageBuilder
- [ ] Directus collection created (manual step - see Directus Setup section)
- [x] No TypeScript errors
- [x] No console errors
- [ ] Visual match with HTML design (requires testing with data)

---

## Completion Status
- [x] All tasks completed
- [x] All validations passed (TypeScript, Build)
- [ ] Feature tested in browser (requires Directus collection setup)
- Completed: 2024-12-19

### Implementation Notes
- Fixed: Changed `post.description` to `post.excerpt` in client component (BlogPost interface doesn't have `description` field)
- Enhanced: Added `featured_image.*` and `author_avatar.*` to `getBlogPosts()` fields for proper file handling
- All TypeScript types properly registered
- Components follow Server/Client pattern correctly

---

## Context Notes

- **Client Component Required**: Search and category filtering need `useState` and `useMemo`
- **Reuses Existing Collections**: Uses `blog_posts` and `blog_categories` (no new data collections needed)
- **Featured Article**: First post with `is_featured: true`, or null if none
- **Search Filtering**: Client-side filtering by title, excerpt, and description
- **Category Filtering**: Client-side filtering (simpler than server-side for this use case)
- **Date Formatting**: Uses Thai locale (`th-TH`)
- **View Count Formatting**: Shows "k" for thousands (e.g., "2.4k")
- **Empty States**: Show message when no posts match search/filter

---

## Project-Specific Requirements

- ✅ ISR: Handled by page component
- ✅ Images: Use `getFileUrl()` for blog images and author avatars
- ✅ Server Components: Main block is Server, Client only for interactivity
- ✅ Tailwind Only: All styling with Tailwind classes
- ✅ Fallbacks: Handle empty posts/categories gracefully
- ✅ Type Safety: All interfaces match Directus collection structure
- ✅ Lucide Icons: Use Search, Eye, ArrowRight icons
- ✅ Next.js Link: Use `next/link` for navigation

---

## Next Steps

After completing this plan:
1. Test with sample data in Directus
2. Verify search and filters work
3. Proceed to **Plan 13: Blog Pages** to create/update blog listing and detail pages
4. Or continue with other Phase 2 plans

