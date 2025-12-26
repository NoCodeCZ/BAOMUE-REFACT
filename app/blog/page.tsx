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

              {/* Load More Button */}
              {regularPosts.length >= 6 && (
                <div className="text-center mt-12">
                  <button className="inline-flex items-center gap-2 h-14 px-8 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-cyan-300 hover:text-cyan-600 transition-all shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <p className="text-slate-500 text-lg">ยังไม่มีบทความ</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
            มีคำถามเกี่ยวกับสุขภาพฟัน?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            ปรึกษาทันตแพทย์ผู้เชี่ยวชาญของเราฟรี ไม่มีค่าใช้จ่าย
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="h-14 px-8 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 shadow-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              นัดหมายเลย
            </a>
            <a
              href="tel:0969159391"
              className="h-14 px-8 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
              </svg>
              096 915 9391
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
