import type { BlockPortfolio, PortfolioCase, PortfolioCategory } from "@/lib/types";
import { getPortfolioCases, getPortfolioCategories } from "@/lib/data";
import PortfolioBlockClient from "./PortfolioBlockClient";

interface PortfolioBlockProps {
  data?: BlockPortfolio | null;
}

export default async function PortfolioBlock({ data }: PortfolioBlockProps) {
  if (!data) return null;

  const showCategoryFilter = data.show_category_filter ?? true;
  const casesPerPage = data.cases_per_page || 12;

  // Fetch ALL portfolio cases (no limit) so client can do incremental load-more
  const [cases, categories] = await Promise.all([
    getPortfolioCases(),
    getPortfolioCategories(),
  ]);

  return (
    <section className="py-12 lg:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Client Component for Filters, Grid, and Load More */}
        <PortfolioBlockClient
          cases={cases}
          categories={categories}
          showCategoryFilter={showCategoryFilter}
          initialDisplayCount={casesPerPage}
        />
      </div>
    </section>
  );
}

