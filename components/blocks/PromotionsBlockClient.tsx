"use client";

import { useState, useEffect } from "react";
import type { Promotion, PromotionCategory } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";

interface PromotionsBlockClientProps {
  // For countdown timer
  countdownDate?: string;
  // For filters and grid
  promotions?: Promotion[];
  categories?: PromotionCategory[];
  showCategoryFilter?: boolean;
}

export default function PromotionsBlockClient({
  countdownDate,
  promotions = [],
  categories = [],
  showCategoryFilter = true,
}: PromotionsBlockClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer effect
  useEffect(() => {
    if (!countdownDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(countdownDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [countdownDate]);

  // Filter promotions by category
  const filteredPromotions =
    activeCategory === "all"
      ? promotions
      : promotions.filter(
          (p) =>
            p.category &&
            (typeof p.category === "object"
              ? p.category.slug === activeCategory
              : false)
        );

  // If only countdownDate provided, render countdown timer
  if (countdownDate && !promotions.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 flex gap-4 items-center">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-blue-100">วัน</div>
        </div>
        <div className="text-blue-200">:</div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-blue-100">ชั่วโมง</div>
        </div>
        <div className="text-blue-200">:</div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-blue-100">นาที</div>
        </div>
        <div className="text-blue-200">:</div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs text-blue-100">วินาที</div>
        </div>
      </div>
    );
  }

  // Render filters and grid
  return (
    <>
      {/* Category Filters */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
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
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Promotions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promo) => (
          <Link
            key={promo.id}
            href={promo.cta_link || `#`}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-slate-100"
          >
            {promo.featured_image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getFileUrl(promo.featured_image as any) || ""}
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
                {promo.discount_percentage && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{promo.discount_percentage}%
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {promo.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {promo.short_description}
              </p>
              <div className="flex items-center gap-2">
                {promo.original_price && (
                  <span className="text-slate-400 line-through text-sm">
                    {promo.original_price}
                  </span>
                )}
                {promo.discounted_price && (
                  <span className="text-blue-600 font-bold text-lg">
                    {promo.discounted_price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          ไม่พบโปรโมชั่นในหมวดหมู่นี้
        </div>
      )}
    </>
  );
}

