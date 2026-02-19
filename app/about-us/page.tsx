import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import AboutUsPremiumBlock from "@/components/blocks/AboutUsPremiumBlock";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
  getAboutUsBlock,
  getFormById,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | Baomue Dental Clinic",
  description: "รู้จักคลินิกทันตกรรมเบามือ คลินิกที่ใส่ใจทุกรอยยิ้ม ด้วยเทคนิค Gentle Touch และทีมแพทย์เฉพาะทาง",
};

export default async function AboutUsPage() {
  // Fetch page blocks and the homepage about-us data in parallel
  let result = await getPageWithBlocks("about-us");
  if (!result) {
    result = await getPageWithBlocksBatched("about-us");
  }

  // Final fallback
  if (!result) {
    const page = await getPageBySlug("about-us");
    if (!page) notFound();

    const pageBlocks = await getPageBlocks(page.id);
    const blocksWithContent = await Promise.all(
      pageBlocks.map(async (block: { id: number; page: number; collection: string; item: string; sort: number }) => ({
        ...block,
        collection: block.collection as BlockType,
        content: await getBlockContent(block.collection, block.item),
      }))
    ) as PageBlockWithContent[];

    result = { page, blocks: blocksWithContent };
  }

  const { blocks } = result;

  // Fetch the homepage about-us block (item:1) for the premium section
  const aboutUsData = await getAboutUsBlock(1);

  // Extract locations for ContactBlock special case
  const locations = blocks.find(b => b.collection === 'block_locations')?.content as BlockLocations | null;

  // Fetch form data for any block_form blocks
  const formDataMap: Record<number, Form | null> = {};
  const formBlocks = blocks.filter(b => b.collection === 'block_form');
  await Promise.all(
    formBlocks.map(async (block) => {
      if (block.content && 'form' in block.content && block.content.form) {
        const formData = await getFormById(block.content.form as number);
        formDataMap[block.id] = formData;
      }
    })
  );

  // Split blocks: render premium about section instead of the original block_about_us,
  // then continue with the rest (team, booking, footer)
  const blocksBeforeAbout = blocks.filter(b => b.collection !== 'block_about_us' && b.sort < (blocks.find(t => t.collection === 'block_team')?.sort ?? 999));
  const blocksFromTeam = blocks.filter(b => b.collection !== 'block_about_us' && b.sort >= (blocks.find(t => t.collection === 'block_team')?.sort ?? 999));

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />

      {/* Blocks before team (e.g. hero, page_header) — excluding original about_us */}
      {blocksBeforeAbout.length > 0 && (
        <PageBuilder
          blocks={blocksBeforeAbout}
          additionalProps={{ locations, formDataMap }}
        />
      )}

      {/* Premium About Us Section */}
      <AboutUsPremiumBlock data={aboutUsData} />

      {/* Remaining blocks: team, booking, footer */}
      {blocksFromTeam.length > 0 && (
        <PageBuilder
          blocks={blocksFromTeam}
          additionalProps={{ locations, formDataMap }}
        />
      )}
    </main>
  );
}
