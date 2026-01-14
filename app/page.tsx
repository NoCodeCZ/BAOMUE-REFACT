import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBuilder from "@/components/PageBuilder";
import Link from "next/link";
import {
  getPageWithBlocks,
  getPageWithBlocksBatched,
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
  getFormById,
} from "@/lib/data";
import type { PageBlockWithContent, BlockType, BlockLocations, Form } from "@/lib/types";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

// Beautiful fallback homepage when Directus data is not available
function FallbackHomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-xs font-semibold text-blue-700 tracking-wide">รับผู้ป่วยใหม่</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-yellow-400">เบามือ</span>
                <span className="text-slate-900">อย่างโปร</span>
                <br />
                <span className="text-slate-700">เพื่อรอยยิ้มที่เป๊ะทุกองศา</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                บอกลาเสียงกรอที่น่ากังวลและความเจ็บปวด ด้วยเทคโนโลยี Silent Technology 
                และเทคนิคการรักษาที่นุ่มนวลเป็นพิเศษ ให้คุณหลับสบายตลอดการรักษา
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="group h-14 px-8 rounded-2xl bg-blue-600 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>จองคิวออนไลน์</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
                <Link
                  href="/services"
                  className="h-14 px-8 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-semibold text-lg flex items-center justify-center hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm"
                >
                  ดูบริการของเรา
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-medium mb-1">Call Center</div>
                    <div className="text-slate-900 font-semibold text-lg">096 915 9391</div>
                  </div>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                    <span className="font-bold text-[10px]">LINE</span>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-medium mb-1">Line Official</div>
                    <div className="text-slate-900 font-semibold text-lg">@BAOMUE</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative hidden lg:block h-[600px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md h-[500px] rounded-[40px] overflow-hidden border-4 border-white shadow-2xl rotate-3">
                  <img 
                    src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ec7f76a9-b773-48f2-ad44-c1ef877851dc_1600w.png"
                    alt="Professional Dental Care" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">บริการของเรา</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              บริการทันตกรรมครบวงจรด้วยเทคโนโลยีทันสมัยและทีมแพทย์ผู้เชี่ยวชาญ
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "ทันตกรรมทั่วไป", desc: "ตรวจรักษาและดูแลสุขภาพช่องปาก" },
              { title: "จัดฟัน", desc: "แก้ไขปัญหาการเรียงตัวของฟัน" },
              { title: "รากเทียม", desc: "ทดแทนฟันที่สูญเสียไปอย่างถาวร" },
              { title: "ฟอกสีฟัน", desc: "ฟอกสีฟันให้ขาวขึ้นอย่างปลอดภัย" },
              { title: "วีเนียร์", desc: "ปรับปรุงรูปร่างและสีของฟัน" },
              { title: "ทำฟันปลอม", desc: "ทดแทนฟันที่สูญเสียไป" },
            ].map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              ดูบริการทั้งหมด
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default async function HomePage() {
  // Try optimized query first
  let result = await getPageWithBlocks("home");
  
  // Fallback to batched approach if nested query not supported
  if (!result) {
    result = await getPageWithBlocksBatched("home");
  }
  
  // If no result after all attempts, show fallback homepage
  // This handles cases where Directus is unavailable or page doesn't exist
  if (!result || !result.page) {
    return <FallbackHomePage />;
  }

  const { page, blocks: blocksWithContent } = result;

  // Extract locations for ContactBlock special case
  const locations = blocksWithContent.find(b => b.collection === 'block_locations')?.content as BlockLocations | null;

  // Fetch form data for any block_form blocks
  const formDataMap: Record<number, Form | null> = {};
  const formBlocks = blocksWithContent.filter(b => b.collection === 'block_form');
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
        blocks={blocksWithContent} 
        additionalProps={{ 
          locations,
          formDataMap
        }}
      />
      <Footer />
    </main>
  );
}
