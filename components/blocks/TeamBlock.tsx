import type { BlockTeam } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface Dentist {
  name: string;
  nickname?: string;
  specialty: string;
  photo?: string; // Directus file ID (UUID)
  photo_url?: string; // External URL fallback
}

interface TeamBlockProps {
  data?: BlockTeam | null;
}

export default function TeamBlock({ data }: TeamBlockProps) {
  if (!data) return null;

  const title = data.title ?? "Sodent Dentists";
  const subtitle = data.subtitle ?? "ทันตแพทย์ของเรา";
  const dentists = (data.dentists as Dentist[]) ?? [];

  const fallbackDentists: Dentist[] = [
    { name: "ทพ. สมชาย ใจดี", nickname: "หมอเอ็ม", specialty: "เชี่ยวชาญด้านทันตกรรมจัดฟัน จบการศึกษาจากจุฬาลงกรณ์มหาวิทยาลัย ประสบการณ์กว่า 10 ปี", photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" },
    { name: "ทพญ. สุดา รักยิ้ม", nickname: "หมอมิ้นท์", specialty: "ทันตแพทย์เฉพาะทางเด็ก ใจดี มือเบา เด็กๆ รัก จบเฉพาะทางจากมหิดล", photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" },
    { name: "ทพญ. นิภา วงศ์ศิริ", nickname: "หมอนุ่น", specialty: "เชี่ยวชาญด้านวีเนียร์และการออกแบบรอยยิ้ม (Smile Design) ให้คุณสวยเป๊ะ", photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" },
    { name: "ทพ. ประวิทย์ มั่นคง", nickname: "หมอวิทย์", specialty: "ศัลยกรรมช่องปาก ผ่าฟันคุด รากฟันเทียม มือเบา พักฟื้นไว", photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80" },
    { name: "ทพ. เคน ธีรเดช", nickname: "หมอเคน", specialty: "ทันตกรรมทั่วไปและทันตกรรมบดเคี้ยว แก้ปัญหาปวดกราม นอนกัดฟัน", photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" },
    { name: "ทพญ. อัมพวา สุขใจ", nickname: "หมอแอม", specialty: "รักษารากฟันด้วยกล้องจุลทรรศน์ ความละเอียดสูง เก็บฟันไว้ได้นาน", photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
    { name: "ทพญ. โบว์ เมลดา", nickname: "หมอโบว์", specialty: "ทันตกรรมประดิษฐ์ ครอบฟัน สะพานฟัน ฟันปลอมถอดได้", photo_url: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80" },
    { name: "ทพญ. บี น้ำทิพย์", nickname: "หมอบี", specialty: "ทันตกรรมจัดฟันใส Invisalign ระดับ Platinum Provider", photo_url: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400&q=80" },
    { name: "ทพ. กาย รัชชานนท์", nickname: "หมอกาย", specialty: "โรคเหงือกและปริทันต์วิทยา รักษาเหงือกอักเสบ ปลูกเหงือก", photo_url: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&q=80" },
    { name: "ทพญ. เมย์ เฟื่องอารมย์", nickname: "หมอเมย์", specialty: "ทันตกรรมทั่วไป ขูดหินปูน อุดฟัน มือเบา ใจเย็น", photo_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80" },
  ];

  const displayDentists = dentists.length > 0 ? dentists : fallbackDentists;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header matching HTML design */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl md:text-4xl font-black font-bricolage text-[#1a5fb4] tracking-tight">{title}</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-800">{subtitle}</h2>
        </div>

        {/* Dentist Grid - 5 columns on large screens matching HTML */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {displayDentists.map((d, index) => {
            // Prioritize photo (Directus file) over photo_url (external URL)
            const img = d.photo 
              ? getFileUrl(d.photo as any) 
              : (d.photo_url ? (getFileUrl(d.photo_url as any) || d.photo_url) : null);
            
            return (
              <div 
                key={`${d.name}-${index}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                  {img ? (
                    <img 
                      src={img}
                      alt={d.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                      <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{d.name}</h3>
                  {d.nickname && (
                    <p className="text-xs font-medium text-[#1DAEE0] mb-3">({d.nickname})</p>
                  )}
                  <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-4">
                    {d.specialty}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
