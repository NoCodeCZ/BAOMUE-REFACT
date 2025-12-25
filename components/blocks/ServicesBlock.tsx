import type { BlockServices, Service, ServiceCategory } from "@/lib/types";
import { getServices, getServiceCategories } from "@/lib/data";
import ServicesBlockClient from "./ServicesBlockClient";

interface ServicesBlockProps {
  data?: BlockServices | null;
}

export default async function ServicesBlock({ data }: ServicesBlockProps) {
  if (!data) return null;

  const title = data.title ?? "OUR SERVICES!";
  const subtitle = data.subtitle ?? "บริการทางทันตกรรมของ Baomue";
  
  // Fetch services and categories
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories(),
  ]);

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = {};
  categories.forEach((cat) => {
    servicesByCategory[cat.slug] = services.filter(
      (s) => s.category && (typeof s.category === 'object' ? s.category.slug : null) === cat.slug
    );
  });

  return (
    <section className="md:py-16 bg-white pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black text-[#0F3FA1] mb-2 tracking-tighter uppercase">
            {title}
          </h1>
          <p className="text-[#1e3a8a] text-lg font-bold">{subtitle}</p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none"></div>

          {/* Card Header */}
          <div className="text-center pt-12 px-6 pb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FB9C2C] text-white shadow-sm mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span className="text-xs font-bold tracking-wide">เปิดให้บริการทุกวัน</span>
            </div>
            <h2 className="text-3xl md:text-3xl font-bold text-[#1e3a8a] mb-2 tracking-tight">
              บริการทันตกรรมของ Baomue
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล
            </p>
          </div>

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

