import type { Metadata } from "next";
import "./globals.css";
import { getGlobalSettings } from "@/lib/data";
import { GTMScript, GTMNoScript } from "@/lib/analytics/gtm";

// Revalidate every 60 seconds to ensure fresh settings from Directus
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  return {
    title: settings?.site_name || "BAOMUE Dental Clinic | คลินิกทันตกรรมเบามือ",
    description:
      settings?.site_description ||
      "คลินิกทันตกรรมเบามือ (Baomue Dental Clinic) – บริการทันตกรรมครบวงจร จัดฟัน วีเนียร์ รากเทียม ฟอกสีฟัน",
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
    "name": settings?.site_name || "BAOMUE Dental Clinic",
    "description": settings?.site_description,
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "telephone": "+66-65-291-6466",
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
      </head>
      <body className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
        <GTMNoScript />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}

