import type { BlockPromotions, Promotion, PromotionCategory } from "@/lib/types";
import { getPromotions, getPromotionCategories } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import PromotionsBlockClient from "./PromotionsBlockClient";

interface PromotionsBlockProps {
  data?: BlockPromotions | null;
}

export default async function PromotionsBlock({ data }: PromotionsBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "Promotions!";
  const subtitle = data.subtitle ?? "รวมโปรโมชั่นพิเศษประจำเดือน ครบจบในที่เดียว";
  const showCountdown = data.show_countdown ?? true;
  const countdownDate = data.countdown_date;
  const countdownLabel = data.countdown_label ?? "โปรโมชั่นประจำเดือน";
  const showCategoryFilter = data.show_category_filter ?? true;

  // Fetch promotions and categories
  const [promotions, categories] = await Promise.all([
    getPromotions(),
    getPromotionCategories(),
  ]);

  // Transform promotions to include resolved image URLs
  const promotionsWithImageUrls = promotions.map((promo) => ({
    ...promo,
    imageUrl: getFileUrl(promo.featured_image as any) || null,
  }));

  return (
    <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Title */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tighter uppercase">
          {headline}
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base">
          {subtitle}
        </p>
      </div>

      {/* Hero Banner Card with Countdown */}
      {showCountdown && countdownDate && (
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white shadow-xl shadow-blue-600/20">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <div className="relative z-10 px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium border border-white/20 text-blue-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {countdownLabel}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  รวมโปรโมชั่นประจำเดือน
                </h2>
                <p className="text-blue-100 font-light opacity-90">
                  อัพเดทโปรโมชั่นล่าสุดทุกเดือน ดีลราคาพิเศษเฉพาะที่นี่
                </p>
              </div>
            </div>

            {/* Countdown Timer - Client Component */}
            <PromotionsBlockClient countdownDate={countdownDate} />
          </div>
        </div>
      )}

      {/* Client Component for Filters and Grid */}
      <PromotionsBlockClient
        promotions={promotionsWithImageUrls}
        categories={categories}
        showCategoryFilter={showCategoryFilter}
      />
    </div>
  );
}

