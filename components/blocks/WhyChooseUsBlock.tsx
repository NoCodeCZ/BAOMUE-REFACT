import type { BlockWhyChooseUs } from "@/lib/types";

interface WhyChooseUsBlockProps {
  data?: BlockWhyChooseUs | null;
}

export default function WhyChooseUsBlock({ data }: WhyChooseUsBlockProps) {
  if (!data) return null;

  const title = data.title ?? "มาตรฐานที่คุณไว้วางใจได้";
  const subtitle = data.subtitle ?? "สิ่งที่ทำให้ Tooth Box แตกต่างจากคลินิกทั่วไป";
  const point1Title = data.point_1_title ?? "เทคโนโลยีทันสมัย";
  const point1Text = data.point_1_text ?? "นำเข้าเครื่องมือและอุปกรณ์จากยุโรปและอเมริกา รวมถึงระบบ Digital X-Ray และ 3D Scanner";
  const point2Title = data.point_2_title ?? "ทีมแพทย์ผู้เชี่ยวชาญ";
  const point2Text = data.point_2_text ?? "ทันตแพทย์ทุกท่านจบการศึกษาจากมหาวิทยาลัยชั้นนำ พร้อมประสบการณ์เฉพาะทาง";
  const point3Title = data.point_3_title ?? "สะดวก รวดเร็ว";
  const point3Text = data.point_3_text ?? "จองคิวออนไลน์ได้ตลอด 24 ชั่วโมง เปิดให้บริการทุกวัน ไม่ต้องรอคิวนาน";
  const point4Title = data.point_4_title ?? "ผ่อนชำระ 0%";
  const point4Text = data.point_4_text ?? "รองรับบัตรเครดิตทุกธนาคาร ผ่อนชำระได้สูงสุด 10 เดือน ไม่มีดอกเบี้ย";

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
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
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>
            ทำไมต้องเลือกเรา
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80"
              alt="Treatment Room"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#1DAEE0] rounded-2xl flex items-center justify-center shrink-0">
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
                  className="w-7 h-7 text-white"
                >
                  <path d="M6 18h8"></path>
                  <path d="M3 22h18"></path>
                  <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                  <path d="M9 14h2"></path>
                  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
                  <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {point1Title}
                </h3>
                <p className="text-slate-600">
                  {point1Text}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#1DAEE0] rounded-2xl flex items-center justify-center shrink-0">
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
                  className="w-7 h-7 text-white"
                >
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
                  <path d="M22 10v6"></path>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {point2Title}
                </h3>
                <p className="text-slate-600">
                  {point2Text}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#1DAEE0] rounded-2xl flex items-center justify-center shrink-0">
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
                  className="w-7 h-7 text-white"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {point3Title}
                </h3>
                <p className="text-slate-600">
                  {point3Text}
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-14 h-14 bg-[#1DAEE0] rounded-2xl flex items-center justify-center shrink-0">
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
                  className="w-7 h-7 text-white"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {point4Title}
                </h3>
                <p className="text-slate-600">
                  {point4Text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

