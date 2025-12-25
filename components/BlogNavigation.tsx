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
    <section className="py-6 sticky top-20 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input
              type="text"
              placeholder="ค้นหาบทความ..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 flex-1">
            {categoryButtons.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Article Count */}
          <div className="flex items-center gap-2 shrink-0 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-sm text-slate-600">แสดง:</span>
            <span className="text-sm font-bold text-slate-900">
              {articleCount} บทความ
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}







