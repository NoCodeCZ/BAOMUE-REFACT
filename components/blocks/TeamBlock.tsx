import type { BlockTeam } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface TeamBlockProps {
  data?: BlockTeam | null;
}

export default function TeamBlock({ data }: TeamBlockProps) {
  if (!data) return null;

  const title = data.title ?? "พบกับทีมทันตแพทย์ของเรา";
  const subtitle = data.subtitle ?? "ทีมผู้เชี่ยวชาญที่พร้อมดูแลรอยยิ้มของคุณ";
  const dentists = (data.dentists as any[]) ?? [];

  const fallbackDentists = [
    {
      name: "ทพญ.นภัสสร วงศ์ศิริ",
      specialty: "ทันตกรรมจัดฟัน",
    },
    {
      name: "ทพ.ธนกร สุขสมบูรณ์",
      specialty: "ทันตกรรมรากเทียม",
    },
    {
      name: "ทพญ.พิมพ์ชนก รัตนโชติ",
      specialty: "ทันตกรรมเด็ก",
    },
    {
      name: "ทพ.วีรภัทร จันทร์แก้ว",
      specialty: "ศัลยกรรมช่องปาก",
    },
  ];

  const displayDentists = dentists.length > 0 ? dentists : fallbackDentists;
  const fallbackImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl md:text-4xl font-black font-bricolage text-[#1a5fb4] tracking-tight">Sodent Dentists</span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-800">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {displayDentists.map((d, index) => {
            const img = getFileUrl((d as any).photo_url) || fallbackImages[index % fallbackImages.length];
            return (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100" key={d.name}>
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                  <img
                    src={img}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {d.name}
                  </h3>
                  <p className="text-xs font-medium text-[#1DAEE0] mb-3">
                    {d.specialty}
                  </p>
                  {(d as any).description && (
                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-4">
                      {(d as any).description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

