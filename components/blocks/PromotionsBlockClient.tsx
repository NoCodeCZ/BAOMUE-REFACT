"use client";

import { useState, useEffect } from "react";
import type { Promotion, PromotionCategory } from "@/lib/types";
import Link from "next/link";

// Extended promotion type with pre-resolved image URL
interface PromotionWithImage extends Promotion {
  imageUrl?: string | null;
}

interface PromotionsBlockClientProps {
  // For countdown timer
  countdownDate?: string;
  // For filters and grid
  promotions?: PromotionWithImage[];
  categories?: PromotionCategory[];
  showCategoryFilter?: boolean;
}

// Badge type mapping
function getBadge(promo: Promotion) {
  if (promo.is_featured) {
    return { text: "HOT", color: "bg-red-500" };
  }
  if (promo.discount_percentage && promo.discount_percentage >= 35) {
    return { text: "BEST SELLER", color: "bg-emerald-500" };
  }
  if (promo.discount_percentage && promo.discount_percentage >= 30) {
    return { text: "POPULAR", color: "bg-purple-500" };
  }
  if (promo.discount_percentage && promo.discount_percentage >= 25) {
    return { text: "PREMIUM", color: "bg-blue-500" };
  }
  if (promo.discounted_price?.toLowerCase().includes("ฟรี") || promo.discount_percentage === 100) {
    return { text: "FREE", color: "bg-green-500" };
  }
  return { text: "LIMITED", color: "bg-amber-500" };
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

  // Check if countdown has expired
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  
  // Check if running low (less than 24 hours)
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 24;

  // If only countdownDate provided, render countdown timer (for hero section)
  if (countdownDate && !promotions.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20">
        {/* Urgency Badge */}
        {isUrgent && !isExpired && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider animate-pulse">
              รีบหน่อย! เหลือเวลาอีกไม่นาน
            </span>
          </div>
        )}
        
        <div className="flex gap-3 md:gap-4 items-center justify-center">
          {/* Days */}
          <div className="text-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all duration-300 ${isUrgent ? 'ring-2 ring-amber-400/50' : ''}`}>
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-blue-100 mt-1.5 uppercase tracking-wide font-medium">วัน</div>
          </div>
          
          <div className="text-2xl font-light text-white/50 pb-5 animate-pulse">:</div>
          
          {/* Hours */}
          <div className="text-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all duration-300 ${isUrgent ? 'ring-2 ring-amber-400/50' : ''}`}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-blue-100 mt-1.5 uppercase tracking-wide font-medium">ชั่วโมง</div>
          </div>
          
          <div className="text-2xl font-light text-white/50 pb-5 animate-pulse">:</div>
          
          {/* Minutes */}
          <div className="text-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 bg-white text-blue-600 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all duration-300 ${isUrgent ? 'ring-2 ring-amber-400/50' : ''}`}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-blue-100 mt-1.5 uppercase tracking-wide font-medium">นาที</div>
          </div>
          
          <div className="text-2xl font-light text-white/50 pb-5 animate-pulse">:</div>
          
          {/* Seconds - The ticking element for FOMO */}
          <div className="text-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all duration-150 ${
              isUrgent 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-2 ring-white/30' 
                : 'bg-white text-blue-600'
            }`}>
              <span className="tabular-nums" key={timeLeft.seconds}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <div className="text-[10px] text-blue-100 mt-1.5 uppercase tracking-wide font-medium">วินาที</div>
          </div>
        </div>
        
        {/* Expired Message */}
        {isExpired && countdownDate && (
          <div className="mt-4 text-center">
            <span className="text-sm font-semibold text-amber-200 bg-white/10 px-4 py-2 rounded-full">
              🔥 โปรโมชั่นหมดอายุแล้ว - รอติดตามโปรใหม่เร็วๆ นี้!
            </span>
          </div>
        )}
      </div>
    );
  }

  // Calculate savings
  const calculateSavings = (original: string, discounted: string) => {
    // Extract numbers from price strings
    const originalNum = parseInt(original.replace(/[^0-9]/g, ""));
    const discountedNum = parseInt(discounted.replace(/[^0-9]/g, ""));
    if (isNaN(originalNum) || isNaN(discountedNum)) return null;
    return (originalNum - discountedNum).toLocaleString();
  };

  // Render filters and grid
  return (
    <>
      {/* Category Filters - Pill Style */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 w-max mx-auto p-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-blue-900 text-white shadow-md"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              ทั้งหมด
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === category.slug
                    ? "bg-blue-900 text-white shadow-md"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Promotions Grid - Beautiful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promo) => {
          const badge = getBadge(promo);
          const categoryName = typeof promo.category === "object" ? promo.category?.name : "";
          const savings = promo.original_price && promo.discounted_price 
            ? calculateSavings(promo.original_price, promo.discounted_price) 
            : null;
          const isGreen = promo.discounted_price?.toLowerCase().includes("ฟรี");

          return (
            <div
              key={promo.id}
              className={`group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
                isGreen ? "hover:shadow-green-900/5" : "hover:shadow-blue-900/5"
              }`}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {promo.imageUrl ? (
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-16 h-16 text-slate-300"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 ${badge.color} text-white text-[10px] font-bold rounded-md shadow-sm`}>
                    {badge.text}
                  </span>
                  {promo.discount_percentage && promo.discount_percentage > 0 && (
                    <span className="px-2.5 py-1 bg-amber-400 text-white text-[10px] font-bold rounded-md shadow-sm">
                      -{promo.discount_percentage}%
                    </span>
                  )}
                </div>
                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </button>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1">
                {/* Category Tag */}
                <div className="flex items-center gap-2 text-[10px] font-medium mb-1">
                  <span className={`px-1.5 py-0.5 rounded ${isGreen ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-500"}`}>
                    {categoryName}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`font-bold text-lg text-slate-900 mb-1 transition-colors ${
                  isGreen ? "group-hover:text-green-600" : "group-hover:text-blue-600"
                }`}>
                  {promo.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {promo.short_description}
                </p>

                {/* Pricing */}
                <div className="mb-4">
                  {promo.original_price && (
                    <div className="text-xs text-slate-400 line-through">฿{promo.original_price}</div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-bold tracking-tight ${isGreen ? "text-green-600" : "text-blue-600"}`}>
                      {promo.discounted_price?.toLowerCase().includes("ฟรี") 
                        ? "ฟรี!" 
                        : `฿${promo.discounted_price}`}
                    </span>
                    {savings && (
                      <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        ประหยัด ฿{savings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features Box */}
                {promo.features && typeof promo.features === 'object' && Array.isArray(promo.features) && promo.features.length > 0 && (
                  <div className="space-y-2 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(promo.features as string[]).slice(0, 2).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-green-500 flex-shrink-0">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={promo.cta_link || "#"}
                  className={`w-full mt-auto py-3 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] ${
                    isGreen 
                      ? "bg-[#22C55E] hover:bg-[#16A34A] shadow-green-500/20 hover:shadow-green-500/30" 
                      : "bg-[#003888] hover:bg-blue-800 shadow-blue-900/10 hover:shadow-blue-900/20"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  {promo.cta_text || "จองโปรโมชั่น"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          ไม่พบโปรโมชั่นในหมวดหมู่นี้
        </div>
      )}

      {/* Sticky Bottom Contact Bar */}
      <div className="sticky bottom-6 z-40 bg-[#111D51] rounded-2xl p-4 shadow-2xl shadow-blue-900/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-blue-900/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-base">สอบถามเพิ่มเติม?</h4>
            <p className="text-xs text-slate-300">ติดต่อทีมงานได้ตลอด 24 ชั่วโมง</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a 
            href="tel:0652916466" 
            className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-white text-[#111D51] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            065 291 6466
          </a>
          <a 
            href="#" 
            className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-[#06C755] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#05b64d] transition-colors"
          >
            <span className="font-bold text-[10px]">LINE</span> @BAOMUEDENTAL
          </a>
        </div>
      </div>
    </>
  );
}
