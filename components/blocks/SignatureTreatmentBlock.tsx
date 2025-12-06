import type { BlockSignatureTreatment } from "@/lib/types";
import PromotionsCarousel from "@/components/PromotionsCarousel";

interface SignatureTreatmentBlockProps {
  data?: BlockSignatureTreatment | null;
}

export default function SignatureTreatmentBlock({ data }: SignatureTreatmentBlockProps) {
  if (!data) return null;

  const title = data.title ?? "Promotions";
  const subtitle = data.subtitle ?? "เปลี่ยนรอยยิ้มของคุณอย่างแนบเนียน ไร้ลวด ไร้ความเจ็บปวด";

  return (
    <section className="lg:py-32 bg-gradient-to-br from-[#0e2a47] to-[#1a4a6e] pt-24 pb-24">
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex gap-2 text-sm font-semibold text-cyan-300 bg-white/10 rounded-full mb-6 pt-2 pr-4 pb-2 pl-4 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
            </svg>
            Signature Treatment
          </div>
          <h2 className="md:text-5xl text-4xl font-semibold text-white tracking-tight mb-6">{title}</h2>
          <p className="text-xl text-white/70">{subtitle}</p>
        </div>

        <div className="overflow-hidden bg-white/10 rounded-3xl pt-8 pr-8 pb-8 pl-8 shadow-xl backdrop-blur">
          <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">โปรโมชั่นพิเศษ</h3>
          <PromotionsCarousel />
        </div>
      </div>
    </section>
  );
}

