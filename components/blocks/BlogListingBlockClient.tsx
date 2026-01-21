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
          post.content?.toLowerCase().includes(query)
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
                      {post.excerpt && (
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                          {post.excerpt}
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

