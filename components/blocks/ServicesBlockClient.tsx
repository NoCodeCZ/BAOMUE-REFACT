"use client";

import { useState } from "react";
import type { Service, ServiceCategory } from "@/lib/types";
import Link from "next/link";

interface ServicesBlockClientProps {
  categories: ServiceCategory[];
  servicesByCategory: Record<string, Service[]>;
}

export default function ServicesBlockClient({ 
  categories, 
  servicesByCategory 
}: ServicesBlockClientProps) {
  const [activeTab, setActiveTab] = useState<string>(
    categories[0]?.slug || ""
  );

  const activeServices = servicesByCategory[activeTab] || [];

  return (
    <>
      {/* Navigation Tabs */}
      <div className="px-6 md:px-10 py-2 mb-4 relative z-10">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start overflow-x-auto pb-2 md:pb-0">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveTab(category.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap min-w-[80px] ${
                activeTab === category.slug
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
          {activeServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="bg-[#E6F4FF] rounded-2xl p-6 flex flex-col items-start hover:shadow-md transition-all cursor-pointer group h-full border border-blue-50/50"
            >
              {/* Icon placeholder - can be enhanced with actual icon from service */}
              <div className="w-12 h-12 rounded-xl bg-[#FB9C2C] flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1e3a8a] mb-1">
                {service.name}
              </h3>
              <p className="text-[#1e3a8a]/70 text-xs mb-6 leading-relaxed">
                {service.short_description || "บริการทันตกรรมคุณภาพ"}
              </p>
              <div className="mt-auto text-[#0099FF] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                อ่านเพิ่มเติม
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

