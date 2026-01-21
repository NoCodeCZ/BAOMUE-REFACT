import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType } from "@/lib/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

// SEO metadata
export const metadata: Metadata = {
  title: "ผลงานของเรา | BAOMUE Dental Clinic",
  description: "ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม พร้อมรายละเอียดขั้นตอนและระยะเวลาการรักษา",
  openGraph: {
    title: "ผลงานของเรา | BAOMUE Dental Clinic",
    description: "ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม",
    type: "website",
  },
};

// Hero Section Component
function OurWorkHero() {
  return (
    <section className="pt-16 pb-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            ผลงานที่ภาคภูมิใจ
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl font-semibold text-[#003888] tracking-tight mb-6"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
          >
            Our Work
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-[#003888] mb-4">
            ผลงานจริงจากคนไข้ของเรา
          </p>

          {/* Description */}
          <p className="text-base text-[#003888] max-w-xl mx-auto">
            ดูผลลัพธ์การรักษาจริงจากผู้ที่ไว้วางใจให้เราดูแลรอยยิ้ม พร้อมรายละเอียดขั้นตอนและระยะเวลาการรักษา
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function OurWorkPage() {
  // Try optimized query first
  let result = await getPageWithBlocks("our-work");

  // Fallback to batched approach if nested query not supported
  if (!result) {
    result = await getPageWithBlocksBatched("our-work");
  }

  // Final fallback to original pattern (backward compatibility)
  if (!result) {
    const page = await getPageBySlug("our-work");
    if (!page) {
      notFound();
    }

    const pageBlocks = await getPageBlocks(page.id);
    const blocksWithContent = await Promise.all(
      pageBlocks.map(async (block: { id: number; page: number; collection: string; item: string; sort: number; hide_block?: boolean }) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];

    result = { page, blocks: blocksWithContent };
  }

  const { page, blocks: blocksWithContent } = result;

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <OurWorkHero />
      <PageBuilder blocks={blocksWithContent} />
    </main>
  );
}

