import Header from "@/components/Header";
import { getServiceCategories, getServices } from "@/lib/data";
import type { Service, ServiceCategory } from "@/lib/types";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

function groupServicesByCategory(
  categories: ServiceCategory[],
  services: Service[]
) {
  const byCategoryId: Record<number, Service[]> = {};
  const uncategorized: Service[] = [];

  for (const service of services) {
    // Handle different category formats
    let catId: number | null = null;
    
    if (service.category === null || service.category === undefined) {
      uncategorized.push(service);
      continue;
    }
    
    if (typeof service.category === "number") {
      catId = service.category;
    } else if (typeof service.category === "object" && service.category !== null) {
      catId = service.category.id;
    }

    if (!catId || catId === 0) {
      uncategorized.push(service);
      continue;
    }
    
    if (!byCategoryId[catId]) byCategoryId[catId] = [];
    byCategoryId[catId].push(service);
  }

  // Create categorized sections
  const categorized = categories
    .filter((cat) => byCategoryId[cat.id]?.length > 0)
    .map((cat) => ({
      category: cat,
      services: byCategoryId[cat.id] || [],
    }))
    .sort((a, b) => (a.category.sort || 0) - (b.category.sort || 0));

  // Add uncategorized services section if there are any
  if (uncategorized.length > 0) {
    categorized.push({
      category: {
        id: 0,
        name: "บริการอื่นๆ",
        slug: "other",
        description: undefined,
        icon_name: undefined,
        sort: 999,
      } as ServiceCategory,
      services: uncategorized,
    });
  }

  return categorized;
}

export default async function ServicesIndexPage() {
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  // Debug logging (remove in production if needed)
  console.log('Services fetched:', services.length);
  console.log('Categories fetched:', categories.length);

  const grouped = groupServicesByCategory(categories, services);

  // Fallback: If no grouped services but we have services, show them all
  const hasGroupedServices = grouped.some(({ services }) => services.length > 0);
  const shouldShowFallback = !hasGroupedServices && services.length > 0;

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="md:text-7xl uppercase transform text-5xl font-black text-[#5372ee] tracking-tighter font-bricolage mb-4 -rotate-2">
            OUR SERVICES!
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-slate-800">
            บริการทางทันตกรรมของ Baomue
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="px-6 md:px-10 pt-10 pb-8 text-center border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-cyan-600 text-sm font-medium">
                เปิดให้บริการทุกวัน
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-3">
              บริการทันตกรรมของ Baomue
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-10">
            {shouldShowFallback ? (
              // Fallback: Show all services without grouping
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      บริการทั้งหมด
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {services.length} บริการ
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <a
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-[#1DAEE0] hover:shadow-lg transition-all group flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#1DAEE0]">
                            {service.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="text-slate-900 font-semibold text-lg">
                          {service.name}
                        </h3>
                      </div>

                      {service.short_description && (
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                          {service.short_description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between text-sm">
                        {service.price_from && (
                          <span className="font-semibold text-slate-900">
                            {service.price_from}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[#1DAEE0] font-medium group-hover:text-cyan-600 transition-colors">
                          อ่านเพิ่มเติม
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
                            className="w-4 h-4"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ) : grouped.length > 0 ? (
              grouped.map(({ category, services }) => {
                if (!services.length) return null;

                return (
                  <section key={category.id} className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-slate-900">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-slate-500 text-sm">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <a
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className="bg-slate-50 rounded-2xl p-5 border border-slate-200 hover:border-[#1DAEE0] hover:shadow-lg transition-all group flex flex-col"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                              <span className="text-sm font-semibold text-[#1DAEE0]">
                                {(category.icon_name || service.name).charAt(0)}
                              </span>
                            </div>
                            <h3 className="text-slate-900 font-semibold text-lg">
                              {service.name}
                            </h3>
                          </div>

                          {service.short_description && (
                            <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                              {service.short_description}
                            </p>
                          )}

                          <div className="mt-auto flex items-center justify-between text-sm">
                            {service.price_from && (
                              <span className="font-semibold text-slate-900">
                                {service.price_from}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[#1DAEE0] font-medium group-hover:text-cyan-600 transition-colors">
                              อ่านเพิ่มเติม
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
                                className="w-4 h-4"
                              >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <p className="text-center text-slate-500 py-10">
                ยังไม่มีการตั้งค่าบริการในระบบ Directus
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


