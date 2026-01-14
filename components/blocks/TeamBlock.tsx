import type { BlockTeam, Dentist } from "@/lib/types";
import { getFileUrl, getPlaceholderUrl } from "@/lib/directus";

interface TeamBlockProps {
  data?: BlockTeam | null;
}

export default function TeamBlock({ data }: TeamBlockProps) {
  if (!data) return null;

  const title = data.title ?? "Sodent Dentists";
  const subtitle = data.subtitle ?? "ทันตแพทย์ของเรา";

  // Handle M2M relation - dentists comes through junction table
  // Structure: dentists[] contains junction records with dentist_id nested
  let dentists: Dentist[] = [];

  if (data.dentists && Array.isArray(data.dentists)) {
    const mapped = data.dentists
      .map((junction: any) => {
        // M2M junction structure: junction.dentist_id contains the actual dentist
        const dentist = junction.dentist_id || junction;

        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          if (!dentist || !dentist.id) {
            console.warn('[TeamBlock] Invalid dentist data:', { junction, dentist });
          }
        }

        // Only include published dentists
        if (dentist && dentist.status && dentist.status !== 'published') {
          return null;
        }

        // Handle case where dentist might be null or undefined
        if (!dentist || !dentist.id || !dentist.name) {
          return null;
        }

        return {
          id: dentist.id,
          name: dentist.name,
          nickname: dentist.nickname,
          specialty: dentist.specialty,
          photo: dentist.photo,
          photo_url: dentist.photo_url,
          linkedin_url: dentist.linkedin_url,
          sort: junction.sort || dentist.sort,
        } as Dentist;
      });

    dentists = mapped
      .filter((d): d is Dentist => d !== null && !!d.id && !!d.name)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0)); // Sort by junction sort field
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[TeamBlock] Data:', {
      title,
      subtitle,
      dentistsCount: dentists.length,
      dentists: dentists.map(d => ({ id: d.id, name: d.name, photo: d.photo }))
    });
  }

  // Generate placeholder URLs for fallback dentists
  const getDentistPlaceholder = (name: string) => {
    return getPlaceholderUrl(400, 600, name.split(' ').pop() || '') || null;
  };

  const fallbackDentists: Dentist[] = [
    { id: "fallback-1", name: "ทพ. สมชาย ใจดี", nickname: "หมอเอ็ม", specialty: "เชี่ยวชาญด้านทันตกรรมจัดฟัน จบการศึกษาจากจุฬาลงกรณ์มหาวิทยาลัย ประสบการณ์กว่า 10 ปี", photo_url: getDentistPlaceholder("ทพ. สมชาย ใจดี") || undefined },
    { id: "fallback-2", name: "ทพญ. สุดา รักยิ้ม", nickname: "หมอมิ้นท์", specialty: "ทันตแพทย์เฉพาะทางเด็ก ใจดี มือเบา เด็กๆ รัก จบเฉพาะทางจากมหิดล", photo_url: getDentistPlaceholder("ทพญ. สุดา รักยิ้ม") || undefined },
    { id: "fallback-3", name: "ทพญ. นิภา วงศ์ศิริ", nickname: "หมอนุ่น", specialty: "เชี่ยวชาญด้านวีเนียร์และการออกแบบรอยยิ้ม (Smile Design) ให้คุณสวยเป๊ะ", photo_url: getDentistPlaceholder("ทพญ. นิภา วงศ์ศิริ") || undefined },
    { id: "fallback-4", name: "ทพ. ประวิทย์ มั่นคง", nickname: "หมอวิทย์", specialty: "ศัลยกรรมช่องปาก ผ่าฟันคุด รากฟันเทียม มือเบา พักฟื้นไว", photo_url: getDentistPlaceholder("ทพ. ประวิทย์ มั่นคง") || undefined },
    { id: "fallback-5", name: "ทพ. เคน ธีรเดช", nickname: "หมอเคน", specialty: "ทันตกรรมทั่วไปและทันตกรรมบดเคี้ยว แก้ปัญหาปวดกราม นอนกัดฟัน", photo_url: getDentistPlaceholder("ทพ. เคน ธีรเดช") || undefined },
    { id: "fallback-6", name: "ทพญ. อัมพวา สุขใจ", nickname: "หมอแอม", specialty: "รักษารากฟันด้วยกล้องจุลทรรศน์ ความละเอียดสูง เก็บฟันไว้ได้นาน", photo_url: getDentistPlaceholder("ทพญ. อัมพวา สุขใจ") || undefined },
    { id: "fallback-7", name: "ทพญ. โบว์ เมลดา", nickname: "หมอโบว์", specialty: "ทันตกรรมประดิษฐ์ ครอบฟัน สะพานฟัน ฟันปลอมถอดได้", photo_url: getDentistPlaceholder("ทพญ. โบว์ เมลดา") || undefined },
    { id: "fallback-8", name: "ทพญ. บี น้ำทิพย์", nickname: "หมอบี", specialty: "ทันตกรรมจัดฟันใส Invisalign ระดับ Platinum Provider", photo_url: getDentistPlaceholder("ทพญ. บี น้ำทิพย์") || undefined },
    { id: "fallback-9", name: "ทพ. กาย รัชชานนท์", nickname: "หมอกาย", specialty: "โรคเหงือกและปริทันต์วิทยา รักษาเหงือกอักเสบ ปลูกเหงือก", photo_url: getDentistPlaceholder("ทพ. กาย รัชชานนท์") || undefined },
    { id: "fallback-10", name: "ทพญ. เมย์ เฟื่องอารมย์", nickname: "หมอเมย์", specialty: "ทันตกรรมทั่วไป ขูดหินปูน อุดฟัน มือเบา ใจเย็น", photo_url: getDentistPlaceholder("ทพญ. เมย์ เฟื่องอารมย์") || undefined },
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
            // Get image URL - prioritize "photo" field (Directus file) over "photo_url" (fallback/external)
            // The "photo" field in Directus is the file field, "photo_url" is for external URLs
            let img: string | null = null;

            // First try the "photo" field (Directus file UUID)
            const photoField = d.photo || d.photo_url;

            if (photoField) {
              // Check if it's already a URL string
              if (typeof photoField === 'string' && (photoField.startsWith('http') || photoField.startsWith('/') || photoField.startsWith('data:'))) {
                // Already a URL (from placeholder, external, or data URI)
                img = photoField;
              } else {
                // Extract UUID from photo field (could be string UUID or file object)
                let fileId: string | null = null;

                if (typeof photoField === 'string') {
                  // It's a UUID string
                  fileId = photoField;
                } else if (typeof photoField === 'object' && photoField !== null) {
                  // It's a file object - extract the id
                  fileId = (photoField as any).id || null;
                }

                if (fileId) {
                  // Convert UUID to Directus asset URL
                  img = getFileUrl(fileId);

                  // Debug logging in development
                  if (process.env.NODE_ENV === 'development') {
                    if (!img) {
                      console.warn(`[TeamBlock] Failed to generate image URL for "${d.name}"`, {
                        fileId,
                        hasDirectusUrl: !!process.env.NEXT_PUBLIC_DIRECTUS_URL,
                        directusUrl: process.env.NEXT_PUBLIC_DIRECTUS_URL,
                        photo: d.photo,
                        photo_url: d.photo_url
                      });
                    }
                  }
                }
              }
            }

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
