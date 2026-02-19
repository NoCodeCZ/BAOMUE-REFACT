import type { BlockAboutUs } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import { Shield, Heart, Sparkles, Award } from "lucide-react";

interface AboutUsPremiumBlockProps {
  data?: BlockAboutUs | null;
}

export default function AboutUsPremiumBlock({ data }: AboutUsPremiumBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "ABOUT US!";
  const subtitle = data.subtitle ?? "คลินิกทันตกรรมเบามือ";
  const paragraph1 = data.paragraph_1 ?? "";
  const paragraph2 = data.paragraph_2 ?? "";
  const paragraph3 = data.paragraph_3 ?? "";

  // Image: prefer file relation (with focal point), fallback to legacy image_url string
  const fallbackImage = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop";
  let imageUrl = fallbackImage;
  let imagePosition = "center center";

  if (data.image && typeof data.image === 'object' && data.image.id) {
    imageUrl = getFileUrl(data.image) ?? fallbackImage;
    const fpx = data.image.focal_point_x;
    const fpy = data.image.focal_point_y;
    if (fpx != null && fpy != null && data.image.width && data.image.height) {
      const xPercent = Math.round((fpx / data.image.width) * 100);
      const yPercent = Math.round((fpy / data.image.height) * 100);
      imagePosition = `${xPercent}% ${yPercent}%`;
    }
  } else if (data.image_url) {
    imageUrl = getFileUrl(data.image_url as any) ?? data.image_url ?? fallbackImage;
    imagePosition = data.image_position ?? "center center";
  }

  const values = [
    {
      icon: Heart,
      title: "Gentle Touch",
      description: "เทคนิคเบามือ ลดความเจ็บ",
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "มาตรฐานปลอดเชื้อระดับสากล",
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      icon: Sparkles,
      title: "Modern Tech",
      description: "เทคโนโลยีทันสมัย ผลลัพธ์แม่นยำ",
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "ทีมแพทย์เฉพาะทางประสบการณ์สูง",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-blue-50/30"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl -translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {headline}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            รู้จัก<span className="text-blue-600">{subtitle.replace('คลินิกทันตกรรม', '')}</span>
            <br className="hidden sm:block" />
            <span className="text-slate-400 font-normal text-2xl sm:text-3xl lg:text-4xl">คลินิกทันตกรรมที่ใส่ใจทุกรอยยิ้ม</span>
          </h2>
        </div>

        {/* Main Content: Image + Text */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 sm:mb-24">
          {/* Image Column */}
          <div className="lg:col-span-5 order-1">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 aspect-[4/5]">
                <img
                  src={imageUrl}
                  alt="Baomue Dental Clinic"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: imagePosition }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent"></div>

                {/* Floating Quote */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <blockquote className="text-white/95 text-sm sm:text-base font-light leading-relaxed italic">
                    &ldquo;เพราะเราเชื่อว่ารอยยิ้มที่สวยที่สุด คือรอยยิ้มที่มาจากความสุขของคุณ&rdquo;
                  </blockquote>
                </div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-3xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-2xl -z-10"></div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-7 order-2">
            {/* Story Paragraphs */}
            <div className="space-y-6 sm:space-y-8">
              {/* Paragraph 1 — highlighted */}
              <div className="relative pl-5 sm:pl-6 border-l-[3px] border-blue-500">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                  {paragraph1}
                </p>
              </div>

              {/* Paragraph 2 */}
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                {paragraph2}
              </p>

              {/* Paragraph 3 */}
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                {paragraph3}
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-slate-100">
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight">10+</div>
                <div className="text-[11px] sm:text-sm text-slate-400 font-medium mt-1">ปีประสบการณ์</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight">5,000+</div>
                <div className="text-[11px] sm:text-sm text-slate-400 font-medium mt-1">เคสที่ดูแล</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-4xl font-bold text-blue-600 tracking-tight">4.9</div>
                <div className="text-[11px] sm:text-sm text-slate-400 font-medium mt-1">คะแนนรีวิว</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className={`group relative ${value.bg} ${value.border} border rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 sm:mb-5 ${value.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 sm:mb-1.5 tracking-tight">
                  {value.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-slate-500 font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
