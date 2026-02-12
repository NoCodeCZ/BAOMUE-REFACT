import type { BlockSignatureTreatment } from "@/lib/types";
import { getPromotions } from "@/lib/data";
import { getFileUrl } from "@/lib/directus";
import PromotionsCarousel from "@/components/PromotionsCarousel";

const BADGE_GRADIENTS = [
  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
];

interface SignatureTreatmentBlockProps {
  data?: BlockSignatureTreatment | null;
}

export default async function SignatureTreatmentBlock({ data }: SignatureTreatmentBlockProps) {
  if (!data) return null;

  const title = data.title ?? "Promotions";
  const subtitle = data.subtitle ?? "เปลี่ยนรอยยิ้มของคุณอย่างแนบเนียน ไร้ลวด ไร้ความเจ็บปวด";

  const directusPromotions = await getPromotions({ limit: 10 });

  const promotions = directusPromotions.map((promo, idx) => {
    let badge = 'พิเศษ';
    if (promo.discount_percentage) {
      badge = `ลด ${promo.discount_percentage}%`;
    } else if (promo.discount_amount) {
      badge = promo.discount_amount;
    } else if (promo.cta_text) {
      badge = promo.cta_text;
    }

    return {
      image: getFileUrl(promo.featured_image ?? null),
      badge,
      badgeGradient: BADGE_GRADIENTS[idx % BADGE_GRADIENTS.length],
      title: promo.title,
      description: promo.short_description ?? '',
    };
  });

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
              <PromotionsCarousel promotions={promotions} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

