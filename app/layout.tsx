import type { Metadata } from "next";
import "./globals.css";
import { getGlobalSettings } from "@/lib/data";
import { GTMScript, GTMNoScript } from "@/lib/analytics/gtm";

// Revalidate every 60 seconds to ensure fresh settings from Directus
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  return {
    title: settings?.site_name || "Tooth Box Dental Clinic",
    description:
      settings?.site_description ||
      "คลินิกทันตกรรม Tooth Box Dental Clinic – บริการทันตกรรมครบวงจร ใจกลางกรุงเทพฯ",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": settings?.site_name || "Tooth Box Dental Clinic",
    "description": settings?.site_description,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "telephone": "+66-96-915-9391",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangkok",
      "addressCountry": "TH",
    },
    "priceRange": "$$",
  };

  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <GTMScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
        <GTMNoScript />
        {children}
      </body>
    </html>
  );
}

