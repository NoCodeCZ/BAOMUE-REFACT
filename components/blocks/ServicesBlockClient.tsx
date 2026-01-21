"use client";

import { useState } from "react";
import type { Service, ServiceCategory } from "@/lib/types";
import Link from "next/link";
import { getFileUrl } from "@/lib/directus";

interface ServicesBlockClientProps {
  categories: ServiceCategory[];
  servicesByCategory: Record<string, Service[]>;
}

export default function ServicesBlockClient({
  categories,
  servicesByCategory
}: ServicesBlockClientProps) {
  // Start with 'all' tab to show all services by default
  const [activeTab, setActiveTab] = useState<string>("all");

  const activeServices = servicesByCategory[activeTab] || [];

  return (
    <>
      {/* Navigation Tabs */}
      <div className="px-6 md:px-10 py-6 border-b border-slate-100">
        <div className="flex flex-wrap gap-2 justify-center overflow-x-auto pb-2 md:pb-0">
          {/* All Services Tab */}
          <button
            key="all"
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === "all"
              ? "text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            style={activeTab === "all" ? { background: 'linear-gradient(135deg, #1a3a8a 0%, #2563eb 100%)' } : {}}
          >
            ทั้งหมด
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveTab(category.slug)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === category.slug
                ? "text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              style={activeTab === category.slug ? { background: 'linear-gradient(135deg, #1a3a8a 0%, #2563eb 100%)' } : {}}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid Content */}
      <div className="p-6 md:p-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeServices.map((service) => {
            const serviceAny = service as any;
            const imageUrl = serviceAny.hero_image
              ? (getFileUrl(serviceAny.hero_image) ?? "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80")
              : "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80";

            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#003888] mb-2 group-hover:text-[#1DAEE0] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {service.short_description || "บริการทันตกรรมคุณภาพสูง"}
                  </p>
                  <div className="flex items-center gap-2 text-[#1DAEE0] text-sm font-medium group-hover:gap-3 transition-all">
                    ดูรายละเอียด
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link href="/services" className="inline-flex items-center gap-2 hover:bg-slate-800 transition-colors font-medium text-white bg-[#003888] h-12 rounded-xl pr-8 pl-8">
            ดูบริการทั้งหมด
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
