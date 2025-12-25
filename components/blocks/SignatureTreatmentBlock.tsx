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
    <section 
      className="lg:py-32 bg-center relative pt-24 pb-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a5fb4 0%, #3584e4 50%, #1DAEE0 100%)'
      }}
    >
      <img 
        src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/3b36a18b-3851-43e6-b02a-2446fe661f62_3840w.jpg" 
        alt="Container background" 
        className="absolute inset-0 w-full h-full object-cover opacity-20" 
      />
      <div className="max-w-7xl mr-auto ml-auto pr-6 pl-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 
            className="md:text-5xl text-4xl font-semibold tracking-tight mb-4"
            style={{ color: '#FEDF45' }}
          >
            {title}
          </h2>
          <p className="text-xl text-white/90">{subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            className="overflow-hidden rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div className="pt-6 pr-8 pb-6 pl-8">
              <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">โปรโมชั่นพิเศษ</h3>
              <PromotionsCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

