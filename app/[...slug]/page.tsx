import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageBuilder from "@/components/PageBuilder";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
  getFormById,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";

// Revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  // Resolve params (Next.js 15 async params)
  const { slug } = await params;
  
  // Convert slug array to string (e.g., ['about', 'team'] → 'about/team')
  // For home page, slug will be empty array []
  const slugString = slug.length === 0 ? 'home' : slug.join('/');
  
  // Check if this is an existing explicit route (services, blog)
  // These should not be handled by dynamic routing
  const explicitRoutes = ['services', 'blog'];
  if (slug.length > 0 && explicitRoutes.includes(slug[0])) {
    notFound();
  }

  // Try optimized query first
  let result = await getPageWithBlocks(slugString);
  
  // Fallback to batched approach
  if (!result) {
    result = await getPageWithBlocksBatched(slugString);
  }
  
  // Final fallback to original pattern
  if (!result) {
    const page = await getPageBySlug(slugString);
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

  const { page, blocks } = result;

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

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      <PageBuilder 
        blocks={blocks} 
        additionalProps={{ 
          locations,
          formDataMap
        }}
      />
    </main>
  );
}
