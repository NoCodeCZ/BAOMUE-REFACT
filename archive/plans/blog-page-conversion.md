# Feature: Blog Page Conversion with Directus Integration

## Description
Convert the static blog.html file to a fully functional Next.js page (`app/blog/page.tsx`) with complete Directus CMS integration. The page will display blog posts with search, category filtering, featured articles, and article cards. All content will be managed through Directus collections.

## User Story
As a content manager, I want to manage blog posts through Directus CMS so that I can easily create, edit, and organize dental health articles without code changes.

## Current System Behavior
- Basic blog page exists at `app/blog/page.tsx` but only shows placeholder content
- `BlogNavigation` component exists with search and category filtering (client component)
- No blog-related Directus collections exist
- No blog data fetching functions exist
- No blog TypeScript interfaces exist

## Research Summary
**Key patterns identified:**
- Block-based pages use `getPageBySlug` → `getPageBlocks` → `getBlockContent` pattern
- List pages use direct collection queries (e.g., `getServices()`)
- Server Components default, client components only for interactivity
- ISR with `export const revalidate = 60` for all data-fetching pages
- Images use `getFileUrl()` helper from `lib/directus.ts`
- Empty states handled gracefully with fallback UI

**Similar implementations:**
- `app/services/page.tsx` - List page pattern
- `app/services/[slug]/page.tsx` - Detail page pattern
- `components/BlogNavigation.tsx` - Already handles search/filter UI

**Constraints:**
- Must use Server Components by default
- Must handle null/empty CMS responses
- Must use Tailwind classes only (no custom CSS)
- Must follow existing data fetching patterns

## Files to Modify/Create

### New Files
- `lib/types.ts` - Add BlogPost, BlogCategory interfaces
- `lib/data.ts` - Add blog data fetching functions
- `components/FeaturedArticle.tsx` - Featured article card component
- `components/ArticleCard.tsx` - Article card component for grid
- `app/blog/[slug]/page.tsx` - Blog post detail page

### Modified Files
- `lib/types.ts` - Add blog interfaces to Schema
- `lib/data.ts` - Add blog fetch functions
- `app/blog/page.tsx` - Replace placeholder with full implementation

## Step-by-Step Tasks

### Task 1: Add Blog TypeScript Interfaces
**File**: `lib/types.ts`
**Action**: Add new interfaces
**Lines**: After line 305 (after NavigationItem interface)

**Current Code**:
```typescript
export interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;
  page?: Page | number | null;
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];
}
```

**Proposed Change**:
```typescript
export interface NavigationItem {
  id: number;
  title: string;
  url?: string | null;
  page?: Page | number | null;
  parent?: NavigationItem | number | null;
  target?: '_self' | '_blank';
  sort?: number | null;
  children?: NavigationItem[];
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string; // For category badge colors
  sort?: number;
}

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
  reading_time?: number; // in minutes
  views?: number;
  is_featured?: boolean;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}
```

**Why**: TypeScript interfaces must match Directus collection structure for type safety

**Validation**: `npx tsc --noEmit`
**Test**: Verify no TypeScript errors

---

### Task 2: Register Blog Collections in Schema
**File**: `lib/types.ts`
**Action**: Modify Schema interface
**Lines**: Around line 1-25 (Schema interface)

**Current Code**:
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  // ... other collections
  navigation: NavigationItem[];
}
```

**Proposed Change**:
```typescript
export interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  // ... other collections
  navigation: NavigationItem[];
  blog_categories: BlogCategory[];
  blog_posts: BlogPost[];
}
```

**Why**: Schema interface must include all Directus collections for SDK type safety

**Validation**: `npx tsc --noEmit`
**Test**: Verify no TypeScript errors

---

### Task 3: Add Blog Data Fetching Functions
**File**: `lib/data.ts`
**Action**: Add new functions at end of file
**Lines**: After last function (around line 476)

**Current Code**:
```typescript
// Last function in file
```

**Proposed Change**:
```typescript
// ... existing functions ...

import type { BlogPost, BlogCategory } from './types';

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const categories = await directus.request(
      readItems('blog_categories', {
        fields: ['*'],
        sort: ['sort'],
      })
    );
    return (categories || []) as BlogCategory[];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

export async function getBlogPosts(options?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<BlogPost[]> {
  try {
    const filter: any = { status: { _eq: 'published' } };
    
    if (options?.category) {
      filter.category = { slug: { _eq: options.category } };
    }
    
    if (options?.featured !== undefined) {
      filter.is_featured = { _eq: options.featured };
    }
    
    if (options?.search) {
      filter._or = [
        { title: { _icontains: options.search } },
        { excerpt: { _icontains: options.search } },
        { content: { _icontains: options.search } },
      ];
    }

    const posts = await directus.request(
      readItems('blog_posts', {
        filter,
        fields: ['*', 'category.*'],
        sort: ['-published_date'],
        limit: options?.limit || 100,
      })
    );
    return (posts || []) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
        fields: ['*', 'category.*'],
        limit: 1,
      })
    );
    return (posts?.[0] as BlogPost) || null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  try {
    const posts = await directus.request(
      readItems('blog_posts', {
        filter: { 
          is_featured: { _eq: true },
          status: { _eq: 'published' }
        },
        fields: ['*', 'category.*'],
        sort: ['-published_date'],
        limit: 1,
      })
    );
    return (posts?.[0] as BlogPost) || null;
  } catch (error) {
    console.error('Error fetching featured blog post:', error);
    return null;
  }
}
```

**Why**: Data fetching functions follow existing patterns and handle errors gracefully

**Validation**: `npx tsc --noEmit`
**Test**: Verify functions compile without errors

---

### Task 4: Create ArticleCard Component
**File**: `components/ArticleCard.tsx`
**Action**: Create new file

**Proposed Change**:
```typescript
import Link from 'next/link';
import { getFileUrl } from '@/lib/directus';
import type { BlogPost } from '@/lib/types';
import { Eye } from 'lucide-react';

interface ArticleCardProps {
  post: BlogPost;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const categoryColorMap: Record<string, string> = {
    'orthodontics': 'from-cyan-500 to-blue-500',
    'whitening': 'from-amber-400 to-orange-400',
    'oral-care': 'from-emerald-500 to-teal-500',
    'kids': 'from-pink-500 to-rose-500',
    'implant': 'from-indigo-500 to-purple-500',
  };

  const category = typeof post.category === 'object' ? post.category : null;
  const categorySlug = category?.slug || 'default';
  const categoryName = category?.name || 'บทความ';
  const gradientClass = categoryColorMap[categorySlug] || 'from-cyan-500 to-blue-500';

  return (
    <article className="glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.featured_image && (
            <img
              src={getFileUrl(post.featured_image) || ''}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {category && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r ${gradientClass} rounded-full text-xs font-semibold text-white shadow-lg`}>
              {categoryName}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
            {post.published_date && (
              <span>{new Date(post.published_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            )}
            {post.reading_time && (
              <>
                <span>•</span>
                <span>{post.reading_time} นาทีอ่าน</span>
              </>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            {post.author_name && (
              <div className="flex items-center gap-2">
                {post.author_avatar && (
                  <img
                    src={getFileUrl(post.author_avatar) || ''}
                    alt={post.author_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-slate-600">{post.author_name}</span>
              </div>
            )}
            {post.views !== undefined && (
              <div className="flex items-center gap-1 text-slate-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </article>
  );
}
```

**Why**: Reusable component for article cards, follows existing component patterns

**Validation**: `npx tsc --noEmit`
**Test**: Component renders without errors

---

### Task 5: Create FeaturedArticle Component
**File**: `components/FeaturedArticle.tsx`
**Action**: Create new file

**Proposed Change**:
```typescript
import Link from 'next/link';
import { getFileUrl } from '@/lib/directus';
import type { BlogPost } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface FeaturedArticleProps {
  post: BlogPost;
}

export default function FeaturedArticle({ post }: FeaturedArticleProps) {
  const category = typeof post.category === 'object' ? post.category : null;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative aspect-[16/10] lg:aspect-auto">
              {post.featured_image && (
                <img
                  src={getFileUrl(post.featured_image) || ''}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white shadow-lg">
                บทความแนะนำ
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                {category && (
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-xs font-medium">
                    {category.name}
                  </span>
                )}
                {post.published_date && (
                  <span className="text-sm text-slate-400">
                    {new Date(post.published_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
                {post.reading_time && (
                  <span className="text-sm text-slate-400">• {post.reading_time} นาทีอ่าน</span>
                )}
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight mb-4">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-slate-500 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              {post.author_name && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    {post.author_avatar && (
                      <img
                        src={getFileUrl(post.author_avatar) || ''}
                        alt={post.author_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-slate-900">{post.author_name}</div>
                      {post.author_role && (
                        <div className="text-xs text-slate-500">{post.author_role}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 h-12 px-6 bg-slate-900 text-white font-medium rounded-xl hover:bg-cyan-600 transition-all w-fit"
              >
                อ่านบทความ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
```

**Why**: Special component for featured article display with larger layout

**Validation**: `npx tsc --noEmit`
**Test**: Component renders without errors

---

### Task 6: Update Blog Page with Full Implementation
**File**: `app/blog/page.tsx`
**Action**: Replace entire file content
**Lines**: All lines (1-69)

**Current Code**:
```typescript
import Header from "@/components/Header";
import BlogNavigation from "@/components/BlogNavigation";

export default function BlogPage() {
  // ... placeholder implementation
}
```

**Proposed Change**:
```typescript
import Header from "@/components/Header";
import BlogNavigation from "@/components/BlogNavigation";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/data";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "บทความ - BAOMUE Dental Clinic",
  description: "เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ",
};

export default async function BlogPage() {
  const [featuredPost, allPosts, categories] = await Promise.all([
    getFeaturedBlogPost(),
    getBlogPosts({ limit: 100 }),
    getBlogCategories(),
  ]);

  // Filter out featured post from main grid
  const regularPosts = featuredPost
    ? allPosts.filter((post) => post.id !== featuredPost.id)
    : allPosts;

  return (
    <main className="antialiased bg-slate-50 text-slate-600">
      <Header />

      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              ความรู้ทันตกรรม
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-slate-500 mb-4">บทความสุขภาพช่องปาก</p>
            <p className="text-base text-slate-400 max-w-xl mx-auto">
              เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี
              พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section - Client Component */}
      <BlogNavigation
        categories={categories}
        articleCount={allPosts.length}
      />

      {/* Featured Article */}
      {featuredPost && <FeaturedArticle post={featuredPost} />}

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {regularPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>

              {/* Load More Button - Placeholder for pagination */}
              {regularPosts.length >= 6 && (
                <div className="text-center mt-12">
                  <button className="inline-flex items-center gap-2 h-14 px-8 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-cyan-300 hover:text-cyan-600 transition-all shadow-lg">
                    <span>+</span>
                    โหลดบทความเพิ่มเติม
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400">ยังไม่มีบทความ</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
```

**Why**: Full server-side implementation with data fetching, follows existing page patterns

**Validation**: `npm run build`
**Test**: Page loads and displays blog posts from Directus

---

### Task 7: Update BlogNavigation to Accept Categories from Props
**File**: `components/BlogNavigation.tsx`
**Action**: Modify to accept categories from server
**Lines**: 12-19, 21-26

**Current Code**:
```typescript
const categories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "orthodontics", label: "จัดฟัน" },
  // ... hardcoded categories
];

export default function BlogNavigation({
  onSearch,
  onCategoryChange,
  articleCount = 0,
  initialCategory = "all",
}: BlogNavigationProps) {
```

**Proposed Change**:
```typescript
import type { BlogCategory } from '@/lib/types';

interface BlogNavigationProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  articleCount?: number;
  initialCategory?: string;
  categories?: BlogCategory[];
}

export default function BlogNavigation({
  onSearch,
  onCategoryChange,
  articleCount = 0,
  initialCategory = "all",
  categories = [],
}: BlogNavigationProps) {
  const allCategory = { id: "all", label: "ทั้งหมด" };
  const categoryButtons = [
    allCategory,
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
    })),
  ];
```

**Why**: Categories should come from Directus, not hardcoded

**Validation**: `npx tsc --noEmit`
**Test**: Navigation displays categories from CMS

---

## Directus Setup

### Collections to Create

#### 1. `blog_categories` Collection
**Fields:**
- `id` (uuid, primary key, auto)
- `name` (string, required) - Category name in Thai
- `slug` (string, required, unique) - URL-friendly identifier
- `description` (text, optional) - Category description
- `color` (string, optional) - Color code for badges
- `sort` (integer, optional) - Display order
- `status` (string, default: 'published') - published/draft

**Permissions:** Public read access

#### 2. `blog_posts` Collection
**Fields:**
- `id` (uuid, primary key, auto)
- `title` (string, required) - Post title
- `slug` (string, required, unique) - URL-friendly identifier
- `status` (string, default: 'draft') - published/draft
- `category` (uuid, M2O relation → `blog_categories`)
- `featured_image` (uuid, file relation → `directus_files`)
- `excerpt` (text, optional) - Short description
- `content` (text, optional) - Full article content (rich text)
- `author_name` (string, optional) - Author display name
- `author_role` (string, optional) - Author role/title
- `author_avatar` (uuid, file relation → `directus_files`)
- `published_date` (timestamp, optional) - Publication date
- `reading_time` (integer, optional) - Reading time in minutes
- `views` (integer, default: 0) - View count
- `is_featured` (boolean, default: false) - Featured article flag
- `tags` (json, optional) - Array of tag strings
- `seo_title` (string, optional) - SEO meta title
- `seo_description` (text, optional) - SEO meta description
- `date_created` (timestamp, auto)
- `date_updated` (timestamp, auto)

**Permissions:** Public read access for published posts only

**Relations:**
- `category` → `blog_categories.id` (M2O, SET NULL on delete)
- `featured_image` → `directus_files.id` (M2O, SET NULL on delete)
- `author_avatar` → `directus_files.id` (M2O, SET NULL on delete)

### Collection Config
- Use `config/COLLECTIONS_TO_CREATE.json` pattern if exists
- Set up user-friendly field names in Directus admin
- Configure field interfaces (input, textarea, file-image, etc.)

## Testing Strategy

### Task 1-2: TypeScript Interfaces
- [ ] Run `npx tsc --noEmit` - no errors
- [ ] Verify interfaces match Directus schema

### Task 3: Data Fetching Functions
- [ ] Run `npx tsc --noEmit` - no errors
- [ ] Functions handle errors gracefully (return empty arrays/null)

### Task 4-5: Components
- [ ] Run `npx tsc --noEmit` - no errors
- [ ] Components render without errors
- [ ] Images display correctly with `getFileUrl()`

### Task 6: Blog Page
- [ ] Run `npm run build` - builds successfully
- [ ] Page displays featured article if exists
- [ ] Page displays article grid
- [ ] Empty state shows when no posts
- [ ] ISR revalidation works (check after 60s)

### Task 7: BlogNavigation
- [ ] Categories display from Directus
- [ ] Search functionality works (client-side for now)
- [ ] Category filtering works (client-side for now)

### Integration Testing
- [ ] Create test blog categories in Directus
- [ ] Create test blog posts (featured and regular)
- [ ] Verify featured post appears in featured section
- [ ] Verify regular posts appear in grid
- [ ] Verify category filtering works
- [ ] Verify search functionality works
- [ ] Verify article count updates correctly
- [ ] Test responsive design on mobile/tablet/desktop

## Validation Commands
```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Acceptance Criteria
- [ ] All TypeScript interfaces match Directus collection structure
- [ ] All data fetching functions handle errors gracefully
- [ ] Blog page displays posts from Directus
- [ ] Featured article displays correctly when set
- [ ] Article cards display with images, categories, metadata
- [ ] Search and category filtering work (client-side)
- [ ] Empty states handled gracefully
- [ ] All validation commands pass
- [ ] Page works in browser
- [ ] No regressions introduced
- [ ] ISR revalidation configured (`revalidate = 60`)

## Context Notes
- **Follow existing patterns**: Use same data fetching pattern as `getServices()`
- **Server Components**: Blog page is server component, BlogNavigation is client component
- **Image handling**: Always use `getFileUrl()` helper for images
- **ISR**: Include `export const revalidate = 60` in blog page
- **Empty states**: Handle gracefully when no posts/categories exist
- **Category colors**: Map category slugs to gradient classes (can be enhanced later with Directus color field)
- **Client-side filtering**: Search and category filter are client-side for now (can be enhanced with URL params later)

## Project-Specific Requirements
- ✅ ISR: Include `export const revalidate = 60`
- ✅ Images: Use `getFileUrl(item.image)` helper
- ✅ Server Components: Default to RSC
- ✅ Tailwind Only: No custom CSS (except inline styles for glass-card)
- ✅ Fallbacks: Handle null/empty responses
- ✅ Type Safety: Match Directus collection structure
- ✅ Error Handling: All fetch functions return empty arrays/null on error

