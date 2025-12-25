"use client";

import { useState, useRef } from "react";
import type { PortfolioCase, PortfolioCategory } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import { Star } from "lucide-react";

interface PortfolioBlockClientProps {
  cases: PortfolioCase[];
  categories: PortfolioCategory[];
  showCategoryFilter?: boolean;
}

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  caseId: number;
}

function BeforeAfterSlider({ beforeImage, afterImage, caseId }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const beforeUrl = beforeImage ? getFileUrl(beforeImage as any) : null;
  const afterUrl = afterImage ? getFileUrl(afterImage as any) : null;

  if (!beforeUrl || !afterUrl) {
    // Fallback: show single image if only one available
    const imageUrl = beforeUrl || afterUrl;
    if (!imageUrl) return null;
    return (
      <div className="aspect-[4/3] relative overflow-hidden rounded-t-3xl">
        <img
          src={imageUrl}
          alt="Portfolio case"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div
      ref={containerRef}
      className="before-after-slider aspect-[4/3] relative overflow-hidden rounded-t-3xl cursor-col-resize"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (background) */}
      <img
        src={afterUrl}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeUrl}
          alt="Before"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10 cursor-col-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
        </div>
      </div>

      {/* Range Input (for accessibility) */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
        aria-label="Before/After slider"
      />

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-xs font-medium text-white">
        Before
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-900">
        After
      </div>
    </div>
  );
}

export default function PortfolioBlockClient({
  cases = [],
  categories = [],
  showCategoryFilter = true,
}: PortfolioBlockClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter cases by category
  const filteredCases =
    activeCategory === "all"
      ? cases
      : cases.filter(
          (c) =>
            c.category &&
            (typeof c.category === "object"
              ? c.category.slug === activeCategory
              : false)
        );

  return (
    <>
      {/* Category Filters */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="sticky top-20 z-40 bg-slate-50/80 backdrop-blur-xl py-4 mb-8 -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="glass-card rounded-2xl border border-white/50 shadow-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 shrink-0">
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
                  className="w-4 h-4"
                >
                  <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
                </svg>
                ประเภทเคส:
              </div>
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
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-slate-500">แสดง:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {filteredCases.length} เคส
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cases Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((caseItem) => {
          const categoryName =
            caseItem.category && typeof caseItem.category === "object"
              ? caseItem.category.name
              : "";
          const categorySlug =
            caseItem.category && typeof caseItem.category === "object"
              ? caseItem.category.slug
              : "";

          return (
            <div
              key={caseItem.id}
              className="glass-card rounded-3xl border border-white/50 shadow-xl overflow-hidden group"
            >
              {/* Before/After Slider */}
              <div className="relative">
                <BeforeAfterSlider
                  beforeImage={caseItem.image_before}
                  afterImage={caseItem.image_after}
                  caseId={caseItem.id}
                />

                {/* Category Badge */}
                {categoryName && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-semibold text-white shadow-lg">
                    {categoryName}
                  </div>
                )}
              </div>

              {/* Case Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {caseItem.title}
                </h3>
                {caseItem.description && (
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {caseItem.description}
                  </p>
                )}

                {/* Rating */}
                {caseItem.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(caseItem.rating!)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-slate-600 ml-1">
                      {caseItem.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Duration */}
                {caseItem.duration && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>ระยะเวลา: {caseItem.duration}</span>
                  </div>
                )}

                {/* Client Info */}
                {(caseItem.client_name || caseItem.client_age) && (
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>
                        {caseItem.client_name}
                        {caseItem.client_age && `, ${caseItem.client_age} ปี`}
                        {caseItem.client_gender && ` (${caseItem.client_gender})`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          ไม่พบเคสในหมวดหมู่นี้
        </div>
      )}
    </>
  );
}

