import type { BlockServiceDetail, Service, ServiceFeature, ServiceProcessStep, ServiceResult, ServiceCareItem, ServiceSuitability } from "@/lib/types";
import { getFileUrl } from "@/lib/directus";
import Link from "next/link";
import { 
  EyeOff, 
  Smile, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  CalendarCheck,
  Star
} from "lucide-react";

interface ServiceDetailBlockProps {
  data?: BlockServiceDetail | null;
}

// Icon mapping helper
const getIcon = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    "eye-off": EyeOff,
    "smile": Smile,
    "zap": Zap,
    "clock": Clock,
    "check-circle-2": CheckCircle2,
    "sparkles": Sparkles,
    "alert-circle": AlertCircle,
  };
  return iconMap[iconName || ""] || CheckCircle2;
};

// Color mapping helper
const getColorClasses = (color?: string) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-50", border: "border-green-100", text: "text-green-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600" },
    cyan: { bg: "bg-cyan-50", border: "border-cyan-100", text: "text-cyan-600" },
    teal: { bg: "bg-teal-50", border: "border-teal-100", text: "text-teal-600" },
  };
  return colorMap[color || "blue"] || colorMap.blue;
};

// Helper to get grid columns class for process steps
const getProcessGridClass = (stepCount: number) => {
  const count = Math.min(stepCount, 5);
  const gridClasses: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
  };
  return gridClasses[count] || "lg:grid-cols-3";
};

export default async function ServiceDetailBlock({ data }: ServiceDetailBlockProps) {
  if (!data) return null;

  const showHero = data.show_hero ?? true;
  const showFeatures = data.show_features ?? true;
  const showProcess = data.show_process ?? true;
  const showResultsCare = data.show_results_care ?? true;

  // Get service data
  const service = data.service && typeof data.service === "object" 
    ? data.service 
    : null;

  if (!service) {
    console.warn("[ServiceDetailBlock] No service data provided");
    return null;
  }

  // Parse JSON fields
  const features: ServiceFeature[] = Array.isArray(service.features) 
    ? service.features 
    : typeof service.features === "string" 
      ? JSON.parse(service.features || "[]")
      : [];
  
  const processSteps: ServiceProcessStep[] = Array.isArray(service.process_steps)
    ? service.process_steps
    : typeof service.process_steps === "string"
      ? JSON.parse(service.process_steps || "[]")
      : [];

  const results: ServiceResult[] = Array.isArray(service.results)
    ? service.results
    : typeof service.results === "string"
      ? JSON.parse(service.results || "[]")
      : [];

  const careItems: ServiceCareItem[] = Array.isArray(service.care_instructions)
    ? service.care_instructions
    : typeof service.care_instructions === "string"
      ? JSON.parse(service.care_instructions || "[]")
      : [];

  const suitability: ServiceSuitability = service.suitability && typeof service.suitability === "object"
    ? service.suitability
    : typeof service.suitability === "string"
      ? JSON.parse(service.suitability || '{"items":[]}')
      : { items: [] };

  // Use price_starting_from if available, otherwise fall back to price_from
  const priceDisplay = service.price_starting_from || service.price_from;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      {showHero && (
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-200 text-[11px] font-semibold text-blue-800 mb-6 w-fit shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                ปรึกษาฟรี! ไม่มีค่าใช้จ่าย
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold text-blue-900 tracking-tight mb-4 leading-[1.1]">
                {service.name}
                <br />
                <span className="text-blue-500">เบามือ คลินิก</span>
              </h1>

              {service.short_description && (
                <p className="text-lg text-slate-500 font-normal mb-8 leading-relaxed max-w-md">
                  {service.short_description}
                </p>
              )}

              {/* Price Badge */}
              {priceDisplay && (
                <div className="bg-blue-50/80 rounded-2xl p-6 mb-8 border border-blue-100">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-sm font-medium text-slate-500">ราคาเริ่มต้น</span>
                    <span className="text-3xl font-semibold text-blue-600 tracking-tight">
                      {priceDisplay}
                    </span>
                  </div>
                  {service.price_installment && (
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <span className="inline-flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
                        ผ่อน 0% นาน {service.price_installment_months || 10} เดือน
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
                        สแกนฟันฟรี
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {service.cta_booking_link && (
                  <Link
                    href={service.cta_booking_link}
                    className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
                  >
                    <CalendarCheck className="w-5 h-5 stroke-[1.5]" />
                    {service.cta_booking_text || "นัดปรึกษาฟรี"}
                  </Link>
                )}
                {service.cta_line_link && (
                  <a
                    href={service.cta_line_link}
                    className="flex-1 h-12 bg-[#06c755] hover:bg-[#05b64d] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5"
                  >
                    <span className="font-bold text-sm">LINE</span>
                    {service.cta_line_text || "แชทเลย"}
                  </a>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative min-h-[400px] lg:h-auto bg-slate-50">
              {service.hero_image && (
                <>
                  <img
                    src={getFileUrl(service.hero_image as any) || ""}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/40 lg:via-transparent lg:to-transparent"></div>
                </>
              )}

              {/* Floating Stats */}
              {(service.stats_cases || service.stats_rating) && (
                <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                  {service.stats_cases && (
                    <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-xl shadow-slate-200/50">
                      <div className="text-2xl font-semibold text-slate-900 tracking-tight">
                        {service.stats_cases}
                      </div>
                      <div className="text-xs font-medium text-slate-500">เคสสำเร็จ</div>
                    </div>
                  )}
                  {service.stats_rating && (
                    <div className="flex-1 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-slate-200 shadow-xl shadow-slate-200/50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-semibold text-slate-900 tracking-tight">
                          {service.stats_rating}
                        </span>
                        <Star className="w-5 h-5 stroke-[1.5] text-amber-400 fill-amber-400" />
                      </div>
                      <div className="text-xs font-medium text-slate-500">คะแนนรีวิว</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {showFeatures && features.length > 0 && (
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 lg:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-blue-900 tracking-tight mb-3">
              ทางเลือกของการจัดฟันแบบไม่เจ็บ
            </h2>
            <p className="text-slate-500 font-normal max-w-2xl mx-auto">
              เทคโนโลยีจัดฟันใสที่ออกแบบเฉพาะบุคคล ให้ผลลัพธ์ที่รวดเร็ว และสบายปาก
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Features Grid */}
            <div className="space-y-8">
              {features.map((feature, index) => {
                const Icon = getIcon(feature.icon);
                const colors = getColorClasses(feature.icon_color);
                return (
                  <div key={index} className="flex gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0 ${colors.text}`}>
                      <Icon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-blue-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-500 font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suitability Card */}
            {suitability.items && suitability.items.length > 0 && (
              <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
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
                    className="w-32 h-32 stroke-[1]"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </div>

                <h4 className="text-xl font-medium mb-6 flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                  </div>
                  เหมาะกับใครบ้าง?
                </h4>

                <ul className="space-y-4 relative z-10">
                  {suitability.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm font-light opacity-90">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-200 mt-0.5 stroke-[1.5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process Section */}
      {showProcess && processSteps.length > 0 && (
        <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-white/95"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-blue-900 tracking-tight mb-3">
                ขั้นตอนการรักษา
              </h2>
              <p className="text-slate-500 font-normal">
                กระบวนการ{processSteps.length} ขั้นตอนง่ายๆ
              </p>
            </div>

            <div className="relative">
              {/* Gradient Line Desktop */}
              <div className="hidden lg:block absolute top-[22px] left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-green-500 rounded-full opacity-30"></div>

              <div className={`grid grid-cols-1 md:grid-cols-3 ${getProcessGridClass(processSteps.length)} gap-6`}>
                {processSteps.map((step, index) => {
                  const stepColors = [
                    { bg: "bg-blue-500", shadow: "shadow-blue-500/20" },
                    { bg: "bg-blue-600", shadow: "shadow-blue-600/20" },
                    { bg: "bg-cyan-500", shadow: "shadow-cyan-500/20" },
                    { bg: "bg-teal-500", shadow: "shadow-teal-500/20" },
                    { bg: "bg-green-500", shadow: "shadow-green-500/20" },
                  ];
                  const color = stepColors[index % stepColors.length];
                  const durationColor = step.color || ["blue", "blue", "cyan", "teal", "green"][index % 5];
                  const durationColors = getColorClasses(durationColor);

                  return (
                    <div key={index} className="group relative">
                      <div className="flex flex-col items-start p-5 bg-slate-50 rounded-2xl border border-slate-100 h-full hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-300">
                        <div className={`w-12 h-12 rounded-full ${color.bg} text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg ${color.shadow} group-hover:scale-110 transition-transform`}>
                          {step.number || index + 1}
                        </div>
                        <h3 className="font-medium text-blue-900 mb-2">{step.title}</h3>
                        <p className="text-xs text-slate-500 font-light leading-relaxed mb-3">
                          {step.description}
                        </p>
                        {step.duration && (
                          <div className={`mt-auto text-[10px] font-medium ${durationColors.text} ${durationColors.bg} px-2 py-1 rounded-md`}>
                            {step.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results & Care Section */}
      {showResultsCare && (results.length > 0 || careItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Results */}
          {results.length > 0 && (
            <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                  <Sparkles className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-semibold text-blue-900 tracking-tight">
                  ผลลัพธ์ที่คาดหวัง
                </h2>
              </div>
              <ul className="space-y-6">
                {results.map((result, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="block font-medium text-slate-800 mb-1">
                        {result.title}
                      </span>
                      <p className="text-sm text-slate-500 font-light">
                        {result.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Care */}
          {careItems.length > 0 && (
            <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertCircle className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h2 className="text-xl font-semibold text-blue-900 tracking-tight">
                  ข้อควรระวัง
                </h2>
              </div>
              <ul className="space-y-6">
                {careItems.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-600 text-[10px] font-bold">
                      {item.number || index + 1}
                    </div>
                    <div>
                      <span className="block font-medium text-slate-800 mb-1">
                        {item.title}
                      </span>
                      <p className="text-sm text-slate-500 font-light">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

