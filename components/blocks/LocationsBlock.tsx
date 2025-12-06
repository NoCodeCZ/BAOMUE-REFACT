import type { BlockLocations } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface LocationsBlockProps {
  data?: BlockLocations | null;
}

export default function LocationsBlock({ data }: LocationsBlockProps) {
  if (!data) return null;

  const sectionTitle = data.section_title ?? "พบกับเราที่สาขาสยาม";
  const sectionSubtitle = data.section_subtitle ?? "คลินิกทันตกรรมครบวงจร ใจกลางกรุงเทพฯ";
  const branchName = data.branch_name ?? "สาขาสยาม";
  const branchTag = data.branch_tag ?? "สาขาหลัก";
  const branchAddress = data.branch_address ?? "ชั้น 5 สยามพารากอน ถ.พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330";
  const branchHours = data.branch_hours ?? "เปิดทุกวัน 10:00 - 21:00 น.";
  const branchPhone = data.branch_phone ?? "096 915 9391";
  const mapEmbedUrl = data.map_embed_url ?? "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5461478889387!2d100.5299699!3d13.746287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecde3aee521%3A0x9f43939a2caf2963!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1234567890123!5m2!1sen!2sth";

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold mb-6">
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
              className="w-4 h-4"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            สาขาของเรา
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold text-slate-900 tracking-tight mb-6">
            {sectionTitle}
          </h2>
          <p className="text-xl text-slate-500">
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src={
                  getFileUrl(data.branch_image_url as any) ??
                  "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80"
                }
                alt={branchName}
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent rounded-3xl"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="inline-flex items-center gap-2 bg-[#1DAEE0] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                  {branchTag}
                </div>
                <h3 className="text-3xl font-semibold text-white mb-2">
                  {branchName}
                </h3>
                <p className="text-white/80 text-lg">
                  ชั้น 5 สยามพารากอน ถ.พระราม 1
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg">
              <h4 className="text-xl font-semibold text-slate-900 mb-6">
                ข้อมูลสาขา
              </h4>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
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
                      className="w-6 h-6 text-[#1DAEE0]"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">
                      ที่อยู่
                    </div>
                    <p className="text-slate-600">
                      {branchAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
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
                      className="w-6 h-6 text-[#1DAEE0]"
                    >
                      <path d="M12 6v6l4 2"></path>
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">
                      เวลาทำการ
                    </div>
                    <p className="text-slate-600">
                      {branchHours}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
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
                      className="w-6 h-6 text-[#1DAEE0]"
                    >
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">
                      โทรศัพท์
                    </div>
                    <p className="text-slate-600">
                      {branchPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex-1 h-14 bg-[#1DAEE0] text-white font-semibold rounded-xl hover:bg-[#0e9fd0] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
                ดูเส้นทาง
              </a>
              <a
                href="#"
                className="flex-1 h-14 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
                นัดหมายเลย
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

