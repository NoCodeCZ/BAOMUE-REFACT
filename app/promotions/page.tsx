import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingBlock from "@/components/blocks/BookingBlock";
import PromotionsBlock from "@/components/blocks/PromotionsBlock";
import { getPageBySlug, getPageBlocks, getBlockContent } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "โปรโมชั่นทำฟัน - จัดฟัน ฟอกสีฟัน วีเนียร์ ราคาพิเศษ",
  description: "รวมโปรโมชั่นทำฟันประจำเดือน จัดฟัน Invisalign, Damon รากเทียม วีเนียร์ ฟอกสีฟัน Zoom ราคาพิเศษ ผ่อน 0% นัดปรึกษาฟรี",
  alternates: {
    canonical: "/promotions",
  },
  openGraph: {
    title: "โปรโมชั่นทำฟัน | BAOMUE Dental Clinic",
    description: "รวมโปรโมชั่นทำฟัน จัดฟัน รากเทียม วีเนียร์ ประจำเดือน ราคาพิเศษ",
    type: "website",
    url: "/promotions",
  },
};

export default async function PromotionsPage() {
  try {
    // Try block-based approach first (if promotions page is managed in Directus)
    const page = await getPageBySlug("promotions");
    
    if (page) {
      const pageBlocks = await getPageBlocks(page.id);
      const promotionsBlock = pageBlocks.find(
        (block: { id: number; page: number; collection: string; item: string; sort: number }) => block.collection === "block_promotions"
      );
      
      if (promotionsBlock) {
        const blockData = await getBlockContent(
          promotionsBlock.collection,
          promotionsBlock.item
        );
        
        return (
          <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
            <Header />
            {blockData ? (
              <PromotionsBlock data={blockData} />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">No promotions available.</p>
              </div>
            )}
            <BookingBlock />
            <Footer />
          </main>
        );
      }
    }
    
    // If no page found in Directus, show not found
    // Note: PromotionsBlock requires data prop, so we can't render it without block data
    notFound();
  } catch (error) {
    console.error("Error loading promotions page:", error);
    notFound();
  }
}

