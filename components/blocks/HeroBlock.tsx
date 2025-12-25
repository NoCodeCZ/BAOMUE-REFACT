import type { BlockHero } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";

interface HeroBlockProps {
  data?: BlockHero | null;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  if (!data) return null;

  const heroBadge = data.badge_text ?? "Accepting New Patients";
  const heroLine1 = data.headline_line1 ?? "เบามืออย่างโปร";
  const heroLine2 = data.headline_line2 ?? "เพื่อรอยยิ้มที่เป๊ะทุกองศา";
  const heroDescription = data.description ?? "บอกลาเสียงกรอที่น่ากังวลและความเจ็บปวด ด้วยเทคโนโลยี Silent Technology และเทคนิคการรักษาที่นุ่มนวลเป็นพิเศษ ให้คุณหลับสบายตลอดการรักษา";
  const heroPrimaryCta = data.primary_cta_text ?? "จองคิวออนไลน์";
  const heroSecondaryCta = data.secondary_cta_text ?? "ดูบริการของเรา";
  const heroPrimaryCtaLink = data.primary_cta_link ?? "#";
  const heroSecondaryCtaLink = data.secondary_cta_link ?? "/services";
  const heroImage = data.background_image 
    ? (getFileUrl(data.background_image as any) ?? "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ec7f76a9-b773-48f2-ad44-c1ef877851dc_1600w.png")
    : "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/ec7f76a9-b773-48f2-ad44-c1ef877851dc_1600w.png";

  return (
    <section className="overflow-hidden min-h-[90vh] flex bg-blue-700 relative items-center">
      <div 
        className="z-10 min-h-screen flex w-full max-w-7xl mr-auto ml-auto pt-16 pr-6 pb-16 pl-6 relative items-center" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)' 
        }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full gap-x-12 gap-y-12 items-center">
          <div className="flex flex-col text-left items-start">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-8" 
              style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-xs font-medium text-white/90 tracking-wide">{heroBadge}</span>
            </div>
            
            <h1 className="sm:text-6xl lg:text-7xl leading-[1.05] text-5xl font-bold text-white tracking-tight mb-6" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '94px', wordWrap: 'break-word' }}>
              <span style={{ color: '#FEDF45', fontSize: '70.30px', fontWeight: 700 }}>{heroLine1}</span>
              <span style={{ color: 'white', fontSize: '70.30px', fontWeight: 700 }}>{heroLine2}</span>
            </h1>
            
            <p className="sm:text-xl leading-relaxed text-lg font-normal text-stone-50/70 max-w-lg mb-10" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
              {heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-16">
              <a 
                href={heroPrimaryCtaLink}
                className="group h-14 px-8 rounded-2xl bg-white text-slate-900 font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all" 
                style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 30px', fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
              >
                <span>{heroPrimaryCta}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <a 
                href={heroSecondaryCtaLink}
                className="flex hover:bg-white/20 transition-all text-lg font-medium text-white bg-white/10 h-14 border-white/20 border rounded-2xl pr-8 pl-8 backdrop-blur-xl items-center justify-center" 
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}
              >
                {heroSecondaryCta}
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-white/10 w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white shrink-0" style={{ boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-white/50 text-xs font-medium tracking-wide mb-0.5" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>Call Center</div>
                  <div className="text-white font-medium text-xl leading-none tracking-tight" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>096 915 9391</div>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#06c755] flex items-center justify-center text-white shrink-0" style={{ boxShadow: '0 4px 30px rgba(6, 199, 85, 0.3)' }}>
                  <span className="font-bold text-[10px]">LINE</span>
                </div>
                <div>
                  <div className="text-white/50 text-xs font-medium tracking-wide mb-0.5" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>Line Official</div>
                  <div className="leading-none text-xl font-medium text-white tracking-tight" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}>@BAOMUE</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block h-full min-h-[600px] w-full">
            <div className="absolute inset-0 flex items-center justify-center translate-x-12">
              <div className="relative w-[500px] h-[640px] rounded-[40px] overflow-hidden border border-white/20 shadow-2xl rotate-3" style={{ boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)' }}>
                <img 
                  src={heroImage}
                  alt="Professional Dental Care" 
                  className="transform hover:scale-105 transition-transform duration-700 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
