import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceDetailHero from "@/components/services/ServiceDetailHero";
import ServiceDetailContent from "@/components/services/ServiceDetailContent";
import RelatedServices from "@/components/services/RelatedServices";
import { getServiceBySlug, getServices } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const imageUrl = service.hero_image
    ? getFileUrl(service.hero_image as any)
    : undefined;

  return {
    title: `${service.name} | Baomue`,
    description: service.short_description || service.seo_description,
    openGraph: {
      title: service.name,
      description: service.short_description || service.seo_description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getServices()
  ]);

  if (!service) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.name },
  ];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.short_description || service.seo_description,
    provider: {
      "@type": "Dentist",
      name: "Baomue",
    },
    ...(service.price_from && {
      offers: {
        "@type": "Offer",
        price: service.price_from,
        priceCurrency: "THB",
      },
    }),
    ...(service.hero_image && {
      image: getFileUrl(service.hero_image as any),
    }),
  };

  return (
    <main className="antialiased text-slate-600 bg-white min-h-screen">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <ServiceDetailHero service={service} />
        
        <ServiceDetailContent service={service} />
        
        <RelatedServices 
          services={allServices} 
          currentServiceId={service.id} 
        />
      </div>
      
      <Footer />
    </main>
  );
}


