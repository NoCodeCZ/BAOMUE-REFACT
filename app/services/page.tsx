import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBlock from "@/components/blocks/BookingBlock";
import ServicesBlockClient from "@/components/blocks/ServicesBlockClient";
import { getServices, getServiceCategories } from "@/lib/data";
import type { Service } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "บริการทันตกรรม - จัดฟัน วีเนียร์ รากเทียม ฟอกสีฟัน",
  description: "บริการทันตกรรมครบวงจรของ Baomue ทั้งจัดฟัน Invisalign, Damon, AOSC วีเนียร์เซรามิก ฟอกสีฟัน Zoom รากฟันเทียม ขูดหินปูน ครอบฟัน สะพานฟัน ดูแลโดยทันตแพทย์เฉพาะทาง",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "บริการทันตกรรม | BAOMUE Dental Clinic",
    description: "ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล",
    type: "website",
    url: "/services",
  },
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories()
  ]);

  // Group services by category (same logic as ServicesBlock on Homepage)
  const servicesByCategory: Record<string, Service[]> = {};
  servicesByCategory['all'] = services;
  categories.forEach((cat) => {
    servicesByCategory[cat.slug] = services.filter((s) => {
      const serviceCategory = typeof s.category === 'object' ? (s.category as any)?.id : s.category;
      return String(serviceCategory) === String(cat.id);
    });
  });

  return (
    <main className="antialiased selection:bg-cyan-200 selection:text-cyan-900 text-slate-600 bg-white min-h-screen">
      <Header />
      
      <section className="lg:py-32 bg-slate-50 pt-24 pb-24">
        <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
          {/* Header — same style as Homepage ServicesBlock */}
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
              บริการของเรา
            </h2>
            <p className="text-xl" style={{ color: '#1DAEE0' }}>ทันตกรรมครบวงจร ดูแลทุกปัญหาช่องปากของคุณ</p>
          </div>

          {/* Main Card Container — same as Homepage */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <ServicesBlockClient
              categories={categories}
              servicesByCategory={servicesByCategory}
              showViewAllButton={false}
            />
          </div>
        </div>
      </section>
      
      <BookingBlock />
      <Footer />
    </main>
  );
}
