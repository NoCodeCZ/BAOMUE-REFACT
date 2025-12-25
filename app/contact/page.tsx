import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactBlock from "@/components/blocks/ContactBlock";
import FormBlock from "@/components/blocks/FormBlock";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
  getFormById,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType, Form } from "@/lib/types";
import { CalendarCheck } from "lucide-react";
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
  
  // If no CMS page exists, use hardcoded blocks
  let contactBlock = null;
  let formBlock = null;
  let formData: Form | null = null;

  if (result) {
    const { blocks } = result;
    const contactBlockData = blocks.find(b => b.collection === 'block_contact');
    const formBlockData = blocks.find(b => b.collection === 'block_form');
    
    if (contactBlockData) {
      contactBlock = contactBlockData.content;
    }
    
    if (formBlockData && formBlockData.content && 'form' in formBlockData.content && formBlockData.content.form) {
      formBlock = formBlockData.content;
      formData = await getFormById(formBlockData.content.form as number);
    }
  } else {
    // Fallback: Fetch blocks directly if page doesn't exist in CMS
    // This allows page to work even if not configured in Directus yet
    // In production, you'd want to create the page in Directus
  }

  return (
    <main className="antialiased bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 bg-[#F8F9FB]">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>นัดหมายออนไลน์</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            ติดต่อ & จองคิว
          </h1>
          <p className="text-slate-500 text-lg">
            ติดต่อเราได้หลากหลายช่องทาง หรือนัดหมายออนไลน์ได้ตลอด 24 ชั่วโมง
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5">
            <ContactBlock data={contactBlock} />
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">ฟอร์มนัดหมาย</h2>
                  <p className="text-slate-500 text-sm">กรอกข้อมูลเพื่อจองคิว</p>
                </div>
              </div>
              <FormBlock data={formBlock} formData={formData} compact={true} />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-500 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Call Center</div>
              <div className="text-xs text-slate-500">พร้อมให้บริการทุกวัน 10:30-19:30</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">ตอบกลับรวดเร็ว</div>
              <div className="text-xs text-slate-500">LINE ตอบกลับภายใน 5 นาที</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-500 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">รีวิว 4.9/5</div>
              <div className="text-xs text-slate-500">จากลูกค้ากว่า 2,000+ คน</div>
            </div>
          </div>
        </div>

        {/* Footer Privacy Notice */}
        <div className="mt-12 text-center border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            BAOMUE Dental Clinic ให้ความสำคัญกับความเป็นส่วนตัวของคุณ ข้อมูลที่ท่านให้ไว้จะถูกเก็บรักษาอย่างปลอดภัยและใช้เพื่อการนัดหมายเท่านั้น
            หมายเหตุ: อ่านเพิ่มเติมได้ที่{" "}
            <a href="#" className="text-blue-500 hover:underline">
              นโยบายความเป็นส่วนตัว
            </a>{" "}
            |{" "}
            <a href="#" className="text-blue-500 hover:underline">
              ข้อกำหนดการใช้งาน
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

