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
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="md:text-7xl transform text-5xl font-black text-[#5da1f8] tracking-tighter font-bricolage mb-6 -rotate-2">
              {headline}
            </h2>
            <h3 className="md:text-3xl text-2xl font-bold text-slate-800 mt-2 mb-8">
              {subtitle}
            </h3>
            <div className="space-y-6 text-base md:text-lg text-slate-500 leading-relaxed max-w-xl text-justify lg:text-left font-medium">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-full aspect-[3.5/4.5] rounded-t-full rounded-b-[3rem] overflow-hidden shadow-2xl bg-slate-100">
              <img
                src={
                  getFileUrl(data.image_url as any) ??
                  "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                }
                alt="Sodent Dental Clinic"
                className="object-center w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

