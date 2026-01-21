import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBlock from "@/components/blocks/ContactBlock";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
} from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ติดต่อ & นัดหมาย | BAOMUE Dental Clinic",
  description: "ติดต่อเราได้หลากหลายช่องทาง หรือนัดหมายออนไลน์ได้ตลอด 24 ชั่วโมง",
};

export default async function ContactPage() {
  // Try to get page with blocks from Directus
  let result = await getPageWithBlocks("contact");
  
  if (!result) {
    result = await getPageWithBlocksBatched("contact");
  }
  
  // Get contact block data from CMS if available
  let contactBlockData = null;

  if (result) {
    const { blocks } = result;
    const contactBlock = blocks.find(b => b.collection === 'block_contact');
    
    if (contactBlock) {
      contactBlockData = contactBlock.content;
    }
  }

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      
      {/* Contact Block - Standalone section with its own layout */}
      <ContactBlock data={contactBlockData} />

      <Footer />
    </main>
  );
}
