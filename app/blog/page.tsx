import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBlock from "@/components/blocks/BookingBlock";
import BlogPageClient from "@/components/BlogPageClient";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "บทความสุขภาพช่องปาก - เคล็ดลับดูแลฟันจากทันตแพทย์",
  description: "เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ ขูดหินปูน ฟอกสีฟัน ฟันคุด ประกันสังคมทำฟัน",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "บทความสุขภาพช่องปาก | BAOMUE Dental Clinic",
    description: "เรียนรู้วิธีดูแลสุขภาพฟันและเหงือกอย่างถูกวิธี พร้อมเคล็ดลับจากทันตแพทย์ผู้เชี่ยวชาญ",
    type: "website",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const [featuredPost, allPosts, categories] = await Promise.all([
    getFeaturedBlogPost(),
    getBlogPosts({ limit: 100 }),
    getBlogCategories(),
  ]);

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

      {/* Client Component for filtering */}
      <BlogPageClient
        allPosts={allPosts}
        featuredPost={featuredPost}
        categories={categories}
      />

      <BookingBlock />
      <Footer />
    </main>
  );
}

