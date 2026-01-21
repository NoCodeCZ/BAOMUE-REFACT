"use client";

import { useState } from "react";
import Link from "next/link";
import { Service, ServiceCategory } from "@/lib/types";
import { ChevronRight, Clock, Phone, HelpCircle, Smile, Grid3X3, Gem, Layers } from "lucide-react";

interface ServiceCategoryTabsProps {
  services: Service[];
  categories: ServiceCategory[];
}

// Icon mapping for services - can be extended based on service type
const getServiceIcon = (index: number) => {
  const icons = [
    { Icon: Smile, color: "bg-[#FB9C2C]" },
    { Icon: Grid3X3, color: "bg-[#5FBBEF]" },
    { Icon: Gem, color: "bg-[#1e3a8a]" },
    { Icon: Layers, color: "bg-[#FB9C2C]" },
  ];
  return icons[index % icons.length];
};

export default function ServiceCategoryTabs({ services, categories }: ServiceCategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const filteredServices = activeCategory === "all"
    ? services
    : services.filter(s => {
        if (!s.category) return false;
        if (typeof s.category === 'object') {
          return s.category.slug === activeCategory;
        }
        const cat = categories.find(c => c.id === s.category);
        return cat?.slug === activeCategory;
      });
  
  return (
    <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden font-sans relative">
      {/* Background decoration for card header */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none"></div>

      {/* Card Header Section */}
      <div className="text-center pt-12 px-6 pb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FB9C2C] text-white shadow-sm mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <span className="text-xs font-bold tracking-wide">เปิดให้บริการทุกวัน</span>
        </div>
        
        <h2 className="text-3xl md:text-3xl font-bold text-[#1e3a8a] mb-2 tracking-tight">
          บริการทันตกรรมของ Baomue
        </h2>
        <p className="text-slate-400 text-sm md:text-base font-medium">
          ครบทุกบริการด้านทันตกรรม ด้วยมาตรฐานระดับสากล
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 md:px-10 py-2 mb-4 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap min-w-[80px] ${
              activeCategory === "all"
                ? "bg-[#0F2942] text-white shadow-sm"
                : "bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-100"
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap min-w-[80px] ${
                activeCategory === category.slug
                  ? "bg-[#0F2942] text-white shadow-sm"
                  : "bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid Content */}
      <div className="p-6 md:px-10 md:pb-10 relative z-10">
        <div className="grid md:grid-cols-2 gap-5">
          {filteredServices.map((service, index) => {
            const { Icon, color } = getServiceIcon(index);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-[#E6F4FF] rounded-2xl p-6 flex flex-col items-start hover:shadow-md transition-all cursor-pointer group h-full border border-blue-50/50"
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">{service.name}</h3>
                <p className="text-[#1e3a8a]/70 text-xs mb-6 leading-relaxed line-clamp-2">
                  {service.short_description || "บริการทันตกรรมคุณภาพสูง"}
                </p>
                <div className="mt-auto text-[#0099FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  อ่านเพิ่มเติม
                  <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              </Link>
            );
          })}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            ไม่พบบริการในหมวดหมู่นี้
          </div>
        )}
      </div>

      {/* Consultation Banner */}
      <div className="mx-6 md:mx-10 mb-8 p-6 rounded-[24px] bg-[#E8F8FA] border border-[#d0f0f4] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-10 h-10 rounded-full bg-[#11A8CD] flex items-center justify-center shrink-0 text-white shadow-lg shadow-cyan-200/50">
            <HelpCircle className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-0.5">ปรึกษาฟรี ไม่มีค่าใช้จ่าย</h4>
            <p className="text-slate-500 text-xs">พูดคุยกับทีมงานเพื่อรับคำแนะนำที่เหมาะกับคุณ</p>
          </div>
        </div>
        <Link 
          href="/contact"
          className="w-full md:w-auto px-6 py-2.5 bg-[#11A8CD] hover:bg-[#0e90b0] text-white rounded-xl font-bold text-sm shadow-md shadow-cyan-200/50 flex items-center justify-center gap-2 transition-all"
        >
          <Phone className="w-4 h-4" strokeWidth={2.5} />
          นัดปรึกษา
        </Link>
      </div>

      {/* Footer Bar */}
      <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" />
          <span>เปิดทุกวัน 10:30 - 19:30</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/baomue" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://www.instagram.com/baomue" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
          </a>
          <a href="tel:0969159391" className="hover:text-green-500 transition-colors">
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
