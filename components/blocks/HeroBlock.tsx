import type { BlockHero } from "@/lib/types";

interface HeroBlockProps {
  data?: BlockHero | null;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  if (!data) return null;

  const heroBadge = data.badge_text ?? "Accepting New Patients";
  const heroLine1 = data.headline_line1 ?? "Unlock your";
  const heroLine2 = data.headline_line2 ?? "best smile today.";
  const heroDescription =
    data.description ??
    "ยกระดับความมั่นใจผ่านรอยยิ้มที่สวยงาม ด้วยบริการด้านทันตกรรมแบบครบวงจร โดยทีมแพทย์ผู้เชี่ยวชาญ พร้อมเทคโนโลยีที่ทันสมัย";
  const heroPrimaryCta = data.primary_cta_text ?? "จองคิวออนไลน์";
  const heroSecondaryCta = data.secondary_cta_text ?? "ดูบริการของเรา";
  const heroPrimaryCtaLink = data.primary_cta_link ?? "#";
  const heroSecondaryCtaLink = data.secondary_cta_link ?? "#";

  return (
    <section className="overflow-hidden min-h-[90vh] flex bg-gradient-to-br from-sky-400 to-sky-600 relative items-center">
      <div className="z-10 w-full max-w-7xl mr-auto ml-auto pt-16 pr-6 pb-16 pl-6 relative min-h-screen flex items-center" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          <div className="flex flex-col text-left items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-8" style={{boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'}}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-xs font-medium text-white/90 tracking-wide">
                {heroBadge}
              </span>
            </div>
            
            <h1 className="sm:text-6xl lg:text-7xl leading-[1.05] text-5xl font-semibold text-white tracking-tight mb-6">
              {heroLine1}{" "}
              <span className="text-white/60">{heroLine2}</span>
            </h1>
            
            <p className="text-white/70 text-lg sm:text-xl font-normal leading-relaxed max-w-lg mb-10">
              {heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-16">
              <a 
                href={heroPrimaryCtaLink}
                className="group h-14 px-8 rounded-2xl bg-white text-slate-900 font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-all" 
                style={{boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)'}}
              >
                <span>{heroPrimaryCta}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
              <a 
                href={heroSecondaryCtaLink}
                className="h-14 px-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium text-lg flex items-center justify-center hover:bg-white/20 transition-all"
              >
                {heroSecondaryCta}
              </a>
            </div>
            
            <div className="flex items-center gap-8 pt-8 border-t border-white/10 w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white shrink-0" style={{boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'}}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-white/50 text-xs font-medium tracking-wide mb-0.5">
                    Call Center
                  </div>
                  <div className="text-white font-medium text-xl leading-none tracking-tight">
                    096 915 9391
                  </div>
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#06c755] flex items-center justify-center text-white shrink-0" style={{boxShadow: '0 4px 30px rgba(6, 199, 85, 0.3)'}}>
                  <span className="font-bold text-[10px]">LINE</span>
                </div>
                <div>
                  <div className="text-white/50 text-xs font-medium tracking-wide mb-0.5">
                    Line Official
                  </div>
                  <div className="leading-none text-xl font-medium text-white tracking-tight">
                    @BAOMUE
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block h-full min-h-[600px] w-full">
            <div className="absolute inset-0 flex items-center justify-center translate-x-12">
              <div className="relative w-[500px] h-[640px] rounded-[40px] overflow-hidden border border-white/20 shadow-2xl rotate-3" style={{boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'}}>
                <img
                  src="https://images.unsplash.com/photo-1629946832022-c327f74956e0?w=2160&q=80"
                  alt="Professional Dental Care"
                  className="transform hover:scale-105 transition-transform duration-700 w-full h-full object-cover -rotate-3 scale-110"
                />

                <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-2xl p-5 rounded-3xl flex items-center justify-between border border-white/50 -rotate-3" style={{boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'}}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                      >
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-slate-900 font-medium text-sm">
                        Certified Clinic
                      </div>
                      <div className="text-slate-500 text-xs">
                        International Standard
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                        </svg>
                      ))}
                    </div>
                    <div className="text-slate-400 text-xs font-medium mt-1">
                      4.9/5 Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

