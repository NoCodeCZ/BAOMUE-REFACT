import type { BlockLocations } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface LocationsBlockProps {
  data?: BlockLocations | null;
}

export default function LocationsBlock({ data }: LocationsBlockProps) {
  if (!data) return null;

  const sectionTitle = data.section_title ?? "พบกับเรา";
  const sectionSubtitle = data.section_subtitle ?? "คลินิกทันตกรรมครบวงจร ปรึกษาฟรี ไม่มีค่าใช้จ่าย";
  const branchName = data.branch_name ?? "สาขานวลจันทร์";
  const branchTag = data.branch_tag ?? "สาขาหลัก";
  const branchAddress = data.branch_address ?? "51/14 หมู่บ้าน เสนา88 คลองสำเวา 8 ถนน นวลจันทร์ กรุงเทพฯ 10230";
  const branchHours = data.branch_hours ?? "เปิดทุกวัน 10:30 - 19:30 น.";
  const branchPhone = data.branch_phone ?? "065 291 6466";

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="md:text-5xl text-4xl font-semibold tracking-tight mb-6" style={{ color: '#003888' }}>
            {sectionTitle}
          </h2>
          <p className="text-xl" style={{ color: '#1DAEE0' }}>{sectionSubtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Branch Image & Info */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img
                src={
                  getFileUrl(data.branch_image_url as any) ??
                  "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80"
                }
                alt={branchName}
                className="w-full h-[350px] object-cover"
              />
              <div className="bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent absolute inset-0 rounded-3xl"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-flex text-sm font-medium text-white bg-[#F59E0B] rounded-full mb-3 px-3 py-1.5 gap-x-2 gap-y-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {branchTag}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">{branchName}</h3>
                <p className="text-white/80 text-base">{branchAddress}</p>
              </div>
            </div>
          </div>

          {/* Branch Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
              <h4 className="text-xl font-semibold mb-6" style={{ color: '#003888' }}>ข้อมูลสาขา</h4>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: '#003888' }}>ที่อยู่</div>
                    <p className="text-slate-600">{branchAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                      <path d="M12 6v6l4 2"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: '#003888' }}>เวลาทำการ</div>
                    <p className="text-slate-600">{branchHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold mb-1" style={{ color: '#003888' }}>โทรศัพท์</div>
                    <p className="text-slate-600">{branchPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex-1 hover:bg-[#0e9fd0] transition-colors flex items-center justify-center gap-2 font-medium text-white bg-[#003888] h-14 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                ดูเส้นทาง
              </a>
              <a
                href="#"
                className="flex-1 hover:opacity-90 transition-colors flex items-center justify-center gap-2 font-medium text-slate-50 h-14 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgb(26, 95, 180) 0%, rgb(53, 132, 228) 100%)' }}
              >
                นัดหมายเลย
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
