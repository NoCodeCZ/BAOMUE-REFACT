import type { BlockSafetyBanner } from "@/lib/types";

interface SafetyBannerBlockProps {
  data?: BlockSafetyBanner | null;
}

export default function SafetyBannerBlock({ data }: SafetyBannerBlockProps) {
  if (!data) return null;

  const title = data.title ?? "มาตรฐานความปลอดภัยสูงสุด";
  const subtitle = data.subtitle ?? "ผ่านการรับรองมาตรฐาน WHO และกรมอนามัย";
  const points = data.points ?? [
    { label: "ฆ่าเชื้อทุกรอบ" },
    { label: "ระบบฟอกอากาศ HEPA" },
    { label: "อุปกรณ์ใช้ครั้งเดียว" },
    { label: "ตรวจวัดอุณหภูมิ" },
  ];

  const safetyIcons: Record<string, JSX.Element> = {
    "ฆ่าเชื้อทุกรอบ": (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
        <path d="M3 3h.01"></path>
        <path d="M7 5h.01"></path>
        <path d="M11 7h.01"></path>
        <path d="M3 7h.01"></path>
        <path d="M7 9h.01"></path>
        <path d="M3 11h.01"></path>
        <rect width="4" height="4" x="15" y="5"></rect>
        <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"></path>
        <path d="m13 14 8-2"></path>
        <path d="m13 19 8-2"></path>
      </svg>
    ),
    "ระบบฟอกอากาศ HEPA": (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
        <path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path>
        <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path>
        <path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path>
      </svg>
    ),
    "อุปกรณ์ใช้ครั้งเดียว": (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
        <path d="M12 22V12"></path>
        <polyline points="3.29 7 12 12 20.71 7"></polyline>
        <path d="m7.5 4.27 9 5.15"></path>
      </svg>
    ),
    "ตรวจวัดอุณหภูมิ": (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
      </svg>
    ),
  };

  return (
    <section className="bg-gradient-to-r from-blue-500 to-cyan-500 py-16 lg:py-20 lg:rounded-3xl lg:my-8 lg:mx-6 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-black opacity-5 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 text-center sm:text-left w-full lg:w-auto">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-white drop-shadow-sm"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                {title}
              </h3>
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-sm lg:max-w-md mx-auto sm:mx-0">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start lg:justify-end gap-3 lg:gap-4 w-full sm:w-auto">
            {points.map((item: any, idx: number) => (
              <div
                key={item.label ?? idx}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-sm w-full sm:w-auto min-w-[200px]"
              >
                {safetyIcons[item.label] || (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white opacity-90 shrink-0">
                    <path d="M3 3h.01"></path>
                    <path d="M7 5h.01"></path>
                    <path d="M11 7h.01"></path>
                    <path d="M3 7h.01"></path>
                    <path d="M7 9h.01"></path>
                    <path d="M3 11h.01"></path>
                    <rect width="4" height="4" x="15" y="5"></rect>
                    <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"></path>
                    <path d="m13 14 8-2"></path>
                    <path d="m13 19 8-2"></path>
                  </svg>
                )}
                <span className="text-white font-semibold tracking-wide text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

