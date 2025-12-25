import type { BlockAboutUs } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface AboutUsBlockProps {
  data?: BlockAboutUs | null;
}

export default function AboutUsBlock({ data }: AboutUsBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "ABOUT US!";
  const subtitle = data.subtitle ?? "คลินิกทันตกรรมเบามือ";
  const paragraph1 = data.paragraph_1 ?? "เพราะเรารู้ว่าหลายคนมีความทรงจำที่ไม่ดีเกี่ยวกับการทำฟัน เราจึงตั้งใจสร้าง คลินิกทันตกรรมเบามือ ให้เป็นสถานที่ที่ทำให้ คุณรู้สึก \"ปลอดภัย\" ตั้งแต่ก้าวแรกที่เข้ามา ด้วยบรรยากาศ ที่ผ่อนคลาย และทีมงานที่พร้อมจะรับฟังทุกความกังวลของคุณ";
  const paragraph2 = data.paragraph_2 ?? "หัวใจสำคัญของเราคือเทคนิค \"Gentle Touch\" หรือการรักษา ที่เน้นความเบามือเป็นพิเศษ ทีมทันตแพทย์ของเราไม่เพียงแต่ เชี่ยวชาญด้านการรักษา แต่ยังผ่านการฝึกฝนมาเพื่อให้ความสำคัญ กับความรู้สึกของคนไข้ในทุกขั้นตอน เพื่อให้คุณรู้สึกผ่อนคลาย และลดความกังวลลงได้อย่างแท้จริง";
  const paragraph3 = data.paragraph_3 ?? "เป้าหมายสูงสุดของเรา คือการดูแลสุขภาพช่องปากของคุณ ในระยะยาว เรามุ่งมั่นพัฒนาการบริการอย่างไม่หยุดยั้ง เพื่อให้ มั่นใจว่าทุกคนที่ก้าวออกจากคลินิกไป จะมีรอยยิ้มที่สมบูรณ์แบบ พร้อมความประทับใจในทุกสัมผัส เพราะเราเชื่อว่ารอยยิ้มที่สวยที่สุด คือรอยยิ้มที่มาจากความสุขของคุณ";
  
  const imageUrl = data.image_url 
    ? (getFileUrl(data.image_url as any) ?? "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3b36a18b-3851-43e6-b02a-2446fe661f62_1600w.jpg")
    : "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3b36a18b-3851-43e6-b02a-2446fe661f62_1600w.jpg";

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 gap-x-12 gap-y-12 items-center">
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="transform text-5xl font-black tracking-tighter font-bricolage mb-6 -rotate-2 bg-gradient-to-t from-white/10 to-white/0 md:text-7xl md:text-blue-700">
              {headline}
            </h2>
            <h3 className="md:text-3xl text-2xl font-bold text-slate-800 mt-2 mb-8" style={{ color: '#1A3897', fontSize: '30px', fontFamily: 'Prompt', fontWeight: 700, lineHeight: '36px', wordWrap: 'break-word' }}>
              {subtitle}
            </h3>
            <div className="space-y-6 text-base md:text-lg text-slate-500 leading-relaxed max-w-xl text-justify lg:text-left font-medium">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
              <p>{paragraph3}</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[3.5/4.5] rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <img 
                src={imageUrl}
                alt="Baomue Dental Clinic" 
                className="object-center w-full h-full object-cover bg-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
