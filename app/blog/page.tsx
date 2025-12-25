import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogNavigation from "@/components/BlogNavigation";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCard from "@/components/ArticleCard";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/data";
import type { Metadata } from "next";

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

      <Footer />
    </main>
  );
}
