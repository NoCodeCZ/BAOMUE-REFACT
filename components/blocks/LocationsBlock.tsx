import type { BlockLocations } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface LocationsBlockProps {
  data?: BlockLocations | null;
}

export default function LocationsBlock({ data }: LocationsBlockProps) {
  if (!data) return null;

  const sectionTitle = data.section_title ?? "คลินิกทันตกรรมครบวงจร";
  const sectionSubtitle = data.section_subtitle ?? "พร้อมให้บริการคุณ";
  const branchName = data.branch_name ?? "สำนักงานใหญ่";
  const branchTag = data.branch_tag ?? "สาขาหลัก";
  const branchAddress = data.branch_address ?? "51/14 หมู่บ้าน เสนา88 คลองลำเจียก 8 ถนน นวลจันทร์ กรุงเทพฯ 10230";
  const branchHours = data.branch_hours ?? "เปิดทุกวัน 10:30 - 19:30 น.";
  const branchPhone = data.branch_phone ?? "065 291 6466";
  const branchEmail = "Baomuedentalclinic@gmail.com";

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="md:text-6xl text-4xl font-bold tracking-tight mb-4" style={{ color: '#003888' }}>
            {sectionTitle}
          </h2>
          <p className="md:text-3xl text-2xl font-medium" style={{ color: '#1DAEE0' }}>{sectionSubtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Branch Image */}
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[420px]">
            <img
              src={
                getFileUrl(data.branch_image_url as any) ??
                "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80"
              }
              alt={branchName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Branch Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg h-[420px] flex flex-col justify-center">
            <h4 className="text-xl font-semibold mb-8" style={{ color: '#003888' }}>ติดต่อสอบถามหรือนัดหมายได้ทุกช่องทาง</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold mb-0.5 text-base" style={{ color: '#003888' }}>{branchName}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{branchAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold mb-0.5 text-base" style={{ color: '#003888' }}>โทรศัพท์</div>
                  <p className="text-slate-600 text-sm">{branchPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                    <path d="M12 6v6l4 2"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold mb-0.5 text-base" style={{ color: '#003888' }}>เวลาทำการ</div>
                  <p className="text-slate-600 text-sm">{branchHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1DAEE0' }}>
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold mb-0.5 text-base" style={{ color: '#003888' }}>อีเมล</div>
                  <p className="text-slate-600 text-sm">{branchEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button - Centered below */}
        <div className="text-center mt-10 max-w-md mx-auto">
          <a
            href="#booking"
            className="w-full hover:opacity-90 transition-all hover:shadow-xl flex items-center justify-center gap-2 font-semibold text-white h-14 rounded-full text-lg"
            style={{ background: 'linear-gradient(135deg, #003888 0%, #1DAEE0 100%)' }}
          >
            จองคิวออนไลน์
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>

        {/* Google Maps */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1937.2!2d100.6388676!3d13.8202109!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d63397c753a35%3A0x5bf24a307a48d354!2z4LiE4Lil4Li04LiZ4Li04LiB4LiX4Lix4LiZ4LiV4LiB4Lij4Lij4Lih4LmA4Lia4Liy4Lih4Li34LitIChCYW9tdWUgRGVudGFsIENsaW5pYyk!5e0!3m2!1sth!2sth"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Baomue Dental Clinic Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
