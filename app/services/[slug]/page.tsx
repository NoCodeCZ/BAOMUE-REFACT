import Header from "@/components/Header";
import { getServiceBySlug } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import type { Metadata } from "next";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

interface ServiceDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "บริการไม่พบ",
    };
  }

  return {
    title: service.seo_title || service.name,
    description: service.seo_description || service.short_description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-slate-700">
        <p>ไม่พบบริการนี้</p>
      </main>
    );
  }

  return (
    <main className="antialiased bg-[#f2f2f7] text-slate-800">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <a href="/" className="hover:text-blue-500">
            หน้าแรก
          </a>
          <span>/</span>
          <a href="/services" className="hover:text-blue-500">
            บริการ
          </a>
          <span>/</span>
          <span className="text-slate-800 font-medium">{service.name}</span>
        </nav>
      </div>

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_#1e293b] overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 border-2 border-green-600 text-xs font-bold mb-6 w-fit shadow-[2px_2px_0px_0px_#166534]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                ปรึกษาฟรี! ไม่มีค่าใช้จ่าย
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
                {service.name}
              </h1>

              {service.short_description && (
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {service.short_description}
                </p>
              )}

              <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#1e293b]">
                {service.price_from && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-slate-500">ราคาเริ่มต้น</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {service.price_from}
                    </span>
                  </div>
                )}
                {service.duration_label && (
                  <div className="flex items-center gap-3 text-sm text-green-600">
                    <span>{service.duration_label}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#booking"
                  className="flex-1 h-14 bg-blue-500 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#1e293b] flex items-center justify-center gap-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e293b] active:shadow-none"
                >
                  นัดปรึกษาฟรี
                </a>
                <a
                  href="https://line.me/ti/p/@baomue"
                  className="flex-1 h-14 bg-[#06c755] text-white font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#1e293b] flex items-center justify-center gap-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1e293b] active:shadow-none"
                >
                  LINE แชทเลย
                </a>
              </div>
            </div>

            <div className="relative h-64 lg:h-auto min-h-[400px]">
              <img
                src={
                  getFileUrl(service.hero_image as any) ??
                  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80"
                }
                alt={service.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>
          </div>
        </div>
      </section>

      {service.long_description && (
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-[2rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_#1e293b] p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              รายละเอียดการรักษา
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {service.long_description}
            </p>
          </div>
        </section>
      )}

      {service.highlights && service.highlights.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {service.highlights.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#1e293b] p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}


