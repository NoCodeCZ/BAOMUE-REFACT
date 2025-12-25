import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";
import ServiceCategoryTabs from "@/components/services/ServiceCategoryTabs";
import { getServices, getServiceCategories } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "บริการทันตกรรม | Baomue Dental",
  description: "บริการทันตกรรมครบวงจรของ Baomue ทั้งจัดฟัน ความงาม ฟันปลอม รักษาราก และทันตกรรมทั่วไป",
  openGraph: {
    title: "บริการทันตกรรม | Baomue Dental",
    description: "ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories()
  ]);

  return (
    <main className="antialiased selection:bg-cyan-200 selection:text-cyan-900 text-slate-600 bg-white min-h-screen">
      <Header />
      
      <div className="md:py-16 max-w-7xl mx-auto pt-12 px-6 pb-12">
        <ServicesPageHeader 
          title="Our Services!"
          subtitle="บริการทางทันตกรรมของ Baomue"
        />
        
        <ServiceCategoryTabs 
          services={services}
          categories={categories}
        />
      </div>
      
      <Footer />
    </main>
  );
}
