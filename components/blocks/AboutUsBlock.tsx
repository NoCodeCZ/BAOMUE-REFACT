import type { BlockAboutUs } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface AboutUsBlockProps {
  data?: BlockAboutUs | null;
}

export default function AboutUsBlock({ data }: AboutUsBlockProps) {
  if (!data) return null;

  const headline = data.headline ?? "ABOUT US!";
  const subtitle = data.subtitle ?? "คลินิกทันตกรรมเบามือ";
  const paragraphs = [
    data.paragraph_1,
    data.paragraph_2,
    data.paragraph_3,
  ].filter(Boolean);

  return (
    <section className="lg:py-32 bg-white pt-24 pb-24 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mb-6">
              {/* Watermark headline */}
              <h2 className="text-6xl md:text-7xl font-black text-[#1a5fb4] font-bricolage tracking-tighter -rotate-2 transform origin-bottom-left leading-none opacity-20 absolute -top-12 left-0 select-none">
                {headline}
              </h2>
              {/* Main headline */}
              <h2 className="text-4xl md:text-5xl font-bold text-[#003888] font-bricolage tracking-tight relative z-10">
                {headline}
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8">
              {subtitle}
            </h3>
            <div className="space-y-6 text-base text-slate-500 leading-relaxed text-justify">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-t-full rounded-b-[4rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={
                  getFileUrl(data.image_url as any) ??
                  "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
                }
                alt="Sodent Dental Clinic"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#003888]/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

