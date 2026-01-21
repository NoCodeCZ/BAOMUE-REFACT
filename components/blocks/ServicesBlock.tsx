import type { BlockServices, Service, ServiceCategory } from "@/lib/types";
import { getServices, getServiceCategories } from "@/lib/data";
import ServicesBlockClient from "./ServicesBlockClient";

interface ServicesBlockProps {
  data?: BlockServices | null;
}

export default async function ServicesBlock({ data }: ServicesBlockProps) {
  if (!data) return null;

  const title = data.title ?? "บริการทางทันตกรรมของเรา";
  const subtitle = data.subtitle ?? "ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล";

  // Fetch services and categories
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories(),
  ]);

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = {};

  // Add 'all' category with all services
  servicesByCategory['all'] = services;

  categories.forEach((cat) => {
    // Note: s.category could be UUID string or number ID, cat.id could be number or string
    // We convert both to string for comparison
    servicesByCategory[cat.slug] = services.filter(
      (s) => {
        const serviceCategory = typeof s.category === 'object' ? (s.category as any)?.id : s.category;
        return String(serviceCategory) === String(cat.id);
      }
    );
  });


  return (
    <section className="lg:py-32 bg-slate-50 pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex text-sm font-semibold text-slate-50 bg-[#3B82F6] rounded-full mb-6 px-4 py-2 gap-x-2 gap-y-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
            บริการของเรา
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold tracking-tight mb-6" style={{ color: '#003888' }}>
            {title}
          </h2>
          <p className="text-xl" style={{ color: '#1DAEE0' }}>{subtitle}</p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Client Component for Tabs */}
          <ServicesBlockClient
            categories={categories}
            servicesByCategory={servicesByCategory}
          />
        </div>
      </div>
    </section>
  );
}
