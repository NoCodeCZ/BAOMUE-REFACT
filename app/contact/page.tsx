import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBlock from "@/components/blocks/ContactBlock";
import BookingBlock from "@/components/blocks/BookingBlock";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
} from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ติดต่อเรา & นัดหมายออนไลน์",
  description: "ติดต่อคลินิกทันตกรรมเบามือ โทร 065-291-6466 หรือ Line @baomuedentalclinic นัดหมายออนไลน์ได้ตลอด 24 ชั่วโมง เปิดทุกวัน 10.30-19.30 น.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  // Try to get page with blocks from Directus
  let result = await getPageWithBlocks("contact");
  
  if (!result) {
    result = await getPageWithBlocksBatched("contact");
  }
  
  // Get block data from CMS if available
  let contactBlockData = null;
  let bookingBlockData = null;

  if (result) {
    const { blocks } = result;
    const contactBlock = blocks.find(b => b.collection === 'block_contact');
    const bookingBlock = blocks.find(b => b.collection === 'block_booking');
    
    if (contactBlock) {
      contactBlockData = contactBlock.content;
    }
    if (bookingBlock) {
      bookingBlockData = bookingBlock.content;
    }
  }

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />
      
      {/* Contact Block - Standalone section with its own layout */}
      <ContactBlock data={contactBlockData} />
      <BookingBlock data={bookingBlockData} />

      <Footer />
    </main>
  );
}
