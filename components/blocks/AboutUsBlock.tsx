import type { BlockAboutUs } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface AboutUsBlockProps {
  data?: BlockAboutUs | null;
}

export default function AboutUsBlock({ data }: AboutUsBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "ABOUT US!";
  const subtitle = data.subtitle ?? "คลินิกทันตกรรมโซเดนท์";
  const paragraph1 = data.paragraph_1 ?? "ก่อตั้งโดยทีมทันตแพทย์เฉพาะทาง ที่มีความตั้งใจจะสร้างคลินิกทันตกรรมที่อบอุ่น ผ่อนคลาย ให้ความรู้สึกเหมือนมาพักผ่อน ไม่ใช่การมาทำฟันที่น่ากลัว ด้วยความใส่ใจในทุกรายละเอียด ตั้งแต่การออกแบบสถานที่ บรรยากาศ กลิ่น และเสียงเพลง เพื่อให้คนไข้รู้สึกผ่อนคลายที่สุด";
  const paragraph2 = data.paragraph_2 ?? "ที่โซเดนท์ เราให้ความสำคัญกับ \"คุณภาพ\" และ \"มาตรฐาน\" เป็นอันดับหนึ่ง เครื่องมือและอุปกรณ์ทุกชิ้นผ่านการคัดสรรอย่างดี ระบบปลอดเชื้อที่ได้มาตรฐานสากล เพื่อความปลอดภัยสูงสุดของคนไข้ ไม่ว่าจะเป็นงานทันตกรรมทั่วไป หรือการรักษาที่ซับซ้อน เราพร้อมดูแลด้วยความเชี่ยวชาญ";
  const paragraph3 = data.paragraph_3 ?? "ไม่ว่าจะเป็นการจัดฟัน วีเนียร์ รากเทียม หรือการทำฟันเด็ก เรามีทีมแพทย์เฉพาะทางคอยดูแลอย่างใกล้ชิด เพื่อให้คุณมั่นใจว่าจะได้รับรอยยิ้มที่สวยงามและสุขภาพช่องปากที่ดีกลับไป";
  
  const imageUrl = data.image_url 
    ? (getFileUrl(data.image_url as any) ?? "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop")
    : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative element matching HTML */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            {/* Shadow headline effect matching HTML */}
            <div className="relative mb-6">
              <h2 className="text-6xl md:text-7xl font-black text-[#1a5fb4] font-bricolage tracking-tighter -rotate-2 transform origin-bottom-left leading-none opacity-20 absolute -top-12 left-0 select-none">
                {headline}
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-[#003888] font-bricolage tracking-tight relative z-10">
                {headline}
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">{subtitle}</h3>
            
            <div className="space-y-6 text-base text-slate-500 leading-relaxed text-justify">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
              <p>{paragraph3}</p>
            </div>
          </div>

          {/* Image Content - Arched Shape matching HTML */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-t-full rounded-b-[4rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src={imageUrl}
                alt="Clinic Atmosphere" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003888]/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
