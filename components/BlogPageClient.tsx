"use client";

import { useState, useMemo } from "react";
import BlogNavigation from "@/components/BlogNavigation";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import type { BlogPost, BlogCategory } from "@/lib/types";

interface BlogPageClientProps {
    allPosts: BlogPost[];
    featuredPost: BlogPost | null;
    categories: BlogCategory[];
}

export default function BlogPageClient({
    allPosts,
    featuredPost,
    categories,
}: BlogPageClientProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter posts by category and search
    const filteredPosts = useMemo(() => {
        let posts = allPosts;

        // Filter out featured post from main grid
        if (featuredPost) {
            posts = posts.filter((post) => post.id !== featuredPost.id);
        }

        // Filter by category
        if (activeCategory !== "all") {
            // Find the selected category by slug
            const selectedCategory = categories.find(
                (cat) => cat.slug === activeCategory || cat.slug === `/${activeCategory}`
            );

            posts = posts.filter((post) => {
                if (!post.category) return false;

                // Handle category as object or primitive
                const postCategoryId = typeof post.category === "object"
                    ? String((post.category as any)?.id)
                    : String(post.category);

                const postCategorySlug = typeof post.category === "object"
                    ? (post.category as any)?.slug
                    : null;

                // Clean slug (remove leading /)
                const cleanActiveSlug = activeCategory.replace(/^\//, "");

                // Match by:
                // 1. Category ID matches selected category's ID
                // 2. Category slug matches active category
                // 3. Post's category slug matches active category
                if (selectedCategory) {
                    return postCategoryId === String(selectedCategory.id);
                }

                // Fallback: direct slug comparison
                return postCategorySlug === cleanActiveSlug ||
                    postCategorySlug === activeCategory;
            });
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(
                (post) =>
                    post.title?.toLowerCase().includes(query) ||
                    post.excerpt?.toLowerCase().includes(query)
            );
        }

        return posts;
    }, [allPosts, featuredPost, activeCategory, searchQuery, categories]);

    const handleCategoryChange = (category: string) => {
        setActiveCategory(category);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <>
            {/* Search & Filter Section */}
            <BlogNavigation
                categories={categories}
                articleCount={filteredPosts.length}
                initialCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
            />

            {/* Featured Article - only show when "all" category */}
            {featuredPost && activeCategory === "all" && (
                <FeaturedArticle post={featuredPost} />
            )}

            {/* Articles Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {filteredPosts.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map((post) => (
                                    <ArticleCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {filteredPosts.length >= 6 && (
                                <div className="text-center mt-12">
                                    <button className="inline-flex items-center gap-2 h-14 px-8 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-cyan-300 hover:text-cyan-600 transition-all shadow-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-5 h-5"
                                        >
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5v14"></path>
                                        </svg>
                                        โหลดบทความเพิ่มเติม
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-slate-400"
                                >
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                </svg>
                            </div>
                            <p className="text-slate-500 text-lg">
                                {searchQuery
                                    ? `ไม่พบบทความที่ค้นหา "${searchQuery}"`
                                    : "ไม่มีบทความในหมวดนี้"}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
