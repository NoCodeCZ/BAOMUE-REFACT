import type { BlockServices } from "@/lib/types";

interface ServicesBlockProps {
  data?: BlockServices | null;
}

export default function ServicesBlock({ data }: ServicesBlockProps) {
  if (!data) return null;

  const title = data.title ?? "OUR SERVICES!";
  const subtitle = data.subtitle ?? "บริการทางทันตกรรมของ Tooth Box";
  const services = data.services ?? [
    { label: "อุดฟัน" },
    { label: "ขูดหินปูน" },
    { label: "ทันตกรรมจัดฟัน" },
    { label: "รักษารากฟัน" },
    { label: "รากฟันเทียม" },
    { label: "ครอบฟัน" },
    { label: "สะพานฟัน" },
    { label: "ฟันปลอม" },
    { label: "ผ่าฟันคุด" },
    { label: "ฟอกสีฟัน" },
    { label: "วีเนียร์" },
    { label: "ทันตกรรมเด็ก" },
  ];

  // Icon mapping would be too large, simplified version
  return (
    <section className="lg:py-32 bg-white pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pt-12 pr-6 pb-12 pl-6">
        <div className="text-center mb-16">
          <h2 className="md:text-7xl uppercase transform text-5xl font-black text-[#5372ee] tracking-tighter font-bricolage mb-4 -rotate-2">
            {title}
          </h2>
          <p className="text-xl md:text-2xl font-bold text-slate-800">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-12">
          {services.map((service: any) => (
            <div
              key={service.label}
              className="group flex flex-col items-center gap-5 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 text-xl transition-transform duration-300 group-hover:scale-110">
                {service.label.slice(0, 1)}
              </div>
              <p className="text-center text-slate-700 font-medium text-sm">
                {service.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

