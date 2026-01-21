# Feature: Blog Pages

## Description
Update the blog listing page styling to match HTML design and create a complete blog detail page with article content, sidebar (related services, related posts, newsletter), breadcrumb navigation, share buttons, and tags. This plan completes the blog feature by ensuring both listing and detail pages match the HTML design specifications.

## User Story
As a website visitor, I want to browse blog articles and read detailed blog posts with related content and easy sharing options, so that I can learn about dental health and easily navigate between related content.

## Current System Behavior

### Blog Listing Page (`app/blog/page.tsx`)
- ✅ Already exists with basic functionality
- ✅ Uses `BlogNavigation` (Client Component) for search/filter
- ✅ Uses `FeaturedArticle` component for featured post
- ✅ Uses `ArticleCard` component for article grid
- ✅ Fetches data using `getBlogPosts()`, `getFeaturedBlogPost()`, `getBlogCategories()`
- ⚠️ Styling doesn't fully match HTML design:
  - Hero section uses different colors (`text-4xl md:text-6xl` vs HTML `text-6xl md:text-7xl`)
  - Hero uses `text-slate-900` vs HTML `text-[#00347a]`
  - Missing badge with icon in hero
  - Article count display needs styling updates

### Blog Detail Page
- ❌ Does NOT exist yet
- ❌ Need to create `/app/blog/[slug]/page.tsx`
- ✅ Data fetching function exists: `getBlogPostBySlug()`

### Existing Components
- ✅ `BlogNavigation.tsx` - Client component for search/filter (matches HTML design)
- ✅ `FeaturedArticle.tsx` - Server component for featured post (matches HTML design)
- ✅ `ArticleCard.tsx` - Server component for article cards (matches HTML design)

### Data Functions (Already Exist)
- ✅ `getBlogPosts()` - Fetches blog posts with filtering options
- ✅ `getBlogPostBySlug()` - Fetches single blog post by slug
- ✅ `getBlogCategories()` - Fetches blog categories
- ✅ `getFeaturedBlogPost()` - Fetches featured blog post

## Research Summary

From `docs/research/html-to-directus-conversion.md`:
- Blog listing page uses glass card styling with backdrop blur
- Blog detail page includes comprehensive sidebar with related content
- HTML design uses specific color palette (`#00347a`, `#2d5284`, `#577399` for hero)
- Blog detail page has breadcrumb, article content, tags, share buttons
- Sidebar includes: Related Services, CTA Card, Related Posts, Newsletter signup

**Key Patterns Identified:**
- Service detail page pattern (`app/services/[slug]/page.tsx`) for reference
- Dynamic route pattern with `generateMetadata()` and `generateStaticParams()`
- Breadcrumb navigation pattern
- Related content fetching pattern

**Similar Implementations:**
- `app/services/[slug]/page.tsx` - Dynamic route with metadata generation
- `app/blog/page.tsx` - List page with data fetching
- `components/ArticleCard.tsx` - Card component pattern

**Constraints:**
- Must use Server Components by default
- Must include `export const revalidate = 60` for ISR
- Must use `getFileUrl()` for all images
- Must handle null/empty responses gracefully
- Must match HTML design styling exactly

## Files to Modify/Create

### New Files
- `app/blog/[slug]/page.tsx` - Blog detail page with article content, sidebar, breadcrumb

### Modified Files
- `app/blog/page.tsx` - Update hero section styling to match HTML design

## Step-by-Step Tasks

### Task 1: Update Blog Listing Page Hero Styling
**File**: `app/blog/page.tsx`
**Action**: Modify existing
**Lines**: 33-50 (Hero Section)

**Current Code**:
```typescript
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
```

**Proposed Change**:
```typescript
      {/* Hero Section */}
      <section className="pt-16 pb-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-[#00347a] mb-4">
              Blog
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#2d5284] mb-4">
              บทความสุขภาพช่องปาก
            </p>
            <p className="text-sm md:text-base text-[#577399] max-w-lg mx-auto leading-relaxed">
              เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี
              พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ
            </p>
          </div>
        </div>
      </section>
```

**Why**: Match HTML design exactly - remove badge, update heading sizes, use HTML color palette (`#00347a`, `#2d5284`, `#577399`), adjust font weights and sizes.

**Validation**: `npm run dev` - Check `/blog` page renders correctly
**Test**: Visual comparison with HTML design - hero section should match exactly

---

### Task 2: Create Blog Detail Page Structure
**File**: `app/blog/[slug]/page.tsx`
**Action**: Create new file

**Code Snippet** (NEW FILE):
```typescript
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPostBySlug, getBlogPosts, getServices } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  Eye, 
  ChevronRight, 
  Facebook, 
  Twitter, 
  Share2,
  Calendar,
  Phone,
  Stethoscope,
  Newspaper
} from "lucide-react";

export const revalidate = 60;

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts({ limit: 100 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "บทความไม่พบ - BAOMUE Dental Clinic",
    };
  }

  const category = typeof post.category === 'object' ? post.category : null;

  return {
    title: post.seo_title || `${post.title} - BAOMUE Dental Clinic`,
    description: post.seo_description || post.excerpt || post.title,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || post.title,
      type: "article",
      images: post.featured_image
        ? [{ url: getFileUrl(post.featured_image) || "" }]
        : [],
      publishedTime: post.published_date || undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags || [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts (same category, exclude current post)
  const category = typeof post.category === 'object' ? post.category : null;
  const relatedPosts = category
    ? (await getBlogPosts({ category: category.slug, limit: 3 })).filter(p => p.id !== post.id).slice(0, 3)
    : (await getBlogPosts({ limit: 3 })).filter(p => p.id !== post.id).slice(0, 3);

  // Fetch related services (first 3 services)
  const relatedServices = (await getServices()).slice(0, 3);

  return (
    <main className="antialiased bg-slate-50 text-slate-600">
      <Header />

      {/* Article Detail Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <Link href="/" className="hover:text-cyan-600 transition-colors">
                  หน้าแรก
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/blog" className="hover:text-cyan-600 transition-colors">
                  บทความ
                </Link>
                {category && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <Link 
                      href={`/blog?category=${category.slug}`} 
                      className="hover:text-cyan-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </>
                )}
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-900">{post.title}</span>
              </nav>

              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Article Header */}
                  <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      {category && (
                        <span className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-sm font-medium">
                          {category.name}
                        </span>
                      )}
                      {post.published_date && (
                        <span className="text-sm text-slate-400">
                          {new Date(post.published_date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-6">
                      {post.title}
                    </h1>
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                      {post.author_name && (
                        <div className="flex items-center gap-3">
                          {post.author_avatar && (
                            <img
                              src={getFileUrl(post.author_avatar) || ''}
                              alt={post.author_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-slate-900">{post.author_name}</div>
                            {post.author_role && (
                              <div className="text-sm text-slate-500">{post.author_role}</div>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 ml-auto text-slate-400">
                        {post.reading_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{post.reading_time} นาทีอ่าน</span>
                          </div>
                        )}
                        {post.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">
                              {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </header>

                  {/* Cover Image */}
                  {post.featured_image && (
                    <div className="rounded-2xl overflow-hidden mb-8">
                      <img
                        src={getFileUrl(post.featured_image) || ''}
                        alt={post.title}
                        className="w-full aspect-video object-cover"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <article className="prose prose-slate max-w-none">
                    {post.excerpt && (
                      <p className="text-lg text-slate-600 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                    )}
                    {post.content && (
                      <div
                        className="text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    )}
                  </article>

                  {/* Share & Tags */}
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-slate-500">แท็ก:</span>
                          {post.tags.map((tag, index) => (
                            <Link
                              key={index}
                              href={`/blog?search=${encodeURIComponent(tag)}`}
                              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">แชร์:</span>
                        <button
                          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </button>
                        <button
                          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </button>
                        <button
                          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                          aria-label="Share"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-8">
                  {/* Related Services */}
                  {relatedServices.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-cyan-500" />
                        บริการที่เกี่ยวข้อง
                      </h3>
                      <div className="space-y-3">
                        {relatedServices.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
                              <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900 group-hover:text-cyan-600 transition-colors">
                                {service.name}
                              </div>
                              {service.price_from && (
                                <div className="text-sm text-slate-500">เริ่มต้น {service.price_from}</div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Card */}
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
                    <h3 className="font-semibold text-xl mb-2">สนใจจัดฟัน?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      ปรึกษาทันตแพทย์จัดฟันผู้เชี่ยวชาญฟรี ไม่มีค่าใช้จ่าย
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 h-12 px-6 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-all w-full justify-center"
                    >
                      <Calendar className="w-5 h-5" />
                      นัดปรึกษาฟรี
                    </Link>
                  </div>

                  {/* Related Posts */}
                  {relatedPosts.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-cyan-500" />
                        บทความที่เกี่ยวข้อง
                      </h3>
                      <div className="space-y-4">
                        {relatedPosts.map((relatedPost) => (
                          <Link
                            key={relatedPost.id}
                            href={`/blog/${relatedPost.slug}`}
                            className="flex gap-3 group"
                          >
                            {relatedPost.featured_image && (
                              <img
                                src={getFileUrl(relatedPost.featured_image) || ''}
                                alt={relatedPost.title}
                                className="w-20 h-16 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div>
                              <h4 className="text-sm font-medium text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              {relatedPost.reading_time && (
                                <span className="text-xs text-slate-400">{relatedPost.reading_time} นาทีอ่าน</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Newsletter */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">รับบทความใหม่</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      สมัครรับข่าวสารและบทความสุขภาพฟันใหม่ๆ
                    </p>
                    <form className="space-y-3">
                      <input
                        type="email"
                        placeholder="อีเมลของคุณ"
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="submit"
                        className="w-full h-12 bg-slate-900 text-white font-medium rounded-xl hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        สมัครรับข่าวสาร
                      </button>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

**Why**: Create complete blog detail page matching HTML design with all required sections: breadcrumb, article header, content, tags, share buttons, sidebar with related services, CTA card, related posts, and newsletter signup.

**Validation**: `npx tsc --noEmit` - Check TypeScript errors
**Test**: Navigate to `/blog/[any-slug]` - Should render blog detail page with all sections

---

### Task 3: Add Missing Imports to Blog Listing Page
**File**: `app/blog/page.tsx`
**Action**: Modify existing
**Lines**: 1-8 (Import statements)

**Current Code**:
```typescript
import Header from "@/components/Header";
import BlogNavigation from "@/components/BlogNavigation";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/data";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
```

**Proposed Change**:
```typescript
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogNavigation from "@/components/BlogNavigation";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/data";
import type { Metadata } from "next";
```

**Why**: Remove unused `BookOpen` import (removed badge), add `Footer` import for consistency with other pages.

**Validation**: `npm run lint` - Check for unused imports
**Test**: Build should complete without warnings

---

### Task 4: Add Footer to Blog Listing Page
**File**: `app/blog/page.tsx`
**Action**: Modify existing
**Lines**: 89-91 (End of component)

**Current Code**:
```typescript
        </div>
      </section>
    </main>
  );
}
```

**Proposed Change**:
```typescript
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

**Why**: Add Footer component for consistency with other pages and HTML design.

**Validation**: `npm run dev` - Check footer renders on `/blog` page
**Test**: Visual check - footer should appear at bottom of page

---

## Directus Setup

### No New Collections Required
All required collections already exist:
- ✅ `blog_posts` - Blog posts collection
- ✅ `blog_categories` - Blog categories collection
- ✅ `services` - Services collection (for related services sidebar)

### Existing Collection Fields (Verified)
- `blog_posts` has all required fields:
  - `title`, `slug`, `status`, `category`, `featured_image`, `excerpt`, `content`
  - `author_name`, `author_role`, `author_avatar`
  - `published_date`, `reading_time`, `views`
  - `is_featured`, `tags`, `seo_title`, `seo_description`

### Data Requirements
- Blog posts must have `status: 'published'` to appear
- Featured posts should have `is_featured: true`
- Categories should be linked via `category` field (M2O relationship)
- Tags should be stored as array in `tags` field

## Testing Strategy

### Task 1: Blog Listing Hero Styling
- [ ] Navigate to `/blog` page
- [ ] Verify hero section matches HTML design:
  - [ ] Heading is `text-6xl md:text-7xl` (not `text-4xl md:text-6xl`)
  - [ ] Heading color is `text-[#00347a]` (not `text-slate-900`)
  - [ ] Subtitle is `text-xl md:text-2xl font-medium text-[#2d5284]`
  - [ ] Description is `text-sm md:text-base text-[#577399]`
  - [ ] Badge with icon is removed
- [ ] Check responsive behavior on mobile/tablet/desktop

### Task 2: Blog Detail Page
- [ ] Navigate to `/blog/[any-slug]` for existing blog post
- [ ] Verify all sections render:
  - [ ] Breadcrumb navigation (หน้าแรก > บทความ > [category] > [title])
  - [ ] Article header with category badge, date, author, reading time, views
  - [ ] Cover image (if available)
  - [ ] Article content (excerpt + content)
  - [ ] Tags section (if tags exist)
  - [ ] Share buttons (Facebook, Twitter, Share)
  - [ ] Sidebar with Related Services (3 services)
  - [ ] Sidebar with CTA Card
  - [ ] Sidebar with Related Posts (3 posts)
  - [ ] Sidebar with Newsletter signup form
- [ ] Test navigation:
  - [ ] Breadcrumb links work correctly
  - [ ] Tag links filter blog posts
  - [ ] Related post links navigate to detail pages
  - [ ] Related service links navigate to service pages
- [ ] Test with missing data:
  - [ ] Post without featured image
  - [ ] Post without category
  - [ ] Post without tags
  - [ ] Post without author info
- [ ] Verify SEO metadata:
  - [ ] Page title includes post title
  - [ ] Meta description uses excerpt or title
  - [ ] OpenGraph tags are present

### Task 3: Integration Testing
- [ ] Test full blog flow:
  - [ ] Navigate from homepage to blog listing
  - [ ] Click on featured article → navigate to detail page
  - [ ] Click on article card → navigate to detail page
  - [ ] Use breadcrumb to navigate back to listing
  - [ ] Use category filter → navigate to detail page
  - [ ] Click related post → navigate to another detail page
- [ ] Test `generateStaticParams()`:
  - [ ] Build succeeds: `npm run build`
  - [ ] All blog post slugs generate static pages
- [ ] Test `notFound()`:
  - [ ] Navigate to `/blog/non-existent-slug`
  - [ ] Should show 404 page

## Validation Commands
```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build

# Run dev server
npm run dev
```

## Acceptance Criteria
- [ ] Blog listing page hero section matches HTML design exactly (colors, sizes, no badge)
- [ ] Blog detail page created at `/app/blog/[slug]/page.tsx`
- [ ] Blog detail page includes all sections: breadcrumb, article header, content, tags, share buttons, sidebar
- [ ] Sidebar includes: Related Services, CTA Card, Related Posts, Newsletter
- [ ] `generateMetadata()` function generates dynamic SEO metadata
- [ ] `generateStaticParams()` generates static paths for all blog posts
- [ ] `notFound()` called for non-existent blog posts
- [ ] All links navigate correctly (breadcrumb, tags, related posts, related services)
- [ ] Footer component added to blog listing page
- [ ] All validation commands pass
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Images use `getFileUrl()` helper
- [ ] All data fetching handles null/empty responses gracefully

## Context Notes
- **Follow existing patterns**: Blog detail page follows same pattern as `app/services/[slug]/page.tsx`
- **Server Components**: All components are Server Components by default (no `"use client"` needed)
- **ISR**: Both pages use `export const revalidate = 60` for incremental static regeneration
- **Images**: Always use `getFileUrl()` helper for Directus file URLs
- **Fallbacks**: Handle null/empty responses for optional fields (featured_image, category, tags, etc.)
- **Type Safety**: Use existing TypeScript interfaces from `lib/types.ts` (BlogPost, BlogCategory, Service)
- **Related Content**: Fetch related posts from same category, exclude current post, limit to 3
- **Related Services**: Fetch first 3 services for sidebar (can be enhanced later with category matching)
- **Share Buttons**: Currently static buttons (can be enhanced later with actual share functionality)
- **Newsletter Form**: Currently static form (can be enhanced later with form submission)

## Project-Specific Requirements
- ✅ ISR: Include `export const revalidate = 60` on both pages
- ✅ Images: Use `getFileUrl(item.image)` helper for all images
- ✅ Server Components: Default to RSC (no client components needed)
- ✅ Tailwind Only: No custom CSS, use Tailwind classes
- ✅ Fallbacks: Handle null/empty responses gracefully
- ✅ Type Safety: Match Directus collection structure from `lib/types.ts`
- ✅ SEO: Implement `generateMetadata()` for dynamic SEO
- ✅ Static Generation: Implement `generateStaticParams()` for better performance
- ✅ Error Handling: Use `notFound()` for missing blog posts

## Dependencies
- **Plan 8**: BlogListingBlock (if using block-based approach, but current implementation uses direct page)
- **Existing**: BlogNavigation, FeaturedArticle, ArticleCard components
- **Existing**: getBlogPosts, getBlogPostBySlug, getBlogCategories, getServices data functions
- **Existing**: BlogPost, BlogCategory, Service TypeScript interfaces

## Estimated Time
- Task 1: 15 minutes (simple styling update)
- Task 2: 2-3 hours (create complete detail page with all sections)
- Task 3: 5 minutes (import cleanup)
- Task 4: 5 minutes (add footer)
- **Total: 2.5-3.5 hours**

## Next Steps After Completion
1. Test blog detail page with real Directus data
2. Enhance share buttons with actual share functionality (optional)
3. Enhance newsletter form with form submission (optional)
4. Add related services matching by category (optional enhancement)
5. Consider adding reading progress indicator (optional enhancement)
6. Consider adding table of contents for long articles (optional enhancement)

---

## Completion Status
- [x] All tasks completed
- [x] All validations passed
- [x] Feature tested in browser
- Completed: 2025-01-27

### Tasks Completed
- [x] Task 1: Update Blog Listing Page Hero Styling
- [x] Task 2: Create Blog Detail Page Structure
- [x] Task 3: Add Missing Imports to Blog Listing Page
- [x] Task 4: Add Footer to Blog Listing Page

### Validation Results
- ✅ TypeScript: `npx tsc --noEmit` - Passed
- ✅ Build: `npm run build` - Passed
- ✅ Static Generation: Blog detail pages generated successfully
- ✅ No linting errors

### Files Created/Modified
- ✅ Created: `app/blog/[slug]/page.tsx`
- ✅ Modified: `app/blog/page.tsx` (hero styling, imports, footer)

