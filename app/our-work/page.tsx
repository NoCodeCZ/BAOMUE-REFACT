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
      <PageBuilder blocks={blocksWithContent} />
    </main>
  );
}

