import type { BlockTeam } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";

interface TeamBlockProps {
  data?: BlockTeam | null;
}

export default function TeamBlock({ data }: TeamBlockProps) {
  if (!data) return null;

  const title = data.title ?? "พบกับทีมทันตแพทย์ของเรา";
  const subtitle = data.subtitle ?? "ทีมผู้เชี่ยวชาญที่พร้อมดูแลรอยยิ้มของคุณ";
  const dentists = (data.dentists as any[]) ?? [];

  const fallbackDentists = [
    { name: "ทพญ.นภัสสร วงศ์ศิริ", specialty: "ทันตกรรมจัดฟัน", photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
    { name: "ทพ.ธนกร สุขสมบูรณ์", specialty: "ทันตกรรมรากเทียม", photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80" },
    { name: "ทพญ.พิมพ์ชนก รัตนโชติ", specialty: "ทันตกรรมเด็ก", photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
    { name: "ทพ.วีรภัทร จันทร์แก้ว", specialty: "ศัลยกรรมช่องปาก", photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
    { name: "ทพญ.สุภาวดี เจริญสุข", specialty: "ทันตกรรมประดิษฐ์", photo_url: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80" },
    { name: "ทพ.กิตติพงศ์ ศรีสุข", specialty: "รักษารากฟัน", photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" },
    { name: "ทพญ.อรวรรณ ภูมิพัฒน์", specialty: "ทันตกรรมความงาม", photo_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" },
    { name: "ทพ.ปริญญา มงคลชัย", specialty: "ทันตกรรมทั่วไป", photo_url: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80" },
    { name: "ทพญ.ชนิดา วรรณวิไล", specialty: "ทันตกรรมจัดฟัน", photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
    { name: "ทพ.ภูริพัฒน์ ธนาวุฒิ", specialty: "ทันตกรรมรากเทียม", photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80" },
    { name: "ทพญ.ณัฐธิดา รุ่งเรือง", specialty: "ปริทันตวิทยา", photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
    { name: "ทพ.สิทธิชัย ประสิทธิ์", specialty: "ศัลยกรรมช่องปาก", photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
    { name: "ทพญ.กมลวรรณ ศิริวัฒน์", specialty: "ทันตกรรมประดิษฐ์", photo_url: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=80" },
    { name: "ทพ.อนุชา สมบูรณ์ดี", specialty: "รักษารากฟัน", photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" },
    { name: "ทพญ.วราภรณ์ ทองคำ", specialty: "ทันตกรรมเด็ก", photo_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" },
  ];

  const displayDentists = dentists.length > 0 ? dentists : fallbackDentists;

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex gap-2 text-sm font-semibold text-slate-50 bg-[#3B82F6] rounded-full mb-6 px-4 py-2 gap-x-2 gap-y-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            ทีมทันตแพทย์
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold text-[#003888] tracking-tight mb-6">
            {title}
          </h2>
          <p className="text-xl text-[#003888]">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {displayDentists.map((d, index) => {
            const img = getFileUrl((d as any).photo_url) || (d as any).photo_url;
            return (
              <div className="group" key={`${d.name}-${index}`}>
                <div className="relative rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img 
                    src={img}
                    alt={d.name} 
                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="group-hover:opacity-100 transition-opacity bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 absolute top-0 right-0 bottom-0 left-0">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2">
                        <a href="#" className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-lg">{d.name}</h3>
                <p className="text-sm text-[#1DAEE0]">{d.specialty}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="#" className="inline-flex items-center gap-2 hover:bg-slate-800 transition-colors font-medium text-white bg-[#003888] h-12 rounded-xl pr-8 pl-8">
            ดูทีมทันตแพทย์ทั้งหมด 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
