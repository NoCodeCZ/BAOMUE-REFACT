import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceDetailBlock from "@/components/blocks/ServiceDetailBlock";
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
    { label: "หน้าแรก", href: "/" },
    { label: "บริการ", href: "/services" },
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

  // Load seed data for testing (provides fallback when Directus fields are empty)
  // NOTE: Using clear-aligner seed data as default template for ALL services
  // until proper data is added to Directus for each service
  const seedData = await import("@/data/services/clear-aligners-seed.json").then(m => m.default).catch(() => null);

  // Merge service with seed data for fields that are missing
  const enrichedService = {
    ...service,
    // Use seed data as fallback for empty fields (for testing purposes)
    features: service.features && (Array.isArray(service.features) ? service.features.length > 0 : true)
      ? service.features
      : seedData?.features,
    process_steps: service.process_steps && (Array.isArray(service.process_steps) ? service.process_steps.length > 0 : true)
      ? service.process_steps
      : seedData?.process_steps,
    results: service.results && (Array.isArray(service.results) ? service.results.length > 0 : true)
      ? service.results
      : seedData?.results,
    care_instructions: service.care_instructions && (Array.isArray(service.care_instructions) ? service.care_instructions.length > 0 : true)
      ? service.care_instructions
      : seedData?.care_instructions,
    suitability: service.suitability
      ? service.suitability
      : seedData?.suitability,
    pricing_plans: service.pricing_plans && (Array.isArray(service.pricing_plans) ? service.pricing_plans.length > 0 : true)
      ? service.pricing_plans
      : seedData?.pricing_plans,
    faqs: service.faqs && (Array.isArray(service.faqs) ? service.faqs.length > 0 : true)
      ? service.faqs
      : seedData?.faqs,
    // Also set stats for testing
    stats_cases: service.stats_cases || seedData?.stats_cases,
    stats_rating: service.stats_rating || seedData?.stats_rating,
    price_installment: service.price_installment || seedData?.price_installment,
    price_installment_months: service.price_installment_months || seedData?.price_installment_months,
    cta_booking_text: service.cta_booking_text || seedData?.cta_booking_text || "นัดปรึกษาฟรี",
    cta_booking_link: service.cta_booking_link || seedData?.cta_booking_link || "#booking",
    cta_line_text: service.cta_line_text || seedData?.cta_line_text || "แชทเลย",
    cta_line_link: service.cta_line_link || seedData?.cta_line_link || "https://line.me/ti/p/@baomue",
    portfolio_cases: service.portfolio_cases && (Array.isArray(service.portfolio_cases) ? service.portfolio_cases.length > 0 : true)
      ? service.portfolio_cases
      : seedData?.portfolio_cases,
  };

  // Create block data structure for ServiceDetailBlock
  const blockData = {
    id: 1,
    service: enrichedService,
    show_hero: true,
    show_features: true,
    show_process: true,
    show_results_care: true,
    show_pricing: true,
    show_faq: true,
    show_portfolio: true,
    show_booking: true,
  };

  return (
    <main className="antialiased text-slate-600 min-h-screen" style={{
      backgroundColor: '#f2f2f7',
      backgroundImage: `
        radial-gradient(ellipse 80% 50% at 50% -20%, #bfdbfe 0%, rgba(255, 255, 255, 0) 100%),
        radial-gradient(ellipse 80% 50% at 50% 120%, #dbeafe 0%, rgba(255, 255, 255, 0) 100%)
      `,
      backgroundAttachment: 'fixed'
    }}>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-2">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-[1120px] mx-auto px-4 pb-12">
        <ServiceDetailBlock data={blockData} />
      </div>

      <Footer />
    </main>
  );
}
