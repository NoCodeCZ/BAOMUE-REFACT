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
        <div className="bg-white/80 backdrop-blur-20 rounded-3xl border border-white/50 shadow-xl overflow-hidden" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
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
              <h2 className="lg:text-3xl text-2xl font-semibold text-slate-900 tracking-tight mb-4">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-slate-500 mb-6 line-clamp-3" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
    </section>
  );
}

