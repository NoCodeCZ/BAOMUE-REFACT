import Header from "@/components/Header";
import HeroBlock from "@/components/blocks/HeroBlock";
import TextBlock from "@/components/blocks/TextBlock";
import ContactBlock from "@/components/blocks/ContactBlock";
import AboutUsBlock from "@/components/blocks/AboutUsBlock";
import WhyChooseUsBlock from "@/components/blocks/WhyChooseUsBlock";
import TeamBlock from "@/components/blocks/TeamBlock";
import SignatureTreatmentBlock from "@/components/blocks/SignatureTreatmentBlock";
import SafetyBannerBlock from "@/components/blocks/SafetyBannerBlock";
import ServicesBlock from "@/components/blocks/ServicesBlock";
import LocationsBlock from "@/components/blocks/LocationsBlock";
import BookingBlock from "@/components/blocks/BookingBlock";
import {
  getPageBySlug,
  getPageBlocks,
  getBlockContent,
} from "@/lib/data";

// Revalidate every 60 seconds to ensure fresh content from Directus
export const revalidate = 60;

export default async function HomePage() {
  const page = await getPageBySlug("home");

  let blocksWithContent: any[] = [];

  if (page) {
    const pageBlocks = await getPageBlocks(page.id);
    blocksWithContent = await Promise.all(
      pageBlocks.map(async (block: any) => ({
        ...block,
        content: await getBlockContent(block.collection, block.item),
      }))
    );
  }

  const findBlock = (collection: string) =>
    blocksWithContent.find((b) => b.collection === collection)?.content as any;

  const hero = findBlock("block_hero");
  const text = findBlock("block_text");
  const about = findBlock("block_about_us");
  const why = findBlock("block_why_choose_us");
  const team = findBlock("block_team");
  const signature = findBlock("block_signature_treatment");
  const safety = findBlock("block_safety_banner");
  const services = findBlock("block_services");
  const locations = findBlock("block_locations");
  const booking = findBlock("block_booking");
  const contact = findBlock("block_contact");

  return (
    <main className="antialiased text-slate-600 bg-white selection:bg-cyan-200 selection:text-cyan-900">
      <Header />

      {hero && <HeroBlock data={hero} />}
      {text && <TextBlock data={text} />}
      {about && <AboutUsBlock data={about} />}
      {why && <WhyChooseUsBlock data={why} />}
      {team && <TeamBlock data={team} />}
      {signature && <SignatureTreatmentBlock data={signature} />}
      {safety && <SafetyBannerBlock data={safety} />}
      {services && <ServicesBlock data={services} />}
      {locations && <LocationsBlock data={locations} />}
      {booking && <BookingBlock data={booking} />}
      {contact && <ContactBlock data={contact} locations={locations} />}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s5-3 5-9-2-10-5-10-5 4-5 10 5 9 5 9z"></path>
                </svg>
                <span className="text-2xl font-bold text-white tracking-tight">
                  TOOTH BOX
                </span>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                สร้างรอยยิ้มที่มั่นใจ ด้วยบริการที่ใส่ใจทุกรายละเอียด
                โดยทีมทันตแพทย์ผู้เชี่ยวชาญ
              </p>

              <div className="flex gap-4 mb-8">
                {[
                  "facebook",
                  "instagram",
                  "youtube",
                  "other",
                ].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-[#1DAEE0] hover:text-white transition-colors"
                  >
                    <span className="text-xs uppercase">
                      {social[0].toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 inline-block">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 100 100">
                      <rect fill="#000" x="10" y="10" width="20" height="20"></rect>
                      <rect fill="#000" x="70" y="10" width="20" height="20"></rect>
                      <rect fill="#000" x="10" y="70" width="20" height="20"></rect>
                      <rect fill="#000" x="40" y="40" width="20" height="20"></rect>
                      <rect fill="#000" x="35" y="10" width="10" height="10"></rect>
                      <rect fill="#000" x="55" y="10" width="10" height="10"></rect>
                      <rect fill="#000" x="10" y="35" width="10" height="10"></rect>
                      <rect fill="#000" x="10" y="55" width="10" height="10"></rect>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">Add LINE</div>
                    <div className="text-slate-500 text-sm">@TOOTHBOX</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-6">บริการ</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    ทันตกรรมทั่วไป
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    จัดฟัน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    รากเทียม
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    ฟอกสีฟัน
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    วีเนียร์
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-6">ข้อมูล</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    เกี่ยวกับเรา
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    ทีมทันตแพทย์
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    สาขา
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    บทความ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1DAEE0] transition-colors">
                    โปรโมชั่น
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-lg mb-6">ติดต่อ</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
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
                    className="w-5 h-5 text-[#1DAEE0]"
                  >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                  <span>096 915 9391</span>
                </li>
                <li className="flex items-center gap-3">
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
                    className="w-5 h-5 text-[#1DAEE0]"
                  >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  </svg>
                  <span>contact@toothbox.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-[#06c755] rounded flex items-center justify-center text-white text-[8px] font-black">
                    LINE
                  </span>
                  <span>@TOOTHBOX</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Tooth Box Dental Clinic. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
