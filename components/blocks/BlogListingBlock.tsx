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

