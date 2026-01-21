import type { BlockWhyChooseUs } from "@/lib/types";

interface WhyChooseUsBlockProps {
  data?: BlockWhyChooseUs | null;
}

export default function WhyChooseUsBlock({ data }: WhyChooseUsBlockProps) {
  if (!data) return null;

  const title = data.title ?? "มาตรฐานการดูแลที่สัมผัสได้";
  const subtitle = data.subtitle ?? "คลินิกทันตกรรมเบามือ ยกระดับการรักษาด้วยเทคโนโลยีขั้นสูง และศิลปะแห่งความเบามือ";
  const point1Title = data.point_1_title ?? "นวัตกรรมถนอมฟัน";
  const point1Text = data.point_1_text ?? "ใช้เครื่องมือนำเข้ามาตรฐานสากลที่ทำงานเงียบและแม่นยำเพื่อลดความกังวลในทุกขั้นตอน";
  const point2Title = data.point_2_title ?? "ทีมแพทย์มือเบา";
  const point2Text = data.point_2_text ?? "ทันตแพทย์เฉพาะทางผู้เชี่ยวชาญ ที่ให้ความสำคัญกับความอ่อนโยนและนุ่มนวลเป็นอันดับหนึ่ง";
  const point3Title = data.point_3_title ?? "ดูแลคุณทันที";
  const point3Text = data.point_3_text ?? "จองคิวออนไลน์ง่ายๆ ตลอด 24 ชม. พร้อมการบริหารจัดการเวลาที่รวดเร็วเพื่อลูกค้าคนสำคัญ";
  const point4Title = data.point_4_title ?? "ยิ้มได้สบายใจ";
  const point4Text = data.point_4_text ?? "โปรแกรมแบ่งจ่าย 0% นานสูงสุด 10 เดือน มอบอิสระทางการเงินควบคู่ไปกับผลลัพธ์ที่สมบูรณ์แบบ";

  return (
    <section className="lg:py-32 bg-slate-50 pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex text-sm font-semibold text-slate-50 bg-[#3B82F6] rounded-full mb-6 px-4 py-2 gap-x-2 gap-y-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
            ทำไมต้องเลือกเรา
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold tracking-tight mb-6" style={{ color: '#003888', fontFamily: 'Prompt', lineHeight: '48px', wordWrap: 'break-word' }}>
            {title}
          </h2>
          <p className="text-xl text-[#003888]">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a899f98f-0d75-4990-905e-9433e6fbc56c_1600w.jpg"
              alt="Treatment Room"
              className="w-full h-[400px] object-cover bg-center"
            />
          </div>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="flex shrink-0 bg-blue-800 w-14 h-14 rounded-2xl items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                  <path d="M6 18h8"></path>
                  <path d="M3 22h18"></path>
                  <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                  <path d="M9 14h2"></path>
                  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
                  <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003888] mb-2">{point1Title}</h3>
                <p>{point1Text}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex shrink-0 bg-blue-800 w-14 h-14 rounded-2xl items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003888] mb-2">{point2Title}</h3>
                <p>{point2Text}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex shrink-0 bg-blue-800 w-14 h-14 rounded-2xl items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003888] mb-2">{point3Title}</h3>
                <p className="text-slate-600">{point3Text}</p>
              </div>
            </div>
            <div className="flex gap-5 gap-x-5 gap-y-5">
              <div className="flex shrink-0 bg-blue-800 w-14 h-14 rounded-2xl items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-white">
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#003888] mb-2">{point4Title}</h3>
                <p className="text-slate-600">{point4Text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
