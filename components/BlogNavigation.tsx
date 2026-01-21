"use client";

import { useState } from "react";
import type { BlogCategory } from '@/lib/types';

interface BlogNavigationProps {
  onSearch?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  articleCount?: number;
  initialCategory?: string;
  categories?: BlogCategory[];
}

export default function BlogNavigation({
  onSearch,
  onCategoryChange,
  articleCount = 0,
  initialCategory = "all",
  categories = [],
}: BlogNavigationProps) {
  const allCategory = { id: "all", label: "ทั้งหมด" };
  const categoryButtons = [
    allCategory,
    ...categories.map((cat) => ({
      id: cat.slug,
      label: cat.name,
    })),
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  return (
    <section className="py-8 sticky top-20 z-40 bg-slate-50/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/80 backdrop-blur-20 rounded-2xl border border-white/50 shadow-lg p-4" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
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
                className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
              >
                <path d="m21 21-4.34-4.34"></path>
                <circle cx="11" cy="11" r="8"></circle>
              </svg>
              <input
                type="text"
                placeholder="ค้นหาบทความ..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categoryButtons.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`category-pill transition-all text-sm font-medium rounded-full px-4 py-2 ${
                    activeCategory === category.id
                      ? "active bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Article Count */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-slate-500">แสดง:</span>
              <span className="text-sm font-semibold text-slate-900">
                {articleCount} บทความ
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}







