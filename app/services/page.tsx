import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";
import ServiceCategoryTabs from "@/components/services/ServiceCategoryTabs";
import { getServices, getServiceCategories } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Services | Baomue",
  description: "Explore our comprehensive range of dental services including general, cosmetic, and specialized treatments.",
  openGraph: {
    title: "Our Services | Baomue",
    description: "Comprehensive dental care for the whole family",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([
    getServices(),
    getServiceCategories()
  ]);

  return (
    <main className="antialiased text-slate-600 bg-slate-50 min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto pb-20">
        <ServicesPageHeader 
          title="Our Services"
          description="Comprehensive dental care for the whole family"
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


