import type { Metadata } from "next";
import "./globals.css";
import { getGlobalSettings } from "@/lib/data";
import { GTMScript, GTMNoScript } from "@/lib/analytics/gtm";
import { MetaPixelScript } from "@/lib/analytics/meta-pixel";
import MetaPixelEvents from "@/components/analytics/MetaPixelEvents";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://baomuedentalclinic.com";

// Revalidate every 60 seconds to ensure fresh settings from Directus
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const siteName = settings?.site_name || "BAOMUE Dental Clinic | คลินิกทันตกรรมเบามือ";
  const siteDescription =
    settings?.site_description ||
    "คลินิกทันตกรรมเบามือ (Baomue Dental Clinic) – บริการทันตกรรมครบวงจร จัดฟัน วีเนียร์ รากเทียม ฟอกสีฟัน ดูแลโดยทันตแพทย์เฉพาะทาง";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${settings?.site_name || "BAOMUE Dental Clinic"}`,
    },
    description: siteDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url: SITE_URL,
      siteName: settings?.site_name || "BAOMUE Dental Clinic",
      title: siteName,
      description: siteDescription,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: "BAOMUE Dental Clinic - คลินิกทันตกรรมเบามือ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: ["/og-default.png"],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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
    "alternateName": "คลินิกทันตกรรมเบามือ",
    "description": settings?.site_description || "คลินิกทันตกรรมเบามือ บริการทันตกรรมครบวงจร จัดฟัน วีเนียร์ รากเทียม ฟอกสีฟัน",
    "url": SITE_URL,
    "telephone": "+66652916466",
    "image": `${SITE_URL}/og-default.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ซอยอ่อนนุช 17 แยก 17",
      "addressLocality": "สวนหลวง",
      "addressRegion": "กรุงเทพมหานคร",
      "postalCode": "10250",
      "addressCountry": "TH",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.7115,
      "longitude": 100.6345,
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:30",
      "closes": "19:30",
    },
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, PromptPay",
    "areaServed": {
      "@type": "City",
      "name": "กรุงเทพมหานคร",
    },
    "sameAs": [
      "https://www.facebook.com/baomuedentalclinic",
      "https://line.me/ti/p/@baomue",
    ],
  };

  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <GTMScript />
        <MetaPixelScript />
      </head>
      <body className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
        <GTMNoScript />
        <MetaPixelEvents />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </body>
    </html>
  );
}

