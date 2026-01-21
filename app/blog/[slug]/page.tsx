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

