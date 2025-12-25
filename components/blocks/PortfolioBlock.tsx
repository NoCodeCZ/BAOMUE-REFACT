import type { BlockPortfolio, PortfolioCase, PortfolioCategory } from "@/lib/types";
import { getPortfolioCases, getPortfolioCategories } from "@/lib/data";
import PortfolioBlockClient from "./PortfolioBlockClient";

interface PortfolioBlockProps {
  data?: BlockPortfolio | null;
}

export default async function PortfolioBlock({ data }: PortfolioBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "ผลงานของเรา";
  const subtitle = data.subtitle ?? "เคสสำเร็จจากผู้เชี่ยวชาญ";
  const description = data.description ?? "ดูผลงานจริงจากผู้ป่วยของเรา";
  const showCategoryFilter = data.show_category_filter ?? true;
  const casesPerPage = data.cases_per_page ?? 12;

  // Fetch portfolio cases and categories
  const [cases, categories] = await Promise.all([
    getPortfolioCases({ limit: casesPerPage }),
    getPortfolioCategories(),
  ]);

  return (
    <section className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {headline}
          </h1>
          {subtitle && (
            <p className="text-xl text-slate-600 font-medium">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-slate-500 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Client Component for Filters and Grid */}
        <PortfolioBlockClient
          cases={cases}
          categories={categories}
          showCategoryFilter={showCategoryFilter}
        />
      </div>
    </section>
  );
}

