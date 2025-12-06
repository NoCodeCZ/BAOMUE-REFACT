import type { Metadata } from "next";
import "./globals.css";
import { getGlobalSettings } from "@/lib/data";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

