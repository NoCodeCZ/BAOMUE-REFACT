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
    <article className="article-card bg-white/80 backdrop-blur-20 rounded-3xl border border-white/50 shadow-xl overflow-hidden group" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
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
          <h3 className="font-semibold text-slate-900 text-lg mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
    </article>
  );
}

